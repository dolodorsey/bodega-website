import './globals.css';
import './extreme-store.css';
import './spatial-store.css';
import './brand-hub.css';
import { Barlow_Condensed, Manrope } from 'next/font/google';
import MobileMenu from '@/components/MobileMenu';
import PWARegister from '@/components/PWARegister';

const display = Barlow_Condensed({
  subsets:['latin'],
  weight:['500','600','700'],
  variable:'--font-bodega-display',
  display:'swap'
});
const body = Manrope({
  subsets:['latin'],
  weight:['400','500','600','700'],
  variable:'--font-bodega-body',
  display:'swap'
});

const BRAND_DESCRIPTION =
  'BODEGA is the front door to independent clothing, merchandise, event and culture brands — each with its own world.';

export const metadata = {
  metadataBase: new URL('https://www.bodegabodegabodega.com'),
  title: 'BODEGA — The Home of Our Brands',
  description: BRAND_DESCRIPTION,
  applicationName:'BODEGA',
  manifest:'/manifest.webmanifest',
  appleWebApp:{capable:true,title:'BODEGA',statusBarStyle:'black-translucent'},
  icons:{
    icon:[
      {url:'/api/pwa-icon?size=192',sizes:'192x192',type:'image/png'},
      {url:'/api/pwa-icon?size=512',sizes:'512x512',type:'image/png'}
    ],
    apple:[{url:'/api/pwa-icon?size=180',sizes:'180x180',type:'image/png'}]
  },
  openGraph:{
    title:'BODEGA — The Home of Our Brands',
    description:BRAND_DESCRIPTION,
    siteName:'BODEGA',
    type:'website',
    locale:'en_US',
    images:[
      {
        url:'/campaigns/kollective-real-product.png',
        width:1200,
        height:630,
        alt:'BODEGA — the home of our brands'
      }
    ]
  },
};

export const viewport = {
  themeColor:'#080909',
  colorScheme:'dark',
  width:'device-width',
  initialScale:1,
  viewportFit:'cover'
};

const JSON_LD = {
  '@context':'https://schema.org',
  '@type':'Organization',
  name:'BODEGA',
  url:'https://www.bodegabodegabodega.com',
  description:BRAND_DESCRIPTION,
  slogan:'One hub. Many worlds.',
  parentOrganization:{'@type':'Organization',name:'The Kollective Hospitality Group'},
  address:{
    '@type':'PostalAddress',
    addressLocality:'Atlanta',
    addressRegion:'GA',
    addressCountry:'US'
  }
};

const NAV = [
  { label:'Brands', href:'/#brands' },
  { label:'About', href:'/#about' },
  { label:'Contact', href:'/forms/inquiry' },
];

export default function RootLayout({children}){
  return (
    <html lang="en" className={display.variable + ' ' + body.variable}>
      <body>
        <PWARegister/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html:JSON.stringify(JSON_LD)}}
        />
        <nav className="nav" aria-label="Primary">
          <a href="/" className="nav__logo">Bodega</a>
          <ul className="nav__links">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="nav__link">{item.label}</a>
              </li>
            ))}
            <li>
              <a href="/#brands" className="nav__link nav__link--button">All Brands →</a>
            </li>
          </ul>
          <MobileMenu/>
        </nav>
        <main>{children}</main>
        <footer className="footer">
          <div className="footer__grid">
            <div className="footer__identity">
              <a href="/" className="footer__wordmark">BODEGA</a>
              <p className="footer__desc">
                One front door. Independent brand worlds. Enter the directory, shop BODEGA, or go
                straight into the brand you came for.
              </p>
            </div>
            <div className="footer__column">
              <span className="footer__heading">Explore</span>
              <a href="/#brands" className="footer__link">Brand Directory</a>
              <a href="/shop" className="footer__link">Shop BODEGA</a>
              <a href="/forms/inquiry" className="footer__link">Contact</a>
            </div>
            <div className="footer__column">
              <span className="footer__heading">BODEGA</span>
              <span className="footer__meta">Atlanta, Georgia</span>
              <span className="footer__meta">Fashion · Sport · Culture · Merch</span>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} BODEGA</span>
            <span>ALL BRANDS REMAIN INDEPENDENT.</span>
            <span>A KOLLECTIVE COMPANY.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
