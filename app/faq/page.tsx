import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { jsonLd } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ — Shipping, Returns, Sizing & Care | Thoda Soft',
  description:
    'Answers to common questions about Thoda Soft — shipping across India, 7-day size exchanges, inclusive S–XXL sizing, premium cotton care, and secure checkout.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions — Thoda Soft',
    description:
      'Shipping, returns & exchanges, sizing, fabric care, and payments — everything you need to know about Thoda Soft.',
    type: 'website',
  },
};

type QA = { q: string; a: string };
type Category = { title: string; items: QA[] };

const CATEGORIES: Category[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Orders are dispatched within 1–2 business days. Standard delivery across India takes 4–7 business days, and metro cities are usually a little faster.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes — shipping is free on all orders within India, with no minimum spend.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Right now we ship within India only. International shipping is on the way — join our newsletter to be the first to know.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order ships, you’ll receive a tracking link by email and SMS. You can also use the Track Order link in the menu or your account page.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return and exchange policy?',
        a: 'We offer 7-day size exchanges from the date of delivery. Items must be unworn, unwashed, and have their original tags intact.',
      },
      {
        q: 'How do I request an exchange?',
        a: 'Email us with your order number and the size you’d like, and we’ll guide you through the quick exchange process.',
      },
      {
        q: 'Are exchanges free?',
        a: 'Your first size exchange within the 7-day window is free.',
      },
      {
        q: 'Can I get a refund?',
        a: 'We offer size exchanges and store credit rather than refunds, unless an item arrives defective or incorrect — in which case we’ll make it right.',
      },
    ],
  },
  {
    title: 'Sizing & Fit',
    items: [
      {
        q: 'What sizes do you offer?',
        a: 'Every style in the capsule comes in inclusive sizing from S to XXL, designed to drape beautifully on every body.',
      },
      {
        q: 'How do I find my size?',
        a: 'Each product page includes a Size & Fit guide. If you’re between sizes, size down for a closer fit or up for extra ease.',
      },
      {
        q: 'Do the dresses run true to size?',
        a: 'Yes — our pieces are true to size with a relaxed, feminine drape.',
      },
    ],
  },
  {
    title: 'Product & Care',
    items: [
      {
        q: 'What fabric are your pieces made from?',
        a: 'Premium, ultra-soft, breathable cotton — thoughtfully designed in India to look flawless and feel weightless.',
      },
      {
        q: 'How do I care for my dress?',
        a: 'Machine wash cold on a gentle cycle, line dry, and warm iron if needed. Our cotton softens beautifully with every wash.',
      },
    ],
  },
  {
    title: 'Payments & Checkout',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards, UPI, net banking, and popular wallets through our secure checkout.',
      },
      {
        q: 'Is checkout secure?',
        a: 'Absolutely. Payments are processed through Shopify’s PCI-compliant, encrypted checkout — your details are always protected.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Contact us within 12 hours of placing your order and we’ll do our best to update or cancel it before it’s dispatched.',
      },
    ],
  },
];

const ALL_QA = CATEGORIES.flatMap((c) => c.items);

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ALL_QA.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="container-editorial py-14 sm:py-20">
      {/* FAQPage structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <Reveal as="header" className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
          Help Centre
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-charcoal/75 sm:text-base">
          Everything you need to know about shipping, exchanges, sizing, and
          caring for your Thoda Soft pieces.
        </p>
      </Reveal>

      <div className="mx-auto max-w-3xl space-y-12">
        {CATEGORIES.map((category) => (
          <section key={category.title}>
            <h2 className="mb-2 font-serif text-2xl text-charcoal">
              {category.title}
            </h2>
            <div>
              {category.items.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-charcoal/15 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base text-charcoal marker:hidden">
                    {item.q}
                    <span className="shrink-0 text-xl leading-none text-charcoal-muted transition-transform duration-300 ease-soft group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/75">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mx-auto mt-16 max-w-3xl border-t border-charcoal/10 pt-10 text-center">
        <h2 className="font-serif text-2xl">Still have a question?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted">
          We’re happy to help. Reach out and our team will get back to you within
          one business day.
        </p>
        <a
          href="mailto:hello@thodasoft.com"
          className="btn-primary mt-6"
        >
          Email Us
        </a>
        <p className="mt-6 text-sm text-charcoal-muted">
          Or keep browsing the{' '}
          <Link href="/shop" className="underline underline-offset-2 hover:text-charcoal">
            capsule
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
