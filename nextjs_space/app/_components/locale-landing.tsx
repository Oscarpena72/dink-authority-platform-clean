import Link from 'next/link';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import { Newspaper, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { t as translate, type Locale } from '@/lib/i18n/translations';

/**
 * Language landing hub for /es and /pt. Presents the three content sections
 * (news, players, tips) as navigable cards, fully server-rendered and indexable.
 */
const SECTION_TITLES: Record<Locale, { news: string; players: string; tips: string }> = {
  en: { news: 'News', players: 'Players', tips: 'Tips' },
  es: { news: 'Noticias', players: 'Jugadores', tips: 'Consejos' },
  pt: { news: 'Notícias', players: 'Jogadores', tips: 'Dicas' },
};

export default function LocaleLanding({ locale }: { locale: Locale }) {
  const prefix = `/${locale}`;
  const titles = SECTION_TITLES[locale] ?? SECTION_TITLES.en;
  const sections = [
    { href: `${prefix}/news`, Icon: Newspaper, title: titles.news, desc: translate('articles.subtitle', locale) },
    { href: `${prefix}/players`, Icon: Users, title: titles.players, desc: translate('articles.subtitle', locale) },
    { href: `${prefix}/tips`, Icon: Lightbulb, title: titles.tips, desc: translate('tips.subtitle', locale) },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <section className="bg-brand-purple py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">Dink Authority Magazine</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">{translate('articles.subtitle', locale)}</p>
          </div>
        </section>
        <section className="max-w-[1200px] mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map(({ href, Icon, title, desc }) => (
              <Link key={href} href={href} className="group block rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-8 bg-brand-gray">
                <Icon size={32} className="text-brand-purple mb-4" />
                <h2 className="text-xl font-heading font-bold text-brand-purple mb-2 group-hover:text-brand-purple-light transition-colors">{title}</h2>
                <p className="text-sm text-brand-gray-dark line-clamp-2 mb-4">{desc}</p>
                <span className="inline-flex items-center gap-1 text-brand-purple text-sm font-semibold group-hover:gap-2 transition-all">
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
