const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const apiDir = path.join(__dirname, '..', 'api');

const functionDirs = fs.readdirSync(apiDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(apiDir, name, 'function.json')));

test('at least one Azure Function was discovered under api/', () => {
  assert.ok(functionDirs.length > 0, 'expected at least one subdirectory of api/ with a function.json');
});

for (const name of functionDirs) {
  const dir = path.join(apiDir, name);
  const functionJsonPath = path.join(dir, 'function.json');
  const indexJsPath = path.join(dir, 'index.js');

  test(`api/${name}: function.json is valid and wired up correctly`, () => {
    const config = JSON.parse(fs.readFileSync(functionJsonPath, 'utf8'));
    assert.ok(Array.isArray(config.bindings), 'bindings must be an array');

    const hasHttpIn = config.bindings.some((b) => b.type === 'httpTrigger' && b.direction === 'in');
    assert.ok(hasHttpIn, 'must have an httpTrigger binding with direction "in"');

    const hasHttpOut = config.bindings.some((b) => b.type === 'http' && b.direction === 'out');
    assert.ok(hasHttpOut, 'must have an http binding with direction "out"');

    assert.ok(fs.existsSync(indexJsPath), `sibling index.js must exist at ${indexJsPath}`);
  });

  test(`api/${name}: index.js exports a handler`, () => {
    const source = fs.readFileSync(indexJsPath, 'utf8');
    // A text-based check, not a live require(): these handlers import
    // @azure/data-tables / @azure/storage-blob, which may not be installed
    // in every environment this suite runs in, so require()-ing them here
    // would make the test fail for reasons unrelated to the code's own correctness.
    assert.ok(source.includes('module.exports'), 'index.js must contain "module.exports"');
  });

  test(`api/${name}: index.js is syntactically valid JS`, () => {
    execFileSync(process.execPath, ['--check', indexJsPath]);
  });
}
