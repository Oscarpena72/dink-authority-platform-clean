import { NextRequest, NextResponse } from 'next/server';

/**
 * Redirect map: old slug (used in /articles/old-slug) → new path.
 * This handles both dirty slugs (with random IDs) and clean slugs under /articles/.
 */
const OLD_SLUG_REDIRECTS: Record<string, string> = {
  // === EDITORIAL → /news/ ===
  'editorial-letter-beyond-the-magazine-mnj48l2b': '/news/editorial-letter-beyond-the-magazine',
  'editorial-letter-beyond-the-magazine': '/news/editorial-letter-beyond-the-magazine',
  'editorial-letter-new-era-authority-global-pulse-pickleball': '/news/editorial-letter-new-era-authority-global-pulse-pickleball',
  'global-pickleball-passion-professionalism-and-boundless-opportunities-mnq68wym': '/news/global-pickleball-passion-professionalism-and-boundless-opportunities',
  'global-pickleball-passion-professionalism-and-boundless-opportunities': '/news/global-pickleball-passion-professionalism-and-boundless-opportunities',
  'the-new-language-of-sport-mnkpne27': '/news/the-new-language-of-sport',
  'the-new-language-of-sport': '/news/the-new-language-of-sport',
  // === EVENTS → /news/ ===
  'mesa-cup-2026-desert-sets-pulse-professional-pickleball': '/news/mesa-cup-2026-desert-sets-pulse-professional-pickleball',
  // === PLACES → /news/ ===
  'pickleball-places-cartagena-colombia-three-hour-flight-into-magic': '/news/pickleball-places-cartagena-colombia-three-hour-flight-into-magic',
  'pickleball-places-san-carlos-mnjaeuaw': '/news/pickleball-places-san-carlos',
  'pickleball-places-san-carlos': '/news/pickleball-places-san-carlos',
  // === NEWS → /news/ ===
  'agassi-and-blake-win-the-ares-pickleball-slam-4-at-hard-rock-live-in-hollywood-florida-mo1o9iv4': '/news/agassi-and-blake-win-the-ares-pickleball-slam-4-at-hard-rock-live-in-hollywood-florida',
  'agassi-and-blake-win-the-ares-pickleball-slam-4-at-hard-rock-live-in-hollywood-florida': '/news/agassi-and-blake-win-the-ares-pickleball-slam-4-at-hard-rock-live-in-hollywood-florida',
  'anna-bright-number-1-pick-mlp-draft-2026': '/news/anna-bright-number-1-pick-mlp-draft-2026',
  'april-around-the-world-the-global-pickleball-calendar-mnja5307': '/news/april-around-the-world-the-global-pickleball-calendar',
  'april-around-the-world-the-global-pickleball-calendar': '/news/april-around-the-world-the-global-pickleball-calendar',
  'champions-crowned-at-the-2026-u-s-open-pickleball-championships-in-naples-mo775dyb': '/news/champions-crowned-at-the-2026-u-s-open-pickleball-championships-in-naples',
  'champions-crowned-at-the-2026-u-s-open-pickleball-championships-in-naples': '/news/champions-crowned-at-the-2026-u-s-open-pickleball-championships-in-naples',
  'd-a-1-naples-cobra-vida-con-el-inicio-del-u-s-open-pickleball-championships-2026-mnvv0sb3': '/news/d-a-1-naples-cobra-vida-con-el-inicio-del-u-s-open-pickleball-championships-2026',
  'd-a-1-naples-cobra-vida-con-el-inicio-del-u-s-open-pickleball-championships-2026': '/news/d-a-1-naples-cobra-vida-con-el-inicio-del-u-s-open-pickleball-championships-2026',
  'day-2-at-the-us-open-veterans-shine-and-the-party-in-naples-keeps-growing-mnxelgv7': '/news/day-2-at-the-us-open-veterans-shine-and-the-party-in-naples-keeps-growing',
  'day-2-at-the-us-open-veterans-shine-and-the-party-in-naples-keeps-growing': '/news/day-2-at-the-us-open-veterans-shine-and-the-party-in-naples-keeps-growing',
  'day-4-in-naples-fudge-advances-mendez-impresses-split-age-delivers-gold-mo063gnd': '/news/day-4-in-naples-fudge-advances-mendez-impresses-split-age-delivers-gold',
  'day-4-in-naples-fudge-advances-mendez-impresses-split-age-delivers-gold': '/news/day-4-in-naples-fudge-advances-mendez-impresses-split-age-delivers-gold',
  'day-5-the-road-to-the-semifinals-turns-dramatic-in-naples-mo1mh4ve': '/news/day-5-the-road-to-the-semifinals-turns-dramatic-in-naples',
  'day-5-the-road-to-the-semifinals-turns-dramatic-in-naples': '/news/day-5-the-road-to-the-semifinals-turns-dramatic-in-naples',
  'day-6-at-the-u-s-open-mixed-doubles-ignite-the-atmosphere-in-naples-mo2yileq': '/news/day-6-at-the-u-s-open-mixed-doubles-ignite-the-atmosphere-in-naples',
  'day-6-at-the-u-s-open-mixed-doubles-ignite-the-atmosphere-in-naples': '/news/day-6-at-the-u-s-open-mixed-doubles-ignite-the-atmosphere-in-naples',
  'inside-the-courts-crowds-and-rising-tension-of-the-2026-us-open-pickleball-championships-mnyu7vls': '/news/inside-the-courts-crowds-and-rising-tension-of-the-2026-us-open-pickleball-championships',
  'inside-the-courts-crowds-and-rising-tension-of-the-2026-us-open-pickleball-championships': '/news/inside-the-courts-crowds-and-rising-tension-of-the-2026-us-open-pickleball-championships',
  'joola-files-patent-lawsuit-against-11-paddle-companies-over-propulsion-core-technology-mnqa5y75': '/news/joola-files-patent-lawsuit-against-11-paddle-companies-over-propulsion-core-technology',
  'joola-files-patent-lawsuit-against-11-paddle-companies-over-propulsion-core-technology': '/news/joola-files-patent-lawsuit-against-11-paddle-companies-over-propulsion-core-technology',
  'mlp-draft-2026-analysis-changed-tone-professional-pickleball': '/news/mlp-draft-2026-analysis-changed-tone-professional-pickleball',
  'pickleball-s-million-dollar-girl-the-numbers-behind-anna-leigh-waters-dominance-mnqkhrtr': '/news/pickleball-s-million-dollar-girl-the-numbers-behind-anna-leigh-waters-dominance',
  'pickleball-s-million-dollar-girl-the-numbers-behind-anna-leigh-waters-dominance': '/news/pickleball-s-million-dollar-girl-the-numbers-behind-anna-leigh-waters-dominance',
  'rising-pros-players-shaping-next-wave-professional-pickleball': '/news/rising-pros-players-shaping-next-wave-professional-pickleball',
  'staksrud-and-fahey-shine-at-the-ppa-sacramento-open-mo799adn': '/news/staksrud-and-fahey-shine-at-the-ppa-sacramento-open',
  'staksrud-and-fahey-shine-at-the-ppa-sacramento-open': '/news/staksrud-and-fahey-shine-at-the-ppa-sacramento-open',
  'the-awakening-of-a-giant-how-asia-is-transforming-pickleball': '/news/the-awakening-of-a-giant-how-asia-is-transforming-pickleball',
  'the-desert-delivered-drama-mnj5amzq': '/news/the-desert-delivered-drama',
  'the-desert-delivered-drama': '/news/the-desert-delivered-drama',
  'the-numbers-behind-the-pickleball-boom-mo4h4k3j': '/news/the-numbers-behind-the-pickleball-boom',
  'the-numbers-behind-the-pickleball-boom': '/news/the-numbers-behind-the-pickleball-boom',
  'us-open-pickleball-championships-confirmed-players-and-what-to-expect-this-year-mnswgo1t': '/news/us-open-pickleball-championships-confirmed-players-and-what-to-expect-this-year',
  'us-open-pickleball-championships-confirmed-players-and-what-to-expect-this-year': '/news/us-open-pickleball-championships-confirmed-players-and-what-to-expect-this-year',
  'watch-the-u-s-open-pickleball-finals-live-mo4mo8in': '/news/watch-the-u-s-open-pickleball-finals-live',
  'watch-the-u-s-open-pickleball-finals-live': '/news/watch-the-u-s-open-pickleball-finals-live',
  // === ENTHUSIASTS → /players/ ===
  'laura-smith-gym-discipline-pickleball-heart': '/players/laura-smith-gym-discipline-pickleball-heart',
  'meet-hoami-vu-energy-community-and-passion-for-pickleball-mnpzlif1': '/players/meet-hoami-vu-energy-community-and-passion-for-pickleball',
  'meet-hoami-vu-energy-community-and-passion-for-pickleball': '/players/meet-hoami-vu-energy-community-and-passion-for-pickleball',
  'nadia-cretzman-the-pickleball-socialite-who-found-purpose-in-every-dink-mnq6qi71': '/players/nadia-cretzman-the-pickleball-socialite-who-found-purpose-in-every-dink',
  'nadia-cretzman-the-pickleball-socialite-who-found-purpose-in-every-dink': '/players/nadia-cretzman-the-pickleball-socialite-who-found-purpose-in-every-dink',
  'smiley-riley-energy-passion-and-the-warmest-smile-on-court-mnq10fvn': '/players/smiley-riley-energy-passion-and-the-warmest-smile-on-court',
  'smiley-riley-energy-passion-and-the-warmest-smile-on-court': '/players/smiley-riley-energy-passion-and-the-warmest-smile-on-court',
  'sydney-steinaker-the-evolution-of-pickleball-with-style-humor-and-purpose-mnkq6hfi': '/players/sydney-steinaker-the-evolution-of-pickleball-with-style-humor-and-purpose',
  'sydney-steinaker-the-evolution-of-pickleball-with-style-humor-and-purpose': '/players/sydney-steinaker-the-evolution-of-pickleball-with-style-humor-and-purpose',
  'tina-marie-from-everyday-player-to-community-builder-mnkqpoke': '/players/tina-marie-from-everyday-player-to-community-builder',
  'tina-marie-from-everyday-player-to-community-builder': '/players/tina-marie-from-everyday-player-to-community-builder',
  'where-faith-meets-the-court-mnj9z2y8': '/players/where-faith-meets-the-court',
  'where-faith-meets-the-court': '/players/where-faith-meets-the-court',
  // === JUNIORS → /players/ ===
  'ella-yeh-the-rising-star-shaping-the-future-of-pickleball-mnkth5es': '/players/ella-yeh-the-rising-star-shaping-the-future-of-pickleball',
  'ella-yeh-the-rising-star-shaping-the-future-of-pickleball': '/players/ella-yeh-the-rising-star-shaping-the-future-of-pickleball',
  'grace-kosednar-the-joy-of-the-game-mnkvlwhl': '/players/grace-kosednar-the-joy-of-the-game',
  'grace-kosednar-the-joy-of-the-game': '/players/grace-kosednar-the-joy-of-the-game',
  'rex-thais-rising-star': '/players/rex-thais-rising-star',
  // === PRO-PLAYERS → /players/ ===
  'arianna-raga-rising-star-forging-her-path-in-pickleball-mnkr4kqe': '/players/arianna-raga-rising-star-forging-her-path-in-pickleball',
  'arianna-raga-rising-star-forging-her-path-in-pickleball': '/players/arianna-raga-rising-star-forging-her-path-in-pickleball',
  'ben-cawston-the-emerging-promise-of-global-pickleball-mnq8l503': '/players/ben-cawston-the-emerging-promise-of-global-pickleball',
  'ben-cawston-the-emerging-promise-of-global-pickleball': '/players/ben-cawston-the-emerging-promise-of-global-pickleball',
  'christa-gecheva-it-s-her-time-mnj3mjps': '/players/christa-gecheva-it-s-her-time',
  'christa-gecheva-it-s-her-time': '/players/christa-gecheva-it-s-her-time',
  'daria-walczak-her-journey-to-the-top-of-professional-pickleball-mnpzy8hw': '/players/daria-walczak-her-journey-to-the-top-of-professional-pickleball',
  'daria-walczak-her-journey-to-the-top-of-professional-pickleball': '/players/daria-walczak-her-journey-to-the-top-of-professional-pickleball',
  'dink-authority-top-10-asia-2026': '/players/dink-authority-top-10-asia-2026',
  'elena-rodino-building-the-future-of-the-game-mnj4kxpj': '/players/elena-rodino-building-the-future-of-the-game',
  'elena-rodino-building-the-future-of-the-game': '/players/elena-rodino-building-the-future-of-the-game',
  'from-zagreb-to-the-pro-pickleball-circuit-the-rise-of-domenika-turkovic-mnq0mk8h': '/players/from-zagreb-to-the-pro-pickleball-circuit-the-rise-of-domenika-turkovic',
  'from-zagreb-to-the-pro-pickleball-circuit-the-rise-of-domenika-turkovic': '/players/from-zagreb-to-the-pro-pickleball-circuit-the-rise-of-domenika-turkovic',
  'lara-giltinan-from-tennis-prodigy-to-rising-pickleball-star-mnq1kkoz': '/players/lara-giltinan-from-tennis-prodigy-to-rising-pickleball-star',
  'lara-giltinan-from-tennis-prodigy-to-rising-pickleball-star': '/players/lara-giltinan-from-tennis-prodigy-to-rising-pickleball-star',
  'lucy-kovalova-grace-precision-and-power-at-the-net-mnz4s6rd': '/players/lucy-kovalova-grace-precision-and-power-at-the-net',
  'lucy-kovalova-grace-precision-and-power-at-the-net': '/players/lucy-kovalova-grace-precision-and-power-at-the-net',
  'mariana-fortes-the-rising-star-with-competitive-fire-and-grounded-roots-mnpz709f': '/players/mariana-fortes-the-rising-star-with-competitive-fire-and-grounded-roots',
  'mariana-fortes-the-rising-star-with-competitive-fire-and-grounded-roots': '/players/mariana-fortes-the-rising-star-with-competitive-fire-and-grounded-roots',
  'marisa-ruiz-from-burnout-to-a-new-beginning-mnj5ji1b': '/players/marisa-ruiz-from-burnout-to-a-new-beginning',
  'marisa-ruiz-from-burnout-to-a-new-beginning': '/players/marisa-ruiz-from-burnout-to-a-new-beginning',
  'paula-rives-passion-precision-and-the-courage-to-compete-mnqixe5f': '/players/paula-rives-passion-precision-and-the-courage-to-compete',
  'paula-rives-passion-precision-and-the-courage-to-compete': '/players/paula-rives-passion-precision-and-the-courage-to-compete',
  'raquel-amaro-from-professional-tennis-to-the-heart-of-global-pickleball-mnq7sc7w': '/players/raquel-amaro-from-professional-tennis-to-the-heart-of-global-pickleball',
  'raquel-amaro-from-professional-tennis-to-the-heart-of-global-pickleball': '/players/raquel-amaro-from-professional-tennis-to-the-heart-of-global-pickleball',
  'rising-star-jessica-torres-mo35uxcx': '/players/rising-star-jessica-torres',
  'rising-star-jessica-torres': '/players/rising-star-jessica-torres',
  'seone-m-ndez-passion-precision-and-the-joy-of-the-game-mnkslk70': '/players/seone-mendez-passion-precision-and-the-joy-of-the-game',
  'seone-mendez-passion-precision-and-the-joy-of-the-game': '/players/seone-mendez-passion-precision-and-the-joy-of-the-game',
  'tea-peji-from-croatia-to-the-rise-of-pickleball-mnkubxkx': '/players/tea-pejic-from-croatia-to-the-rise-of-pickleball',
  'tea-pejic-from-croatia-to-the-rise-of-pickleball': '/players/tea-pejic-from-croatia-to-the-rise-of-pickleball',
  // === TIPS → /tips/ ===
  'court-lines-cardio-smart-drills-to-boost-endurance-and-agility-in-pickleball-mnq77w2r': '/tips/court-lines-cardio-smart-drills-to-boost-endurance-and-agility-in-pickleball',
  'court-lines-cardio-smart-drills-to-boost-endurance-and-agility-in-pickleball': '/tips/court-lines-cardio-smart-drills-to-boost-endurance-and-agility-in-pickleball',
  'dink-authority-tips-mastering-kitchen-line-reset-game': '/tips/dink-authority-tips-mastering-kitchen-line-reset-game',
  'domenika-turkovic-tips-three-micro-adjustments-win-more-points': '/tips/domenika-turkovic-tips-three-micro-adjustments-win-more-points',
  'domi-s-dinks-tricks-7-common-mistakes-that-can-ruin-your-pickleball-game-mnktye5i': '/tips/domi-s-dinks-tricks-7-common-mistakes-that-can-ruin-your-pickleball-game',
  'domi-s-dinks-tricks-7-common-mistakes-that-can-ruin-your-pickleball-game': '/tips/domi-s-dinks-tricks-7-common-mistakes-that-can-ruin-your-pickleball-game',
  'exercises-to-improve-reflexes-and-reaction-time-in-pickleball-mnq0a5aa': '/tips/exercises-to-improve-reflexes-and-reaction-time-in-pickleball',
  'exercises-to-improve-reflexes-and-reaction-time-in-pickleball': '/tips/exercises-to-improve-reflexes-and-reaction-time-in-pickleball',
  'kitchen-control-the-most-important-real-estate-in-pickleball-mnkb3gj2': '/tips/kitchen-control-the-most-important-real-estate-in-pickleball',
  'kitchen-control-the-most-important-real-estate-in-pickleball': '/tips/kitchen-control-the-most-important-real-estate-in-pickleball',
  'the-bridge-from-3-5-to-4-0-five-skills-turn-enthusiasts-into-competitors': '/tips/the-bridge-from-3-5-to-4-0-five-skills-turn-enthusiasts-into-competitors',
};

/** Category query param → new section path */
const CATEGORY_SECTION_REDIRECTS: Record<string, string> = {
  'news': '/news',
  'editorial': '/news?category=editorial',
  'events': '/news?category=events',
  'places': '/news?category=places',
  'pro-players': '/players?category=pro-players',
  'enthusiasts': '/players?category=enthusiasts',
  'juniors': '/players?category=juniors',
  'tips': '/tips',
};

/**
 * Magazine slug redirects: old slugs → new SEO-optimized slugs with "pickleball-magazine-issue"
 */
const MAGAZINE_SLUG_REDIRECTS: Record<string, string> = {
  'the-awakening-of-asia-pickleball-s-fastest-growing-frontier': 'march-2026-pickleball-magazine-issue-the-awakening-of-asia',
  'seone-m-ndez-passion-discipline-and-the-love-of-the-game': 'november-2025-pickleball-magazine-issue-seone-mendez',
  'paula-rives-power-precision-and-the-will-to-win': 'october-2025-pickleball-magazine-issue-paula-rives',
  'juan-m-benitez-in-august-edition-the-passion-behind-the-game': 'august-2025-pickleball-magazine-issue-juan-m-benitez',
  'the-competitors-driving-the-game-forward': 'july-2025-pickleball-magazine-issue-lucy-kovalova',
  'the-best-of-2025-according-to-our-readers': 'december-2025-pickleball-magazine-issue-best-of-2025-readers-choice',
  'dink-authority-magazine-april-2026': 'april-2026-pickleball-magazine-issue-christa-gecheva',
  'alex-crum-pickleball-s-competitive-momentum-june-edition-2025': 'june-2025-pickleball-magazine-issue-alex-crum',
  'megan-fudge-power-passion-and-the-competitive-spirit-of-pickleball': 'may-2025-pickleball-magazine-issue-megan-fudge',
  'lorena-duknic-performance-power-and-smart-play-april-2025-edition': 'april-2025-pickleball-magazine-issue-lorena-duknic',
  'glauka-carvajal-the-smile-of-a-rising-competitor': 'march-2025-pickleball-magazine-issue-glauka-carvajal',
  'dahlia-garza-power-passion-and-the-expanding-world-of-pickleball': 'february-2025-pickleball-magazine-issue-dahlia-garza',
  'susana-rojas-passion-power-and-play-on-the-court': 'december-2024-pickleball-magazine-issue-susana-rojas',
  'pickleball-is-conquering-the-world': 'january-2025-pickleball-magazine-issue-catalina-parenteau',
  'florida-the-paradise-of-pickleball': 'october-2024-pickleball-magazine-issue-florida-pickleball-paradise',
  'the-kings-of-naples-champions-take-center-stage-in-dink-authority-magazine-may-2026': 'may-2026-pickleball-magazine-issue-kings-of-naples',
  'los-reyes-de-naples-los-campeones-del-us-open-protagonizan-la-edici-n-de-mayo-de-dink-authority-magazine': 'may-2026-pickleball-magazine-issue-los-reyes-de-naples',
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 0. Redirect /magazine/[old-slug] → /magazine/[new-slug] (301)
  if (pathname.startsWith('/magazine/') && pathname !== '/magazine') {
    const slug = pathname.replace('/magazine/', '').replace(/\/$/, '');
    const newSlug = MAGAZINE_SLUG_REDIRECTS[slug];
    if (newSlug) {
      return NextResponse.redirect(new URL(`/magazine/${newSlug}`, request.url), 301);
    }
  }

  // 1. Redirect /articles/[slug] → new route (301)
  if (pathname.startsWith('/articles/')) {
    const slug = pathname.replace('/articles/', '').replace(/\/$/, '');
    const newPath = OLD_SLUG_REDIRECTS[slug];
    if (newPath) {
      return NextResponse.redirect(new URL(newPath, request.url), 301);
    }
    // Unknown slug: let the /articles/[slug]/page.tsx handler do a DB lookup and redirect
    return NextResponse.next();
  }

  // 2. Redirect /articles listing page → appropriate section
  if (pathname === '/articles') {
    const category = searchParams.get('category');
    if (category && CATEGORY_SECTION_REDIRECTS[category]) {
      return NextResponse.redirect(new URL(CATEGORY_SECTION_REDIRECTS[category], request.url), 301);
    }
    // Default: /articles → /news
    const q = searchParams.get('q');
    if (q) {
      return NextResponse.redirect(new URL(`/news?q=${encodeURIComponent(q)}`, request.url), 301);
    }
    return NextResponse.redirect(new URL('/news', request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/articles/:path*', '/articles', '/magazine/:path*'],
};
