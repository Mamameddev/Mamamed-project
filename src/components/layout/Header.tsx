import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { site } from '@/lib/site';

export function Header() {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link href="/" aria-label="MamaMeds home" className="logo-link">
          <Image src={site.logo} alt="MamaMeds" width={744} height={458} className="brand-logo" priority />
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
