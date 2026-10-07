import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { site } from '@/lib/site';
import './globals.css';
import { getWebsite } from '@/lib/cms/read';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const { website, preview } = await getWebsite();
  return {
  metadataBase: new URL(site.url),
  title: website.seoTitle,
  description: website.seoDescription,
  alternates: { canonical: '/' },
  robots: { index: !preview, follow: !preview },
  openGraph: {
    type: 'website', locale: 'en_NG', siteName: website.name,
    title: website.seoTitle, description: website.seoDescription, url: site.url,
    images: [{ url: website.socialPhoto.src, width: website.socialPhoto.width, height: website.socialPhoto.height, alt: website.socialPhoto.alt }],
  },
  twitter: { card: 'summary_large_image', title: website.seoTitle, description: website.seoDescription, images: [website.socialPhoto.src] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      {/* Browser extensions can add body attributes before hydration. Keep this exception local. */}
      <body suppressHydrationWarning><a className="skip-link" href="#main-content">Skip to content</a>{children}</body>
    </html>
  );
}
