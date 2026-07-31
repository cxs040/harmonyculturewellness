/* Public health check for operational monitoring */
const { TableClient } = require('@azure/data-tables');

function json(context, status, body) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

module.exports = async function (context, req) {
  if (req.method !== 'GET') {
    json(context, 405, { error: 'Method not allowed' });
    return;
  }

  const storageConfigured = !!process.env.STORAGE_CONNECTION_STRING;
  let storageReachable = false;

  if (storageConfigured) {
    try {
      const client = TableClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING, 'Figures');
      const iterator = client.listEntities();
      await iterator.next();
      storageReachable = true;
    } catch {
      storageReachable = false;
    }
  }

  // Not configured yet is a valid initial deploy state, not a failure
  const degraded = storageConfigured && !storageReachable;

  json(context, degraded ? 503 : 200, {
    status: degraded ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    checks: { storageConfigured, storageReachable },
  });
};
