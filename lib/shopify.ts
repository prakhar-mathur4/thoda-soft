import 'server-only';
import type { Product, ProductDetail, ProductImage } from './types';
import { MOCK_PRODUCTS } from './mock-products';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? '2024-10';

export const isShopifyConfigured = Boolean(domain && token);

const endpoint = domain
  ? `https://${domain}/api/${apiVersion}/graphql.json`
  : '';

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

/**
 * Thin Storefront API client. Uses Next.js fetch caching for ISR — data is
 * revalidated by Shopify webhooks hitting /api/revalidate (tag-based), not on
 * every request. The `products` tag lets a single webhook bust all product data.
 */
async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600, tags: ['products'] },
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  if (!json.data) throw new Error('Shopify Storefront API returned no data');
  return json.data;
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: CREATED_AT) {
      nodes {
        id
        handle
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          name
          values
        }
        images(first: 2) {
          nodes {
            url
            altText
            width
            height
          }
        }
        variants(first: 20) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  options: { name: string; values: string[] }[];
  images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

function normalize(raw: RawProduct): Product {
  const images = raw.images.nodes;
  const firstAvailable =
    raw.variants.nodes.find((v) => v.availableForSale) ?? raw.variants.nodes[0];

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    priceRange: raw.priceRange,
    featuredImage: images[0] ?? null,
    hoverImage: images[1] ?? null,
    // Hide the placeholder single-value "Title" option Shopify adds.
    options: raw.options.filter(
      (o) => !(o.values.length === 1 && o.values[0] === 'Default Title'),
    ),
    variants: raw.variants.nodes,
    defaultVariantId: firstAvailable?.id ?? null,
  };
}

/**
 * Fetch the debut-capsule products. No collection needed — products are matched
 * by tag (set via the import CSV), controlled by SHOPIFY_PRODUCTS_QUERY.
 * Falls back to the mock catalogue when Shopify is not configured or returns
 * nothing, so the storefront still renders for design review.
 */
export async function getCollectionProducts(
  query = process.env.SHOPIFY_PRODUCTS_QUERY ?? 'tag:debut-capsule',
  first = 4,
): Promise<Product[]> {
  if (!isShopifyConfigured) {
    return MOCK_PRODUCTS.slice(0, first);
  }

  // Empty query = no filter (fetch all published products).
  const filter = query.trim() === '' ? undefined : query;

  try {
    const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>(
      PRODUCTS_QUERY,
      { first, query: filter },
    );

    const nodes = data.products?.nodes ?? [];
    if (nodes.length === 0) return MOCK_PRODUCTS.slice(0, first);
    return nodes.map(normalize);
  } catch (err) {
    console.error('[shopify] falling back to mock products:', err);
    return MOCK_PRODUCTS.slice(0, first);
  }
}

export type HeroImages = {
  primary: ProductImage | null;
  secondary: ProductImage | null;
};

/**
 * Hero art comes from products tagged `hero` in Shopify. The first hero-tagged
 * product supplies the primary image; the second (or the first product's hover
 * image) supplies the secondary. Returns nulls when nothing is tagged — so
 * <Hero /> falls back to its bundled editorial stills — and never falls back to
 * the mock catalogue.
 */
export async function getHeroImages(): Promise<HeroImages> {
  if (!isShopifyConfigured) return { primary: null, secondary: null };

  try {
    const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>(
      PRODUCTS_QUERY,
      { first: 2, query: 'tag:hero' },
    );
    const nodes = (data.products?.nodes ?? []).map(normalize);
    if (nodes.length === 0) return { primary: null, secondary: null };
    return {
      primary: nodes[0].featuredImage,
      secondary: nodes[1]?.featuredImage ?? nodes[0].hoverImage,
    };
  } catch (err) {
    console.error('[shopify] getHeroImages error:', err);
    return { primary: null, secondary: null };
  }
}

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      options {
        name
        values
      }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 8) {
        nodes { url altText width height }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
          image { url altText width height }
        }
      }
    }
  }
`;

type RawProductDetail = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  options: { name: string; values: string[] }[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      image: { url: string; altText: string | null; width: number; height: number } | null;
    }[];
  };
};

function normalizeDetail(raw: RawProductDetail): ProductDetail {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    descriptionHtml: raw.descriptionHtml,
    priceRange: raw.priceRange,
    images: raw.images.nodes,
    // Drop options that only have a single placeholder value (e.g. "Title").
    options: raw.options.filter(
      (o) => !(o.values.length === 1 && o.values[0] === 'Default Title'),
    ),
    variants: raw.variants.nodes,
  };
}

/**
 * Fetch a single product by handle for the product detail page.
 * Returns null when not found (or when Shopify is configured but errors).
 */
export async function getProduct(handle: string): Promise<ProductDetail | null> {
  if (!isShopifyConfigured) {
    const mock = MOCK_PRODUCTS.find((p) => p.handle === handle);
    if (!mock) return null;
    return {
      id: mock.id,
      handle: mock.handle,
      title: mock.title,
      descriptionHtml: `<p>${mock.description}</p>`,
      priceRange: {
        minVariantPrice: mock.priceRange.minVariantPrice,
        maxVariantPrice: mock.priceRange.minVariantPrice,
      },
      images: [mock.featuredImage, mock.hoverImage].filter(
        (img): img is NonNullable<typeof img> => Boolean(img),
      ),
      options: [],
      variants: mock.defaultVariantId
        ? [
            {
              id: mock.defaultVariantId,
              title: 'Default',
              availableForSale: true,
              price: mock.priceRange.minVariantPrice,
              selectedOptions: [],
              image: null,
            },
          ]
        : [],
    };
  }

  try {
    const data = await shopifyFetch<{ product: RawProductDetail | null }>(
      PRODUCT_QUERY,
      { handle },
    );
    return data.product ? normalizeDetail(data.product) : null;
  } catch (err) {
    console.error('[shopify] getProduct error:', err);
    return null;
  }
}

const HANDLES_QUERY = /* GraphQL */ `
  query ProductHandles($first: Int!) {
    products(first: $first) {
      nodes { handle }
    }
  }
`;

/** All product handles — used to pre-render product pages at build time. */
export async function getAllProductHandles(): Promise<string[]> {
  if (!isShopifyConfigured) {
    return MOCK_PRODUCTS.map((p) => p.handle);
  }
  try {
    const data = await shopifyFetch<{ products: { nodes: { handle: string }[] } }>(
      HANDLES_QUERY,
      { first: 100 },
    );
    return data.products.nodes.map((n) => n.handle);
  } catch (err) {
    console.error('[shopify] getAllProductHandles error:', err);
    return [];
  }
}

/**
 * Search products by a free-text term (used by predictive search + /search).
 * Single-word terms get wildcard substring matching across title/tag/type;
 * multi-word terms fall back to Shopify full-text search.
 */
export async function searchProducts(
  term: string,
  first = 12,
): Promise<Product[]> {
  const q = term.trim();
  if (!q) return [];

  if (!isShopifyConfigured) {
    const lc = q.toLowerCase();
    return MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(lc),
    ).slice(0, first);
  }

  const safe = q.replace(/["\\]/g, ' ').trim();
  const query = /\s/.test(safe)
    ? safe
    : `title:*${safe}* OR tag:*${safe}* OR product_type:*${safe}*`;

  try {
    const data = await shopifyFetch<{ products: { nodes: RawProduct[] } }>(
      PRODUCTS_QUERY,
      { first, query },
    );
    return (data.products?.nodes ?? []).map(normalize);
  } catch (err) {
    console.error('[shopify] searchProducts error:', err);
    return [];
  }
}
