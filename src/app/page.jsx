import { BODEGA_BRANDS, BODEGA_LANDING_ANIMATION } from '@/lib/bodegaBrands';

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
        <img
          className="hub-hero__image"
          src={BODEGA_LANDING_ANIMATION}
          alt="BODEGA storefront animation"
          fetchPriority="high"
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
          <span>+ MORE</span>
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
            entity's complete website.
          </p>
        </div>

        <div className="hub-grid">
          {BODEGA_BRANDS.map((brand) => (
            <BrandCard key={brand.key} brand={brand} />
          ))}
        </div>
      </section>

      <section className="hub-coming">
        <div>
          <span className="hub-eyebrow">MORE SHELVES ARE COMING.</span>
          <h2>BevCo + the next merch worlds are already accounted for.</h2>
        </div>
        <p>
          New entities can be added as another card and routed to their own custom domain, Vercel
          site or dedicated BODEGA URL without mixing the brands together.
        </p>
        <a href="#brands">ALL BRANDS <span>→</span></a>
      </section>
    </div>
  );
}
