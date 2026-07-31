const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const configPath = path.join(__dirname, '..', 'staticwebapp.config.json');
const raw = fs.readFileSync(configPath, 'utf8');

let config;

test('staticwebapp.config.json parses as valid JSON', () => {
  config = JSON.parse(raw);
});

test('every route has a route and allowedRoles', () => {
  assert.ok(Array.isArray(config.routes), 'routes must be an array');
  for (const entry of config.routes) {
    assert.ok(typeof entry.route === 'string' && entry.route.length > 0, `route missing on entry ${JSON.stringify(entry)}`);
    assert.ok(Array.isArray(entry.allowedRoles) && entry.allowedRoles.length > 0, `allowedRoles missing on route ${entry.route}`);
  }
});

// Regression test for a real incident: staticwebapp.config.json once let the
// /api/* catch-all fall back to anonymous access, silently hiding CMS content
// from real visitors. The catch-all must be the last route and must require
// "authenticated" only.
test('/api/* catch-all is the last route and requires authenticated role', () => {
  const last = config.routes[config.routes.length - 1];
  assert.equal(last.route, '/api/*', '/api/* must be the last (catch-all) entry in routes');
  assert.deepEqual(last.allowedRoles, ['authenticated'], '/api/* must require allowedRoles: ["authenticated"] only');
  assert.ok(!last.allowedRoles.includes('anonymous'), '/api/* must not allow anonymous access');
});

test('navigationFallback excludes /api/* from the SPA rewrite', () => {
  assert.ok(config.navigationFallback, 'navigationFallback section must exist');
  assert.ok(Array.isArray(config.navigationFallback.exclude), 'navigationFallback.exclude must be an array');
  assert.ok(
    config.navigationFallback.exclude.includes('/api/*'),
    'navigationFallback.exclude must contain "/api/*" so API calls are never swallowed by the SPA rewrite'
  );
});
