import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    const where: any = {};
    if (activeOnly === 'true') where.isActive = true;
    if (featured === 'true') where.isFeatured = true;
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, slug, category, price, shortDescription, fullDescription, images, stripePaymentLink, buttonLabel, isActive, isFeatured, inventoryStatus } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category: category || 'merchandise',
        price: parseFloat(price) || 0,
        shortDescription: shortDescription || null,
        fullDescription: fullDescription || null,
        images: images || [],
        stripePaymentLink: stripePaymentLink || null,
        buttonLabel: buttonLabel || 'Buy Now',
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        inventoryStatus: inventoryStatus || 'in_stock',
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
