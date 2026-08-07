export const metadata = { title: 'Order confirmed | BODEGA' };

export default async function PaymentSuccessPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = typeof params?.session_id === 'string' ? params.session_id : '';

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '48px 20px' }}>
      <section style={{ maxWidth: 680, textAlign: 'center' }}>
        <p style={{ letterSpacing: '.18em', textTransform: 'uppercase', opacity: .65 }}>Payment confirmed</p>
        <h1 style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', lineHeight: 1, margin: '16px 0' }}>You’re checked out.</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, opacity: .78 }}>
          Stripe accepted the payment. Your BODEGA order is being reconciled into the Kollective order system now.
        </p>
        {sessionId && <p style={{ fontSize: 12, opacity: .45, wordBreak: 'break-all' }}>Checkout: {sessionId}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <a className="btn-primary" href="/shop">Keep Shopping</a>
          <a className="btn-secondary" href="/">Back to BODEGA</a>
        </div>
      </section>
    </main>
  );
}
