import { getProductsByBrand, formatPrice } from '@/lib/shopify';
import { BRAND_GRAPHICS } from '@/lib/brandGraphics';
import LandingVideo from '@/components/LandingVideo';

export const dynamic = 'force-dynamic';

function imageScore(image,index,p,variant){const text=`${image?.alt||''} ${image?.src||''}`.toLowerCase();const title=`${p?.title||''} ${p?.product_type||''}`.toLowerCase();let score=120-index*4;if(/front|hero|model|lifestyle|look|main|campaign|on-body|on body/.test(text))score+=90;if(/back|rear|reverse|backside|blank|size chart|diagram|spec|packaging/.test(text))score-=180;if(variant?.image_id&&String(image?.id)===String(variant.image_id))score+=120;if(/shirt|tee|t-shirt|hoodie|sweatshirt|top|jacket/.test(title)&&index===0&&p?.images?.length>1&&!image?.alt)score-=18;return score}
function bestImage(p){const variant=p.variants?.find(item=>item.available!==false)||p.variants?.[0];return [...(p.images||[])].map((image,index)=>({image,score:imageScore(image,index,p,variant)})).sort((a,b)=>b.score-a.score)[0]?.image}
function curationScore(p){const variant=p.variants?.find(item=>item.available!==false)||p.variants?.[0];const quality=bestImage(p)?100:0;const depth=Math.min(4,p.images?.length||0)*16;const availability=variant?.available===false?0:35;const price=Math.min(80,Number(variant?.price||0)/4);return quality+depth+availability+price}

function ProductObject({ p, index }) {
  const variant = p.variants?.find(item => item.available !== false) || p.variants?.[0];
  const img = bestImage(p)?.src;
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

const FLOOR = [
  ['01','THE COOLER','Beverages + cold drops','/shop'],
  ['02','STREET RACK','STUSH, city uniforms + new apparel','/shop'],
  ['03','SPORT CAGE','PULSE, MYXX + performance','/shop'],
  ['04','DAILY SHELF','Essentials worth keeping stocked','/shop'],
  ['05','OBJECTS','Books, tech, culture + useful things','/shop'],
  ['06','BACK ROOM','Limited drops + things not for everybody','/shop'],
];

export default async function HomePage() {
  const brandFolders = await getProductsByBrand();
  const allProducts = brandFolders.flatMap(folder => folder.products);
  const featured = allProducts.filter(p => p.images?.length).sort((a,b)=>curationScore(b)-curationScore(a)).slice(0, 12);
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
          <div className="store-hero__bottom"><p>{productCount} pieces across independent rooms. Fashion, performance, city uniforms and the things worth finding.</p><div><a href="#floor" className="store-btn">ENTER THE STORE</a><a href="#rooms" className="store-link">BROWSE ROOMS ↗</a></div></div>
        </div>
      </section>
      <section className="store-departments"><header><span className="store-kicker">DIRECTORY / LEVEL 01</span><h2>SHOP BY<br/>DEPARTMENT.</h2></header><div className="store-departments__list">{[['NEW IN','The newest pieces across the store'],['STREET','STUSH, BODEGA and city uniforms'],['SPORT','PULSE, MYXX and performance'],['HEADWEAR','Caps, visors and daily rotation'],['ESSENTIALS','The pieces that stay stocked'],['BOOKS + OBJECTS','Culture beyond the closet']].map(([name,note],i)=><a href="/shop" key={name}><span>0{i+1}</span><strong>{name}</strong><em>{note}</em><i>↗</i></a>)}</div></section>
      <section className="store-floorplan" id="floor"><header className="store-floorplan__head"><span className="store-kicker">STORE MAP / WALK IT YOUR WAY</span><h2>THE DIGITAL<br/>CORNER STORE.</h2><p>Browse like a store, not a spreadsheet. Every zone has a different purpose, and the Back Room is where limited product gets weird.</p></header><div className="store-floorplan__map" aria-label="BODEGA digital store map">{FLOOR.map(([no,name,note,href],index)=><a className={`store-zone store-zone--${index+1}`} href={href} key={name}><small>{no} / AISLE</small><strong>{name}</strong><span>{note}</span><i>ENTER ↗</i></a>)}<div className="store-map-counter" aria-hidden="true"><b>BODEGA</b><span>CHECKOUT / ASK SOMEBODY</span></div></div></section>
      <section className="store-rooms" id="rooms"><div className="store-section-head"><div><span className="store-kicker">DIRECTORY / LEVEL 02</span><h2>BRAND<br/>ROOMS.</h2></div><p>Every brand keeps its own identity. BODEGA is the hallway connecting them—not the reason they look alike.</p></div><div className="store-rooms__grid">{brandFolders.slice(0,8).map((folder,i)=><BrandRoom key={folder.handle} folder={folder} index={i}/>)}</div><a href="/shop" className="store-all-link">OPEN THE FULL BRAND DIRECTORY <span>{brandFolders.length} ROOMS</span> ↗</a></section>
      <section className="store-drop"><span className="store-kicker">THE FRONT TABLE / CURRENT DROP</span><div className="store-drop__head"><h2>TWELVE THINGS<br/>WORTH STOPPING FOR.</h2><a href="/shop" className="store-link">SEE ALL {productCount} ↗</a></div><div className="store-object-grid">{featured.map((p,i)=><ProductObject key={p.id} p={p} index={i}/>)}</div></section>
      <section className="store-editorial"><div><span className="store-kicker">BODEGA PAPER / ISSUE 001</span><h2>THE STORE<br/>IS THE <em>STORY.</em></h2></div><p>New drops, people, places, collaborations, city uniforms and whatever is moving culture this week. Commerce should feel like discovery, not inventory management.</p><a href="/shop" className="store-link">ENTER THE CURRENT ISSUE ↗</a></section>
      <section className="store-signup" id="subscribe"><span className="store-kicker">THE RECEIPT LIST</span><h2>GET THE DROP<br/>BEFORE THE SHELF.</h2><div><input type="email" placeholder="EMAIL ADDRESS"/><button>JOIN ↗</button></div></section>
    </div>
  );
}
