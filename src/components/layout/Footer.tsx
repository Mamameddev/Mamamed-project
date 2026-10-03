import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          <p className="footer-brand">{site.name}</p>
          <p>{site.organizationName}</p>
        </div>
        <p className="footer-location">Nigeria <span aria-hidden="true">/</span> United States</p>
      </div>
    </footer>
  );
}
