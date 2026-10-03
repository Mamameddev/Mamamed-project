import Image from 'next/image';

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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8" /></svg>
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
