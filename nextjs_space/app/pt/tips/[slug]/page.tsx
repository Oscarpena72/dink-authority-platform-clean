export const dynamic = "force-dynamic";
import { buildLocalizedDetailMetadata, LocalizedDetailPage } from '@/lib/localized-detail';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return buildLocalizedDetailMetadata(params?.slug ?? '', 'tips', 'pt');
}

export default async function Page({ params }: { params: { slug: string } }) {
  return LocalizedDetailPage({ slug: params?.slug ?? '', sectionKey: 'tips', locale: 'pt' });
}
