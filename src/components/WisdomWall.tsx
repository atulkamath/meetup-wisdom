import { Submission, SortOption } from '@/types/submission';
import SortToggle from './SortToggle';
import SubmissionCard from './SubmissionCard';

interface WisdomWallProps {
  initialSubmissions: Submission[];
  initialSort: SortOption;
  highlightId?: string;
}

// Server Component - no 'use client'
export default function WisdomWall({ initialSubmissions, initialSort, highlightId }: WisdomWallProps) {
  return (
    <div>
      <div className="mb-6 flex justify-center">
        <SortToggle currentSort={initialSort} />
      </div>

      {initialSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No wisdom shared yet. Be the first to contribute!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              isHighlighted={submission.id === highlightId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
