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
 * masked line-by-line serif headline beside a layered, floating photo collage that
 * drapes with fabric-like motion and responds to cursor depth.
 *
 * Motion is entirely GSAP-driven and gated behind prefers-reduced-motion; with
 * motion off (or JS disabled) the static layout is fully visible and legible.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const q = gsap.utils.selector(el);

      // — Entrance choreography ————————————————————————————————
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from(q('[data-anim="rule"]'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
      })
        .from(
          q('[data-anim="eyebrow"] > *'),
          { yPercent: 130, opacity: 0, stagger: 0.06, duration: 0.6 },
          '-=0.55',
        )
        .from(
          q('[data-anim="line"]'),
          { yPercent: 115, stagger: 0.1, duration: 0.95, ease: 'power4.out' },
          '-=0.3',
        )
        .from(
          q('[data-anim="standfirst"]'),
          { y: 18, opacity: 0, duration: 0.7 },
          '-=0.55',
        )
        .from(
          q('[data-anim="cta"]'),
          { y: 16, opacity: 0, stagger: 0.1, duration: 0.6 },
          '-=0.45',
        )
        // Photo frames wipe open like a turning page.
        .from(
          q('[data-anim="frame-primary"]'),
          { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.15, ease: 'power4.inOut' },
          0.15,
        )
        .from(
          q('[data-anim="frame-secondary"]'),
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            opacity: 0,
            duration: 1,
            ease: 'power4.inOut',
          },
          0.5,
        )
        .from(q('[data-anim="credit"]'), { opacity: 0, y: 12, duration: 0.6 }, '-=0.25')
        .from(q('[data-anim="spine"]'), { opacity: 0, duration: 0.9 }, '-=0.6')
        .from(q('[data-anim="scroll"]'), { opacity: 0, y: -8, duration: 0.6 }, '-=0.4');

      // — Continuous fabric-drape float on the inner images ————————
      q('[data-float]').forEach((node, i) => {
        gsap.to(node, {
          y: i % 2 === 0 ? 16 : -14,
          duration: 4.5 + i,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1 + i * 0.3,
        });
      });

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

      // — Pointer parallax (desktop / fine pointer only) ——————————
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const layers = q('[data-parallax]') as HTMLElement[];
        const setters = layers.map((n) => ({
          x: gsap.quickTo(n, 'x', { duration: 0.9, ease: 'power3' }),
          y: gsap.quickTo(n, 'y', { duration: 0.9, ease: 'power3' }),
          depth: Number(n.dataset.parallax) || 1,
        }));
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const cx = (e.clientX - r.left) / r.width - 0.5;
          const cy = (e.clientY - r.top) / r.height - 0.5;
          setters.forEach((s) => {
            s.x(cx * 30 * s.depth);
            s.y(cy * 30 * s.depth);
          });
        };
        el.addEventListener('pointermove', onMove);
        return () => el.removeEventListener('pointermove', onMove);
      }
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Thoda Soft — the debut capsule"
      className="relative w-full overflow-hidden bg-gradient-to-br from-cream via-blush/40 to-lavender/30 pb-16 pt-24 md:pb-0 md:pt-28"
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

          <h1 className="mt-7 font-serif text-[clamp(2.9rem,9vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.01em] text-charcoal">
            <span className="block overflow-hidden">
              <span data-anim="line" className="block">
                Wear your
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-anim="line" className="block font-light italic">
                softness
              </span>
            </span>
            <span className="block overflow-hidden">
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
              Explore the capsule
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
          className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[440px] md:order-none md:col-start-7 md:col-span-6 md:row-start-1 md:mx-0 md:aspect-auto md:h-[80vh] md:max-w-none"
        >
          {/* Primary portrait */}
          <div
            data-parallax="0.5"
            className="absolute right-0 top-0 h-[82%] w-[74%] md:h-[88%] md:w-[68%]"
          >
            <div
              data-anim="frame-primary"
              className="relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-30px_rgba(137,91,58,0.45)] ring-1 ring-white/40"
            >
              <div data-float className="absolute inset-0 scale-105">
                <Image
                  src="/images/product_top_1.png"
                  alt="A woman in a hand-embroidered ivory cotton blouse, lit by golden afternoon sun"
                  fill
                  priority
                  sizes="(min-width: 768px) 40vw, 70vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Overlapping "look" card */}
          <div
            data-parallax="1.15"
            className="absolute bottom-0 left-0 h-[52%] w-[50%] md:h-[50%] md:w-[44%]"
          >
            <div
              data-anim="frame-secondary"
              className="relative h-full w-full overflow-hidden rounded-[1.5rem] border-[5px] border-cream shadow-[0_24px_50px_-24px_rgba(137,91,58,0.5)]"
            >
              <div data-float className="absolute inset-0 scale-105">
                <Image
                  src="/images/hero_banner.png"
                  alt="A tiered floral sundress in motion across a wildflower meadow at sunset"
                  fill
                  sizes="(min-width: 768px) 26vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Shoppable editorial credit */}
            <Link
              data-anim="credit"
              href="/shop"
              className="group absolute -bottom-4 left-3 right-3 flex items-center justify-between gap-2 rounded-full bg-cream/95 px-4 py-2.5 text-charcoal shadow-[0_10px_30px_-12px_rgba(137,91,58,0.55)] backdrop-blur transition hover:bg-cream"
            >
              <span className="text-[0.7rem] uppercase tracking-[0.18em]">
                Nº 01 — The Sundress
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap text-[0.7rem] font-medium tracking-wide">
                Shop the look
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-anim="scroll"
        aria-hidden
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-charcoal/60 md:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-charcoal/40 motion-reduce:animate-none" />
      </div>
    </section>
  );
}
