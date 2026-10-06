import { Mail } from 'lucide-react';
import { SiInstagram } from '@icons-pack/react-simple-icons';
import { FaLinkedin } from 'react-icons/fa6';
import { site } from '@/lib/site';

export function ContactLinks() {
  return <div className="contact-links">
    <a href={`mailto:${site.email}`}><Mail size={19} aria-hidden="true" /><span>{site.email}</span></a>
    <a href={site.instagram.url} aria-label={`MamaMeds on Instagram (${site.instagram.handle})`}><SiInstagram size={19} aria-hidden="true" /><span>{site.instagram.handle}</span></a>
    <a href={site.linkedin.url}><FaLinkedin size={19} aria-hidden="true" /><span>MamaMeds on LinkedIn</span></a>
  </div>;
}
