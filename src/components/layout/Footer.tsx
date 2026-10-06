import { ContactLinks } from './ContactLinks';
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          {/* <p className="footer-brand">{site.name}</p>
          <p>{site.organizationName}</p> */}
          <p className="footer-brand">For questions about MamaMeds, volunteering, or supporting our work, get in touch.</p>
        </div>
        <div className="footer-details">
          <p className="footer-location">Nigeria <span aria-hidden="true">/</span> United States</p>
          <ContactLinks />
        </div>
      </div>
    </footer>
  );
}

<section id="contact" className="contact-section involved-contact" aria-labelledby="contact-title"><div><h3 id="contact-title">Let’s stay connected.</h3><p>For questions about MamaMeds, volunteering, or supporting our work, get in touch.</p></div><ContactLinks /></section>