import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingPage } from '@/components/sections/LandingPage';
import { getWebsite } from '@/lib/cms/read';
import { PreviewBar } from '@/components/layout/PreviewBar';
import { VisualEditing } from 'next-sanity/visual-editing';
import { site } from '@/lib/site';

export default async function Home() {
  const { website, preview } = await getWebsite();
  const organization = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: website.organizationName, alternateName: website.name,
    description: website.seoDescription, url: site.url, logo: new URL(website.logoPhoto.src, site.url).href,
    email: website.email, sameAs: [website.instagramUrl, website.linkedinUrl],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
      {preview && <><PreviewBar /><VisualEditing /></>}
      <Header website={website} />
      <main id="main-content" tabIndex={-1}><LandingPage website={website} /></main>
      <Footer website={website} />
    </>
  );
}
