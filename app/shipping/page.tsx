import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Shipping Policy — Thoda Soft',
  description:
    'Free shipping across India, dispatch timelines, tracking, and Cash on Delivery details.',
  alternates: { canonical: '/shipping' },
};

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      updated="June 2026"
      intro="Everything you need to know about how and when your order arrives."
    >
      <h2>Shipping charges</h2>
      <p>
        We offer <strong>free shipping on all orders within India</strong>, with
        no minimum spend.
      </p>

      <h2>Dispatch &amp; delivery</h2>
      <ul>
        <li>Orders are dispatched within <strong>1–2 business days</strong>.</li>
        <li>
          Delivery typically takes <strong>4–7 business days</strong>; metro
          cities are often faster.
        </li>
        <li>You&apos;ll receive a tracking link by SMS and email once shipped.</li>
      </ul>

      <h2>Cash on Delivery</h2>
      <p>
        Cash on Delivery (COD) is available on eligible orders and serviceable
        pincodes. COD availability is confirmed at checkout.
      </p>

      <h2>Order tracking</h2>
      <p>
        Track your order via the link sent to you after dispatch. For help with
        a specific order, reach us through our{' '}
        <Link href="/contact">contact page</Link> or the chat on this site.
      </p>

      <h2>International shipping</h2>
      <p>
        We currently ship within India only. International shipping is coming
        soon — join our newsletter to be the first to know.
      </p>

      <h2>Delays &amp; accuracy</h2>
      <p>
        Estimated timelines may vary due to courier delays, weather, or peak
        periods. Please ensure your shipping address and phone number are
        accurate to avoid delivery issues.
      </p>
    </PolicyPage>
  );
}
