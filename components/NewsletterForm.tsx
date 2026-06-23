'use client';

import { useState } from 'react';

type State = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company: honeypot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Something went wrong');
      setState('success');
      setMessage('You’re on the list — check your inbox for 10% off.');
      setEmail('');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Please try again.');
    }
  };

  if (state === 'success') {
    return (
      <p role="status" className="text-sm text-charcoal">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      {/* Honeypot — hidden from humans; bots that fill it are silently dropped. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        autoComplete="email"
        className="w-full rounded-full border border-charcoal/15 bg-cream px-5 py-3 text-sm text-charcoal placeholder:text-charcoal-muted focus:border-lavender-deep"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-primary whitespace-nowrap disabled:opacity-60"
      >
        {state === 'loading' ? 'Joining…' : 'Get 10% Off'}
      </button>
      {state === 'error' && (
        <p role="alert" className="text-xs text-charcoal-muted sm:hidden">
          {message}
        </p>
      )}
    </form>
  );
}
