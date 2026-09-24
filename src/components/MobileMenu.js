'use client';
import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Brands', href: '/#brands' },
  { label: 'About', href: '/#about' },
  { label: 'STUSH', href: 'https://stushusa.com' },
  { label: 'FENYX', href: 'https://fenyx-gules.vercel.app' },
  { label: 'PULSE', href: 'https://yourpulsehq.com' },
  { label: 'Kollective Merch', href: '/kollective' },
  { label: 'Halloween Merch', href: 'https://iconic-atl.com/tampa/nightmare-on-channelside/merch/shop' },
  { label: 'Contact', href: '/forms/inquiry' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4L18 18M18 4L4 18" stroke="#F4F1EC" strokeWidth="1.5" />
          ) : (
            <>
              <line x1="2" y1="5" x2="20" y2="5" stroke="#F4F1EC" strokeWidth="1.5" />
              <line x1="2" y1="11" x2="20" y2="11" stroke="#F4F1EC" strokeWidth="1.5" />
              <line x1="2" y1="17" x2="20" y2="17" stroke="#F4F1EC" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="BODEGA navigation">
          <nav className="mobile-menu-links">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
