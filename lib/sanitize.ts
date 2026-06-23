// Minimal HTML sanitizer for merchant-provided product descriptions.
// Strips dangerous tags, inline event handlers, and javascript: URLs.
// (For stronger guarantees, swap in isomorphic-dompurify.)
export function sanitizeHtml(html: string): string {
  return html
    .replace(
      /<\/?(script|style|iframe|object|embed|link|meta|base|form)\b[^>]*>/gi,
      '',
    )
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');
}
