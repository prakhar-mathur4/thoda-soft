import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/shopify';
import { rateLimit, getIp } from '@/lib/rate-limit';

/** Predictive search endpoint for the header overlay. */
export async function GET(request: Request) {
  if (!rateLimit(`search:${getIp(request)}`, 40, 60_000)) {
    return NextResponse.json({ results: [] }, { status: 429 });
  }
  const q = new URL(request.url).searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json({ results: [] });

  const products = await searchProducts(q, 6);
  const results = products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    price: p.priceRange.minVariantPrice.amount,
    currency: p.priceRange.minVariantPrice.currencyCode,
    image: p.featuredImage?.url ?? null,
    imageAlt: p.featuredImage?.altText ?? p.title,
  }));

  return NextResponse.json({ results });
}
