import Image from 'next/image';
import { Clock3 } from 'lucide-react';

export function ComingSoon() {
  return (
    <>
      <section className="page-container hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="accent-dot" aria-hidden="true" />Maternal health • Nigeria</p>
          <h1 id="hero-title">Every mother deserves a <span>safe pregnancy.</span></h1>
          <p className="mission">MamaMeds works to improve maternal health outcomes in Nigeria by expanding access to essential antenatal medications, maternal health education, and community-based support.</p>
          <div className="coming-soon">
            <span className="status-icon" aria-hidden="true">
              <Clock3 size={18} strokeWidth={2} aria-hidden="true" focusable="false" />
            </span>
            <p>Our new website is coming soon.</p>
          </div>
        </div>
        <div className="hero-visual">
          <div className="image-accent" aria-hidden="true" />
          <Image
            src="/images/mamameds-outreach.webp"
            alt="A pregnant woman receiving a MamaMeds bag from a team member, surrounded by women at a community gathering."
            width={1280}
            height={956}
            sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
            className="hero-image"
            preload
          />
          <p className="image-note"><span aria-hidden="true" />Care. Community. Safer pregnancies.</p>
        </div>
      </section>
      <section className="impact" aria-label="Our impact">
        <dl className="page-container impact-grid">
          <div><dt>Women reached</dt><dd>250<span>+</span></dd></div>
          <div><dt>Community outreaches</dt><dd>2</dd></div>
          <div><dt>Our focus</dt><dd className="impact-country">Nigeria</dd></div>
        </dl>
      </section>
    </>
  );
}
