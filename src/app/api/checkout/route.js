import { NextResponse } from 'next/server';

const PAYMENT_RAIL = 'https://dzlmtvodpyhetvektfuo.supabase.co/functions/v1/khg-payment-checkout';

export async function POST(request) {
  try {
    const { productHandle, variantId, variantTitle, quantity = 1, collectionHandle } = await request.json();
    if (!productHandle || !variantId) {
      return NextResponse.json({ message: 'Choose an available product option.' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
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
        collection_handle: collectionHandle || 'bodega',
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
