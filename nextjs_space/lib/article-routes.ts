/**
 * Maps article categories to their route prefixes for the new SEO-friendly URL structure.
 * 
 * Route mapping:
 *   news, editorial, events, places → /news/
 *   pro-players, enthusiasts, juniors → /players/
 *   tips → /tips/
 *   magazine → /magazine/
 */

const CATEGORY_TO_PREFIX: Record<string, string> = {
  news: 'news',
  editorial: 'news',
  events: 'news',
  places: 'news',
  'pro-players': 'players',
  enthusiasts: 'players',
  juniors: 'players',
  tips: 'tips',
};

/** Get route prefix for a category (e.g. 'pro-players' → 'players') */
export function getCategoryPrefix(category: string): string {
  return CATEGORY_TO_PREFIX[category] || 'news';
}

/** Get full article URL path (e.g. '/players/anna-smith-story') */
export function getArticlePath(slug: string, category: string): string {
  return `/${getCategoryPrefix(category)}/${slug}`;
}

/** Get listing page path for a category section */
export function getSectionPath(category: string): string {
  const prefix = getCategoryPrefix(category);
  return `/${prefix}`;
}

/**
 * Returns the URL prefix for a locale.
 * English (default) has no prefix; es/pt get '/es' or '/pt'.
 * e.g. localePrefix('es') → '/es', localePrefix('en') → ''
 */
export function localePrefix(locale?: string): string {
  return locale && locale !== 'en' ? `/${locale}` : '';
}

/** Locale-aware article path (e.g. es + pro-players → '/es/players/slug') */
export function getLocaleArticlePath(slug: string, category: string, locale?: string): string {
  return `${localePrefix(locale)}/${getCategoryPrefix(category)}/${slug}`;
}

/** Locale-aware section listing path (e.g. es + tips → '/es/tips') */
export function getLocaleSectionPath(category: string, locale?: string): string {
  return `${localePrefix(locale)}/${getCategoryPrefix(category)}`;
}

/** Categories that belong to each route section */
export const SECTION_CATEGORIES: Record<string, string[]> = {
  news: ['news', 'editorial', 'events', 'places'],
  players: ['pro-players', 'enthusiasts', 'juniors'],
  tips: ['tips'],
};
