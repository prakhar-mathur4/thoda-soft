import type { Metadata, Viewport } from 'next';
import { playfair, jost } from '@/lib/fonts';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickView from '@/components/QuickView';
import ChatWidget from '@/components/ChatWidget';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, jsonLd } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Thoda Soft — The Pinterest Wardrobe, Made For Reality',
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Thoda Soft',
    description: SITE_DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-color.png`,
      description: SITE_DESCRIPTION,
      sameAs: [] as string[],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: '#FEF9EB',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable}`}>
      {/* suppressHydrationWarning: browser extensions (Grammarly, etc.) inject
          attributes on <body> before hydration — ignore those attribute diffs. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(orgJsonLd) }}
        />
        <a
          href="#capsule"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-2 focus:text-cream"
        >
          Skip to products
        </a>
        <Providers>
          <Header />
          {/* Offset for the fixed header so content never sits beneath it. */}
          <main className="pt-14 sm:pt-16">{children}</main>
          <Footer />
          <CartDrawer />
          <QuickView />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
