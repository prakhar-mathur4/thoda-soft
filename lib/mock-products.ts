import type { Product } from './types';

/**
 * Fallback catalogue used when Shopify Storefront credentials are not configured
 * (e.g. local design preview). The real store returns the same shape from
 * `getCollectionProducts`. Prices sit in the ₹1500–₹2500 brief range.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://mock/Product/1',
    handle: 'the-daydream-midi-dress',
    title: 'The Daydream Midi Dress',
    description:
      'A floaty midi cut in premium cotton — the everyday dress that photographs like a moodboard.',
    priceRange: { minVariantPrice: { amount: '2200.00', currencyCode: 'INR' } },
    featuredImage: { url: '/images/product_dress_1.png', altText: 'The Daydream Midi Dress' },
    hoverImage: { url: '/images/product_dress_2.png', altText: 'The Daydream Midi Dress, styled' },
    options: [],
    variants: [],
    defaultVariantId: 'gid://mock/ProductVariant/1',
  },
  {
    id: 'gid://mock/Product/2',
    handle: 'the-sunday-cloud-tiered-dress',
    title: 'The Sunday Cloud Tiered Dress',
    description: 'Soft tiers, weightless drape. Made for slow mornings and golden light.',
    priceRange: { minVariantPrice: { amount: '2500.00', currencyCode: 'INR' } },
    featuredImage: { url: '/images/product_dress_2.png', altText: 'The Sunday Cloud Tiered Dress' },
    hoverImage: { url: '/images/product_dress_3.png', altText: 'The Sunday Cloud Tiered Dress, styled' },
    options: [],
    variants: [],
    defaultVariantId: 'gid://mock/ProductVariant/2',
  },
  {
    id: 'gid://mock/Product/3',
    handle: 'the-golden-hour-slip-dress',
    title: 'The Golden Hour Slip Dress',
    description: 'A clean bias slip with a quiet sheen — effortless from desk to dinner.',
    priceRange: { minVariantPrice: { amount: '1900.00', currencyCode: 'INR' } },
    featuredImage: { url: '/images/product_dress_3.png', altText: 'The Golden Hour Slip Dress' },
    hoverImage: { url: '/images/product_dress_1.png', altText: 'The Golden Hour Slip Dress, styled' },
    options: [],
    variants: [],
    defaultVariantId: 'gid://mock/ProductVariant/3',
  },
  {
    id: 'gid://mock/Product/4',
    handle: 'the-meadow-breeze-wrap-dress',
    title: 'The Meadow Breeze Wrap Dress',
    description: 'An adjustable wrap that flatters every body — inclusive sizing, S to XXL.',
    priceRange: { minVariantPrice: { amount: '1500.00', currencyCode: 'INR' } },
    featuredImage: { url: '/images/product_top_1.png', altText: 'The Meadow Breeze Wrap Dress' },
    hoverImage: { url: '/images/product_knit_1.png', altText: 'The Meadow Breeze Wrap Dress, styled' },
    options: [],
    variants: [],
    defaultVariantId: 'gid://mock/ProductVariant/4',
  },
];
