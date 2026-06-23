import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Returns & Exchanges — Thoda Soft',
  description:
    'Thoda Soft offers easy 7-day size exchanges. Here’s how returns and exchanges work.',
  alternates: { canonical: '/returns' },
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Exchanges"
      updated="June 2026"
      intro="We want you to love the fit. If the size isn’t right, we offer easy exchanges."
    >
      <h2>Our promise</h2>
      <p>
        We offer <strong>7-day size exchanges</strong> from the date of
        delivery. Your first size exchange within this window is free.
      </p>

      <h2>Eligibility</h2>
      <ul>
        <li>Requested within 7 days of delivery.</li>
        <li>Item is unworn, unwashed, and undamaged.</li>
        <li>Original tags are intact and the piece is in its original condition.</li>
      </ul>

      <h2>How to request an exchange</h2>
      <p>
        Email us at{' '}
        <a href="mailto:hello@thodasoft.com">hello@thodasoft.com</a> or message
        us on WhatsApp with your <strong>order number</strong> and the{' '}
        <strong>size</strong> you&apos;d like. We&apos;ll guide you through the
        rest.
      </p>

      <h2>Refunds &amp; store credit</h2>
      <p>
        We currently offer <strong>exchanges and store credit</strong> rather
        than cash refunds, except where an item arrives defective or incorrect —
        in which case we&apos;ll replace it or refund you in full.
      </p>

      <h2>Defective or wrong items</h2>
      <p>
        If your order arrives damaged or incorrect, contact us within 48 hours
        of delivery with photos and we&apos;ll make it right at no cost to you.
      </p>

      <h2>Non-exchangeable items</h2>
      <p>
        For hygiene reasons, certain items may not be eligible for exchange;
        this will be noted on the product page where applicable.
      </p>

      <h2>Need help?</h2>
      <p>
        See our <Link href="/size-guide">Size Guide</Link> to get the fit right
        the first time, or reach us via our{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </PolicyPage>
  );
}
