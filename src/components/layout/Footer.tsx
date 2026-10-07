import { ContactLinks } from './ContactLinks';
import type { Website } from '@/lib/cms/model';

export function Footer({ website }: { website: Website }) {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="contact-title">
      <div className="page-container">
        <div className="footer-inner">
          <div className="footer-contact-copy">
            <h2 id="contact-title">{website.contactTitle}</h2>
            <p>{website.contactBody}</p>
          </div>
          <ContactLinks website={website} />
        </div>
        <div className="footer-meta">
          <p>{website.footerStatus}</p>
          <p className="footer-location">{website.footerLocation}</p>
        </div>
      </div>
    </footer>
  );
}
