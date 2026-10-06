import Image from 'next/image';
import { Heart, Mail, Users, Pill, BookOpen } from 'lucide-react';
import { content } from '@/lib/content';
import { site } from '@/lib/site';
import { OutreachVideos, OutreachGallery, VideoCard } from '@/components/media/OutreachVideos';

const work = [
  { id: 'medications', icon: Pill, title: 'Essential medications', text: 'Providing antenatal medications and supplements to pregnant women who need them.' },
  { id: 'education', icon: BookOpen, title: 'Maternal health education', text: 'Helping women understand the medications they receive and supporting informed, healthy pregnancies.' },
  { id: 'outreach', icon: Users, title: 'Community outreach', text: 'Partnering with healthcare providers and community organizations to reach women directly.' },
] as const;

const milestones = [
  { label: 'So far', title: '250+', text: 'women reached', current: true },
  { label: 'End of 2026 target', title: '500', text: 'women reached' },
  { label: '2027 plan', title: 'Tech infrastructure', text: 'pilot' },
  { label: '2031 target', title: '100,000', text: 'women impacted' },
];

export function LandingPage() {
  return <>
    <section className={`page-container hero${content.hero ? '' : ' hero-text'}`} aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="accent-dot" aria-hidden="true" />Maternal health • Nigeria</p>
        <h1 id="hero-title">Every mother deserves a <span>safe pregnancy.</span></h1>
        <p className="mission">MamaMeds is committed to reducing maternal mortality across Nigeria by improving access to essential antenatal medications, maternal health education, and community-based support.</p>
        <div className="hero-actions"><a className="primary-link" href="#volunteer">Be part of our mission <Users size={18} aria-hidden="true" /></a><a className="text-link" href="#about">Explore our work</a></div>
      </div>
      {content.hero && <Image {...content.hero} alt={content.hero.alt} sizes="(min-width: 1024px) 46vw, 100vw" className="hero-image" preload />}
    </section>

    <section id="about" className="direction-section section-space" aria-labelledby="direction-title"><div className="page-container editorial-grid">
      <div><p className="eyebrow">About MamaMeds</p><h2 id="direction-title">Where we’re headed.</h2></div>
      <div className="editorial-copy"><p>MamaMeds is a registered 501(c)(3) nonprofit.</p><p>Today, we deliver antenatal medications and education through community outreach. Next, we&apos;re building a model to help community health workers prevent postpartum hemorrhage, one of the leading causes of maternal death, starting with a pilot in 2027.</p><p>Our work starts with a simple belief: where a woman lives or what she earns should not determine her access to the resources needed for a healthy pregnancy.</p></div>
    </div></section>

    <section id="our-work" className="page-container section-space" aria-labelledby="work-title">
      <p className="eyebrow">Our work</p><h2 id="work-title">Supporting healthier pregnancies.</h2>
      <div className="work-grid">{work.map(({ id, icon: Icon, title, text }) => <article className="work-card" key={id}>
        {content.workPhotos[id] && <Image {...content.workPhotos[id]} alt={content.workPhotos[id].alt} className="work-photo" sizes="(min-width: 1024px) 30vw, 90vw" />}
        <div className="feature-icon"><Icon size={25} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p>
      </article>)}</div>
    </section>

    <section id="impact" className="impact section-space" aria-labelledby="impact-title"><div className="page-container">
      <p className="eyebrow">Progress with purpose</p><h2 id="impact-title">Impact &amp; roadmap</h2>
      <dl className="impact-grid impact-pair"><div><dt>Women reached</dt><dd>250<span>+</span></dd></div><div><dt>Community outreaches</dt><dd>2</dd></div></dl>
      <ol className="roadmap" aria-label="Current impact and future targets">{milestones.map(step => <li key={step.label} className={step.current ? 'roadmap-current' : undefined}><p className="roadmap-label">{step.label}</p><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    </div></section>

    <section id="stories" className="community-section section-space" aria-labelledby="stories-title"><div className="page-container">
      <p className="eyebrow">Stories</p><h2 id="stories-title">This is what support looks like.</h2><p className="section-intro">Meet the people and see the moments behind our work, through stories from our outreach.</p>
      <OutreachVideos videos={content.videos} /><OutreachGallery items={[...content.outreachMoments.map(video => ({ kind: 'video' as const, video })), ...content.community.map((photo, index) => ({ kind: 'photo' as const, id: `photo-${index}`, photo }))]} />
      {content.testimonial && <div className="testimonial-layout story-testimonial" aria-labelledby="testimonial-title"><div><p className="eyebrow">A voice from our community</p><h3 id="testimonial-title">Behind every outreach,<br />a personal story.</h3><p className="section-intro">Hear from Tobi, in her own words, about her experience with MamaMeds.</p><a className="text-link" href="#volunteer">Be part of our next chapter</a></div><VideoCard video={content.testimonial} /></div>}
    </div></section>

    <section id="founder" className="founder-section section-space" aria-labelledby="founder-title"><div className={`page-container ${content.founder ? 'editorial-grid' : 'founder-text'}`}>
      {content.founder && <Image {...content.founder} alt="Kasite Ugo-Beke, founder of MamaMeds" sizes="(min-width: 1024px) 40vw, 90vw" className="founder-photo" />}
      <div className="editorial-copy"><p className="eyebrow">About the founder</p><h2 id="founder-title">Hi, I&apos;m Kasite Ugo-Beke.</h2>
        <p>I grew up in Lagos, Nigeria, where I saw firsthand both the resilience of Nigerian communities and the healthcare challenges they face. That early exposure led me to volunteer at orphanages and community initiatives while interning at local pharmacies. Those experiences sparked a lasting interest in what it takes to actually deliver healthcare, not just design it on paper.</p>
        <p>I studied Chemical-Biological Engineering at MIT and later attended Harvard Business School. I&apos;ve built my career designing and scaling healthcare delivery systems, most recently in under-resourced rural communities in the United States. That work convinced me that the hardest problems in healthcare are rarely about a single missing resource. They&apos;re about disconnected systems.</p>
        <p>I founded MamaMeds to bring that same systems discipline to Nigeria&apos;s maternal mortality crisis. Too many women still lose their lives to preventable complications of pregnancy and childbirth. I&apos;m committed to building practical, scalable solutions that close that gap: medicines, education, and coordinated, verifiable care.</p>
      </div>
    </div></section>

    <section id="get-involved" className="page-container section-space" aria-labelledby="involved-title">
      <p className="eyebrow">Be part of our mission</p><h2 id="involved-title">Get involved.</h2>
      <div className="involvement-grid">
        <section id="volunteer" className="involvement-card" aria-labelledby="volunteer-title"><Users size={28} aria-hidden="true" /><h3 id="volunteer-title">Volunteer with us</h3><p>Help prepare outreach materials, support event logistics, and assist with community engagement.</p>{content.volunteerFormUrl && <a className="primary-link" href={content.volunteerFormUrl}>Apply to volunteer <Users size={18} aria-hidden="true" /></a>}</section>
        <section id="donate" className="involvement-card giving-card" aria-labelledby="donate-title"><Heart size={28} aria-hidden="true" /><h3 id="donate-title">Help us reach more mothers.</h3><p>Your support helps provide essential antenatal medications and maternal health resources to women across Nigeria.</p><p className="giving-status">MamaMeds is a 501(c)(3) nonprofit. Donations are tax-deductible to the extent allowed by law.</p><a className="primary-link" href={`mailto:${site.email}`}>Email us to give <Mail size={18} aria-hidden="true" /></a></section>
      </div>
    </section>
  </>;
}
