import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, slug, category, price, shortDescription, fullDescription, images, stripePaymentLink, buttonLabel, isActive, isFeatured, inventoryStatus } = body;

    // Check slug uniqueness if changed
    if (slug) {
      const existing = await prisma.product.findFirst({
        where: { slug, NOT: { id: params.id } },
      });
      if (existing) {
        return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 400 });
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price: parseFloat(price) || 0 }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(fullDescription !== undefined && { fullDescription }),
        ...(images !== undefined && { images }),
        ...(stripePaymentLink !== undefined && { stripePaymentLink }),
        ...(buttonLabel !== undefined && { buttonLabel }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(inventoryStatus !== undefined && { inventoryStatus }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
