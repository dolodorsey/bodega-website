'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

const COLOR_MAP = {
  Charcoal: '#36454F',
  'Sport Grey': '#8B8B8B',
  Graphite: '#4A4A4A',
  Natural: '#E8DCC8',
  'Dark Heather': '#5C5C5C',
  Black: '#1A1A1A',
  Red: '#C41E3A',
  'Military Green': '#4B5320',
  Royal: '#2B4EA2',
  Maroon: '#6B1C2A',
  White: '#F0EDE6',
  'purple color': '#6A3D8E',
  Navy: '#1B2A4A',
  Forest: '#1E4D2B',
  Sand: '#C2B280',
  'Light pink': '#E8B4B4',
  'Irish Green': '#009A44',
  'Light  blue': '#7FB3D8',
  'Rose Pink Color': '#D4707A',
  'dark green': '#2D5A1E',
  'Dark Blue': '#1B2A4A',
  'Royal Blue': '#2B4EA2',
  'Charcoal Black Triblend': '#333333',
  'Athletic Grey Triblend': '#999999',
  'Vintage Smoke': '#6B6B6B',
  'Vintage Navy': '#2C3E5A',
};

function getSwatchColor(colorName) {
  return COLOR_MAP[colorName] || '#555';
}

// Product cards open the internal BODEGA detail page; attribution is applied
// on the cart deeplink from there.
function productUrl(handle) {
  return `/products/${handle}`;
}

export default function ColorCycleCard({ product }) {
  const { title, handle, variants = [], images = [], options = [] } = product;
  const availableVariants = variants.filter(variant => variant.available !== false);
  const firstVariant = availableVariants?.[0] || variants?.[0];
  const firstVariantImage = images.find(image => image.id === firstVariant?.image_id)?.src;
  const hasSupplierSpecCover =
    images.length > 1 &&
    /(cap|hat|visor)/i.test(`${product.product_type || ''} ${title || ''}`) &&
    (!firstVariantImage || firstVariantImage === images?.[0]?.src);
  const firstImage = hasSupplierSpecCover
    ? images[1]?.src
    : firstVariantImage || images?.[0]?.src;
  const firstVariantId = firstVariant?.id;
  const price = availableVariants?.[0]?.price || variants?.[0]?.price;
  if (!firstImage || !firstVariantId) return null;

  const colorOption = options.find(option => option.name.toLowerCase() === 'color');
  const colorPos = colorOption?.position || 0;
  const imageMap = {};
  images.forEach(image => { imageMap[image.id] = image.src; });

  const colorImages = [];
  const seenColors = new Set();
  availableVariants.forEach(variant => {
    const color = variant[`option${colorPos}`];
    if (color && !seenColors.has(color) && variant.image_id && imageMap[variant.image_id]) {
      seenColors.add(color);
      colorImages.push({ color, src: imageMap[variant.image_id], variantId: variant.id });
    }
  });

  const hasMultipleColors = colorImages.length > 1;
  const requiresSelection = availableVariants.length > 1;
  const cycleImages = hasMultipleColors
    ? colorImages.map(color => ({ src: color.src, label: color.color, variantId: color.variantId }))
    : images.length > 1
      ? (hasSupplierSpecCover ? [...images.slice(1), images[0]] : images)
          .slice(0, 6)
          .map(image => ({ src: image.src, label: '', variantId: firstVariantId }))
      : [{ src: firstImage, label: '', variantId: firstVariantId }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!hasMultipleColors) return undefined;
    if (isHovering && cycleImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(previous => (previous + 1) % cycleImages.length);
      }, 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovering, cycleImages.length, hasMultipleColors]);

  const handleDotClick = useCallback((event, index) => {
    event.stopPropagation();
    setActiveIndex(index);
    clearInterval(intervalRef.current);
  }, []);

  const destination = productUrl(handle);
  const ctaDestination = destination;
  const priceNumber = Number.parseFloat(price || 0);
  const priceString = `$${priceNumber.toFixed(2)}`;

  return (
    <article
      className={`dc${hasMultipleColors ? ' dc--multi' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        clearInterval(intervalRef.current);
      }}
    >
      <div className="dc__wrap">
        <a href={destination} className="dc__media-link" aria-label={`View ${title}`}>
          {cycleImages.map((image, index) => (
            <img
              key={`${image.src}-${index}`}
              src={image.src}
              alt={`${title}${image.label ? ` — ${image.label}` : ''}`}
              className={`dc__img dc__img--layer${index === activeIndex ? ' dc__img--active' : ''}`}
              loading="lazy"
            />
          ))}
        </a>

        {hasMultipleColors && (
          <div className="dc__dots">
            {cycleImages.slice(0, 8).map((image, index) => (
              <button
                key={`${image.label}-${index}`}
                type="button"
                className={`dc__dot${index === activeIndex ? ' dc__dot--active' : ''}`}
                style={{ background: getSwatchColor(image.label) }}
                onClick={event => handleDotClick(event, index)}
                aria-label={`Preview ${image.label}`}
                title={image.label}
              />
            ))}
            {cycleImages.length > 8 && (
              <span className="dc__dot-more">+{cycleImages.length - 8}</span>
            )}
          </div>
        )}

        <a href={ctaDestination} className="dc__cta">
          {requiresSelection ? 'Choose Options' : 'View Product'}
        </a>
      </div>

      <a href={destination} className="dc__info">
        <div className="dc__name">{title}</div>
        <div className="dc__meta">
          <div className="dc__price">{priceString}</div>
          {hasMultipleColors && (
            <div className="dc__color-count">{colorImages.length} colors</div>
          )}
        </div>
      </a>
    </article>
  );
}
