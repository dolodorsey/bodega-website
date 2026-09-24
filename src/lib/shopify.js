const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'bodgeaworldwide.myshopify.com';
const ORIGIN = 'https://' + STORE.replace(/^https?:\/\//, '');

async function shopifyFetch(path, revalidate = 120) {
  try {
    const res = await fetch(ORIGIN + path, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BodegaWeb/1.1',
      },
      next: { revalidate },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      if (res.status === 429) {
        console.warn('Shopify rate limited: ' + path);
        return null;
      }
      console.error('Shopify ' + res.status + ': ' + path);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error('Shopify fetch error (' + path + '): ' + err.message);
    return null;
  }
}

export async function getProducts(limit = 250) {
  const products = [];
  for (const collection of BRAND_COLLECTIONS) {
    const data = await shopifyFetch(
      '/collections/' + collection.handle + '/products.json?limit=' + limit,
      120
    );
    products.push(...(data?.products || []));
  }
  return products;
}

export const BRAND_COLLECTIONS = [
  { handle: 'bodega', label: 'BODEGA' },
  { handle: 'fenyx', label: 'FENYX' },
  { handle: 'pulse-usa', label: 'PULSE USA' },
  { handle: 'stush-usa', label: 'STUSH USA' },
  { handle: 'make-atlanta-great-again', label: 'MAKE ATLANTA GREAT AGAIN' },
  { handle: 'nightmare-on-channelside', label: 'HALLOWEEN MERCH' },
  { handle: 'kollective-1', label: 'KOLLECTIVE' },
  { handle: 'dr-dorsey', label: 'DR. DORSEY' },
  { handle: 'the-fraternity', label: 'THE FRATERNITY' },
  { handle: 'myxx-1', label: 'MYXX' },
  { handle: 'hakuna-matata', label: 'HAKUNA MATATA' },
];

export async function getProductsByBrand(limit = 250) {
  const collections = [];
  for (const collection of BRAND_COLLECTIONS) {
    const data = await shopifyFetch(
      '/collections/' + collection.handle + '/products.json?limit=' + limit,
      120
    );
    collections.push({ ...collection, products: data?.products || [] });
  }
  return collections.filter((collection) => collection.products.length > 0);
}

export async function getProductByHandle(handle) {
  if (!handle) return null;
  const data = await shopifyFetch('/products/' + encodeURIComponent(handle) + '.json', 60);
  return data?.product || null;
}

export function formatPrice(price) {
  const num = parseFloat(price);
  return Number.isNaN(num) ? '' : '$' + num.toFixed(2);
}

const HTML_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  mdash: '—',
  ndash: '–',
  hellip: '…',
};

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
  const base = lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped;
  return base.replace(/[\s.,;:—-]+$/, '') + '…';
}