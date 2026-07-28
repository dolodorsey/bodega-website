import { notFound } from 'next/navigation';
import { getProductByHandle, plainDescription } from '@/lib/shopify';
import ProductInteractive from '@/components/ProductInteractive';

export const dynamic = 'force-dynamic';

const S = 'https://bodgeaworldwide.myshopify.com';

function metaDescription(product) {
  return (
    plainDescription(product.body_html, 160) ||
    `${product.title} — stocked at BODEGA. Curated essentials, corner store hours.`
  );
}

export async function generateMetadata({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) return { title: 'Not on the shelf — BODEGA' };

  const description = metaDescription(product);
  const image = product.images?.[0]?.src;

  return {
    title: `${product.title} — BODEGA`,
    description,
    openGraph: {
      title: `${product.title} — BODEGA`,
      description,
      siteName: 'BODEGA',
      type: 'website',
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  return <ProductInteractive product={product} store={S} />;
}
