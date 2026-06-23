import { NextResponse } from 'next/server';
import { getCollectionProducts } from '@/lib/shopify';
import { rateLimit, getIp } from '@/lib/rate-limit';

/** Lightweight product list for the cart "You may also like" upsell. */
export async function GET(request: Request) {
  if (!rateLimit(`reco:${getIp(request)}`, 60, 60_000)) {
    return NextResponse.json({ products: [] }, { status: 429 });
  }

  const products = await getCollectionProducts('', 8);
  const data = products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    price: p.priceRange.minVariantPrice.amount,
    currency: p.priceRange.minVariantPrice.currencyCode,
    image: p.featuredImage?.url ?? null,
    imageAlt: p.featuredImage?.altText ?? p.title,
    variantId: p.defaultVariantId,
  }));

  return NextResponse.json({ products: data });
}
