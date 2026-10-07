import Image from 'next/image';
import { Heart, Mail, Users, Pill, BookOpen } from 'lucide-react';
import type { Website } from '@/lib/cms/model';

import { OutreachVideos, OutreachGallery, VideoCard } from '@/components/media/OutreachVideos';

export function LandingPage({ website }: { website: Website }) {
  const content = { hero: website.heroPhoto, founder: website.founderPhoto, videos: website.videos, testimonial: website.testimonial, workPhotos: website.workPhotos, volunteerFormUrl: website.volunteerFormUrl };
  const milestones = website.milestones;
  const work = [
    { id: 'medications', icon: Pill, title: website.medicationsTitle, text: website.medicationsBody },
    { id: 'education', icon: BookOpen, title: website.educationTitle, text: website.educationBody },
    { id: 'outreach', icon: Users, title: website.outreachTitle, text: website.outreachBody },
  ] as const;
  return <>
    <section className={`page-container hero${content.hero ? '' : ' hero-text'}`} aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="accent-dot" aria-hidden="true" />{website.heroEyebrow}</p>
        <h1 id="hero-title">{website.heroTitle.trimEnd()}{' '}<span>{website.heroEmphasis}</span></h1>
        <p className="mission">{website.heroMission}</p>
        <div className="hero-actions"><a className="primary-link" href="#volunteer">{website.heroButton} <Users size={18} aria-hidden="true" /></a><a className="text-link" href="#about">{website.heroSecondary}</a></div>
      </div>
      {content.hero && <Image {...content.hero} alt={content.hero.alt} sizes="(min-width: 1024px) 46vw, 100vw" className="hero-image" preload />}
    </section>

    <section id="about" className="direction-section section-space" aria-labelledby="direction-title"><div className="page-container editorial-grid">
      <div><p className="eyebrow">{website.directionEyebrow}</p><h2 id="direction-title">{website.directionTitle}</h2></div>
      <div className="editorial-copy"><p>{website.directionStatus}</p><p>{website.directionBody}</p><p>{website.directionBelief}</p></div>
    </div></section>

    <section id="our-work" className="page-container section-space" aria-labelledby="work-title">
      <p className="eyebrow">{website.workEyebrow}</p><h2 id="work-title">{website.workTitle}</h2>
      <div className="work-grid">{work.map(({ id, icon: Icon, title, text }) => <article className="work-card" key={id}>
        {content.workPhotos[id] && <Image {...content.workPhotos[id]} alt={content.workPhotos[id].alt} className="work-photo" sizes="(min-width: 1024px) 30vw, 90vw" />}
        <div className="feature-icon"><Icon size={25} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p>
      </article>)}</div>
    </section>

    <section id="impact" className="impact section-space" aria-labelledby="impact-title"><div className="page-container">
      <p className="eyebrow">{website.impactEyebrow}</p><h2 id="impact-title">{website.impactTitle}</h2>
      <dl className="impact-grid impact-pair"><div><dt>{website.womenLabel}</dt><dd>{website.womenReached}<span>{website.womenReachedSuffix}</span></dd></div><div><dt>{website.outreachesLabel}</dt><dd>{website.outreachCount}</dd></div></dl>
      <ol className="roadmap" aria-label="Current impact and future targets">{milestones.map(step => <li key={step.label} className={step.current ? 'roadmap-current' : undefined}><p className="roadmap-label">{step.label}</p><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    </div></section>

    <section id="stories" className="community-section section-space" aria-labelledby="stories-title"><div className="page-container">
      <p className="eyebrow">{website.storiesEyebrow}</p><h2 id="stories-title">{website.storiesTitle}</h2><p className="section-intro">{website.storiesIntro}</p>
      <OutreachVideos videos={content.videos} /><OutreachGallery items={website.gallery} title={website.galleryTitle} hint={website.galleryHint} />
      {content.testimonial && <div className="testimonial-layout story-testimonial" aria-labelledby="testimonial-title"><div><p className="eyebrow">{website.testimonialEyebrow}</p><h3 id="testimonial-title">{website.testimonialTitle}</h3><p className="section-intro">{website.testimonialIntro}</p><a className="text-link" href="#volunteer">{website.testimonialButton}</a></div><VideoCard video={content.testimonial} /></div>}
    </div></section>

    <section id="founder" className="founder-section section-space" aria-labelledby="founder-title"><div className={`page-container ${content.founder ? 'editorial-grid' : 'founder-text'}`}>
      {content.founder && <Image {...content.founder} alt={content.founder.alt} sizes="(min-width: 1024px) 40vw, 90vw" className="founder-photo" />}
      <div className="editorial-copy"><p className="eyebrow">{website.founderEyebrow}</p><h2 id="founder-title">{website.founderTitle}</h2>{website.founderBiography.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </div></section>

    <section id="get-involved" className="page-container section-space" aria-labelledby="involved-title">
      <p className="eyebrow">{website.involvedEyebrow}</p><h2 id="involved-title">{website.involvedTitle}</h2>
      <div className="involvement-grid">
        <section id="volunteer" className="involvement-card" aria-labelledby="volunteer-title"><Users size={28} aria-hidden="true" /><h3 id="volunteer-title">{website.volunteerTitle}</h3><p>{website.volunteerBody}</p>{content.volunteerFormUrl && <a className="primary-link" href={content.volunteerFormUrl}>{website.volunteerButton} <Users size={18} aria-hidden="true" /></a>}</section>
        <section id="donate" className="involvement-card giving-card" aria-labelledby="donate-title"><Heart size={28} aria-hidden="true" /><h3 id="donate-title">{website.donateTitle}</h3><p>{website.donateBody}</p><p className="giving-status">{website.donateStatus}</p><a className="primary-link" href={`mailto:${website.email}`}>{website.donateButton} <Mail size={18} aria-hidden="true" /></a></section>
      </div>
    </section>
  </>;
}
