import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * Shopify webhook target for on-demand ISR (Product / Inventory update).
 *
 * Auth: prefers HMAC verification of the raw body against your webhook signing
 * secret (SHOPIFY_WEBHOOK_SECRET) via the X-Shopify-Hmac-Sha256 header. Falls
 * back to a shared `?secret=` only if no webhook secret is configured.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  let authorized = false;

  if (webhookSecret) {
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256') ?? '';
    const digest = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('base64');
    try {
      authorized =
        hmacHeader.length === digest.length &&
        crypto.timingSafeEqual(Buffer.from(hmacHeader), Buffer.from(digest));
    } catch {
      authorized = false;
    }
  } else {
    // Fallback: shared secret in query (configure SHOPIFY_WEBHOOK_SECRET to disable).
    const secret = new URL(request.url).searchParams.get('secret');
    authorized = Boolean(secret) && secret === process.env.SHOPIFY_REVALIDATE_SECRET;
  }

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Next 16: revalidateTag(tag, profile) — 'max' marks the tag stale immediately.
  revalidateTag('products', 'max');
  return NextResponse.json({ revalidated: true, tag: 'products' });
}
