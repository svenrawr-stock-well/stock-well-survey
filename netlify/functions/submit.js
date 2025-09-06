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

    const resp = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body || '{}',
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: text || '{}'
    };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: String(err) };
  }
}
