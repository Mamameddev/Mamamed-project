import Image from 'next/image';
import { BookOpen, Heart, Pill, Users, Quote } from 'lucide-react';
import { SiInstagram } from '@icons-pack/react-simple-icons';
import { content } from '@/lib/content';
import { site } from '@/lib/site';
import { OutreachVideos, MoreOutreachVideos, VideoCard } from '@/components/media/OutreachVideos';

const work = [
  { icon: Pill, title: 'Essential medications', text: 'Providing antenatal medications and supplements to pregnant women who need them.' },
  { icon: BookOpen, title: 'Maternal health education', text: 'Helping women understand the medications they receive and supporting informed, healthy pregnancies.' },
  { icon: Users, title: 'Community outreach', text: 'Partnering with healthcare providers and community organizations to reach women directly.' },
];

export function LandingPage() {
  return <>
    <section className="page-container hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="accent-dot" aria-hidden="true" />Maternal health • Nigeria</p>
        <h1 id="hero-title">Every mother deserves a <span>safe pregnancy.</span></h1>
        <p className="mission">MamaMeds is committed to reducing maternal mortality across Nigeria by improving access to essential antenatal medications, maternal health education, and community-based support.</p>
        <div className="hero-actions"><a className="primary-link" href="#volunteer">Be part of our mission <Users size={18} aria-hidden="true" /></a><a className="text-link" href="#our-work">Explore our work</a></div>
      </div>
      <div className="hero-visual">
        {content.hero ? <Image {...content.hero} alt={content.hero.alt} sizes="(min-width: 1024px) 46vw, 100vw" className="hero-image" preload /> :
          <div className="mission-panel"><Image src={site.logo} alt="MamaMeds" width={744} height={458} className="mission-logo" /><p className="eyebrow">Care starts with community</p><h2>For mothers.<br />For families.<br />For healthier futures.</h2><div className="mission-panel-bottom"><Heart size={22} aria-hidden="true" /><span>Essential care. Lasting support.</span></div></div>}
        <p className="image-note"><span aria-hidden="true" />Care. Community. Safer pregnancies.</p>
      </div>
    </section>
    <section className="impact" aria-label="Our impact"><dl className="page-container impact-grid">
      <div><dt>Women reached</dt><dd>250<span>+</span></dd></div><div><dt>Community outreaches</dt><dd>2</dd></div><div><dt>Our focus</dt><dd className="impact-country">Nigeria</dd></div>
    </dl></section>
    <section id="our-work" className="page-container section-space" aria-labelledby="work-title">
      <p className="eyebrow">Our work</p><h2 id="work-title">Supporting healthier pregnancies<br className="desktop-break" /> from the ground up.</h2>
      <p className="section-intro">Essential resources, trusted information, and a community of care. Together, they help make a safer pregnancy possible.</p>
      <div className="work-grid">{work.map(({ icon: Icon, title, text }) => <article className="work-card" key={title}><div className="feature-icon"><Icon size={25} strokeWidth={1.7} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <section className="community-section section-space" aria-labelledby="community-title"><div className="page-container">
      <p className="eyebrow">MamaMeds in the community</p><h2 id="community-title">This is what support looks like.</h2><p className="section-intro">Meet the people and see the moments behind our work, through stories from our outreach.</p>
      <OutreachVideos videos={content.videos} />
      <MoreOutreachVideos videos={content.outreachMoments} />
      {content.community.length > 0 && <div className="photo-grid">{content.community.map(photo => <Image key={photo.src} {...photo} alt={photo.alt} sizes="(min-width: 768px) 45vw, 90vw" />)}</div>}
    </div></section>
    <section id="about" className="page-container section-space editorial-grid" aria-labelledby="about-title">
      <div><p className="eyebrow">About MamaMeds</p><h2 id="about-title">Reducing maternal mortality across Nigeria.</h2></div>
      <div className="editorial-copy"><p>MamaMeds is a nonprofit working to improve maternal health outcomes through community outreach, essential medications, maternal health education, and stronger healthcare systems.</p><p>Our work starts with a simple belief: where a woman lives or what she earns should not determine her access to the resources needed for a healthy pregnancy.</p><a className="text-link" href="#volunteer">Find your place in our community</a></div>
    </section>
    <section id="founder" className="founder-section section-space" aria-labelledby="founder-title"><div className="page-container editorial-grid">
      {content.founder ? <Image {...content.founder} alt={content.founder.alt} sizes="(min-width: 1024px) 40vw, 90vw" className="founder-photo" /> : <div className="founder-nameplate"><span className="eyebrow">A purpose rooted in care</span><span className="founder-initials" aria-hidden="true">KUB</span><p>Kasi Ugo-Beke<br /><span>Founder, MamaMeds</span></p></div>}
      <div className="editorial-copy"><p className="eyebrow">About the founder</p><h2 id="founder-title">Meet Kasi Ugo-Beke.</h2><p>Founder, MamaMeds</p><p>MamaMeds was founded with a belief that where a woman lives or what she earns should not determine whether she has access to the basic resources needed for a healthy pregnancy.</p><p>Through MamaMeds, I work to reduce barriers to accessing essential antenatal medications, maternal health education, and community-based support.</p><div className="founder-belief"><Quote size={24} aria-hidden="true" /><p>A healthier, more equitable future is possible when more women have access to the care and resources they need.</p></div></div>
    </div></section>
    {content.testimonial && <section className="testimonial-section section-space" aria-labelledby="testimonial-title"><div className="page-container testimonial-layout">
      <div><p className="eyebrow">A voice from our community</p><h2 id="testimonial-title">Behind every outreach,<br />a personal story.</h2><p className="section-intro">Hear from Tobi, in her own words, about her experience with MamaMeds.</p><a className="text-link" href="#volunteer">Be part of our next chapter</a></div>
      <VideoCard video={content.testimonial} />
    </div></section>}
    <section id="volunteer" className="page-container section-space editorial-grid" aria-labelledby="volunteer-title"><div><p className="eyebrow">Volunteer</p><h2 id="volunteer-title">Make room for care.<br />Make a difference.</h2></div><div className="editorial-copy"><p>Bring your time, skills, and compassion to a mission that supports mothers and communities.</p>
      {content.volunteerFormUrl ? <><a className="primary-link" href={content.volunteerFormUrl}>Apply to volunteer <Users size={18} aria-hidden="true" /></a><p className="small-note">Applications are collected through our external volunteer form.</p></> : <><p className="availability-note">Our volunteer application form will be available here soon.</p><a className="text-link" href={site.instagram.url}>Connect with us on Instagram <SiInstagram size={18} aria-hidden="true" /></a></>}
    </div></section>
    <section id="donate" className="page-container donation-section" aria-labelledby="donate-title"><div className="donation-panel"><Heart size={32} strokeWidth={1.5} aria-hidden="true" /><h2 id="donate-title">Help us reach<br />more mothers.</h2><p>Your support helps provide essential antenatal medications and maternal health resources to women across Nigeria.</p><button className="donate-button" type="button" disabled aria-describedby="donation-availability">Donate to MamaMeds <Heart size={18} aria-hidden="true" /></button><p id="donation-availability" className="small-note">Online donations are coming soon.</p></div></section>
    <section id="contact" className="page-container section-space contact-section" aria-labelledby="contact-title"><div><p className="eyebrow">Contact us</p><h2 id="contact-title">Let’s stay connected.</h2><p>For questions about MamaMeds, volunteering, or supporting our work, connect with us on Instagram.</p></div><a className="instagram-contact" href={site.instagram.url}><SiInstagram size={26} aria-hidden="true" /><span><strong>{site.instagram.handle}</strong><span>Find MamaMeds on Instagram</span></span></a></section>
  </>;
}
