const https = require('https');

module.exports = async function (context, req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    context.res = { status: 501, body: { error: 'ANTHROPIC_API_KEY not configured' } };
    return;
  }

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    context.res = { status: 400, body: { error: 'text is required' } };
    return;
  }

  const prompt = `Translate the following Chinese text to English. Return only the translated text, no explanation, no quotes:\n\n${text.trim()}`;

  const requestBody = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }]
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };
      const r = https.request(options, res => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });
      r.on('error', reject);
      r.write(requestBody);
      r.end();
    });

    if (result.status !== 200) {
      context.res = { status: 502, body: { error: 'Claude API error', detail: result.body } };
      return;
    }

    const parsed = JSON.parse(result.body);
    const translation = parsed.content?.[0]?.text?.trim() || '';

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ translation })
    };
  } catch (err) {
    context.res = { status: 500, body: { error: err.message } };
  }
};
