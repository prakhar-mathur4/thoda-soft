'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "The Living Editorial" — a magazine-spread hero rather than a banner.
 *
 * Avoids the usual fashion clichés (full-bleed photo + centred overlay, carousel,
 * generic "new collection" banner). Instead: an asymmetric editorial grid with a
 * masked line-by-line serif headline beside a layered photo collage that wipes
 * open on entrance and drifts gently on scroll.
 *
 * Motion is entirely GSAP-driven and gated behind prefers-reduced-motion; with
 * motion off (or JS disabled) the static layout is fully visible and legible.
 */
type HeroImage = { url: string; altText: string | null } | null | undefined;

/**
 * `primaryImage` / `secondaryImage` are sourced from Shopify (the featured
 * images of the debut-capsule products, passed down from the home page Server
 * Component). They fall back to the bundled editorial stills so the hero still
 * renders when Shopify isn't configured.
 */
export default function Hero({
  primaryImage,
  secondaryImage,
}: {
  primaryImage?: HeroImage;
  secondaryImage?: HeroImage;
} = {}) {
  const root = useRef<HTMLElement>(null);

  const primarySrc = primaryImage?.url ?? '/images/product_top_1.png';
  const primaryAlt =
    primaryImage?.altText ??
    'A woman in a hand-embroidered ivory cotton blouse, lit by golden afternoon sun';
  const secondarySrc = secondaryImage?.url ?? '/images/hero_banner.png';
  const secondaryAlt =
    secondaryImage?.altText ??
    'A tiered floral sundress in motion across a wildflower meadow at sunset';

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const q = gsap.utils.selector(el);

      // — Entrance choreography ————————————————————————————————
      // fromTo (explicit end states) rather than from(), so the final frame is
      // always the visible state even under React Strict Mode's double-invoke in
      // dev (a bare .from() can record a mid-revert value as its "end" and stick).
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        q('[data-anim="rule"]'),
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9 },
      )
        .fromTo(
          q('[data-anim="eyebrow"] > *'),
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.6 },
          '-=0.55',
        )
        .fromTo(
          q('[data-anim="line"]'),
          { yPercent: 115 },
          { yPercent: 0, stagger: 0.1, duration: 0.95, ease: 'power4.out' },
          '-=0.3',
        )
        .fromTo(
          q('[data-anim="standfirst"]'),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.55',
        )
        .fromTo(
          q('[data-anim="cta"]'),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
          '-=0.45',
        )
        // Photo frames wipe open like a turning page.
        .fromTo(
          q('[data-anim="frame-primary"]'),
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power4.inOut' },
          0.15,
        )
        .fromTo(
          q('[data-anim="frame-secondary"]'),
          { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1, ease: 'power4.inOut' },
          0.5,
        )
        .fromTo(
          q('[data-anim="credit"]'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.25',
        )
        .fromTo(q('[data-anim="spine"]'), { opacity: 0 }, { opacity: 1, duration: 0.9 }, '-=0.6')
        .fromTo(
          q('[data-anim="scroll"]'),
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4',
        );

      // Soft ambient light drift (the colour glows behind the collage).
      q('[data-glow]').forEach((node, i) => {
        gsap.to(node, {
          xPercent: i % 2 === 0 ? 8 : -10,
          yPercent: i % 2 === 0 ? -6 : 8,
          duration: 9 + i * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      // — Scroll parallax (depth as you leave the spread) ——————————
      gsap.to(q('[data-scroll-photo]'), {
        yPercent: -9,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(q('[data-scroll-text]'), {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Thoda Soft — the debut capsule"
      className="relative w-full overflow-hidden bg-gradient-to-br from-cream via-blush/40 to-lavender/30 pb-14 pt-5 md:pb-0 md:pt-5"
    >
      {/* Ambient colour light — keeps the palette airy, not flat beige. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-glow
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-lavender/50 blur-3xl"
        />
        <div
          data-glow
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blush/60 blur-3xl"
        />
        <div
          data-glow
          className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-sage/40 blur-3xl"
        />
      </div>

      {/* Vertical magazine-spine label */}
      <span
        data-anim="spine"
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rotate-90 text-[0.65rem] uppercase tracking-[0.5em] text-charcoal/60 lg:block"
      >
        Dressed in ease
      </span>

      <div className="container-editorial grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-8">
        {/* — Editorial copy ————————————————————————————————— */}
        <div
          data-scroll-text
          className="order-2 md:order-none md:col-span-5 md:row-start-1 md:self-center"
        >
          {/* Masthead row */}
          <div
            data-anim="eyebrow"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.32em] text-charcoal"
          >
            <span className="font-medium">Issue Nº 01</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-charcoal/40" />
            <span>The Debut Capsule</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-charcoal/40" />
            <span>SS&apos;26</span>
          </div>
          <div
            data-anim="rule"
            aria-hidden
            className="mt-4 h-px w-full max-w-sm bg-charcoal/25"
          />

          <h1 className="mt-7 font-serif text-[clamp(2.4rem,5.4vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-charcoal">
            <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
              <span data-anim="line" className="block">
                Wear your
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
              <span data-anim="line" className="block font-light italic">
                softness
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
              <span data-anim="line" className="block">
                like confidence.
              </span>
            </span>
          </h1>

          <p
            data-anim="standfirst"
            className="mt-7 max-w-md text-pretty text-base leading-relaxed text-charcoal sm:text-lg"
          >
            Premium, breathable cotton cut for slow mornings and restless nights.
            Designed in India for women who&apos;d rather feel like themselves than
            like everyone else.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              data-anim="cta"
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-charcoal px-8 py-3.5 text-sm tracking-wide text-cream transition duration-300 ease-soft hover:bg-charcoal/90 hover:scale-[1.02] focus-visible:scale-[1.02]"
            >
              Explore the Shop
              <span
                aria-hidden
                className="transition-transform duration-300 ease-soft group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              data-anim="cta"
              href="/our-story"
              className="bg-gradient-to-r from-charcoal to-charcoal bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 text-sm tracking-wide text-charcoal transition-[background-size] duration-300 ease-soft hover:bg-[length:100%_1px]"
            >
              Read our story
            </Link>
          </div>
        </div>

        {/* — Layered photo collage ——————————————————————————— */}
        <div
          data-scroll-photo
          className="relative order-1 mx-auto h-[48svh] min-h-[330px] w-full max-w-[400px] md:order-none md:col-start-7 md:col-span-6 md:row-start-1 md:mx-0 md:h-[80vh] md:max-w-none"
        >
          {/* Primary portrait */}
          <div className="absolute right-0 top-0 h-[82%] w-[74%] md:h-[88%] md:w-[68%]">
            <div
              data-anim="frame-primary"
              className="relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(137,91,58,0.45)] ring-1 ring-white/40"
            >
              <div className="absolute inset-0 scale-105">
                <Image
                  src={primarySrc}
                  alt={primaryAlt}
                  fill
                  priority
                  sizes="(min-width: 768px) 40vw, 70vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Overlapping "look" card */}
          <div className="absolute bottom-0 left-0 h-[52%] w-[50%] md:h-[50%] md:w-[44%]">
            <div
              data-anim="frame-secondary"
              className="relative h-full w-full overflow-hidden rounded-[1.5rem] border-[5px] border-cream shadow-[0_24px_50px_-24px_rgba(137,91,58,0.5)]"
            >
              <div className="absolute inset-0 scale-105">
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt}
                  fill
                  sizes="(min-width: 768px) 26vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue — bottom-left, clear of the photo collage */}

    </section>
  );
}
