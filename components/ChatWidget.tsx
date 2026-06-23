'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChatIcon, WhatsAppIcon, CloseIcon } from './icons';

// WhatsApp number in international format, digits only (e.g. 919999999999).
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999';

type Topic = {
  id: string;
  chip: string;
  answer: string;
  link?: { href: string; label: string };
  escalate?: boolean; // surface WhatsApp prominently for this answer
};

const TOPICS: Topic[] = [
  {
    id: 'sizing',
    chip: 'Sizing & fit',
    answer:
      'We offer inclusive sizing from S to XXL — true to size with a relaxed, feminine drape. Between sizes? Size down for a closer fit.',
    link: { href: '/size-guide', label: 'Open size guide' },
  },
  {
    id: 'shipping',
    chip: 'Shipping',
    answer:
      'Free shipping across India. Orders are dispatched in 1–2 business days, with delivery in about 4–7 days.',
    link: { href: '/faq', label: 'Shipping FAQ' },
  },
  {
    id: 'returns',
    chip: 'Returns & exchanges',
    answer:
      'We offer easy 7-day size exchanges from delivery — items unworn, unwashed, tags intact.',
    link: { href: '/faq', label: 'Returns & exchanges' },
  },
  {
    id: 'payments',
    chip: 'COD & payments',
    answer:
      'We accept UPI, cards, and wallets, plus Cash on Delivery — all via secure checkout.',
    link: { href: '/faq', label: 'Payment FAQ' },
  },
  {
    id: 'track',
    chip: 'Track my order',
    answer:
      "You'll get a tracking link by SMS and email once your order ships. For help with a specific order, chat with us on WhatsApp and we'll sort it out.",
    escalate: true,
  },
];

type Msg =
  | { role: 'bot'; text: string; link?: Topic['link']; escalate?: boolean }
  | { role: 'user'; text: string };

const GREETING =
  'Hi! 👋 How can we help? Pick a topic below, or chat with us on WhatsApp.';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: GREETING },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  const openWhatsApp = (context?: string) => {
    const text = encodeURIComponent(
      context
        ? `Hi Thoda Soft! I need help with: ${context}`
        : 'Hi Thoda Soft! I have a question.',
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const pickTopic = (t: Topic) => {
    setMessages((m) => [
      ...m,
      { role: 'user', text: t.chip },
      { role: 'bot', text: t.answer, link: t.link, escalate: t.escalate },
    ]);
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close help chat' : 'Open help chat'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal text-cream shadow-lg transition hover:scale-105 active:scale-100"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>

      {/* Panel */}
      <div
        role="dialog"
        aria-label="Help chat"
        aria-hidden={!open}
        className={`fixed bottom-24 right-5 z-50 flex max-h-[70vh] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl bg-cream shadow-[0_16px_50px_rgba(46,43,41,0.22)] transition-all duration-300 ease-soft ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-charcoal px-5 py-4 text-cream">
          <div>
            <p className="font-serif text-base">Thoda Soft Help</p>
            <p className="text-[11px] text-cream/70">Typically replies in minutes</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-full p-1.5 transition hover:bg-cream/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) =>
            m.role === 'bot' ? (
              <div key={i} className="max-w-[85%]">
                <div className="rounded-2xl rounded-tl-sm bg-blush/60 px-3.5 py-2.5 text-sm text-charcoal">
                  {m.text}
                </div>
                {m.link && (
                  <Link
                    href={m.link.href}
                    onClick={() => setOpen(false)}
                    className="mt-1.5 inline-block text-xs uppercase tracking-[0.1em] text-charcoal underline underline-offset-4 transition hover:opacity-70"
                  >
                    {m.link.label} →
                  </Link>
                )}
                {m.escalate && (
                  <button
                    type="button"
                    onClick={() => openWhatsApp(m.text.slice(0, 60))}
                    className="mt-2 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                  </button>
                )}
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-charcoal px-3.5 py-2.5 text-sm text-cream">
                  {m.text}
                </div>
              </div>
            ),
          )}
        </div>

        {/* Quick replies */}
        <div className="border-t border-charcoal/10 px-4 py-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pickTopic(t)}
                className="rounded-full border border-charcoal/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-charcoal hover:bg-charcoal hover:text-cream"
              >
                {t.chip}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5" /> Chat with us on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
