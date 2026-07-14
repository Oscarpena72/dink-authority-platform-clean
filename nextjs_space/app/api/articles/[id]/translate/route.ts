export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { isAtLeast } from '@/lib/roles';
import { translateArticleFields, type TranslatableLocale } from '@/lib/llm-translate';

const VALID_LOCALES: TranslatableLocale[] = ['es', 'pt'];

function sanitizeSlug(input: string): string {
  return (input ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * POST /api/articles/[id]/translate
 * Duplicates a source (English) article into a NEW locale-specific Article row.
 * Body: { locale: 'es' | 'pt', autoTranslate?: boolean }
 *
 * - Links the copy to the source via `translationOf` (points to the English original).
 * - If a translation for this source+locale already exists, returns it instead of
 *   creating a duplicate (idempotent — one translation per language).
 * - New article is always created as a DRAFT so the admin can review before publishing.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAtLeast((session.user as any)?.role, 'editor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const locale = body?.locale as TranslatableLocale;
    const autoTranslate = body?.autoTranslate !== false; // default true

    if (!VALID_LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale. Use "es" or "pt".' }, { status: 400 });
    }

    const source = await prisma.article.findUnique({ where: { id: params?.id ?? '' } });
    if (!source) return NextResponse.json({ error: 'Source article not found' }, { status: 404 });

    // The canonical original is always the English source. If someone triggers this
    // from an already-translated article, resolve back to its base.
    const baseId = source.translationOf ?? source.id;

    // Idempotency: one translation per (base, locale).
    const existingTranslation = await prisma.article.findFirst({
      where: { translationOf: baseId, locale },
    });
    if (existingTranslation) {
      return NextResponse.json({
        id: existingTranslation.id,
        slug: existingTranslation.slug,
        existing: true,
      });
    }

    // Build a unique slug: <source-slug>-<locale>, with fallback suffix if taken.
    let slug = sanitizeSlug(`${source.slug}-${locale}`);
    if (!slug) slug = sanitizeSlug(`${source.title}-${locale}`) || `article-${locale}`;
    const slugTaken = await prisma.article.findUnique({ where: { slug } });
    if (slugTaken) slug = `${slug}-${Date.now().toString(36)}`;

    // Translate the core fields (or copy English verbatim if autoTranslate is false).
    const translated = autoTranslate
      ? await translateArticleFields(
          {
            title: source.title,
            excerpt: source.excerpt,
            content: source.content,
            metaTitle: source.metaTitle,
            metaDescription: source.metaDescription,
            ogTitle: source.ogTitle,
            ogDescription: source.ogDescription,
          },
          locale,
        )
      : {
          title: source.title,
          excerpt: source.excerpt ?? '',
          content: source.content,
          metaTitle: source.metaTitle ?? '',
          metaDescription: source.metaDescription ?? '',
          ogTitle: source.ogTitle ?? '',
          ogDescription: source.ogDescription ?? '',
        };

    const created = await prisma.article.create({
      data: {
        title: translated.title || source.title,
        slug,
        content: translated.content || source.content,
        excerpt: translated.excerpt || null,
        locale,
        translationOf: baseId,
        // Copy media / layout as-is (images are language-neutral)
        imageUrl: source.imageUrl,
        focalPointX: source.focalPointX,
        focalPointY: source.focalPointY,
        category: source.category,
        // Always start as draft, never inherit hero/featured flags
        status: 'draft',
        isFeatured: false,
        isHeroStory: false,
        authorId: (session.user as any)?.id ?? source.authorId ?? null,
        authorName: source.authorName,
        videoUrl: source.videoUrl,
        videoPosterImage: source.videoPosterImage,
        galleryImages: source.galleryImages,
        socialMediaLink: source.socialMediaLink,
        banner1Image: source.banner1Image,
        banner1Link: source.banner1Link,
        banner2Image: source.banner2Image,
        banner2Link: source.banner2Link,
        banner3Image: source.banner3Image,
        banner3Link: source.banner3Link,
        metaTitle: translated.metaTitle || null,
        metaDescription: translated.metaDescription || null,
        ogTitle: translated.ogTitle || null,
        ogDescription: translated.ogDescription || null,
        noindex: source.noindex,
        focusKeyword: source.focusKeyword,
        secondaryKeywords: source.secondaryKeywords,
        publishedAt: null,
      },
    });

    return NextResponse.json({ id: created.id, slug: created.slug, existing: false });
  } catch (error: any) {
    console.error('[POST /api/articles/[id]/translate] Error:', error?.message, error?.code);
    return NextResponse.json({ error: `Failed to create translation: ${error?.message ?? 'unknown'}` }, { status: 500 });
  }
}
