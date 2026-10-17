import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from './Navigation';
import type { Website } from '@/lib/cms/model';

export function Header({ website }: { website: Website }) {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Link href="/" aria-label="MamaMeds home" className="logo-link">
          <Image {...website.logoPhoto} alt={website.logoPhoto.alt} className="brand-logo" preload />
        </Link>
        <Navigation donate={{ label: website.navDonate, href: '#get-involved' }} links={[
          { label: website.navAbout, href: '#about' }, { label: website.navImpact, href: '#impact' }, { label: website.navGallery, href: '#gallery' },
          { label: website.navFounder, href: '#founder' }, { label: website.navInvolved, href: '#get-involved' }, { label: website.navContact, href: '#contact' },
        ]} />
      </div>
    </header>
  );
}
