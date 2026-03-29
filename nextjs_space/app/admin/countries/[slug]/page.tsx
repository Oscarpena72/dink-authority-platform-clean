export const dynamic = "force-dynamic";
import CountryEditClient from './_components/country-edit-client';
export default function CountryEditPage({ params }: { params: { slug: string } }) {
  return <CountryEditClient slug={params.slug} />;
}
