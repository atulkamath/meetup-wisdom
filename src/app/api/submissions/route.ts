import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, advice, hiringTrait, consent } = body;

    // Validate required fields
    if (!name || !role || !advice || !hiringTrait || !consent) {
      return NextResponse.json(
        { error: 'All fields are required and consent must be given' },
        { status: 400 }
      );
    }

    // Trim inputs
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedAdvice = advice.trim();
    const trimmedHiringTrait = hiringTrait.trim();

    // Validate character limits
    if (trimmedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (trimmedRole.length > 150) {
      return NextResponse.json(
        { error: 'Role must be 150 characters or less' },
        { status: 400 }
      );
    }

    if (trimmedAdvice.length > 300) {
      return NextResponse.json(
        { error: 'Advice must be 300 characters or less' },
        { status: 400 }
      );
    }

    if (trimmedHiringTrait.length > 30) {
      return NextResponse.json(
        { error: 'Hiring trait must be 30 characters or less' },
        { status: 400 }
      );
    }

    // Validate hiring trait is one word (no spaces)
    if (trimmedHiringTrait.includes(' ')) {
      return NextResponse.json(
        { error: 'Hiring trait must be exactly one word with no spaces' },
        { status: 400 }
      );
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        name: trimmedName,
        role: trimmedRole,
        advice: trimmedAdvice,
        hiringTrait: trimmedHiringTrait,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'top';

    const orderBy =
      sort === 'latest'
        ? { createdAt: 'desc' as const }
        : { votes: 'desc' as const };

    const submissions = await prisma.submission.findMany({
      orderBy,
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
