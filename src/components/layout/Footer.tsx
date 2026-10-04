import { SiInstagram } from '@icons-pack/react-simple-icons';
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
            <SiInstagram size={18} aria-hidden="true" focusable="false" />
            <span>{site.instagram.handle}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
