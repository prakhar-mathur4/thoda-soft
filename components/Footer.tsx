import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { ClockIcon, LockIcon } from './icons';

const SHOP_LINKS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping Policy', href: '#' },
  { label: 'Returns & Exchanges', href: '#' },
  { label: 'Size Guide', href: '/size-guide' },
];

export default function Footer() {
  return (
    <footer className="bg-cream">
      <div className="container-editorial border-t border-charcoal/10 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand + newsletter */}
          <div className="md:col-span-6">
            <Image
              src="/images/logo-color.png"
              alt="Thoda Soft"
              width={220}
              height={53}
              className="h-12 w-auto"
            />
            <p className="mt-4 max-w-sm text-pretty text-sm text-charcoal-muted">
              Join the mood board. Get 10% off your first capsule piece.
            </p>
            <div className="mt-5 max-w-md">
              <NewsletterForm />
            </div>
          </div>

          {/* Links */}
          <nav
            aria-label="Footer"
            className="md:col-span-3 md:col-start-8"
          >
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-charcoal-muted">
              Help
            </h2>
            <ul className="space-y-2.5 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-charcoal/80 transition-colors hover:text-charcoal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trust badges */}
          <div className="md:col-span-2">
            <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-charcoal-muted">
              Promise
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <ClockIcon className="h-4 w-4 text-charcoal" />
                7-Day Size Exchanges
              </li>
              <li className="flex items-center gap-2.5">
                <LockIcon className="h-4 w-4 text-charcoal" />
                Secure Checkout
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-charcoal/10 pt-6 text-xs text-charcoal-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Thoda Soft. Designed in India.</p>
          <p>Made with soft cotton &amp; softer pixels.</p>
        </div>
      </div>
    </footer>
  );
}
