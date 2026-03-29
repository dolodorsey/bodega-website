import { getProducts, formatPrice } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
const S = 'https://bodegabodegbodega.myshopify.com';

function ProductCard({ p }) {
  const img = p.images?.[0]?.src;
  const pr = p.variants?.[0]?.price;
  const vid = p.variants?.[0]?.id;
  if (!img) return null;
  return (
    <a href={`${S}/products/${p.handle}`} className="dc">
      <div className="dc__wrap">
        <img src={img} alt={p.title} className="dc__img" loading="lazy" />
        <a href={`${S}/cart/${vid}:1`} className="dc__cta">Add to Cart</a>
      </div>
      <div className="dc__info">
        <div className="dc__name">{p.title}</div>
        <div className="dc__price">{formatPrice(pr)}</div>
      </div>
    </a>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <video
          className="hero__bg"
          src="https://dzlmtvodpyhetvektfuo.supabase.co/storage/v1/object/public/brand-graphics/bodega/BODEGA_VID.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__tag">The Party Starts Here</div>
          <h1 className="hero__title">Bodega<br /><em>Party Shop</em></h1>
          <p className="hero__sub">Costumes, accessories, and everything you need to pull up correct. Don&rsquo;t show up basic.</p>
          <div className="hero__actions">
            <a href="/shop" className="btn-primary">Shop Now</a>
            <a href={`${S}/collections/all`} className="btn-secondary">View All</a>
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section className="shop" style={{ borderTop: '1px solid var(--tx03)' }}>
        <div className="shop__header">
          <h2 className="shop__title">All Products &mdash; {products.length}</h2>
          <a href={`${S}/collections/all`} className="shop__link">View on Shopify &rarr;</a>
        </div>
        <div className="dgrid">
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <p className="manifesto__text">
          Don&rsquo;t be the one who showed up in a basic costume from the gas station.
          <strong> Pull up correct. Stand out. Be the moment.</strong>
        </p>
      </section>

      {/* MARQUEE */}
      <section className="marquee">
        <div className="marquee__track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="marquee__item">BODEGA &bull; PULL UP CORRECT &bull; COSTUMES &amp; PARTY GEAR &bull; THE KOLLECTIVE &bull;</span>
          ))}
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="movement" id="subscribe">
        <div className="movement__tag">Stay Ready</div>
        <h2 className="movement__title">Get the Drop First</h2>
        <p className="movement__desc">New costumes, seasonal drops, and party gear alerts before anybody else.</p>
        <div className="movement__form">
          <input type="email" className="movement__input" placeholder="Enter your email" />
          <button className="movement__submit">Join</button>
        </div>
      </section>
    </>
  );
}
