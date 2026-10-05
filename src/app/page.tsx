import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingPage } from '@/components/sections/LandingPage';
import { site } from '@/lib/site';

export default function Home() {
  const organization = {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: site.organizationName, alternateName: site.name,
    description: site.description, url: site.url, logo: `${site.url}${site.logo}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
      <Header />
      <main id="main-content" tabIndex={-1}><LandingPage /></main>
      <Footer />
    </>
  );
}
