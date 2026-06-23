import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/shopify';
import { rateLimit, getIp } from '@/lib/rate-limit';

/** Returns the full image gallery for a product (used by Quick View). */
export async function GET(request: Request) {
  if (!rateLimit(`quickview:${getIp(request)}`, 60, 60_000)) {
    return NextResponse.json({ images: [] }, { status: 429 });
  }
  const handle = new URL(request.url).searchParams.get('handle') ?? '';
  if (!handle.trim()) return NextResponse.json({ images: [] });

  const product = await getProduct(handle);
  return NextResponse.json({ images: product?.images ?? [] });
}
