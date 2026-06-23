'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@shopify/hydrogen-react';
import { useCartUI } from './cart-ui-context';
import { SearchIcon, BagIcon, UserIcon, MenuIcon } from './icons';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Lookbook', href: '/lookbook' },
];

const ACCOUNT_URL = 'https://account.thoda-soft.myshopify.com';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useCartUI();
  const { totalQuantity } = useCart();
  const count = totalQuantity ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur transition-shadow duration-500 ease-soft ${
        scrolled ? 'shadow-[0_1px_0_rgba(46,43,41,0.08)]' : ''
      }`}
    >
      <nav
        className="container-editorial grid h-14 grid-cols-[1fr_auto_1fr] items-center sm:h-16"
        aria-label="Primary"
      >
        {/* Left: hamburger (mobile) + nav links (desktop) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-2 rounded-full p-2 text-charcoal transition hover:opacity-70 md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <ul className="hidden items-center gap-7 text-sm text-charcoal/80 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-opacity hover:opacity-70">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Center: logo */}
        <Link
          href="/"
          aria-label="Thoda Soft — home"
          className="relative col-start-2 block h-11 w-[184px] justify-self-center sm:h-12 sm:w-[200px]"
        >
          <Image
            src="/images/logo-color.png"
            alt="Thoda Soft"
            fill
            priority
            sizes="200px"
            className="object-contain"
          />
        </Link>

        {/* Right: icons */}
        <div className="col-start-3 flex items-center justify-end gap-2 text-charcoal sm:gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="hidden rounded-full p-2 transition hover:opacity-70 md:inline-flex"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <a
            href={ACCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Account"
            className="hidden rounded-full p-2 transition hover:opacity-70 md:inline-flex"
          >
            <UserIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={open}
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            className="relative rounded-full p-2 transition hover:opacity-70"
          >
            <BagIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-lavender-deep px-1 text-[11px] font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    <MobileMenu
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      onSearch={() => {
        setMenuOpen(false);
        setSearchOpen(true);
      }}
      links={NAV_LINKS}
      accountUrl={ACCOUNT_URL}
    />
    </>
  );
}
