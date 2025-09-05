// /netlify/functions/submit.js
export async function handler(event) {
  const cors = {
    'Access-Control-Allow-Origin': 'https://survey.stock-well.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  try {
    const GAS_ENDPOINT = process.env.GAS_ENDPOINT;
    if (!GAS_ENDPOINT) {
      return { statusCode: 500, headers: cors, body: 'Error: GAS_ENDPOINT env var is missing' };
    }

    // Log to Netlify function logs (see Functions → submit → Logs)
    console.log('Forwarding to GAS:', GAS_ENDPOINT);
    console.log('Incoming body:', event.body);

    const resp = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body || '{}',
    });

    const text = await resp.text();
    console.log('GAS status:', resp.status, 'body:', text);

    // Mirror Apps Script status (helps pinpoint failures)
    return {
      statusCode: resp.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: text || JSON.stringify({ ok: true })
    };

  } catch (err) {
    console.error('Proxy error:', err);
    return { statusCode: 500, headers: cors, body: String(err) };
  }
}
