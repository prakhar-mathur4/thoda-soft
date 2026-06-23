import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getAllProductHandles } from '@/lib/shopify';
import ProductView from '@/components/ProductView';
import { SITE_URL, SITE_NAME, jsonLd } from '@/lib/site';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: 'Product not found — Thoda Soft' };

  const description = product.descriptionHtml
    .replace(/<[^>]+>/g, '')
    .slice(0, 160);

  return {
    title: `${product.title} — Thoda Soft`,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      title: product.title,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${handle}`,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const inStock = product.variants.some((v) => v.availableForSale);
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.descriptionHtml.replace(/<[^>]+>/g, '').slice(0, 300),
    image: product.images.map((img) => img.url),
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.handle}`,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      price: product.priceRange.minVariantPrice.amount,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(productJsonLd) }}
      />
      <ProductView product={product} />
    </>
  );
}
