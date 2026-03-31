export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Pickleball Places | Courts, Clubs and Resorts',
  description: 'Discover the best pickleball places around the world including courts, clubs, resorts and destinations where pickleball is growing.',
  openGraph: {
    title: 'Pickleball Places | Courts, Clubs and Resorts',
    description: 'Discover the best pickleball places around the world including courts, clubs, resorts and destinations where pickleball is growing.',
  },
};

export default function PlacesPage() {
  redirect('/articles?category=places');
}
