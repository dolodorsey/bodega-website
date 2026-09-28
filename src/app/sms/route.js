import { renderPage, htmlResponse, handleOptin } from '../_a2p/a2p-pages.mjs';
const BRAND = {"key": "bodega", "name": "BODEGA", "domain": "bodegabodegabodega.com", "home": "/", "programDescription": "Sign up for BODEGA texts for new product drops, restocks, and promotions across the BODEGA shop.", "messageTypes": "BODEGA product drops, new arrivals, restocks, promotions, and order or customer-service updates."};
export function GET() { return htmlResponse(renderPage('sms', BRAND)); }
export async function POST(request) { return handleOptin(request, BRAND); }
