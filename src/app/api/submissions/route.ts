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

    // Validate hiring trait is maximum 3 words
    const wordCount = trimmedHiringTrait.split(/\s+/).length;
    if (wordCount > 3) {
      return NextResponse.json(
        { error: 'Hiring trait must be maximum 3 words' },
        { status: 400 }
      );
    }

    // Random color selection
    const colors = ['red', 'green', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        name: trimmedName,
        role: trimmedRole,
        advice: trimmedAdvice,
        hiringTrait: trimmedHiringTrait,
        color: randomColor,
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
