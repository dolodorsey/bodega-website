const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'bodgeaworldwide.myshopify.com';
const ORIGIN = `https://${STORE.replace(/^https?:\/\//, '')}`;

async function shopifyFetch(path) {
  try {
    const res = await fetch(`${ORIGIN}${path}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BodegaWeb/1.0',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Shopify ${res.status}: ${path}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error(`Shopify fetch error (${path}): ${err.message}`);
    return null;
  }
}

export async function getProducts(limit = 250) {
  const handles = BRAND_COLLECTIONS.map(collection => collection.handle);
  const collections = await Promise.all(
    handles.map(handle => shopifyFetch(`/collections/${handle}/products.json?limit=${limit}`))
  );
  return collections.flatMap(data => data?.products || []);
}

export const BRAND_COLLECTIONS = [
  { handle: 'bodega', label: 'BODEGA' },
  { handle: 'myxx-1', label: 'MYXX' },
  { handle: 'pulse-usa', label: 'PULSE USA' },
  { handle: 'stush-usa', label: 'STUSH USA' },
  { handle: 'hakuna-matata', label: 'HAKUNA MATATA' },
  { handle: 'kollective-1', label: 'KOLLECTIVE' },
  { handle: 'make-atlanta-great-again', label: 'MAKE ATLANTA GREAT AGAIN' },
];

export async function getProductsByBrand(limit = 250) {
  const collections = await Promise.all(
    BRAND_COLLECTIONS.map(async collection => {
      const data = await shopifyFetch(`/collections/${collection.handle}/products.json?limit=${limit}`);
      return { ...collection, products: data?.products || [] };
    })
  );
  return collections.filter(collection => collection.products.length > 0);
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  const data = await shopifyFetch(`/products/${encodeURIComponent(handle)}.json`);
  return data?.product || null;
}

export function formatPrice(price) {
  const num = parseFloat(price);
  return Number.isNaN(num) ? '' : '$' + num.toFixed(2);
}

const HTML_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  mdash: '—', ndash: '–', hellip: '…',
};

// Flattens body_html to plain text. Used for <meta> descriptions only —
// the product page itself renders the full rich HTML.
export function plainDescription(html, limit = 160) {
  if (!html) return '';
  const text = String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => HTML_ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[\s.,;:—-]+$/, '')}…`;
}
