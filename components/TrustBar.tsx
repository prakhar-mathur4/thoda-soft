import { LeafIcon, SparkleIcon, PinIcon, ClockIcon } from './icons';
import Reveal from './Reveal';

const ITEMS = [
  { icon: LeafIcon, label: 'Premium Cotton' },
  { icon: SparkleIcon, label: 'Inclusive Sizing (S–XXL)' },
  { icon: PinIcon, label: 'Designed in India' },
  { icon: ClockIcon, label: 'Limited Drop' },
];

export default function TrustBar() {
  return (
    <section aria-label="Brand promises" className="bg-blush">
      {/* Desktop: static 4-up row */}
      <Reveal
        as="ul"
        stagger
        className="container-editorial hidden grid-cols-4 gap-x-4 py-8 md:grid"
      >
        {ITEMS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center justify-center gap-3 text-center"
          >
            <Icon className="h-5 w-5 text-charcoal" />
            <span className="text-sm tracking-wide text-charcoal">{label}</span>
          </li>
        ))}
      </Reveal>

      {/* Mobile: single continuously-scrolling marquee ribbon */}
      <div className="overflow-hidden py-3.5 md:hidden">
        <div className="flex w-max animate-marquee [animation-direction:reverse] motion-reduce:animate-none">
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 items-center"
            >
              {ITEMS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 whitespace-nowrap px-5 text-xs tracking-wide text-charcoal"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                  <span
                    aria-hidden
                    className="ml-5 h-1 w-1 rounded-full bg-charcoal/30"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
