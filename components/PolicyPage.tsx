import { ReactNode } from 'react';

/**
 * Shared editorial layout for legal/policy pages (privacy, terms, returns,
 * shipping, contact). Styles nested h2/p/ul/a/strong via arbitrary variants.
 */
export default function PolicyPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-editorial py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
            Thoda Soft
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">{title}</h1>
          {intro && (
            <p className="mt-4 text-pretty text-sm leading-relaxed text-charcoal/75 sm:text-base">
              {intro}
            </p>
          )}
          {updated && (
            <p className="mt-3 text-xs text-charcoal-muted">
              Last updated: {updated}
            </p>
          )}
        </header>

        <div className="space-y-4 text-sm leading-relaxed text-charcoal/80 [&_a]:text-charcoal [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-charcoal [&_strong]:text-charcoal [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
