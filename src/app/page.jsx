import { getProductsByBrand, formatPrice } from '@/lib/shopify';
import { BRAND_GRAPHICS } from '@/lib/brandGraphics';
import LandingVideo from '@/components/LandingVideo';

export const dynamic = 'force-dynamic';

function ProductObject({ p, index }) {
  const variant = p.variants?.find(item => item.available !== false) || p.variants?.[0];
  const img = p.images?.find(image => image.id === variant?.image_id)?.src || p.images?.[0]?.src;
  if (!img) return null;
  return (
    <a href={`/products/${p.handle}`} className="store-object" aria-label={`View ${p.title}`}>
      <span className="store-object__no">{String(index + 1).padStart(2,'0')}</span>
      <div className="store-object__media"><img src={img} alt={p.title} loading="lazy"/><i>VIEW ↗</i></div>
      <div className="store-object__meta"><span>{p.title}</span><strong>{formatPrice(variant?.price)}</strong></div>
    </a>
  );
}

function BrandRoom({ folder, index }) {
  const graphic = BRAND_GRAPHICS[folder.handle];
  return (
    <a href={`/shop#brand-${folder.handle}`} className={`store-room store-room--${(index % 4) + 1}`}>
      {graphic ? (graphic.type === 'video' ? <video src={graphic.src} autoPlay muted loop playsInline preload="metadata" aria-label={graphic.alt}/> : <img src={graphic.src} alt={graphic.alt} loading="lazy"/>) : null}
      <div className="store-room__veil" />
      <span className="store-room__index">{String(index + 1).padStart(2,'0')} / BRAND ROOM</span>
      <div className="store-room__copy"><strong>{folder.label}</strong><em>{folder.products.length} PIECES</em><i>ENTER ROOM ↗</i></div>
    </a>
  );
}

export default async function HomePage() {
  const brandFolders = await getProductsByBrand();
  const allProducts = brandFolders.flatMap(folder => folder.products);
  const featured = allProducts.filter(p => p.images?.length).slice(0, 12);
  const productCount = allProducts.length;

  return (
    <div className="storefront-flagship">
      <section className="store-hero">
        <LandingVideo />
        <div className="store-hero__veil" />
        <div className="store-hero__side" aria-hidden="true">ATLANTA / OPEN DAILY / CULTURE DEPARTMENT STORE</div>
        <div className="store-hero__content">
          <span className="store-kicker">BODEGA / THE CORNER STORE, REBUILT</span>
          <h1><span>EVERYTHING</span><span>GOOD IS</span><em>ON THE SHELF.</em></h1>
          <div className="store-hero__bottom"><p>{productCount} pieces across independent rooms. Fashion, performance, city uniforms and the things worth finding.</p><div><a href="/shop" className="store-btn">ENTER THE STORE</a><a href="#rooms" className="store-link">BROWSE ROOMS ↗</a></div></div>
        </div>
      </section>

      <section className="store-departments">
        <header><span className="store-kicker">DIRECTORY / LEVEL 01</span><h2>SHOP BY<br/>DEPARTMENT.</h2></header>
        <div className="store-departments__list">
          {[['NEW IN','The newest pieces across the store'],['STREET','STUSH, BODEGA and city uniforms'],['SPORT','PULSE, MYXX and performance'],['HEADWEAR','Caps, visors and daily rotation'],['ESSENTIALS','The pieces that stay stocked'],['BOOKS + OBJECTS','Culture beyond the closet']].map(([name,note],i)=><a href="/shop" key={name}><span>0{i+1}</span><strong>{name}</strong><em>{note}</em><i>↗</i></a>)}
        </div>
      </section>

      <section className="store-rooms" id="rooms">
        <div className="store-section-head"><div><span className="store-kicker">DIRECTORY / LEVEL 02</span><h2>BRAND<br/>ROOMS.</h2></div><p>Every brand keeps its own identity. BODEGA is the hallway connecting them—not the reason they look alike.</p></div>
        <div className="store-rooms__grid">{brandFolders.slice(0,8).map((folder,i)=><BrandRoom key={folder.handle} folder={folder} index={i}/>)}</div>
        <a href="/shop" className="store-all-link">OPEN THE FULL BRAND DIRECTORY <span>{brandFolders.length} ROOMS</span> ↗</a>
      </section>

      <section className="store-drop">
        <span className="store-kicker">THE FRONT TABLE / CURRENT DROP</span>
        <div className="store-drop__head"><h2>TWELVE THINGS<br/>WORTH STOPPING FOR.</h2><a href="/shop" className="store-link">SEE ALL {productCount} ↗</a></div>
        <div className="store-object-grid">{featured.map((p,i)=><ProductObject key={p.id} p={p} index={i}/>)}</div>
      </section>

      <section className="store-editorial">
        <div><span className="store-kicker">BODEGA PAPER / ISSUE 001</span><h2>THE STORE<br/>IS THE <em>STORY.</em></h2></div>
        <p>New drops, people, places, collaborations, city uniforms and whatever is moving culture this week. Commerce should feel like discovery, not inventory management.</p>
        <a href="/shop" className="store-link">ENTER THE CURRENT ISSUE ↗</a>
      </section>

      <section className="store-signup" id="subscribe"><span className="store-kicker">THE RECEIPT LIST</span><h2>GET THE DROP<br/>BEFORE THE SHELF.</h2><div><input type="email" placeholder="EMAIL ADDRESS"/><button>JOIN ↗</button></div></section>
    </div>
  );
}
