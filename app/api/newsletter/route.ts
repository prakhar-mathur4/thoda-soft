import { NextResponse } from 'next/server';
import { rateLimit, getIp, isSameOrigin } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter capture. Subscribes to Klaviyo when KLAVIYO_PRIVATE_API_KEY +
 * KLAVIYO_LIST_ID are set; otherwise it validates and no-ops gracefully so the
 * UI works in development. Swap the Klaviyo block for Shopify Customer create
 * if you prefer to keep subscribers in Shopify.
 */
export async function POST(request: Request) {
  // CSRF guard: reject cross-site POSTs.
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Rate limit: 5 signups / minute / IP.
  if (!rateLimit(`newsletter:${getIp(request)}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    );
  }

  let email = '';
  let honeypot = '';
  try {
    const body = await request.json();
    email = body.email;
    honeypot = body.company; // hidden field — humans never fill this
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Bot caught by honeypot — accept silently, do nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    // Not configured — accept the signup so local/preview works.
    console.info('[newsletter] Klaviyo not configured; accepted:', email);
    return NextResponse.json({ ok: true, provider: 'none' });
  }

  try {
    const res = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
          revision: '2024-10-15',
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email,
                      subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                    },
                  },
                ],
              },
            },
            relationships: { list: { data: { type: 'list', id: listId } } },
          },
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('[newsletter] Klaviyo error:', res.status, detail);
      return NextResponse.json(
        { error: 'Could not subscribe right now. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, provider: 'klaviyo' });
  } catch (err) {
    console.error('[newsletter] unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
