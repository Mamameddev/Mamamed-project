'use client';

import { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';

const anchors = ['#about', '#volunteer', '#founder', '#contact', '#donate'];

export function Navigation({ labels }: { labels: string[] }) {
  const links = labels.map((label, index) => [label, anchors[index]]);
  const [open, setOpen] = useState(false);
  return (
    <div className="navigation" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    }}>
      <button id="menu-toggle" className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>
      <nav id="main-navigation" aria-label="Main navigation" className={`nav-links${open ? ' is-open' : ''}`}>
        {links.map(([label, href]) => <a key={href} href={href} className={href === '#donate' ? 'nav-donate' : undefined} onClick={() => setOpen(false)}>
          {label}{href === '#donate' && <Heart size={17} aria-hidden="true" />}
        </a>)}
      </nav>
    </div>
  );
}
