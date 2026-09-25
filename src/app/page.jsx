import {
  BODEGA_BRANDS,
  BODEGA_LANDING_VIDEO,
  BODEGA_LANDING_POSTER,
} from '@/lib/bodegaBrands';

function BrandCard({ brand }) {
  const external = /^https?:\/\//.test(brand.href);

  return (
    <a
      className={'hub-card hub-card--' + brand.key}
      href={brand.href}
      aria-label={'Visit ' + brand.name + ' full website'}
      data-site-type={brand.siteType}
      {...(external ? { rel: 'noopener' } : {})}
    >
      <img
        src={brand.cover}
        alt=""
        aria-hidden="true"
        loading={brand.priority ? 'eager' : 'lazy'}
        decoding="async"
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
  return (
    <div className="brand-hub">
      <section className="hub-hero" id="about">
        <video
          className="hub-hero__video"
          src={BODEGA_LANDING_VIDEO}
          poster={BODEGA_LANDING_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <img
          className="hub-hero__poster"
          src={BODEGA_LANDING_POSTER}
          alt="BODEGA storefront"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hub-hero__shade" aria-hidden="true" />

        <div className="hub-hero__minimal">
          <span className="hub-eyebrow">BODEGA / ONE HUB. MANY WORLDS.</span>
          <a href="#brands" className="hub-hero__cta">
            ENTER THE BRAND DIRECTORY <span>↓</span>
          </a>
        </div>

        <div className="hub-hero__rail" aria-hidden="true">
          <span>FASHION</span>
          <span>SPORT</span>
          <span>CULTURE</span>
          <span>MERCH</span>
          <span>DROPS</span>
        </div>
      </section>

      <section className="hub-brands" id="brands" aria-labelledby="brands-title">
        <div className="hub-section-head">
          <div>
            <span className="hub-eyebrow">THE BODEGA DIRECTORY</span>
            <h1 id="brands-title">CHOOSE YOUR WORLD.</h1>
          </div>
          <p>
            BODEGA is the front door. Every brand stays independent. Choose a card and enter that
            entity&apos;s complete website.
          </p>
        </div>

        <div className="hub-grid">
          {BODEGA_BRANDS.map((brand) => (
            <BrandCard key={brand.key} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
}
