const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const htmlFiles = ['index.html', 'dashboard.html'];

const ASSET_REGEX = /(?:href="(css\/[^"]+)"|src="(js\/[^"]+)")/g;

function extractAssetRefs(html) {
  const refs = [];
  let match;
  while ((match = ASSET_REGEX.exec(html)) !== null) {
    const raw = match[1] || match[2];
    const [assetPath, version] = raw.split('?v=');
    refs.push({ raw, assetPath, version: version || null });
  }
  return refs;
}

for (const file of htmlFiles) {
  const filePath = path.join(repoRoot, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const refs = extractAssetRefs(html);

  test(`${file}: at least one css/js asset reference found`, () => {
    assert.ok(refs.length > 0, `expected to find css/js asset references in ${file}`);
  });

  test(`${file}: every referenced css/js asset exists on disk`, () => {
    for (const { raw, assetPath } of refs) {
      const diskPath = path.join(repoRoot, assetPath);
      assert.ok(fs.existsSync(diskPath), `${file} references "${raw}" but ${diskPath} does not exist`);
    }
  });

  test(`${file}: repeated references to the same asset use a consistent version`, () => {
    const versionsByAsset = new Map();
    for (const { assetPath, version } of refs) {
      if (!versionsByAsset.has(assetPath)) versionsByAsset.set(assetPath, new Set());
      versionsByAsset.get(assetPath).add(version);
    }

    console.log(`[${file}] asset versions:`, Object.fromEntries(
      [...versionsByAsset.entries()].map(([asset, versions]) => [asset, [...versions]])
    ));

    for (const [assetPath, versions] of versionsByAsset) {
      assert.equal(
        versions.size,
        1,
        `${file} references "${assetPath}" multiple times with inconsistent versions: ${[...versions].join(', ')}`
      );
    }
  });
}
