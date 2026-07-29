import './globals.css';
import { Bebas_Neue, Outfit } from 'next/font/google';
import MobileMenu from '@/components/MobileMenu';

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bodega-display',
  display: 'swap',
});
const body = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-bodega-body',
  display: 'swap',
});

const BRAND_DESCRIPTION =
  'The corner store, curated. BODEGA stocks its own apparel — tees, caps, hoodies, pants, shorts, socks — and carries STUSH, PULSE, MYXX, MAGA and Kollective on the same shelf. Staples built for rotation.';

export const metadata = {
  metadataBase: new URL('https://www.bodegabodegabodega.com'),
  title: 'BODEGA — Apparel Essentials, Curated',
  description: BRAND_DESCRIPTION,
  openGraph: {
    title: 'BODEGA — Apparel Essentials, Curated',
    description:
      'Apparel stocked for rotation. The house that carries STUSH, PULSE, MYXX, MAGA and Kollective.',
    siteName: 'BODEGA',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/campaigns/kollective-real-product.png',
        width: 1200,
        height: 630,
        alt: 'BODEGA apparel — curated essentials on the shelf',
      },
    ],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BODEGA',
  description: BRAND_DESCRIPTION,
  slogan: 'Curated essentials, corner store hours.',
  brand: ['BODEGA', 'STUSH', 'PULSE', 'MYXX', 'MAGA', 'Kollective'],
  parentOrganization: { '@type': 'Organization', name: 'The Kollective Hospitality Group' },
  address: { '@type': 'PostalAddress', addressLocality: 'Atlanta', addressRegion: 'GA', addressCountry: 'US' },
};

const SHOPIFY = 'https://bodgeaworldwide.myshopify.com';

const NAV = [
  { label: 'Shop All', href: '/shop' },
  { label: 'New Arrivals', href: '/shop' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <nav className="nav">
          <a href="/" className="nav__logo">Bodega</a>
          <ul className="nav__links">
            {NAV.map(n => (
              <li key={n.label}><a href={n.href} className="nav__link">{n.label}</a></li>
            ))}
            <li><a href={`${SHOPIFY}/cart`} className="nav__link nav__link--cart">Cart</a></li>
          </ul>
          <MobileMenu />
        </nav>

        <main>{children}</main>

        <footer className="footer">
          <div className="footer__grid">
            <div>
              <div className="footer__brand">Bodega</div>
              <p className="footer__desc">
                The corner store, curated. Our own apparel on the shelf next to STUSH, PULSE, MYXX, MAGA and Kollective. Part of The Kollective Hospitality Group.
              </p>
            </div>
            <div>
              <div className="footer__heading">Shop</div>
              <a href={`${SHOPIFY}/collections/bodega`} className="footer__link">All Products</a>
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
            <span>&copy; 2026 BODEGA &mdash; THE CORNER STORE, CURATED</span>
            <span>A Kollective Hospitality Group brand</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
