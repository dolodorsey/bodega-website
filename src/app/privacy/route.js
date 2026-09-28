import { renderPage, htmlResponse } from '../_a2p/a2p-pages.mjs';
const BRAND = {"key": "bodega", "name": "BODEGA", "domain": "bodegabodegabodega.com", "home": "/", "programDescription": "Sign up for BODEGA texts for new product drops, restocks, and promotions across the BODEGA shop.", "messageTypes": "BODEGA product drops, new arrivals, restocks, promotions, and order or customer-service updates."};
export const dynamic = 'force-static';
export function GET() { return htmlResponse(renderPage('privacy', BRAND)); }
