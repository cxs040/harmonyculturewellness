/* Full data export of all CMS tables for disaster recovery — admin/user only */
const { TableClient } = require('@azure/data-tables');

const TABLES = ['Figures', 'SiteContent', 'SiteLikes'];
const ALLOWED_EMAILS = () =>
  [process.env.ADMIN_EMAIL, process.env.USER_EMAIL].filter(Boolean).map(e => e.toLowerCase());

function parsePrincipal(req) {
  const header = req.headers['x-ms-client-principal'];
  if (!header) return null;
  try {
    return JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function authorise(req) {
  const principal = parsePrincipal(req);
  if (!principal) return null;
  const email = (principal.userDetails || '').toLowerCase();
  const allowed = ALLOWED_EMAILS();
  if (allowed.length > 0 && !allowed.includes(email)) return null;
  return email;
}

function json(context, status, body) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
    body: JSON.stringify(body),
  };
}

async function exportTable(tableName) {
  const items = [];
  try {
    const client = TableClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING, tableName);
    for await (const entity of client.listEntities()) {
      const { etag, timestamp, ...item } = entity;
      items.push(item);
    }
  } catch {
    // Table doesn't exist yet — treat as empty
  }
  return items;
}

module.exports = async function (context, req) {
  if (req.method !== 'GET') {
    json(context, 405, { error: 'Method not allowed' });
    return;
  }

  const email = authorise(req);
  if (!email) {
    json(context, 403, { error: 'Access denied' });
    return;
  }

  if (!process.env.STORAGE_CONNECTION_STRING) {
    json(context, 503, { error: 'Storage not configured.' });
    return;
  }

  const tables = {};
  for (const tableName of TABLES) {
    tables[tableName] = await exportTable(tableName);
  }

  const date = new Date().toISOString().slice(0, 10);
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Disposition': `attachment; filename="backup-${date}.json"`,
    },
    body: JSON.stringify({
      exportedAt: new Date().toISOString(),
      exportedBy: email,
      tables,
    }),
  };
};
