import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import SizeChart from '@/components/SizeChart';

const SITE_URL = 'https://thodasoft.com';

export const metadata: Metadata = {
  title: 'Size Guide — Inclusive S–XXL Fit & Measurements | Thoda Soft',
  description:
    'Find your perfect fit with the Thoda Soft size guide. Body measurements for sizes S–XXL in inches and centimetres, plus how to measure your bust, waist, and hips.',
  alternates: { canonical: '/size-guide' },
  openGraph: {
    title: 'Size Guide — Thoda Soft',
    description:
      'Measurements for sizes S–XXL in inches and centimetres, with simple how-to-measure tips for the perfect fit.',
    type: 'website',
  },
};

const HOW_TO = [
  {
    part: 'Bust',
    how: 'Measure around the fullest part of your bust, keeping the tape level and parallel to the floor.',
  },
  {
    part: 'Waist',
    how: 'Measure around the narrowest part of your natural waistline, usually just above the belly button.',
  },
  {
    part: 'Hip',
    how: 'Stand with feet together and measure around the fullest part of your hips.',
  },
];

const SIZE_FAQ = [
  {
    q: 'How do I measure for the right size?',
    a: 'Use a soft measuring tape to measure your bust, waist, and hips, then match them to our size chart. If your measurements fall across two sizes, go by your largest measurement.',
  },
  {
    q: 'What if I am between two sizes?',
    a: 'Size down for a closer, more fitted look, or size up for extra ease and a relaxed drape. Our dresses are designed to flatter either way.',
  },
  {
    q: 'Do Thoda Soft dresses run true to size?',
    a: 'Yes — our pieces are true to size with a relaxed, feminine fit, available in inclusive sizing from S to XXL.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Size Guide',
          item: `${SITE_URL}/size-guide`,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: SIZE_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function SizeGuidePage() {
  return (
    <div className="container-editorial py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Reveal as="header" className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
          Fit & Sizing
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">Size Guide</h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-charcoal/75 sm:text-base">
          Inclusive sizing from S to XXL, designed to drape beautifully on every
          body. Use the chart below to find your perfect fit.
        </p>
      </Reveal>

      <div className="mx-auto max-w-3xl space-y-14">
        {/* Chart */}
        <section>
          <h2 className="mb-4 font-serif text-2xl">Size Chart</h2>
          <SizeChart />
        </section>

        {/* How to measure */}
        <section>
          <h2 className="mb-5 font-serif text-2xl">How to Measure</h2>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {HOW_TO.map((m) => (
              <div
                key={m.part}
                className="rounded-2xl bg-[#f7dfdf]/50 p-5"
              >
                <dt className="font-serif text-lg text-charcoal">{m.part}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal/75">
                  {m.how}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-charcoal-muted">
            Tip: measure over your underclothes and keep the tape snug but not
            tight for the most accurate fit.
          </p>
        </section>

        {/* Fit notes / FAQ */}
        <section>
          <h2 className="mb-2 font-serif text-2xl">Fit Questions</h2>
          <div>
            {SIZE_FAQ.map((f) => (
              <details
                key={f.q}
                className="group border-b border-charcoal/15 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base text-charcoal marker:hidden">
                  {f.q}
                  <span className="shrink-0 text-xl leading-none text-charcoal-muted transition-transform duration-300 ease-soft group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/75">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-16 max-w-3xl border-t border-charcoal/10 pt-10 text-center">
        <h2 className="font-serif text-2xl">Found your size?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-muted">
          Every piece comes with free shipping and easy 7-day size exchanges.
        </p>
        <Link href="/shop" className="btn-primary mt-6">
          Shop The Capsule
        </Link>
      </div>
    </div>
  );
}
