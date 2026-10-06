import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { site } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website', locale: 'en_NG', siteName: site.name,
    title: site.title, description: site.description, url: site.url,
    images: [{ url: site.socialImage, width: 1200, height: 630, alt: 'MamaMeds — Every mother deserves a safe pregnancy.' }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [site.socialImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      {/* Browser extensions can add body attributes before hydration. Keep this exception local. */}
      <body suppressHydrationWarning><a className="skip-link" href="#main-content">Skip to content</a>{children}</body>
    </html>
  );
}
