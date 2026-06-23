import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Our Story — Thoda Soft',
  description:
    'Thoda Soft was born from the space between a beautiful moodboard and real, everyday life — soft-aesthetic dresses in premium cotton, designed in India.',
  alternates: { canonical: '/our-story' },
};

export default function OurStoryPage() {
  return (
    <article className="pb-24">
      {/* Intro */}
      <section className="container-editorial py-16 text-center sm:py-24">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-charcoal-muted">
          Thoda Soft
        </p>
        <h1 className="font-serif text-5xl leading-tight sm:text-6xl">
          Our Story
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-charcoal/75 sm:text-lg">
          We started Thoda Soft for the space between a beautiful moodboard and
          a real, lived-in life — for the woman who wants to feel as soft as she
          looks.
        </p>
      </section>

      {/* Full-width image */}
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/8]">
        <Image
          src="/images/hero_banner.png"
          alt="A soft, sunlit moment captured in a Thoda Soft dress"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Narrative */}
      <section className="container-editorial py-16 sm:py-24">
        <Reveal className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-charcoal/80">
          <p>
            It began with a familiar frustration: the dresses we saved on
            Pinterest never seemed to exist in real life — or when they did,
            they looked beautiful for a photo and felt impossible to wear for a
            day. We wanted both. The dreamy, soft-aesthetic silhouette
            <em> and</em> the kind of comfort that makes you forget you&apos;re
            even dressed up.
          </p>
          <p>
            So we built it ourselves. Every Thoda Soft piece is cut from
            premium, ultra-soft cotton and designed in India with feminine,
            flattering fits — pieces meant to be lived in, not just looked at.
          </p>

          <h2 className="pt-6 font-serif text-2xl text-charcoal">
            Made for reality
          </h2>
          <p>
            Real wardrobes aren&apos;t one size. That&apos;s why every style
            comes in inclusive sizing from S to XXL, designed to drape
            beautifully on every body. We&apos;d rather make fewer things,
            better — small, considered drops over endless racks of the
            forgettable.
          </p>

          <h2 className="pt-6 font-serif text-2xl text-charcoal">
            Soft, on purpose
          </h2>
          <p>
            The name says it: <em>thoda soft</em> — a little soft. Soft on your
            skin, soft on the eyes, soft on the planet where we can be. It&apos;s
            a feeling more than a trend, and it&apos;s stitched into everything
            we make.
          </p>
        </Reveal>
      </section>

      {/* Pull quote */}
      <section className="bg-[#f7dfdf] py-16 sm:py-24">
        <blockquote className="container-editorial mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl italic leading-snug text-charcoal sm:text-3xl">
            &ldquo;You shouldn&apos;t have to choose between a beautiful
            moodboard and breathable comfort.&rdquo;
          </p>
          <footer className="mt-5 text-xs uppercase tracking-[0.2em] text-charcoal-muted">
            thoda pretty, thoda you
          </footer>
        </blockquote>
      </section>

      {/* Split: image + craftsmanship */}
      <section className="grid grid-cols-1 items-stretch bg-[#ccd1b2] md:grid-cols-2">
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[480px]">
          <Image
            src="/images/category_dresses.png"
            alt="Close-up of premium, ultra-soft cotton fabric"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-6 py-14 sm:px-12 md:py-20">
          <Reveal className="max-w-md">
            <h2 className="font-serif text-3xl leading-snug sm:text-4xl">
              The fabric is the whole point.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal/80">
              We obsess over the hand-feel first. Breathable, weightless cotton
              that moves with you and softens with every wash — so the piece you
              reach for on day one becomes the one you reach for on day one
              hundred.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-editorial py-20 text-center sm:py-28">
        <Reveal>
        <h2 className="font-serif text-3xl sm:text-4xl">
          Find your softest piece.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-charcoal-muted">
          Explore the debut capsule — limited, considered, made to be lived in.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop The Capsule
        </Link>
        </Reveal>
      </section>
    </article>
  );
}
