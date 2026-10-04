import { NextResponse } from 'next/server';

const HOST_ROUTES = {
  'maga.bodegabodegabodega.com': '/make-atl-great-again',
  'kollective.bodegabodegabodega.com': '/kollective',
};

export function middleware(request) {
  const hostname = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const route = HOST_ROUTES[hostname];
  if (route && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = route;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
