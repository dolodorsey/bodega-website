import { getProductsByBrand } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

const ANIMATED_COVERS = {
  stush: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-stush-card.webp?v=1790286478',
  fenyx: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-fenyx-card.webp?v=1790286517',
  pulse: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-pulse-card.webp?v=1790286522',
  maga: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-maga-card.webp?v=1790286526',
  kollective: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-kollective-card.webp?v=1790286532',
};

function collectionImage(folders, handle) {
  const folder = folders.find((item) => item.handle === handle);
  const product = folder?.products?.find((item) => item?.images?.[0]?.src);
  return product?.images?.[0]?.src || null;
}

function BrandCard({ brand }) {
  const external = /^https?:\/\//.test(brand.href);

  return (
    <a
      className={'hub-card hub-card--' + brand.key}
      href={brand.href}
      aria-label={'Visit ' + brand.name}
      {...(external ? { rel: 'noopener' } : {})}
    >
      <img src={brand.cover} alt="" aria-hidden="true" loading={brand.priority ? 'eager' : 'lazy'} />
      <span className="hub-card__veil" aria-hidden="true" />
      <span className="hub-card__number">{brand.number}</span>
      <div className="hub-card__copy">
        <strong>{brand.name}</strong>
        <em>{brand.tagline}</em>
        <span>{brand.cta} <b>→</b></span>
      </div>
    </a>
  );
}

export default async function HomePage() {
  const folders = await getProductsByBrand();

  const halloweenCover =
    collectionImage(folders, 'nightmare-on-channelside') ||
    collectionImage(folders, 'kollective-1') ||
    '/campaigns/kollective-real-product.png';

  const pulseUrl = process.env.NEXT_PUBLIC_PULSE_SITE_URL || 'https://yourpulsehq.com';
  const stushUrl = process.env.NEXT_PUBLIC_STUSH_SITE_URL || 'https://stushusa.com';

  const brands = [
    {
      key: 'stush',
      number: '01',
      name: 'STUSH',
      tagline: 'Everyday essentials. A higher standard.',
      cta: 'VISIT STUSH SITE',
      href: stushUrl,
      cover: ANIMATED_COVERS.stush,
      priority: true,
    },
    {
      key: 'fenyx',
      number: '02',
      name: 'FENYX',
      tagline: 'Built different. Always rising.',
      cta: 'BODEGABODEGABODEGA.COM/FENYX',
      href: '/fenyx',
      cover: ANIMATED_COVERS.fenyx,
      priority: true,
    },
    {
      key: 'pulse',
      number: '03',
      name: 'PULSE',
      tagline: 'Performance. Clubhouse. Culture.',
      cta: 'VISIT PULSE SITE',
      href: pulseUrl,
      cover: ANIMATED_COVERS.pulse,
      priority: true,
    },
    {
      key: 'maga',
      number: '04',
      name: 'MAKE ATL GREAT AGAIN',
      tagline: 'People. Culture. Progress.',
      cta: 'BODEGABODEGABODEGA.COM/MAKE-ATL-GREAT-AGAIN',
      href: '/make-atl-great-again',
      cover: ANIMATED_COVERS.maga,
    },
    {
      key: 'halloween',
      number: '05',
      name: 'HALLOWEEN MERCH',
      tagline: 'Limited event merch. Built for October.',
      cta: 'BODEGABODEGABODEGA.COM/HALLOWEEN',
      href: '/halloween',
      cover: halloweenCover,
    },
    {
      key: 'kollective',
      number: '06',
      name: 'KOLLECTIVE MERCH',
      tagline: 'The uniform for the people building it.',
      cta: 'BODEGABODEGABODEGA.COM/KOLLECTIVE',
      href: '/kollective',
      cover: ANIMATED_COVERS.kollective,
    },
  ];

  return (
    <div className="brand-hub">
      <section className="hub-hero" id="about">
        <img
          className="hub-hero__image"
          src="/campaigns/kollective-real-product.png"
          alt=""
          aria-hidden="true"
        />
        <div className="hub-hero__shade" aria-hidden="true" />

        <div className="hub-hero__copy">
          <span className="hub-eyebrow">ONE HUB. MANY WORLDS.</span>
          <h1>BODEGA</h1>
          <h2>THE HOME FOR ALL OF OUR CLOTHING AND MERCH BRANDS.</h2>
          <p>
            Different styles. A shared vision. BODEGA is the front door to the full wardrobe—
            every brand keeps its own identity, store and world.
          </p>
          <a href="#brands" className="hub-hero__cta">
            EXPLORE THE BRANDS <span>→</span>
          </a>
        </div>

        <div className="hub-hero__rail" aria-hidden="true">
          <span>FASHION</span>
          <span>SPORT</span>
          <span>CULTURE</span>
          <span>COMMUNITY</span>
          <span>+ MORE</span>
        </div>
      </section>

      <section className="hub-brands" id="brands" aria-labelledby="brands-title">
        <div className="hub-section-head">
          <div>
            <span className="hub-eyebrow">SHOP THE UNIVERSE OF BRANDS</span>
            <h2 id="brands-title">CHOOSE YOUR WORLD.</h2>
          </div>
          <p>
            One destination when you want to see everything. One click when you already know where
            you belong.
          </p>
        </div>

        <div className="hub-grid">
          {brands.map((brand) => (
            <BrandCard key={brand.key} brand={brand} />
          ))}
        </div>
      </section>

      <section className="hub-coming">
        <div>
          <span className="hub-eyebrow">THE NEXT CHAPTER IS BIGGER.</span>
          <h2>More brands coming soon: BevCo + more merch.</h2>
        </div>
        <p>
          BODEGA will keep expanding as new apparel, event merchandise, beverage merchandise and
          future Kollective brands become ready for the shelf.
        </p>
        <a href="#brands">ALL BRANDS <span>→</span></a>
      </section>
    </div>
  );
}
