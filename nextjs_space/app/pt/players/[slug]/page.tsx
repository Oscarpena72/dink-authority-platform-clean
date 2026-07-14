export const dynamic = "force-dynamic";
import { buildLocalizedDetailMetadata, LocalizedDetailPage } from '@/lib/localized-detail';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return buildLocalizedDetailMetadata(params?.slug ?? '', 'players', 'pt');
}

export default async function Page({ params }: { params: { slug: string } }) {
  return LocalizedDetailPage({ slug: params?.slug ?? '', sectionKey: 'players', locale: 'pt' });
}
