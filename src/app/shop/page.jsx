import { getProducts } from '@/lib/shopify';
import ColorCycleCard from '@/components/ColorCycleCard';

export const dynamic = 'force-dynamic';
const S = 'https://bodegabodegbodega.myshopify.com';

export default async function ShopPage() {
  const products = await getProducts();
  const byType = {};
  (products || []).forEach(p => {
    const t = p.product_type || 'All Products';
    if (!byType[t]) byType[t] = [];
    byType[t].push(p);
  });

  return (
    <>
      <section className="shop-nav">
        <div className="shop-nav__inner">
          {Object.keys(byType).map(cat => (
            <a key={cat} href={`#${cat.toLowerCase().replace(/\s/g, '-')}`} className="shop-nav__link">
              {cat} <span className="shop-nav__count">({byType[cat].length})</span>
            </a>
          ))}
          <a href={`${S}/collections/all`} className="shop-nav__link shop-nav__link--shopify">
            Shopify Store &rarr;
          </a>
        </div>
      </section>

      {Object.entries(byType).map(([cat, items]) => (
        <section key={cat} id={cat.toLowerCase().replace(/\s/g, '-')} className="shop">
          <div className="shop__header">
            <h2 className="shop__title">{cat} &mdash; {items.length}</h2>
            <a href={`${S}/collections/all`} className="shop__link">View on Shopify &rarr;</a>
          </div>
          <div className="dgrid">
            {items.map(p => (
              <ColorCycleCard key={p.id} product={p} storeUrl={S} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
