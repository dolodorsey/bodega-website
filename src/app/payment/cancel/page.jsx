export const metadata = { title: 'Checkout paused | BODEGA' };

export default function PaymentCancelPage() {
  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '48px 20px' }}>
      <section style={{ maxWidth: 640, textAlign: 'center' }}>
        <p style={{ letterSpacing: '.18em', textTransform: 'uppercase', opacity: .65 }}>Checkout paused</p>
        <h1 style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', lineHeight: 1, margin: '16px 0' }}>Nothing was charged.</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, opacity: .78 }}>
          Your selection is still available to revisit. Return to the shop whenever you’re ready.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <a className="btn-primary" href="/shop">Return to Shop</a>
          <a className="btn-secondary" href="/">Back to BODEGA</a>
        </div>
      </section>
    </main>
  );
}
