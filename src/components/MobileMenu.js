'use client';
import { useState } from 'react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const S = 'https://bodegabodegbodega.myshopify.com';
  const links = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Costumes', href: `${S}/collections/all` },
    { label: 'Cart', href: `${S}/cart` },
  ];
  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {open ? (
            <path d="M4 4L16 16M16 4L4 16" stroke="#F0ECE3" strokeWidth="1.5" />
          ) : (
            <>
              <line x1="2" y1="5" x2="18" y2="5" stroke="#F0ECE3" strokeWidth="1.5" />
              <line x1="2" y1="10" x2="18" y2="10" stroke="#F0ECE3" strokeWidth="1.5" />
              <line x1="2" y1="15" x2="18" y2="15" stroke="#F0ECE3" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'fixed', inset: 0, top: 86, background: 'rgba(10,10,10,0.98)',
          zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 28,
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F0ECE3' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
