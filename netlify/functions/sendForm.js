// /.netlify/functions/sendForm
// Netlify Functions (Node 18+) — keeps your Formspree URL secret via env
export const handler = async (event) => {
  // Allow only POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Method Not Allowed',
    };
  }

  // Read env
  const url = process.env.FORMSPREE_KEY;
  if (!url) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing FORMSPREE_KEY environment variable',
    };
  }

  try {
    // Accept JSON or form-encoded
    const ct = event.headers['content-type'] || '';
    let payload = {};
    if (ct.includes('application/json')) {
      payload = JSON.parse(event.body || '{}');
    } else {
      // form-url-encoded
      payload = Object.fromEntries(new URLSearchParams(event.body));
    }

    // simple honeypot
    if (payload._bot) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true, spam: true }),
      };
    }

    // Basic field validation (optional)
    if (!payload.name || !payload._replyto || !payload.message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: 'Missing required fields' }),
      };
    }

    // Forward to Formspree
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: {
        'Content-Type': resp.headers.get('content-type') || 'text/plain',
        // allow same-site XHR
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Server error',
    };
  }
};
// Note: In Netlify, set the env variable FORMSPREE_KEY to your Formspree endpoint URL