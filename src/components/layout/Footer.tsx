import { ContactLinks } from './ContactLinks';
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
          <ContactLinks />
        </div>
      </div>
    </footer>
  );
}
