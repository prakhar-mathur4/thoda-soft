'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchIcon, CloseIcon } from './icons';

type Result = {
  id: string;
  handle: string;
  title: string;
  price: string;
  currency: string;
  image: string | null;
  imageAlt: string;
};

const POPULAR = ['Midi', 'Slip', 'Wrap', 'Tiered'];

function formatPrice(amount: string, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return `${currency} ${Number(amount).toFixed(0)}`;
  }
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus on open; reset on close + lock scroll + Esc to close.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setTerm('');
        setResults([]);
        setLoading(false);
      }, 250);
      return () => clearTimeout(t);
    }
    const focus = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(focus);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Debounced predictive fetch.
  useEffect(() => {
    const q = term.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        /* aborted or network error */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [term]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = term.trim();
    if (!q) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const typed = term.trim().length >= 2;
  const showEmpty = !loading && typed && results.length === 0;

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity duration-[800ms] ease-soft ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel — soft fade + gentle drift down */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={`absolute inset-x-0 top-0 origin-top bg-cream shadow-[0_12px_40px_rgba(46,43,41,0.15)] transition-all duration-[800ms] ease-soft ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
      >
        <div className="container-editorial py-8 sm:py-10">
          {/* Input row */}
          <form onSubmit={submit} className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3.5 rounded-full border border-[#c9dce6] bg-white px-6 py-4 shadow-[0_4px_24px_rgba(46,43,41,0.05)] transition-all duration-300 ease-soft focus-within:border-[#c9dce6]">
              <SearchIcon className="h-5 w-5 shrink-0 text-charcoal-muted" />
              <input
                ref={inputRef}
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for something soft…"
                aria-label="Search products"
                className="w-full bg-transparent text-base font-light tracking-wide text-charcoal placeholder:font-light placeholder:text-charcoal/35 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 sm:text-lg [&::-webkit-search-cancel-button]:appearance-none"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => {
                    setTerm('');
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="shrink-0 rounded-full p-1 text-charcoal-muted transition hover:bg-charcoal/5 hover:text-charcoal"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="hidden shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] text-charcoal-muted transition hover:text-charcoal sm:block"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="shrink-0 rounded-full p-2.5 text-charcoal transition hover:bg-charcoal/5 sm:hidden"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </form>

          {/* Body */}
          <div className="mt-6 max-h-[65vh] overflow-y-auto">
            {/* Empty state — popular searches */}
            {!typed && (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-charcoal-muted">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setTerm(p);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-charcoal/20 px-4 py-1.5 text-sm text-charcoal transition hover:border-charcoal hover:bg-charcoal hover:text-cream"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 py-8 text-sm text-charcoal-muted">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
                Searching…
              </div>
            )}

            {showEmpty && (
              <div className="py-10 text-center">
                <p className="font-serif text-lg text-charcoal">
                  No matches for &ldquo;{term.trim()}&rdquo;
                </p>
                <p className="mt-1 text-sm text-charcoal-muted">
                  Try a different word, or browse the full capsule.
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="btn-primary mt-5"
                >
                  Shop all
                </Link>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-charcoal-muted">
                  Products
                </p>
                <ul>
                  {results.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/products/${r.handle}`}
                        onClick={onClose}
                        className="group flex items-center gap-4 rounded-2xl px-2 py-2.5 transition hover:bg-blush/50"
                      >
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-blush">
                          {r.image && (
                            <Image
                              src={r.image}
                              alt={r.imageAlt}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
                            />
                          )}
                        </div>
                        <span className="flex-1 font-serif text-base text-charcoal">
                          {r.title}
                        </span>
                        <span className="text-sm text-charcoal-muted">
                          {formatPrice(r.price, r.currency)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => submit()}
                  className="mt-4 w-full border-t border-charcoal/10 pt-4 text-center text-xs uppercase tracking-[0.14em] text-charcoal transition hover:opacity-70"
                >
                  View all results for &ldquo;{term.trim()}&rdquo; →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
