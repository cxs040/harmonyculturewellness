/* Like counter for content blocks — stored in Azure Table Storage (SiteLikes) */
const { TableClient } = require('@azure/data-tables');

const TABLE_NAME = 'SiteLikes';

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

const LIKE_COOLDOWN_MS = 1000;

module.exports = async function (context, req) {
  if (!process.env.STORAGE_CONNECTION_STRING) {
    json(context, 503, { error: 'Storage not configured.' });
    return;
  }

  const client = getClient();
  try { await client.createTable(); } catch { /* already exists */ }

  switch (req.method) {
    case 'GET': {
      const { section } = req.query;
      const result = {};
      const opts = section
        ? { queryOptions: { filter: `PartitionKey eq '${escapeODataString(section)}'` } }
        : {};
      for await (const entity of client.listEntities(opts)) {
        result[entity.rowKey] = entity.count || 0;
      }
      json(context, 200, result);
      break;
    }

    case 'POST': {
      const { section, id } = req.query;
      if (!section || !id) {
        json(context, 400, { error: 'Requires ?section= and ?id= query params' });
        return;
      }
      let existing = null;
      try {
        existing = await client.getEntity(section, id);
      } catch {
        // Entity doesn't exist yet; start at 1
      }
      if (existing && existing.lastLikedAt && Date.now() - new Date(existing.lastLikedAt).getTime() < LIKE_COOLDOWN_MS) {
        json(context, 429, { error: 'Too many requests' });
        return;
      }
      const count = (existing ? existing.count || 0 : 0) + 1;
      const entity = {
        partitionKey: section,
        rowKey: id,
        count,
        lastLikedAt: new Date().toISOString(),
      };
      try {
        await client.upsertEntity(entity, 'Replace');
        json(context, 200, { section, id, count });
      } catch (err) {
        context.log.error(err);
        json(context, 500, { error: 'Failed to record like' });
      }
      break;
    }

    default:
      json(context, 405, { error: 'Method not allowed' });
  }
};
