// Lightweight in-memory fixed-window rate limiter. Good as a first line of
// defense; for multi-instance/serverless scale, back this with Upstash/Vercel KV.
type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export function getIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/** Reject cross-site POSTs (basic CSRF guard); allows same-origin + non-browser. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // no Origin header (e.g. server-to-server)
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}
