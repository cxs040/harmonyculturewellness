/* Returns current user info from SWA client-principal header */
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

module.exports = async function (context, req) {
  const principal = parsePrincipal(req);

  if (!principal) {
    context.res = {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not authenticated' }),
    };
    return;
  }

  const email = (principal.userDetails || '').toLowerCase();
  const allowed = ALLOWED_EMAILS();

  if (allowed.length > 0 && !allowed.includes(email)) {
    context.res = {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Access denied — your account is not authorised for this dashboard.' }),
    };
    return;
  }

  context.res = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      isAdmin: email === (process.env.ADMIN_EMAIL || '').toLowerCase(),
      identityProvider: principal.identityProvider,
      userId: principal.userId,
    }),
  };
};
