import './globals.css';
import './extreme-store.css';
import './spatial-store.css';
import './experience.css';
import { Barlow_Condensed, Manrope } from 'next/font/google';
import MobileMenu from '@/components/MobileMenu';
import ExperienceLayer from '@/components/ExperienceLayer';

const display = Barlow_Condensed({ subsets:['latin'], weight:['500','600','700'], variable:'--font-bodega-display', display:'swap' });
const body = Manrope({ subsets:['latin'], weight:['400','500','600','700'], variable:'--font-bodega-body', display:'swap' });

const BRAND_DESCRIPTION = 'BODEGA is a culture department store from Atlanta — independent brand rooms, curated apparel, performance, city uniforms and new drops under one roof.';
export const metadata = {
  metadataBase: new URL('https://www.bodegabodegabodega.com'),
  title: 'BODEGA — Culture Department Store',
  description: BRAND_DESCRIPTION,
  openGraph:{ title:'BODEGA — Culture Department Store', description:BRAND_DESCRIPTION, siteName:'BODEGA', type:'website', locale:'en_US', images:[{url:'/campaigns/kollective-real-product.png',width:1200,height:630,alt:'BODEGA culture department store'}] },
};
const JSON_LD = {'@context':'https://schema.org','@type':'Organization',name:'BODEGA',description:BRAND_DESCRIPTION,slogan:'Everything good is on the shelf.',parentOrganization:{'@type':'Organization',name:'The Kollective Hospitality Group'},address:{'@type':'PostalAddress',addressLocality:'Atlanta',addressRegion:'GA',addressCountry:'US'}};
const NAV=[{label:'New In',href:'/shop'},{label:'Store Map',href:'/#floor'},{label:'Brand Rooms',href:'/#rooms'},{label:'Shop All',href:'/shop'}];

export default function RootLayout({children}){
 return <html lang="en" className={`${display.variable} ${body.variable}`}><body>
  <ExperienceLayer/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(JSON_LD)}}/>
  <nav className="nav"><a href="/" className="nav__logo">Bodega</a><ul className="nav__links">{NAV.map(n=><li key={n.label}><a href={n.href} className="nav__link">{n.label}</a></li>)}</ul><MobileMenu/></nav>
  <main>{children}</main>
  <footer className="footer"><div className="footer__grid">
   <div><div className="footer__brand">Bodega</div><p className="footer__desc">The culture department store. Every brand keeps its own room; BODEGA keeps the hallway moving.</p></div>
   <div><div className="footer__heading">Store</div><a href="/shop" className="footer__link">Shop All</a><a href="/#floor" className="footer__link">Store Map</a><a href="/#rooms" className="footer__link">Brand Rooms</a><a href="/#subscribe" className="footer__link">Drop List</a></div>
   <div><div className="footer__heading">Business</div><a href="/forms/inquiry" className="footer__link">General Inquiry</a><a href="/forms/vendor" className="footer__link">Vendor / Brand</a><a href="/forms/sponsor" className="footer__link">Partnerships</a></div>
   <div><div className="footer__heading">Based In</div><span className="footer__link">Atlanta, Georgia</span><span className="footer__link">Shipping Nationwide</span></div>
  </div><div className="footer__bottom"><span>© {new Date().getFullYear()} BODEGA — CULTURE DEPARTMENT STORE</span><span>A KOLLECTIVE COMPANY</span></div></footer>
 </body></html>
}
