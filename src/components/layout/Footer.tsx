import { ContactLinks } from './ContactLinks';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="contact-title">
      <div className="page-container">
        <div className="footer-inner">
          <div className="footer-contact-copy">
            <h2 id="contact-title">Let’s stay connected.</h2>
            <p>For questions about MamaMeds, volunteering, or supporting our work, get in touch.</p>
          </div>
          <ContactLinks />
        </div>
        <div className="footer-meta">
          <p>{site.organizationName} is a registered 501(c)(3) nonprofit organization.</p>
          <p className="footer-location">Nigeria <span aria-hidden="true">/</span> United States</p>
        </div>
      </div>
    </footer>
  );
}
