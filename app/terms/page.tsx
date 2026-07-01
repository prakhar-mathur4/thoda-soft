import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Thoda Soft',
  description:
    'The terms governing your use of the Thoda Soft website and your purchases.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      updated="June 2026"
      intro="By using this website and placing an order, you agree to the following terms."
    >
      <h2>Orders &amp; acceptance</h2>
      <p>
        All orders are subject to acceptance and availability. We reserve the
        right to cancel or refuse any order, including for suspected fraud or
        pricing errors.
      </p>

      <h2>Pricing &amp; payment</h2>
      <p>
        Prices are listed in Indian Rupees (₹) and include applicable taxes
        unless stated otherwise. Payment is processed securely via our checkout
        and payment partners, including UPI, cards, wallets, and Cash on
        Delivery.
      </p>

      <h2>Shipping</h2>
      <p>
        Delivery timelines are estimates. See our{' '}
        <Link href="/shipping">Shipping Policy</Link> for details.
      </p>

      <h2>Returns &amp; exchanges</h2>
      <p>
        Exchanges are governed by our{' '}
        <Link href="/returns">Returns &amp; Exchanges Policy</Link>.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site — including imagery, designs, text, and the
        Thoda Soft name and logo — is our property and may not be used without
        permission.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse the site, attempt to disrupt it, or use it for
        any unlawful purpose.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, Thoda Soft is not liable for indirect or
        consequential losses arising from use of the site or products.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and disputes are subject
        to the jurisdiction of the courts of [City/State].
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email{' '}
        <a href="mailto:thodasoft@gmail.com">thodasoft@gmail.com</a> or visit our{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </PolicyPage>
  );
}
