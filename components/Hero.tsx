'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = imgRef.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.to(el, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: imgRef },
  );

  return (
    <section id="top" className="relative h-[56svh] min-h-[360px] w-full overflow-hidden md:h-[92svh] md:min-h-[560px]">
      {/* Scaled slightly so the parallax shift never exposes the edges. */}
      <div ref={imgRef} className="absolute inset-0 scale-110">
        <Image
          src="https://cdn.shopify.com/s/files/1/1004/1779/8437/files/Screenshot_2026-06-17_at_11.46.11_PM.png?v=1781720192"
          alt="A model in a soft pastel dress bathed in warm afternoon sunlight"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
