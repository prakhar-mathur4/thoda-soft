import Image from 'next/image';
import Reveal from './Reveal';

export default function BrandStory() {
  return (
    <section id="story" className="scroll-mt-24 bg-[#ccd1b2]">
      <div className="grid grid-cols-1 items-stretch md:grid-cols-2">
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-[520px]">
          <Image
            src="/images/category_dresses.png"
            alt="Close-up of soft, premium cotton fabric in a natural pastel tone"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex items-center px-6 py-14 sm:px-12 md:py-20">
          <Reveal className="max-w-md">
            <h2 className="text-balance font-serif text-3xl leading-snug sm:text-4xl">
              Aesthetic meets Everyday Wearability.
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-charcoal/80">
              You shouldn&apos;t have to choose between a beautiful moodboard and
              breathable comfort. Crafted from premium, ultra-soft cotton, our
              pieces are designed to look flawless on your feed and feel
              weightless on your skin.
            </p>
            <a href="/shop" className="btn-primary mt-8">
              Explore the capsule
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
