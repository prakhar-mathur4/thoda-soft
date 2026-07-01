import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — Thoda Soft',
  description:
    'How Thoda Soft collects, uses, and protects your personal data, in line with India’s Digital Personal Data Protection Act.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="June 2026"
      intro="Your trust matters to us. This policy explains what information we collect, how we use it, and the choices you have."
    >
      <p>
        This Privacy Policy describes how <strong>Thoda Soft</strong>{' '}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles your personal data when you
        visit or purchase from our website. We process data in accordance with
        India&apos;s Digital Personal Data Protection Act, 2023.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact &amp; order details</strong> — name, phone number,
          email, shipping/billing address, and order history.
        </li>
        <li>
          <strong>Payment information</strong> — processed securely by our
          payment partners; we do not store your full card details.
        </li>
        <li>
          <strong>Usage data</strong> — pages viewed, device and browser info,
          and cookies used for analytics and improving the site.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To process, fulfil, and deliver your orders.</li>
        <li>To provide customer support and respond to your queries.</li>
        <li>To send order updates and, with your consent, marketing messages.</li>
        <li>To prevent fraud and improve our products and experience.</li>
      </ul>

      <h2>Who we share data with</h2>
      <p>We share data only with trusted partners who help us operate:</p>
      <ul>
        <li><strong>Shopify</strong> — our commerce backend and order management.</li>
        <li>
          <strong>Checkout &amp; payment partners</strong> (e.g. our checkout
          provider) — to process payments and Cash on Delivery.
        </li>
        <li><strong>Logistics partners</strong> — to ship and track your orders.</li>
        <li>
          <strong>Communication tools</strong> (email/WhatsApp) — for order
          updates and support.
        </li>
      </ul>

      <h2>Cookies &amp; analytics</h2>
      <p>
        We use cookies and analytics to understand how the site is used and to
        improve it. You can control cookies through your browser settings.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal
        data, and withdraw consent for marketing at any time. To exercise these
        rights, contact us at{' '}
        <a href="mailto:thodasoft@gmail.com">thodasoft@gmail.com</a>.
      </p>

      <h2>Data security &amp; retention</h2>
      <p>
        We use reasonable technical and organisational measures to protect your
        data and retain it only as long as needed for the purposes above or as
        required by law.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us at{' '}
        <a href="mailto:thodasoft@gmail.com">thodasoft@gmail.com</a> or via our{' '}
        <Link href="/contact">contact page</Link>.
      </p>

      <p className="pt-4 text-xs text-charcoal-muted">
        [Operated by: [Registered business name], [Registered address], GSTIN:
        [GSTIN]. Replace these placeholders with your legal entity details.]
      </p>
    </PolicyPage>
  );
}
