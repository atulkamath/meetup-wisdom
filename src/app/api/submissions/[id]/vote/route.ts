import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment votes atomically
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error voting on submission:', error);
    return NextResponse.json(
      { error: 'Failed to vote on submission' },
      { status: 500 }
    );
  }
}
