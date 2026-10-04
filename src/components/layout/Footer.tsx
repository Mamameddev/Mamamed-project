import { Camera } from 'lucide-react';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          <p className="footer-brand">{site.name}</p>
          <p>{site.organizationName}</p>
        </div>
        <div className="footer-details">
          <p className="footer-location">Nigeria <span aria-hidden="true">/</span> United States</p>
          <a className="instagram-link" href={site.instagram.url} aria-label={`MamaMeds on Instagram (${site.instagram.handle})`}>
            <Camera size={18} strokeWidth={2} aria-hidden="true" focusable="false" />
            <span>{site.instagram.handle}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
