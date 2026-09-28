import { renderPage, htmlResponse } from '../../_a2p/a2p-pages.mjs';
const BRAND = {"key": "fenyx", "name": "FĚNYX", "domain": "bodegabodegabodega.com", "home": "/fenyx", "base": "/fenyx", "programDescription": "Sign up for FĚNYX texts for private access to collection launches and product releases.", "messageTypes": "FĚNYX collection launches, product releases, promotions, and order or customer-service updates."};
export const dynamic = 'force-static';
export function GET() { return htmlResponse(renderPage('privacy', BRAND)); }
