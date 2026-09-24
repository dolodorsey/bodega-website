'use client';
import { useState } from 'react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Brands', href: '/#brands' },
    { label: 'About', href: '/#about' },
    { label: 'FENYX', href: '/fenyx' },
    { label: 'Kollective Merch', href: '/kollective' },
    { label: 'Halloween Merch', href: '/halloween' },
    { label: 'Contact', href: '/forms/inquiry' },
  ];

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {open ? (
            <path d="M4 4L16 16M16 4L4 16" stroke="#F4F1EC" strokeWidth="1.5" />
          ) : (
            <>
              <line x1="2" y1="5" x2="18" y2="5" stroke="#F4F1EC" strokeWidth="1.5" />
              <line x1="2" y1="10" x2="18" y2="10" stroke="#F4F1EC" strokeWidth="1.5" />
              <line x1="2" y1="15" x2="18" y2="15" stroke="#F4F1EC" strokeWidth="1.5" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 60,
            background: 'rgba(8,9,9,.985)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 18,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#F4F1EC',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}