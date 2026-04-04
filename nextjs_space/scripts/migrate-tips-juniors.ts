/**
 * Migration script: Convert existing Tips and Juniors into Articles.
 * Run with: npx tsx scripts/migrate-tips-juniors.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Migrate Tips → Articles (category: 'tips')
  const tips = await prisma.tip.findMany({ include: { author: true } });
  console.log(`Found ${tips.length} tips to migrate`);
  for (const tip of tips) {
    const existingArticle = await prisma.article.findFirst({ where: { slug: tip.slug } });
    if (existingArticle) {
      console.log(`  SKIP tip "${tip.title}" — slug already exists in Articles`);
      continue;
    }
    await prisma.article.create({
      data: {
        title: tip.title,
        slug: tip.slug,
        content: tip.content,
        excerpt: tip.excerpt,
        imageUrl: tip.featuredImage,
        category: 'tips',
        status: tip.status,
        authorName: tip.authorName || tip.author?.name || null,
        videoUrl: tip.videoUrl || tip.youtubeUrl || null,
        videoPosterImage: tip.videoPosterImage,
        galleryImages: tip.galleryImages || '[]',
        banner1Image: tip.banner1Image,
        banner1Link: tip.banner1Link,
        banner2Image: tip.banner2Image,
        banner2Link: tip.banner2Link,
        banner3Image: tip.banner3Image,
        banner3Link: tip.banner3Link,
        metaTitle: tip.metaTitle,
        metaDescription: tip.metaDescription,
        publishedAt: tip.publishDate || tip.createdAt,
        createdAt: tip.createdAt,
      },
    });
    console.log(`  MIGRATED tip "${tip.title}"`);
  }

  // Migrate Juniors → Articles (category: 'juniors')
  const juniors = await prisma.junior.findMany();
  console.log(`Found ${juniors.length} juniors to migrate`);
  for (const jr of juniors) {
    const existingArticle = await prisma.article.findFirst({ where: { slug: jr.slug } });
    if (existingArticle) {
      console.log(`  SKIP junior "${jr.title}" — slug already exists in Articles`);
      continue;
    }
    await prisma.article.create({
      data: {
        title: jr.title,
        slug: jr.slug,
        content: jr.content,
        excerpt: jr.excerpt,
        imageUrl: jr.featuredImage,
        category: 'juniors',
        status: jr.status,
        authorName: jr.name || null,
        videoUrl: jr.videoUrl || jr.instagramVideoUrl || null,
        videoPosterImage: jr.videoPosterImage,
        galleryImages: jr.galleryImages || '[]',
        banner2Image: jr.banner2Image,
        banner2Link: jr.banner2Link,
        banner3Image: jr.banner3Image,
        banner3Link: jr.banner3Link,
        metaTitle: jr.metaTitle,
        metaDescription: jr.metaDescription,
        publishedAt: jr.publishDate || jr.createdAt,
        createdAt: jr.createdAt,
      },
    });
    console.log(`  MIGRATED junior "${jr.title}"`);
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
