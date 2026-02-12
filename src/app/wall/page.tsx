import Link from 'next/link';
import WisdomWall from '@/components/WisdomWall';
import { Submission, SortOption } from '@/types/submission';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

interface PageProps {
  searchParams: Promise<{ sort?: string; highlight?: string }>;
}

export default async function WallPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = (params.sort || 'top') as SortOption;
  const highlightId = params.highlight;

  const orderBy =
    sort === 'latest'
      ? { createdAt: 'desc' as const }
      : { votes: 'desc' as const };

  const submissions = await prisma.submission.findMany({
    orderBy,
  }) as Submission[];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-left md:text-center mb-8 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wisdom Wall</h1>
          <p className="text-lg text-gray-600 mb-4">
            Insights and advice from our community
          </p>
          <Link href="/" className="block">
            <Button className="w-full bg-gray-900 hover:bg-gray-800" size="lg">
              Share Your Wisdom
            </Button>
          </Link>
        </header>

        <WisdomWall initialSubmissions={submissions} initialSort={sort} highlightId={highlightId} />
      </div>
    </div>
  );
}
