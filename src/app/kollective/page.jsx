import { getCollectionProducts, formatPrice } from '@/lib/shopify';
import styles from './kollective.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'KOLLECTIVE MERCH — Official Store',
  description: 'Official Kollective apparel and merchandise. Built for the people building the universe.',
};

const HERO = 'https://cdn.shopify.com/s/files/1/0759/7506/5791/files/bodega-kollective-card.webp?v=1790286532';

function ProductCard({ product }) {
  const image = product?.images?.[0]?.src;
  const variant = product?.variants?.find((item) => item.available !== false) || product?.variants?.[0];
  if (!image || !variant) return null;

  return (
    <a className={styles.product} href={'/products/' + product.handle}>
      <div className={styles.productMedia}>
        <img src={image} alt={product.title} loading="lazy" />
        <span>VIEW PIECE →</span>
      </div>
      <div className={styles.productMeta}>
        <strong>{product.title}</strong>
        <em>{formatPrice(variant.price)}</em>
      </div>
    </a>
  );
}

export default async function KollectiveMerchPage() {
  const products = (await getCollectionProducts('kollective-1', 100))
    .filter((product) => {
      const tags = Array.isArray(product?.tags) ? product.tags : String(product?.tags || '').split(',');
      const isKollective = tags.some((tag) => String(tag).trim().toLowerCase() === 'brand:kollective');
      const isDuplicateHat = product?.handle === 'unisex-trucker-hat-with-black-half-mesh';\n      return isKollective && !isDuplicateHat && product?.images?.[0]?.src && product?.variants?.[0]?.id;
    });

  return (
    <div className={styles.site}>
      <section className={styles.hero}>
        <img className={styles.heroImage} src={HERO} alt="" aria-hidden="true" />
        <span className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroTop}>
          <a href="/" className={styles.back}>← BODEGA</a>
          <span>KOLLECTIVE / OFFICIAL MERCH</span>
        </div>
        <div className={styles.heroCopy}>
          <span>FOR THE ONES BUILDING IT</span>
          <h1>KOLLECTIVE<br/>MERCH.</h1>
          <p>
            The uniform of the ecosystem — apparel, house pieces and limited drops from The
            Kollective.
          </p>
          <a href="#collection">SHOP THE COLLECTION ↓</a>
        </div>
      </section>

      <section className={styles.statement}>
        <span>KOLLECTIVE / ATLANTA</span>
        <h2>NOT ONE BRAND.<br/>THE UNIFORM BEHIND ALL OF THEM.</h2>
        <p>
          This storefront stays separate from STUSH, FENYX, PULSE and every other brand in the
          portfolio. KOLLECTIVE merch represents the house itself.
        </p>
      </section>

      <section className={styles.collection} id="collection">
        <header>
          <div>
            <span>OFFICIAL COLLECTION</span>
            <h2>THE CURRENT DROP.</h2>
          </div>
          <span className={styles.live}>LIVE SHOPIFY INVENTORY / KOLLECTIVE ONLY</span>
        </header>

        {products.length ? (
          <div className={styles.grid}>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>THE NEXT DROP IS LOADING.</h3>
            <p>Kollective merchandise will appear here directly from the live Shopify collection.</p>
          </div>
        )}
      </section>

      <section className={styles.footerCta}>
        <span>ONE HOUSE. MANY WORLDS.</span>
        <h2>SEE THE REST OF BODEGA.</h2>
        <a href="/#brands">BACK TO ALL BRANDS →</a>
      </section>
    </div>
  );
}
