export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import CommunityPageClient from './_components/community-page-client';

export const metadata: Metadata = {
  title: 'Become a Community Correspondent | Dink Authority Magazine',
  description: 'Join the Dink Authority community network and help us discover the best stories and talents in pickleball.',
  openGraph: {
    title: 'Become a Dink Authority Community Correspondent',
    description: 'Join the Dink Authority community network and help us discover the best stories and talents in pickleball.',
    type: 'website',
    images: [{ url: '/images/community-hero.jpg', width: 1312, height: 736, alt: 'Dink Authority Community Correspondent' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Dink Authority Community Correspondent',
    description: 'Join the Dink Authority community network and help us discover the best stories and talents in pickleball.',
    images: ['/images/community-hero.jpg'],
  },
};

export default function CommunityPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Become a Dink Authority Community Correspondent',
    description: 'Join the Dink Authority community network and help us discover the best stories and talents in pickleball.',
    publisher: { '@type': 'Organization', name: 'Dink Authority Magazine' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CommunityPageClient />
    </>
  );
}
