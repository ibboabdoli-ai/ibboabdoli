const { createHash } = require('node:crypto');

const DESTINATION = 'ibbo.abdoli@gmail.com';
const FROM = 'Ibbo Portfolio <contact@ibboabdoli.com>';
const ALLOWED_HOSTS = new Set(['www.ibboabdoli.com', 'ibboabdoli.com']);

function wantsHtml(req) {
  const accept = String(req.headers.accept || '');
  return accept.includes('text/html') && !accept.includes('application/json');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function allowedSource(req) {
  const candidate = req.headers.origin || req.headers.referer;
  if (!candidate) return true;
  try {
    const host = new URL(candidate).hostname.toLowerCase();
    return ALLOWED_HOSTS.has(host) || (host.endsWith('.vercel.app') && host.startsWith('ibboabdoli-'));
  } catch {
    return false;
  }
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;

  let raw = '';
  if (typeof req.body === 'string') raw = req.body;
  else if (Buffer.isBuffer(req.body)) raw = req.body.toString('utf8');
  else {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 12000) throw new Error('payload_too_large');
    }
  }

  const type = String(req.headers['content-type'] || '').toLowerCase();
  if (type.includes('application/json')) return raw ? JSON.parse(raw) : {};
  if (type.includes('application/x-www-form-urlencoded')) return Object.fromEntries(new URLSearchParams(raw));
  return {};
}

function sendResult(req, res, status, message, extra = {}) {
  res.setHeader('Cache-Control', 'no-store');
  if (wantsHtml(req)) {
    const ok = status >= 200 && status < 300;
    const title = ok ? 'Meddelandet skickades' : 'Meddelandet kunde inte skickas';
    res.status(status).setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(`<!doctype html><html lang="sv"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><body style="font-family:system-ui;max-width:680px;margin:10vh auto;padding:24px"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p><p><a href="https://www.ibboabdoli.com/#contact">Tillbaka till webbplatsen</a></p></body></html>`);
  }
  return res.status(status).json({ ok: status >= 200 && status < 300, message, ...extra });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendResult(req, res, 405, 'Method not allowed.');
  }

  if (!allowedSource(req)) return sendResult(req, res, 403, 'Request source is not allowed.');

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > 12000) return sendResult(req, res, 413, 'Meddelandet är för stort.');

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    return sendResult(req, res, error?.message === 'payload_too_large' ? 413 : 400, 'Ogiltig formulärdata.');
  }

  const honeypot = String(body._gotcha || '').trim();
  if (honeypot) return sendResult(req, res, 200, 'Tack! Ditt meddelande har skickats.');

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').trim();

  if (name.length < 2 || name.length > 254) return sendResult(req, res, 422, 'Kontrollera namnet och försök igen.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return sendResult(req, res, 422, 'Kontrollera e-postadressen och försök igen.');
  if (message.length < 10 || message.length > 4000) return sendResult(req, res, 422, 'Meddelandet måste vara mellan 10 och 4000 tecken.');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is missing');
    return sendResult(req, res, 503, 'Kontaktformuläret är tillfälligt otillgängligt. Försök igen senare.');
  }

  const plain = `Namn: ${name}\nE-post: ${email}\n\nMeddelande:\n${message}`;
  const html = `<h2>Ny kontakt från ibboabdoli.com</h2><p><strong>Namn:</strong> ${escapeHtml(name)}</p><p><strong>E-post:</strong> ${escapeHtml(email)}</p><hr><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;
  const retryWindow = Math.floor(Date.now() / 300000);
  const idempotencyKey = `portfolio-contact/${createHash('sha256').update(`${email}\n${message}\n${retryWindow}`).digest('hex').slice(0, 32)}`;

  let resendResponse;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ibboabdoli.com-contact/1.0',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify({
        from: FROM,
        to: [DESTINATION],
        reply_to: email,
        subject: `Ny kontakt via ibboabdoli.com – ${name}`,
        text: plain,
        html,
        tags: [{ name: 'source', value: 'portfolio-contact' }]
      })
    });
  } catch (error) {
    console.error('Resend network error', error?.message || 'unknown');
    return sendResult(req, res, 502, 'E-posttjänsten kunde inte nås. Försök igen om en stund.');
  }

  let payload = null;
  try { payload = await resendResponse.json(); } catch { payload = null; }

  if (!resendResponse.ok) {
    console.error('Resend send failed', resendResponse.status, payload?.message || payload?.name || 'unknown');
    return sendResult(req, res, 502, 'E-posttjänsten avvisade meddelandet. Försök igen om en stund.');
  }

  return sendResult(req, res, 200, 'Tack! Ditt meddelande har skickats.', { id: payload?.id || null });
};
