import { getCollectionProducts } from '@/lib/shopify';
import ProductCarousel from './ProductCarousel';
import Reveal from './Reveal';

/**
 * Server Component — products are fetched on the server (ISR) and the cards
 * hydrate as client components for the add-to-cart interaction.
 */
export default async function ProductGrid() {
  const products = await getCollectionProducts();

  return (
    <section id="capsule" className="scroll-mt-24 bg-cream">
      <div className="container-editorial py-16 sm:py-24">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
            Limited Drop
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl">The Debut Capsule</h2>
          <p className="mt-3 text-pretty text-sm text-charcoal-muted sm:text-base">
            Four pieces. Endlessly wearable. Made to be lived in.
          </p>
        </Reveal>

        {/* Mobile: swipeable snap-carousel + slider · Desktop (sm+): 2-col grid */}
        <Reveal>
          <ProductCarousel products={products} />
        </Reveal>
      </div>
    </section>
  );
}
