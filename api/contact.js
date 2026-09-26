const { createHash, createHmac, randomBytes, timingSafeEqual } = require('node:crypto');

const DESTINATION = 'ibbo.abdoli@gmail.com';
const FROM = 'Ibbo Portfolio <contact@ibboabdoli.com>';
const ALLOWED_HOSTS = new Set(['www.ibboabdoli.com', 'ibboabdoli.com']);

const CHALLENGE_MIN_AGE_MS = 1500;
const CHALLENGE_MAX_AGE_MS = 2 * 60 * 60 * 1000;
const POST_RATE_WINDOW_MS = 10 * 60 * 1000;
const POST_RATE_MAX = 3;
const CHALLENGE_RATE_WINDOW_MS = 10 * 60 * 1000;
const CHALLENGE_RATE_MAX = 20;

const rateStore = globalThis.__ibboContactRateStore || new Map();
globalThis.__ibboContactRateStore = rateStore;

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
  if (!candidate) return false;
  try {
    const host = new URL(candidate).hostname.toLowerCase();
    return ALLOWED_HOSTS.has(host) || (host.endsWith('.vercel.app') && host.startsWith('ibboabdoli-'));
  } catch {
    return false;
  }
}

function clientIp(req) {
  const forwarded = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
  const value = Array.isArray(forwarded) ? forwarded[0] : String(forwarded).split(',')[0];
  return value.trim();
}

function rateKey(req, scope) {
  const ip = clientIp(req);
  if (!ip) return null;
  return `${scope}:${createHash('sha256').update(ip).digest('hex').slice(0, 24)}`;
}

function takeRateLimit(req, scope, max, windowMs) {
  const key = rateKey(req, scope);
  if (!key) return { allowed: true, retryAfterSeconds: 0 };

  const now = Date.now();
  const cutoff = now - windowMs;
  const recent = (rateStore.get(key) || []).filter(timestamp => timestamp > cutoff);

  if (recent.length >= max) {
    const retryAfterMs = Math.max(1000, recent[0] + windowMs - now);
    rateStore.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  recent.push(now);
  rateStore.set(key, recent);

  if (rateStore.size > 2000) {
    for (const [storedKey, timestamps] of rateStore) {
      const fresh = timestamps.filter(timestamp => timestamp > cutoff);
      if (fresh.length) rateStore.set(storedKey, fresh);
      else rateStore.delete(storedKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function challengeSecret() {
  return process.env.CONTACT_FORM_SECRET || process.env.RESEND_API_KEY || '';
}

function userAgentFingerprint(req) {
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 512);
  return createHash('sha256').update(userAgent).digest('hex').slice(0, 16);
}

function createChallenge(req) {
  const secret = challengeSecret();
  if (!secret) return null;

  const timestamp = Date.now();
  const nonce = randomBytes(18).toString('base64url');
  const fingerprint = userAgentFingerprint(req);
  const unsigned = `${timestamp}.${nonce}.${fingerprint}`;
  const signature = createHmac('sha256', secret).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyChallenge(req, token) {
  const secret = challengeSecret();
  if (!secret || !token) return false;

  const parts = String(token).split('.');
  if (parts.length !== 4) return false;

  const [timestampRaw, nonce, fingerprint, signature] = parts;
  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp) || !nonce || !fingerprint || !signature) return false;

  const age = Date.now() - timestamp;
  if (age < CHALLENGE_MIN_AGE_MS || age > CHALLENGE_MAX_AGE_MS) return false;
  if (fingerprint !== userAgentFingerprint(req)) return false;

  const unsigned = `${timestampRaw}.${nonce}.${fingerprint}`;
  const expected = createHmac('sha256', secret).update(unsigned).digest('base64url');
  return safeEqual(signature, expected);
}

function looksLikeSpam(name, email, message) {
  const combined = `${name}\n${email}\n${message}`.toLowerCase();
  let score = 0;

  const urlCount = (message.match(/https?:\/\/|www\./gi) || []).length;
  if (urlCount >= 2) score += 2;
  else if (urlCount === 1) score += 1;

  const strongPatterns = [
    /freeb2bdata/i,
    /\b(?:b2b|business)\s+(?:data|database|leads?)\b/i,
    /\b(?:download|buy|get)\s+(?:your\s+)?data\b/i,
    /\b(?:shutting down|last chance|offer expires?)\b/i,
    /\b\d{1,3}\s*(?:million|m)\s+compan(?:y|ies)\b/i,
    /\b(?:guest post|backlinks?|seo services?|domain authority)\b/i
  ];

  for (const pattern of strongPatterns) {
    if (pattern.test(combined)) score += 2;
  }

  if (email.endsWith('@freeb2bdata.org')) score += 3;
  return score >= 3;
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
  if (req.method === 'GET') {
    if (!allowedSource(req)) return sendResult(req, res, 403, 'Request source is not allowed.');

    const rate = takeRateLimit(req, 'challenge', CHALLENGE_RATE_MAX, CHALLENGE_RATE_WINDOW_MS);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSeconds));
      return sendResult(req, res, 429, 'För många försök. Vänta en stund och försök igen.');
    }

    const challenge = createChallenge(req);
    if (!challenge) {
      console.error('Contact challenge secret is unavailable');
      return sendResult(req, res, 503, 'Kontaktformuläret är tillfälligt otillgängligt. Försök igen senare.');
    }

    return sendResult(req, res, 200, 'Challenge created.', {
      challenge,
      minDelayMs: CHALLENGE_MIN_AGE_MS
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendResult(req, res, 405, 'Method not allowed.');
  }

  if (!allowedSource(req)) return sendResult(req, res, 403, 'Request source is not allowed.');

  const rate = takeRateLimit(req, 'post', POST_RATE_MAX, POST_RATE_WINDOW_MS);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return sendResult(req, res, 429, 'För många meddelanden på kort tid. Vänta en stund och försök igen.');
  }

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

  if (!verifyChallenge(req, body._challenge)) {
    return sendResult(req, res, 403, 'Säkerhetskontrollen misslyckades. Ladda om sidan och försök igen.');
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').trim();

  if (name.length < 2 || name.length > 254) return sendResult(req, res, 422, 'Kontrollera namnet och försök igen.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return sendResult(req, res, 422, 'Kontrollera e-postadressen och försök igen.');
  if (message.length < 10 || message.length > 4000) return sendResult(req, res, 422, 'Meddelandet måste vara mellan 10 och 4000 tecken.');

  if (looksLikeSpam(name, email, message)) {
    console.info('Blocked suspected portfolio contact spam', { source: rateKey(req, 'spam') });
    return sendResult(req, res, 200, 'Tack! Ditt meddelande har skickats.');
  }

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
        'User-Agent': 'ibboabdoli.com-contact/1.1',
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
