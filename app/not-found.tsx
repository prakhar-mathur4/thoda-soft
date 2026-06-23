import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[62svh] flex-col items-center justify-center py-24 text-center">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-charcoal-muted">
        404
      </p>
      <h1 className="text-balance font-serif text-4xl leading-tight sm:text-5xl">
        This page took a soft detour
      </h1>
      <p className="mx-auto mt-4 max-w-md text-pretty text-sm leading-relaxed text-charcoal/75 sm:text-base">
        We couldn&apos;t find the page you were looking for — but there&apos;s
        plenty of softness waiting in the capsule.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
        <Link href="/shop" className="btn-primary">
          Shop The Capsule
        </Link>
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 transition hover:opacity-70"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
