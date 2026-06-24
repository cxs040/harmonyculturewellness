/* File upload/list/delete via Azure Blob Storage */
const { BlobServiceClient } = require('@azure/storage-blob');

const CONTAINER_NAME = 'site-uploads';
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getContainer() {
  const serviceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
  return serviceClient.getContainerClient(CONTAINER_NAME);
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

  const container = getContainer();

  try {
    await container.createIfNotExists({ access: 'blob' });
  } catch { /* already exists */ }

  switch (req.method) {
    case 'GET': {
      // List blobs in a section prefix
      const { section } = req.query;
      const prefix = section ? `${section}/` : '';
      const blobs = [];
      for await (const blob of container.listBlobsFlat({ prefix })) {
        blobs.push({
          name: blob.name,
          url: `${container.url}/${blob.name}`,
          size: blob.properties.contentLength,
          contentType: blob.properties.contentType,
          lastModified: blob.properties.lastModified,
        });
      }
      json(context, 200, blobs);
      break;
    }

    case 'POST': {
      // Upload file — body is raw bytes, metadata from query params
      const { section, filename, contentType } = req.query;
      if (!section || !filename) {
        json(context, 400, { error: 'Requires ?section= and ?filename= query params' });
        return;
      }
      if (!req.body) {
        json(context, 400, { error: 'No file data in body' });
        return;
      }

      // Sanitise filename
      const safe = filename.replace(/[^a-zA-Z0-9._\-一-鿿]/g, '_');
      const blobName = `${section}/${Date.now()}_${safe}`;
      const blockBlob = container.getBlockBlobClient(blobName);

      const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.rawBody || '', 'binary');
      await blockBlob.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: contentType || 'application/octet-stream' },
        metadata: { uploadedBy: email, section },
      });

      json(context, 201, {
        name: blobName,
        url: blockBlob.url,
        uploadedBy: email,
      });
      break;
    }

    case 'DELETE': {
      const { name } = req.query;
      if (!name) {
        json(context, 400, { error: 'Requires ?name= query param' });
        return;
      }
      try {
        await container.deleteBlob(name);
        json(context, 200, { deleted: name });
      } catch {
        json(context, 404, { error: `Blob not found: ${name}` });
      }
      break;
    }

    default:
      json(context, 405, { error: 'Method not allowed' });
  }
};
