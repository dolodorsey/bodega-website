'use client';

import { useMemo, useState } from 'react';

// Client-side product detail: variant selection across every option name,
// image gallery with thumbnails, and an attributed cart deeplink.
// Props:
//   product — Shopify product JSON from /products/{handle}.json
//   store   — 'https://bodgeaworldwide.myshopify.com' (includes protocol)

// Same attribution the storefront cards already carry, so BODEGA keeps
// credit for the sale through checkout.
function trackedCartUrl(storeUrl, variantId) {
  const params = new URLSearchParams({
    utm_source: 'bodega',
    utm_medium: 'storefront',
    utm_campaign: 'brand_store',
    brand_source: 'bodega',
    landing_brand: 'bodega',
    'attributes[brand_source]': 'bodega',
    'attributes[landing_brand]': 'bodega',
  });
  if (!variantId) return `${storeUrl}/cart?${params.toString()}`;
  return `${storeUrl}/cart/${variantId}:1?${params.toString()}`;
}

function money(value) {
  const num = Number.parseFloat(value);
  return Number.isNaN(num) ? '' : `$${num.toFixed(2)}`;
}

export default function ProductInteractive({ product, store }) {
  const images = product.images || [];
  const variants = product.variants || [];
  const options = (product.options || []).filter(
    option => option.name && option.name !== 'Title'
  );

  const [selected, setSelected] = useState(() => {
    const initial = {};
    const first = variants.find(variant => variant.available !== false) || variants[0];
    options.forEach((option, index) => {
      initial[option.name] = first?.[`option${index + 1}`] || option.values?.[0];
    });
    return initial;
  });

  const [activeImage, setActiveImage] = useState(0);

  const variant = useMemo(() => {
    if (variants.length === 0) return null;
    if (options.length === 0) return variants[0];
    return (
      variants.find(candidate =>
        options.every((option, index) => candidate[`option${index + 1}`] === selected[option.name])
      ) || null
    );
  }, [selected, variants, options]);

  const soldOut = !variant || variant.available === false;
  const price = money(variant?.price ?? variants[0]?.price);
  const comparePrice = money(variant?.compare_at_price);
  const cartUrl = trackedCartUrl(store, variant?.id);

  function chooseOption(name, value) {
    setSelected(previous => {
      const next = { ...previous, [name]: value };
      const match = variants.find(candidate =>
        options.every((option, index) => candidate[`option${index + 1}`] === next[option.name])
      );
      const imageIndex = match?.image_id
        ? images.findIndex(image => image.id === match.image_id)
        : -1;
      if (imageIndex > -1) setActiveImage(imageIndex);
      return next;
    });
  }

  const mainImage = images[activeImage] || images[0];

  return (
    <article className="pdp">
      <nav className="pdp__crumbs" aria-label="Breadcrumb">
        <a href="/shop">Shop</a>
        <span aria-hidden="true">/</span>
        <span>{product.product_type || 'Apparel'}</span>
      </nav>

      <div className="pdp__layout">
        <div className="pdp__gallery">
          {mainImage ? (
            <img
              className="pdp__image"
              src={mainImage.src}
              alt={mainImage.alt || product.title}
              width={mainImage.width || undefined}
              height={mainImage.height || undefined}
            />
          ) : (
            <div className="pdp__image pdp__image--empty" aria-hidden="true" />
          )}

          {images.length > 1 && (
            <div className="pdp__thumbs">
              {images.map((image, index) => (
                <button
                  key={image.id || index}
                  type="button"
                  className={`pdp__thumb${index === activeImage ? ' pdp__thumb--active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-pressed={index === activeImage}
                >
                  <img src={image.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          <span className="pdp__eyebrow">
            {product.vendor || 'BODEGA'}
            {product.product_type ? ` — ${product.product_type}` : ''}
          </span>
          <h1 className="pdp__title">{product.title}</h1>

          <div className="pdp__pricing">
            <span className="pdp__price">{price}</span>
            {comparePrice && comparePrice !== price && (
              <span className="pdp__compare">{comparePrice}</span>
            )}
          </div>

          {options.map((option, index) => (
            <div className="pdp__option" key={option.name}>
              <span className="pdp__option-label">
                {option.name}
                <em>{selected[option.name] || 'Select'}</em>
              </span>
              <div className="pdp__option-values">
                {(option.values || []).map(value => {
                  const isActive = selected[option.name] === value;
                  const unavailable = !variants.some(
                    candidate =>
                      candidate[`option${index + 1}`] === value && candidate.available !== false
                  );
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`pdp__value${isActive ? ' pdp__value--active' : ''}${unavailable ? ' pdp__value--out' : ''}`}
                      onClick={() => chooseOption(option.name, value)}
                      aria-pressed={isActive}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pdp__cta">
            {soldOut ? (
              <span className="btn-primary pdp__soldout" aria-disabled="true">
                Sold Out
              </span>
            ) : (
              <a href={cartUrl} className="btn-primary">
                Add to Cart
              </a>
            )}
            <a href="/shop" className="btn-secondary">
              Keep Browsing
            </a>
          </div>

          {product.body_html && (
            <div
              className="pdp__description"
              dangerouslySetInnerHTML={{ __html: product.body_html }}
            />
          )}

          <dl className="pdp__specs">
            {variant?.sku && (
              <div>
                <dt>SKU</dt>
                <dd>{variant.sku}</dd>
              </div>
            )}
            {product.product_type && (
              <div>
                <dt>Type</dt>
                <dd>{product.product_type}</dd>
              </div>
            )}
            <div>
              <dt>On the shelf</dt>
              <dd>
                {variants.length} variant{variants.length === 1 ? '' : 's'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
