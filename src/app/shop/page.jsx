import { getProductsByBrand } from '@/lib/shopify';
import ColorCycleCard from '@/components/ColorCycleCard';

export const dynamic = 'force-dynamic';
const S = 'https://bodgeaworldwide.myshopify.com';

export default async function ShopPage() {
  const brandFolders = await getProductsByBrand();

  return (
    <>
      <section className="shop-nav">
        <div className="shop-nav__inner">
          {brandFolders.map(folder => (
            <a key={folder.handle} href={`#brand-${folder.handle}`} className="shop-nav__link">
              {folder.label} <span className="shop-nav__count">({folder.products.length})</span>
            </a>
          ))}
          <a href={`${S}/collections/bodega`} className="shop-nav__link shop-nav__link--shopify">
            Shopify Store &rarr;
          </a>
        </div>
      </section>

      {brandFolders.map(folder => {
        const byType = {};
        folder.products.forEach(product => {
          const type = product.product_type?.trim() || 'Other';
          if (!byType[type]) byType[type] = [];
          byType[type].push(product);
        });
        return (
          <section key={folder.handle} id={`brand-${folder.handle}`} className="brand-folder">
            <div className="brand-folder__header">
              <div>
                <span className="brand-folder__eyebrow">Brand Folder</span>
                <h1 className="brand-folder__title">{folder.label}</h1>
              </div>
              <span className="brand-folder__count">{folder.products.length} products</span>
            </div>
            <nav className="brand-folder__categories" aria-label={`${folder.label} categories`}>
              {Object.entries(byType).map(([type, items]) => (
                <a key={type} href={`#${folder.handle}-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                  {type} ({items.length})
                </a>
              ))}
            </nav>
            {Object.entries(byType).map(([type, items]) => (
              <section key={type} id={`${folder.handle}-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="shop">
                <div className="shop__header">
                  <h2 className="shop__title">{type} &mdash; {items.length}</h2>
                  <a href={`${S}/collections/${folder.handle}`} className="shop__link">View {folder.label} &rarr;</a>
                </div>
                <div className="dgrid">
                  {items.map(product => <ColorCycleCard key={product.id} product={product} storeUrl={S} />)}
                </div>
              </section>
            ))}
          </section>
        );
      })}
    </>
  );
}
