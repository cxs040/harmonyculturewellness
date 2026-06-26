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
        ? { queryOptions: { filter: `PartitionKey eq '${section}'` } }
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
      let count = 1;
      try {
        const existing = await client.getEntity(section, id);
        count = (existing.count || 0) + 1;
      } catch {
        // Entity doesn't exist yet; start at 1
      }
      const entity = { partitionKey: section, rowKey: id, count };
      await client.upsertEntity(entity, 'Replace');
      json(context, 200, { section, id, count });
      break;
    }

    default:
      json(context, 405, { error: 'Method not allowed' });
  }
};
