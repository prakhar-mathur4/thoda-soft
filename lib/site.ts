// Central site config. Set NEXT_PUBLIC_SITE_URL to your production domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thodasoft.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Thoda Soft';

export const SITE_DESCRIPTION =
  'Dreamy, soft-aesthetic dresses combining premium comfort and flawless feminine fits. Designed in India, with inclusive sizing from S–XXL.';

/**
 * Serialize an object for a <script type="application/ld+json"> tag.
 * Escapes "<" so untrusted strings (e.g. product titles) can't close the
 * script tag and inject markup (XSS).
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
