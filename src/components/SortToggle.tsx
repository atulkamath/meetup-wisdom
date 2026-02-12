'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SortOption } from '@/types/submission';
import { Button } from '@/components/ui/button';

interface SortToggleProps {
  currentSort: SortOption;
}

export default function SortToggle({ currentSort }: SortToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSort = (sort: SortOption) => {
    startTransition(() => {
      router.push(`/wall?sort=${sort}`);
    });
  };

  return (
    <div className="inline-flex gap-2 p-1 bg-muted rounded-lg">
      <Button
        onClick={() => handleSort('top')}
        variant={currentSort === 'top' ? 'default' : 'ghost'}
        size="sm"
        disabled={isPending}
      >
        Top Voted
      </Button>
      <Button
        onClick={() => handleSort('latest')}
        variant={currentSort === 'latest' ? 'default' : 'ghost'}
        size="sm"
        disabled={isPending}
      >
        Latest
      </Button>
    </div>
  );
}
