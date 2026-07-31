# Tests

Run `npm test` (or `node --test tests/`) from the repo root. Zero dependencies — only Node.js built-ins (`node:test`, `node:assert`, `node:fs`, `node:child_process`).

These checks exist because each one caught (or would have caught) a real bug in this project:
- `config.test.js` — `staticwebapp.config.json` once allowed anonymous access on the `/api/*` catch-all, silently making CMS content invisible to public visitors.
- `functions.test.js` — guards against a broken `api/*/function.json` (bad JSON, missing bindings) or a syntax error in the matching `index.js`.
- `html-assets.test.js` — guards against typo'd/renamed `css/js` asset paths and copy-paste `?v=N` version-bump mistakes within the same HTML file.
