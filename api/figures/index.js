/* CRUD for historical figures stored in Azure Table Storage */
const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'Figures';
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

  // Ensure table exists
  try { await client.createTable(); } catch { /* already exists */ }

  switch (req.method) {
    case 'GET': {
      const figures = [];
      for await (const entity of client.listEntities()) {
        // Strip Azure Table internal fields
        const { etag, timestamp, ...fig } = entity;
        figures.push(fig);
      }
      json(context, 200, figures);
      break;
    }

    case 'POST': {
      const fig = req.body;
      if (!fig || !fig.id) {
        json(context, 400, { error: 'Body must include id' });
        return;
      }
      const entity = {
        partitionKey: fig.dynastyEn || 'Unknown',
        rowKey: fig.id,
        nameZh: fig.nameZh || '',
        nameEn: fig.nameEn || '',
        dynastyZh: fig.dynastyZh || '',
        dynastyEn: fig.dynastyEn || '',
        section: fig.section || 'documents',
        catLabelZh: fig.catLabelZh || '',
        catLabelEn: fig.catLabelEn || '',
        quoteZh: fig.quoteZh || '',
        quoteEn: fig.quoteEn || '',
        sourceZh: fig.sourceZh || '',
        sourceEn: fig.sourceEn || '',
        lat: fig.lat != null ? fig.lat : 35.0,
        lng: fig.lng != null ? fig.lng : 105.0,
        locationZh: fig.locationZh || '',
        locationEn: fig.locationEn || '',
        createdBy: email,
        createdAt: new Date().toISOString(),
      };
      try {
        await client.createEntity(entity);
        json(context, 201, entity);
      } catch (err) {
        json(context, 409, { error: `Figure with id "${fig.id}" already exists` });
      }
      break;
    }

    case 'PUT': {
      const { id } = req.query;
      const fig = req.body;
      if (!id || !fig) {
        json(context, 400, { error: 'Requires ?id= query param and body' });
        return;
      }
      const entity = {
        partitionKey: fig.dynastyEn || 'Unknown',
        rowKey: id,
        nameZh: fig.nameZh || '',
        nameEn: fig.nameEn || '',
        dynastyZh: fig.dynastyZh || '',
        dynastyEn: fig.dynastyEn || '',
        section: fig.section || 'documents',
        catLabelZh: fig.catLabelZh || '',
        catLabelEn: fig.catLabelEn || '',
        quoteZh: fig.quoteZh || '',
        quoteEn: fig.quoteEn || '',
        sourceZh: fig.sourceZh || '',
        sourceEn: fig.sourceEn || '',
        lat: fig.lat != null ? fig.lat : 35.0,
        lng: fig.lng != null ? fig.lng : 105.0,
        locationZh: fig.locationZh || '',
        locationEn: fig.locationEn || '',
        updatedBy: email,
        updatedAt: new Date().toISOString(),
      };
      try {
        await client.upsertEntity(entity, 'Replace');
        json(context, 200, entity);
      } catch (err) {
        json(context, 500, { error: err.message });
      }
      break;
    }

    case 'DELETE': {
      const { id, dynasty } = req.query;
      if (!id || !dynasty) {
        json(context, 400, { error: 'Requires ?id= and ?dynasty= query params' });
        return;
      }
      try {
        await client.deleteEntity(dynasty, id);
        json(context, 200, { deleted: id });
      } catch (err) {
        json(context, 404, { error: `Figure not found: ${id}` });
      }
      break;
    }

    default:
      json(context, 405, { error: 'Method not allowed' });
  }
};
