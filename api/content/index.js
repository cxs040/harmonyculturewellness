/* CRUD for per-section content blocks stored in Azure Table Storage */
const { TableClient } = require('@azure/data-tables');
const { randomUUID } = require('crypto');

const TABLE_NAME = 'SiteContent';
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

function getClient() {
  return TableClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING, TABLE_NAME);
}

function json(context, status, body) {
  context.res = {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

module.exports = async function (context, req) {
  if (!process.env.STORAGE_CONNECTION_STRING) {
    json(context, 503, { error: 'Storage not configured. Set STORAGE_CONNECTION_STRING.' });
    return;
  }

  const email = authorise(req);
  if (!email) {
    json(context, 403, { error: 'Access denied' });
    return;
  }

  const client = getClient();

  try { await client.createTable(); } catch { /* already exists */ }

  switch (req.method) {
    case 'GET': {
      const { section } = req.query;
      const items = [];
      const opts = section
        ? { queryOptions: { filter: `PartitionKey eq '${section}'` } }
        : {};
      for await (const entity of client.listEntities(opts)) {
        const { etag, timestamp, ...item } = entity;
        items.push(item);
      }
      // Sort by order then createdAt
      items.sort((a, b) => {
        if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
        return (a.createdAt || '') < (b.createdAt || '') ? -1 : 1;
      });
      json(context, 200, items);
      break;
    }

    case 'POST': {
      const item = req.body;
      if (!item || !item.section) {
        json(context, 400, { error: 'Body must include section' });
        return;
      }
      const id = randomUUID();
      const entity = {
        partitionKey: item.section,
        rowKey: id,
        id,
        section: item.section,
        type: item.type || 'html',
        titleZh: item.titleZh || '',
        titleEn: item.titleEn || '',
        body: item.body || '',
        fileUrl: item.fileUrl || '',
        order: item.order || 0,
        createdAt: new Date().toISOString(),
        createdBy: email,
        updatedAt: new Date().toISOString(),
        updatedBy: email,
      };
      await client.createEntity(entity);
      json(context, 201, entity);
      break;
    }

    case 'PUT': {
      const { id, section } = req.query;
      const item = req.body;
      if (!id || !section || !item) {
        json(context, 400, { error: 'Requires ?id= and ?section= query params and body' });
        return;
      }
      const entity = {
        partitionKey: section,
        rowKey: id,
        id,
        section,
        type: item.type || 'html',
        titleZh: item.titleZh || '',
        titleEn: item.titleEn || '',
        body: item.body || '',
        fileUrl: item.fileUrl || '',
        order: item.order || 0,
        updatedAt: new Date().toISOString(),
        updatedBy: email,
      };
      try {
        await client.upsertEntity(entity, 'Merge');
        json(context, 200, entity);
      } catch (err) {
        json(context, 500, { error: err.message });
      }
      break;
    }

    case 'DELETE': {
      const { id, section } = req.query;
      if (!id || !section) {
        json(context, 400, { error: 'Requires ?id= and ?section= query params' });
        return;
      }
      try {
        await client.deleteEntity(section, id);
        json(context, 200, { deleted: id });
      } catch {
        json(context, 404, { error: `Item not found: ${id}` });
      }
      break;
    }

    default:
      json(context, 405, { error: 'Method not allowed' });
  }
};
