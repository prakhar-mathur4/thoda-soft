import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyPage from '@/components/PolicyPage';
import { SITE_URL, SITE_NAME, jsonLd } from '@/lib/site';

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999';

export const metadata: Metadata = {
  title: 'Contact Us — Thoda Soft',
  description:
    'Get in touch with Thoda Soft — email, WhatsApp, and support hours for orders, sizing, and exchanges.',
  alternates: { canonical: '/contact' },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Thoda Soft',
  url: `${SITE_URL}/contact`,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    email: 'hello@thodasoft.com',
  },
};

export default function ContactPage() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hi Thoda Soft! I have a question.',
  )}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(contactJsonLd) }}
      />
      <PolicyPage
        title="Contact Us"
        intro="We'd love to help — with sizing, orders, exchanges, or anything else."
      >
        <h2>Reach us</h2>
        <ul>
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:hello@thodasoft.com">hello@thodasoft.com</a>
          </li>
          <li>
            <strong>WhatsApp:</strong>{' '}
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              Chat with us
            </a>
          </li>
          <li>
            <strong>Support hours:</strong> Mon–Sat, 10am–7pm IST. We typically
            reply within one business day.
          </li>
        </ul>

        <h2>Quick links</h2>
        <ul>
          <li>
            <Link href="/faq">FAQ</Link> — shipping, returns, sizing, payments
          </li>
          <li>
            <Link href="/size-guide">Size Guide</Link> — find your fit
          </li>
          <li>
            <Link href="/returns">Returns &amp; Exchanges</Link>
          </li>
          <li>
            <Link href="/shipping">Shipping Policy</Link>
          </li>
        </ul>

        <h2>Business details</h2>
        <p className="text-charcoal-muted">
          [Registered business name], [Registered address]. GSTIN: [GSTIN].
          Replace these placeholders with your legal entity details.
        </p>
      </PolicyPage>
    </>
  );
}
