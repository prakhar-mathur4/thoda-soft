import { getCollectionProducts } from '@/lib/shopify';
import ProductCard from './ProductCard';
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

        {/* Mobile: swipeable snap-carousel · Desktop (sm+): 2-col grid */}
        <Reveal
          stagger
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[80%] shrink-0 snap-start sm:min-w-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
