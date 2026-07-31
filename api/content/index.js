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
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
    body: JSON.stringify(body),
  };
}

// OData string literals delimit with single quotes; a literal quote must be
// doubled to escape it, otherwise user input can break out of the filter.
function escapeODataString(value) {
  return String(value).replace(/'/g, "''");
}

function validateTextFields(item) {
  if (item.titleZh !== undefined && typeof item.titleZh !== 'string') {
    return 'titleZh must be a string';
  }
  if (item.titleEn !== undefined && typeof item.titleEn !== 'string') {
    return 'titleEn must be a string';
  }
  if ((item.titleZh || '').length > 500) {
    return 'titleZh must be 500 characters or fewer';
  }
  if ((item.titleEn || '').length > 500) {
    return 'titleEn must be 500 characters or fewer';
  }
  if (item.body !== undefined && typeof item.body !== 'string') {
    return 'body must be a string';
  }
  if ((item.body || '').length > 200000) {
    return 'body must be 200000 characters or fewer';
  }
  return null;
}

module.exports = async function (context, req) {
  if (!process.env.STORAGE_CONNECTION_STRING) {
    json(context, 503, { error: 'Storage not configured. Set STORAGE_CONNECTION_STRING.' });
    return;
  }

  const email = authorise(req);

  // GET is public — write operations require authentication
  if (req.method !== 'GET' && !email) {
    json(context, 403, { error: 'Access denied' });
    return;
  }

  const client = getClient();
  try { await client.createTable(); } catch { /* already exists */ }

  switch (req.method) {
    case 'GET': {
      const { section } = req.query;
      // Unauthenticated visitors → only show published; dashboard (auth'd) sees all
      const publishedOnly = !email;

      const items = [];
      const opts = section
        ? { queryOptions: { filter: `PartitionKey eq '${escapeODataString(section)}'` } }
        : {};
      for await (const entity of client.listEntities(opts)) {
        const { etag, timestamp, ...item } = entity;
        // published defaults to true for content that predates this field
        if (publishedOnly && item.published === false) continue;
        items.push(item);
      }
      items.sort((a, b) => {
        if (a.order !== b.order) return (a.order || 0) - (b.order || 0);
        return (a.createdAt || '') < (b.createdAt || '') ? -1 : 1;
      });
      json(context, 200, items);
      break;
    }

    case 'POST': {
      const item = req.body;
      if (!item || typeof item.section !== 'string' || !item.section) {
        json(context, 400, { error: 'Body must include a non-empty section string' });
        return;
      }
      const validationError = validateTextFields(item);
      if (validationError) {
        json(context, 400, { error: validationError });
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
        published: item.published !== false,
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
      const validationError = validateTextFields(item);
      if (validationError) {
        json(context, 400, { error: validationError });
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
        published: item.published !== false,
        updatedAt: new Date().toISOString(),
        updatedBy: email,
      };
      try {
        await client.upsertEntity(entity, 'Merge');
        json(context, 200, entity);
      } catch (err) {
        context.log.error(err);
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
      } catch (err) {
        context.log.error(err);
        json(context, 404, { error: `Item not found: ${id}` });
      }
      break;
    }

    default:
      json(context, 405, { error: 'Method not allowed' });
  }
};
