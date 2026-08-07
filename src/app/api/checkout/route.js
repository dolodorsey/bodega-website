import { NextResponse } from 'next/server';

const PAYMENT_RAIL = 'https://dzlmtvodpyhetvektfuo.supabase.co/functions/v1/khg-payment-checkout';
const STORE = 'https://bodgeaworldwide.myshopify.com';

function inferCollectionHandle(vendor, title = '') {
  const value = `${vendor || ''} ${title || ''}`.toLowerCase();
  if (value.includes('stush')) return 'stush-usa';
  if (value.includes('myxx')) return 'myxx-1';
  if (value.includes('pulse')) return 'pulse-usa';
  if (value.includes('hakuna')) return 'hakuna-matata';
  if (value.includes('kollective')) return 'kollective-1';
  if (value.includes('make atlanta') || value.includes('maga')) return 'make-atlanta-great-again';
  return 'bodega';
}

export async function POST(request) {
  try {
    const { productHandle, variantId, variantTitle, quantity = 1, collectionHandle } = await request.json();
    if (!productHandle || !variantId) {
      return NextResponse.json({ message: 'Choose an available product option.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    let resolvedCollection = collectionHandle || '';

    // Preserve the product brand even when the customer enters through the BODEGA storefront.
    // Stripe still re-verifies the product and price in the payment rail before checkout.
    if (!resolvedCollection) {
      try {
        const catalogResponse = await fetch(`${STORE}/products/${encodeURIComponent(productHandle)}.json`, {
          cache: 'no-store',
          headers: { Accept: 'application/json', 'User-Agent': 'BodegaWeb/1.0' },
        });
        if (catalogResponse.ok) {
          const catalogData = await catalogResponse.json();
          resolvedCollection = inferCollectionHandle(catalogData?.product?.vendor, catalogData?.product?.title);
        }
      } catch (catalogError) {
        console.warn('Could not infer BODEGA catalog brand', catalogError);
      }
    }

    const response = await fetch(PAYMENT_RAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      cache: 'no-store',
      body: JSON.stringify({
        action: 'bodega_product',
        source_app: 'bodega-website',
        product_handle: productHandle,
        variant_id: String(variantId).replace(/^gid:\/\/shopify\/ProductVariant\//, ''),
        variant_title: variantTitle || null,
        collection_handle: resolvedCollection || 'bodega',
        quantity: Math.max(1, Math.min(10, Number(quantity) || 1)),
        return_origin: origin,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.checkout_url) {
      return NextResponse.json(
        { message: data.error || 'Secure checkout is temporarily unavailable.' },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      checkoutSessionId: data.session_id,
      paymentId: data.payment_id,
      provider: 'stripe',
    });
  } catch (error) {
    console.error('BODEGA Stripe checkout error', error);
    return NextResponse.json(
      { message: 'Secure checkout is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
