import type { Metadata } from 'next';
import { getCollectionProducts } from '@/lib/shopify';
import Lookbook from '@/components/Lookbook';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lookbook — The Debut Capsule | Thoda Soft',
  description:
    'The Thoda Soft lookbook — soft-aesthetic dresses styled for real life. Explore and shop the debut capsule.',
  alternates: { canonical: '/lookbook' },
  openGraph: {
    title: 'Lookbook — Thoda Soft',
    description:
      'Soft-aesthetic dressing for slow mornings and golden hours. Explore and shop the debut capsule.',
    type: 'website',
  },
};

export default async function LookbookPage() {
  const products = await getCollectionProducts('', 8);
  return <Lookbook products={products} />;
}
