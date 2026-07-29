import { getProductsByBrand, formatPrice } from '@/lib/shopify';
import { BRAND_GRAPHICS } from '@/lib/brandGraphics';
import LandingVideo from '@/components/LandingVideo';

export const dynamic = 'force-dynamic';
const S = 'https://bodgeaworldwide.myshopify.com';

function ProductCard({ p }) {
  const variant = p.variants?.find(item => item.available !== false) || p.variants?.[0];
  const img = p.images?.find(image => image.id === variant?.image_id)?.src || p.images?.[0]?.src;
  const pr = variant?.price;
  const vid = variant?.id;
  const requiresSelection = (p.variants?.length || 0) > 1;
  const productUrl = `/products/${p.handle}`;
  if (!img) return null;
  return (
    <article className="dc">
      <div className="dc__wrap">
        <a href={productUrl} aria-label={`View ${p.title}`}>
          <img src={img} alt={p.title} className="dc__img" loading="lazy" />
        </a>
        <a href={requiresSelection ? productUrl : `${S}/cart/${vid}:1`} className="dc__cta">
          {requiresSelection ? 'Choose Options' : 'Add to Cart'}
        </a>
      </div>
      <div className="dc__info">
        <a href={productUrl} className="dc__name">{p.title}</a>
        <div className="dc__price">{formatPrice(pr)}</div>
      </div>
    </article>
  );
}

function BrandGraphic({ folder }) {
  const graphic = BRAND_GRAPHICS[folder.handle];
  if (!graphic) return null;

  return (
    <a href={`/shop#brand-${folder.handle}`} className="brand-campaign" aria-label={`Shop ${folder.label}`}>
      {graphic.type === 'video' ? (
        <video
          className="brand-campaign__media"
          src={graphic.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={graphic.alt}
        />
      ) : (
        <img className="brand-campaign__media" src={graphic.src} alt={graphic.alt} loading="lazy" />
      )}
      <span className="brand-campaign__shade" />
      <span className="brand-campaign__copy">
        <span className="brand-campaign__eyebrow">{graphic.eyebrow}</span>
        <strong className="brand-campaign__title">{folder.label}</strong>
        <span className="brand-campaign__link">Open folder &rarr;</span>
      </span>
    </a>
  );
}

export default async function HomePage() {
  const brandFolders = await getProductsByBrand();
  const productCount = brandFolders.reduce((total, folder) => total + folder.products.length, 0);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <LandingVideo />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__tag">The Corner Store, Curated</div>
          <h1 className="hero__title">Bodega<br /><em>Apparel Essentials</em></h1>
          <p className="hero__sub">Tees, caps, hoodies, pants. Our own shelf, plus STUSH, PULSE, MYXX, MAGA and Kollective.</p>
          <div className="hero__actions">
            <a href="/shop" className="btn-primary">Shop Now</a>
            <a href={`${S}/collections/bodega`} className="btn-secondary">View All</a>
          </div>
        </div>
      </section>

      {/* MOVING BANNER */}
      <div className="announce">
        <div className="announce__track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="announce__item">STOCKED DAILY &bull; APPAREL &amp; ESSENTIALS &bull;</span>
          ))}
        </div>
      </div>

      {/* PRODUCTS BY BRAND */}
      <section className="shop" style={{ borderTop: '1px solid var(--tx03)' }}>
        <div className="shop__header">
          <h2 className="shop__title">Shop by Brand &mdash; {productCount}</h2>
          <a href="/shop" className="shop__link">Open all folders &rarr;</a>
        </div>
        {brandFolders.map(folder => (
          <section key={folder.handle} className="home-brand-folder">
            <BrandGraphic folder={folder} />
            <div className="shop__header">
              <h3 className="shop__title">{folder.label} &mdash; {folder.products.length}</h3>
              <a href={`/shop#brand-${folder.handle}`} className="shop__link">Open folder &rarr;</a>
            </div>
            <div className="dgrid">
              {folder.products.slice(0, 6).map(product => <ProductCard key={product.id} p={product} />)}
            </div>
          </section>
        ))}
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <p className="manifesto__text">
          Every brand on the shelf gets its own room. One checkout, one cart, one place that keeps it stocked.
          <strong> That is the whole idea.</strong>
        </p>
      </section>

      {/* MARQUEE */}
      <section className="marquee">
        <div className="marquee__track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="marquee__item">BODEGA &bull; APPAREL &amp; ESSENTIALS &bull; STOCKED DAILY &bull; THE KOLLECTIVE &bull;</span>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="movement" id="subscribe">
        <div className="movement__tag">Stay Ready</div>
        <h2 className="movement__title">Get the Drop First</h2>
        <p className="movement__desc">New arrivals, seasonal drops, and restocks before they hit the shelf.</p>
        <div className="movement__form">
          <input type="email" className="movement__input" placeholder="Enter your email" />
          <button className="movement__submit">Join</button>
        </div>
      </section>
    </>
  );
}
