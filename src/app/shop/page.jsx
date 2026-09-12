import { getProductsByBrand } from '@/lib/shopify';
import ColorCycleCard from '@/components/ColorCycleCard';
import { BRAND_GRAPHICS } from '@/lib/brandGraphics';
import { inferProductCategory } from '@/lib/productCategories';

export const dynamic = 'force-dynamic';
const S = 'https://bodgeaworldwide.myshopify.com';

function canRenderProduct(product) {
  return Boolean(product?.images?.[0]?.src && product?.variants?.[0]?.id);
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const brandFolders = await getProductsByBrand();
  const requestedHandle = params?.brand;
  const selectedFolder = brandFolders.find(folder => folder.handle === requestedHandle) || brandFolders[0];

  if (!selectedFolder) {
    return (
      <section className="shop">
        <div className="shop__header">
          <h1 className="shop__title">STORE TEMPORARILY UNAVAILABLE</h1>
        </div>
      </section>
    );
  }

  const products = selectedFolder.products.filter(canRenderProduct);
  const graphic = BRAND_GRAPHICS[selectedFolder.handle];
  const byType = {};

  products.forEach(product => {
    const type = inferProductCategory(product);
    if (!byType[type]) byType[type] = [];
    byType[type].push(product);
  });

  return (
    <>
      <section className="shop-nav">
        <div className="shop-nav__inner">
          {brandFolders.map(folder => {
            const visibleCount = folder.products.filter(canRenderProduct).length;
            const isActive = folder.handle === selectedFolder.handle;
            return (
              <a
                key={folder.handle}
                href={`/shop?brand=${encodeURIComponent(folder.handle)}`}
                className="shop-nav__link"
                aria-current={isActive ? 'page' : undefined}
                style={isActive ? { color: '#ff5a1f' } : undefined}
              >
                {folder.label} <span className="shop-nav__count">({visibleCount})</span>
              </a>
            );
          })}
          <a href={`${S}/collections/${selectedFolder.handle}`} className="shop-nav__link shop-nav__link--shopify">
            Shopify Store &rarr;
          </a>
        </div>
      </section>

      <section id={`brand-${selectedFolder.handle}`} className="brand-folder">
        <div
          className={`brand-folder__header${graphic && graphic.type !== 'video' ? ' brand-folder__header--graphic' : ''}`}
        >
          {graphic && graphic.type !== 'video' && (
            <>
              <img className="brand-folder__background" src={graphic.src} alt="" aria-hidden="true" />
              <span className="brand-folder__shade" aria-hidden="true" />
            </>
          )}
          <div>
            <span className="brand-folder__eyebrow">Collection</span>
            <h1 className="brand-folder__title">{selectedFolder.label}</h1>
          </div>
          <span className="brand-folder__count">{products.length} visible products</span>
        </div>

        {products.length === 0 ? (
          <section className="shop">
            <div className="shop__header">
              <h2 className="shop__title">COMING SOON</h2>
              <a href={`${S}/collections/${selectedFolder.handle}`} className="shop__link">View in Shopify &rarr;</a>
            </div>
          </section>
        ) : (
          <>
            <nav className="brand-folder__categories" aria-label={`${selectedFolder.label} categories`}>
              {Object.entries(byType).map(([type, items]) => (
                <a key={type} href={`#${selectedFolder.handle}-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                  {type} ({items.length})
                </a>
              ))}
            </nav>

            {Object.entries(byType).map(([type, items]) => (
              <section key={type} id={`${selectedFolder.handle}-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="shop">
                <div className="shop__header">
                  <h2 className="shop__title">{selectedFolder.label} / {type} &mdash; {items.length}</h2>
                  <a href={`${S}/collections/${selectedFolder.handle}`} className="shop__link">View {selectedFolder.label} &rarr;</a>
                </div>
                <div className="dgrid">
                  {items.map(product => <ColorCycleCard key={product.id} product={product} storeUrl={S} />)}
                </div>
              </section>
            ))}
          </>
        )}
      </section>
    </>
  );
}
