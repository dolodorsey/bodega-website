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
  const handles = [
    'myxx-1',
    'pulse-usa',
    'stush-usa',
    'hakuna-matata',
    'kollective-1',
    'make-atlanta-great-again',
  ];
  const collections = await Promise.all(
    handles.map(handle => shopifyFetch(`/collections/${handle}/products.json?limit=${limit}`))
  );
  return collections.flatMap(data => data?.products || []);
}

export function formatPrice(price) {
  const num = parseFloat(price);
  return Number.isNaN(num) ? '' : '$' + num.toFixed(2);
}
