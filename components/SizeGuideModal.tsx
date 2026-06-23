'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SizeChart from './SizeChart';
import { CloseIcon } from './icons';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';

export default function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Top-most modal — swallow Esc so an underlying modal stays open.
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey, true);
      unlockScroll();
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${
        open ? '' : 'pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity duration-500 ease-soft ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        className={`relative w-full max-w-xl overflow-hidden rounded-3xl bg-cream p-6 shadow-[0_24px_70px_rgba(46,43,41,0.25)] transition-all duration-500 ease-soft sm:p-8 ${
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-[0.98] opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute right-3 top-3 rounded-full p-2 text-charcoal transition hover:bg-charcoal/5"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <h2 className="font-serif text-2xl">Size Guide</h2>
        <p className="mt-1 text-sm text-charcoal-muted">
          Body measurements — find your best fit.
        </p>

        <div className="mt-5">
          <SizeChart />
        </div>

        <Link
          href="/size-guide"
          onClick={onClose}
          className="mt-6 inline-block text-xs uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 transition hover:opacity-70"
        >
          View full size guide →
        </Link>
      </div>
    </div>
  );
}
