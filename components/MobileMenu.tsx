'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, UserIcon, CloseIcon } from './icons';

type NavLink = { label: string; href: string };

export default function MobileMenu({
  open,
  onClose,
  onSearch,
  links,
  accountUrl,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  links: NavLink[];
  accountUrl: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[65] md:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity duration-500 ease-soft ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-cream shadow-[8px_0_40px_rgba(46,43,41,0.15)] transition-transform duration-500 ease-soft ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
          <span className="font-serif text-lg">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1.5 transition hover:bg-charcoal/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-6 py-6">
          <button
            type="button"
            onClick={onSearch}
            className="mb-6 flex items-center gap-3 rounded-full border border-[#c9dce6] bg-white px-5 py-3 text-sm text-charcoal-muted shadow-sm transition hover:bg-blush/30"
          >
            <SearchIcon className="h-4 w-4" />
            Search for something soft…
          </button>

          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block border-b border-charcoal/10 py-4 font-serif text-2xl text-charcoal transition hover:text-charcoal-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="mt-auto flex items-center gap-3 border-t border-charcoal/10 pt-6 text-sm uppercase tracking-[0.12em] text-charcoal transition hover:opacity-70"
          >
            <UserIcon className="h-5 w-5" />
            Account
          </a>
        </nav>
      </div>
    </div>
  );
}
