// netlify/functions/submit.js
export async function handler(event) {
  const cors = {
    'Access-Control-Allow-Origin': 'https://survey.stock-well.com',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  // Parse incoming JSON safely
  let received = {};
  try {
    received = event.body ? JSON.parse(event.body) : {};
  } catch {
    return {
      statusCode: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Invalid JSON body' }),
    };
  }

  const GAS_ENDPOINT = process.env.GAS_ENDPOINT; // must be your Apps Script /exec URL

  if (!GAS_ENDPOINT) {
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'GAS_ENDPOINT env var is missing', received }),
    };
  }

  try {
    // Forward to Google Apps Script
    const resp = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(received),
    });

    const rawText = await resp.text();
    let gasBody = rawText;
    try { gasBody = JSON.parse(rawText); } catch { /* keep as text if not JSON */ }

    // Mirror GAS status, include echo for debugging
    return {
      statusCode: resp.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: resp.status >= 200 && resp.status < 300,
        echo: received,           // what we received from the browser
        gasStatus: resp.status,   // status from Apps Script
        gasBody,                  // body from Apps Script (JSON or text)
      }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: String(err), echo: received }),
    };
  }
}
