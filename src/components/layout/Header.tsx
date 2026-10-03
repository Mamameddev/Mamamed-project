import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { site } from '@/lib/site';

export function Header() {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link href="/" aria-label="MamaMeds home" className="logo-link">
          <Image src={site.logo} alt="MamaMeds" width={744} height={458} className="brand-logo" priority />
        </Link>
        <div className="donation-control">
          <button type="button" disabled aria-describedby="donation-status" className="donate-button">
            Donate <Heart size={18} strokeWidth={2} aria-hidden="true" focusable="false" />
          </button>
          <span id="donation-status">Donations coming soon</span>
        </div>
      </div>
    </header>
  );
}
