'use client';

import { useRef, ElementType, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Distance to travel up, in px. */
  y?: number;
  delay?: number;
  /** When true, animate direct children in sequence (e.g. a grid of cards). */
  stagger?: boolean;
  /** Play on mount instead of waiting for scroll (for content in the first view). */
  immediate?: boolean;
  as?: ElementType;
};

/**
 * Subtle scroll-triggered fade-up. Respects prefers-reduced-motion (content
 * just appears). Targets are below the fold, so the hidden start state is never
 * visible as a flash.
 */
export default function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  stagger = false,
  immediate = false,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const targets = stagger ? Array.from(el.children) : el;

      if (immediate) {
        // Play once on mount (content already in the first view). fromTo keeps the
        // end state explicit so it can't stick hidden under dev double-invoke.
        gsap.fromTo(
          targets,
          { y, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay,
            stagger: stagger ? 0.12 : 0,
          },
        );
        return;
      }

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
