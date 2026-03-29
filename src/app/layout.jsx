import './globals.css';
import MobileMenu from '@/components/MobileMenu';

export const metadata = {
  title: 'BODEGA — Costumes, Party Gear & Good Times',
  description: 'Your one-stop party shop. Costumes, accessories, and everything you need to pull up correct.',
  openGraph: {
    title: 'BODEGA',
    description: 'Costumes, party gear, and everything you need to pull up correct.',
    siteName: 'BODEGA',
    type: 'website',
  },
};

const SHOPIFY = 'https://bodegabodegbodega.myshopify.com';

const NAV = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Costumes', href: `${SHOPIFY}/collections/all` },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <a href="/" className="nav__logo">Bodega</a>
          <ul className="nav__links">
            {NAV.map(n => (
              <li key={n.label}><a href={n.href} className="nav__link">{n.label}</a></li>
            ))}
            <li><a href={`${SHOPIFY}/cart`} className="nav__link" style={{ color: '#FF6B35' }}>Cart</a></li>
          </ul>
          <MobileMenu />
        </nav>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer__grid">
            <div>
              <div className="footer__brand">Bodega</div>
              <p className="footer__desc">
                Your one-stop party shop. Costumes, accessories, and everything you need to show up and show out. Part of The Kollective Hospitality Group.
              </p>
            </div>
            <div>
              <div className="footer__heading">Shop</div>
              <a href={`${SHOPIFY}/collections/all`} className="footer__link">All Products</a>
              <a href="/shop" className="footer__link">Shop Page</a>
            </div>
            <div>
              <div className="footer__heading">Info</div>
              <a href={`${SHOPIFY}/policies/shipping-policy`} className="footer__link">Shipping</a>
              <a href={`${SHOPIFY}/policies/refund-policy`} className="footer__link">Returns</a>
            </div>
            <div>
              <div className="footer__heading">Connect</div>
              <a href="mailto:THEDOCTORDORSEY@gmail.com" className="footer__link">Email</a>
              <a href="tel:4048199609" className="footer__link">(404) 819-9609</a>
              <p className="footer__link" style={{ cursor: 'default' }}>Atlanta, Georgia</p>
            </div>
          </div>
          <div className="footer__bottom">
            <span>&copy; 2026 BODEGA &mdash; PULL UP CORRECT</span>
            <span>A Kollective Hospitality Group brand</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
