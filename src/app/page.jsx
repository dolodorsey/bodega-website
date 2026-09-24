const LANDING_ANIMATION = 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-landing-animation.webp?v=1790288617';

const ANIMATED_COVERS = {
  stush: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-stush-card.webp?v=1790286478',
  fenyx: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-fenyx-card.webp?v=1790286517',
  pulse: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-pulse-card.webp?v=1790286522',
  maga: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-maga-card.webp?v=1790286526',
  halloween: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-halloween-concert-card.webp?v=1790288611',
  kollective: 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-kollective-card.webp?v=1790286532',
};

function BrandCard({ brand }) {
  const external = /^https?:\/\//.test(brand.href);

  return (
    <a
      className={'hub-card hub-card--' + brand.key}
      href={brand.href}
      aria-label={'Visit ' + brand.name + ' full website'}
      {...(external ? { rel: 'noopener' } : {})}
    >
      <img
        src={brand.cover}
        alt=""
        aria-hidden="true"
        loading={brand.priority ? 'eager' : 'lazy'}
      />
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

export default function HomePage() {
  const brands = [
    {
      key: 'stush',
      number: '01',
      name: 'STUSH',
      tagline: 'Everyday essentials. A higher standard.',
      cta: 'STUSHUSA.COM',
      href: 'https://stushusa.com',
      cover: ANIMATED_COVERS.stush,
      priority: true,
    },
    {
      key: 'fenyx',
      number: '02',
      name: 'FENYX',
      tagline: 'Built different. Always rising.',
      cta: 'VISIT FENYX SITE',
      href: '/fenyx',
      cover: ANIMATED_COVERS.fenyx,
      priority: true,
    },
    {
      key: 'pulse',
      number: '03',
      name: 'PULSE',
      tagline: 'Performance. Clubhouse. Culture.',
      cta: 'YOURPULSEHQ.COM',
      href: 'https://yourpulsehq.com',
      cover: ANIMATED_COVERS.pulse,
      priority: true,
    },
    {
      key: 'maga',
      number: '04',
      name: 'MAKE ATL GREAT AGAIN',
      tagline: 'People. Culture. Progress.',
      cta: 'THAOLDATLANTA.COM',
      href: '/make-atl-great-again',
      cover: ANIMATED_COVERS.maga,
    },
    {
      key: 'halloween',
      number: '05',
      name: 'HALLOWEEN CONCERT MERCH',
      tagline: 'Nightmare on Channelside. Tampa.',
      cta: 'SHOP THE FULL MERCH SITE',
      href: '/halloween',
      cover: ANIMATED_COVERS.halloween,
    },
    {
      key: 'kollective',
      number: '06',
      name: 'KOLLECTIVE MERCH',
      tagline: 'The uniform for the people building it.',
      cta: 'ENTER KOLLECTIVE',
      href: '/kollective',
      cover: ANIMATED_COVERS.kollective,
    },
  ];

  return (
    <div className="brand-hub">
      <section className="hub-hero" id="about">
        <img
          className="hub-hero__image"
          src={LANDING_ANIMATION}
          alt="BODEGA storefront animation"
          fetchPriority="high"
        />
        <div className="hub-hero__shade" aria-hidden="true" />

        <div className="hub-hero__copy">
          <span className="hub-eyebrow">BODEGA / ONE HUB. MANY WORLDS.</span>
          <h1>ALL OUR BRANDS.<br/>ONE FRONT DOOR.</h1>
          <p>
            BODEGA is the face of the clothing and merch universe. Every card opens the brand's
            full website — its own identity, products and world.
          </p>
          <a href="#brands" className="hub-hero__cta">
            ENTER THE BRAND UNIVERSE <span>↓</span>
          </a>
        </div>

        <div className="hub-hero__rail" aria-hidden="true">
          <span>FASHION</span>
          <span>SPORT</span>
          <span>CULTURE</span>
          <span>MERCH</span>
          <span>+ MORE</span>
        </div>
      </section>

      <section className="hub-brands" id="brands" aria-labelledby="brands-title">
        <div className="hub-section-head">
          <div>
            <span className="hub-eyebrow">THE BODEGA DIRECTORY</span>
            <h2 id="brands-title">CHOOSE YOUR WORLD.</h2>
          </div>
          <p>
            This page is the directory. The brands stay separate. Choose one and enter its complete
            site.
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
          <h2>BevCo + more merch worlds are next.</h2>
        </div>
        <p>
          New brands can be added as cards without turning BODEGA into one combined store. Each new
          card will route to that entity's own website or dedicated BODEGA-hosted site.
        </p>
        <a href="#brands">ALL BRANDS <span>→</span></a>
      </section>
    </div>
  );
}
