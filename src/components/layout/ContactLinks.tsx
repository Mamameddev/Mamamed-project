import { Mail } from 'lucide-react';
import { SiInstagram } from '@icons-pack/react-simple-icons';
import { FaLinkedin } from 'react-icons/fa6';
import type { Website } from '@/lib/cms/model';

export function ContactLinks({ website }: { website: Website }) {
  return <div className="contact-links">
    <a href={`mailto:${website.email}`}><Mail size={19} aria-hidden="true" /><span>{website.email}</span></a>
    <a href={website.instagramUrl} aria-label={`MamaMeds on Instagram (${website.instagramHandle})`}><SiInstagram size={19} aria-hidden="true" /><span>{website.instagramHandle}</span></a>
    <a href={website.linkedinUrl}><FaLinkedin size={19} aria-hidden="true" /><span>{website.linkedinLabel}</span></a>
  </div>;
}
