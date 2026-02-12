'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Submission } from '@/types/submission';
import { useRelativeTime } from '@/utils/formatRelativeTime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SubmissionCardProps {
  submission: Submission;
  isHighlighted?: boolean;
}

export default function SubmissionCard({ submission, isHighlighted }: SubmissionCardProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(submission.votes);
  const relativeTime = useRelativeTime(new Date(submission.createdAt));
  const { toast } = useToast();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // Get color classes based on submission color
  const getColorClasses = () => {
    const color = submission.color || 'red';
    switch (color) {
      case 'green':
        return {
          border: 'border-green-600',
          header: 'bg-green-600',
          footer: 'bg-green-600',
          text: 'text-green-600',
        };
      case 'blue':
        return {
          border: 'border-blue-600',
          header: 'bg-blue-600',
          footer: 'bg-blue-600',
          text: 'text-blue-600',
        };
      default: // red
        return {
          border: 'border-red-600',
          header: 'bg-red-600',
          footer: 'bg-red-600',
          text: 'text-red-600',
        };
    }
  };

  const colorClasses = getColorClasses();

  useEffect(() => {
    const voted = localStorage.getItem(`voted_${submission.id}`);
    if (voted === 'true') {
      setHasVoted(true);
    }
  }, [submission.id]);

  // Scroll to highlighted card
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [isHighlighted]);

  const handleVote = async () => {
    if (hasVoted || isVoting) return;

    setIsVoting(true);
    const previousVotes = localVotes;

    // Optimistic update
    setLocalVotes((prev) => prev + 1);
    setHasVoted(true);
    localStorage.setItem(`voted_${submission.id}`, 'true');

    try {
      const response = await fetch(`/api/submissions/${submission.id}/vote`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      // Refresh server component data
      router.refresh();
    } catch (error) {
      // Rollback optimistic update
      setLocalVotes(previousVotes);
      setHasVoted(false);
      localStorage.removeItem(`voted_${submission.id}`);
      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`flex flex-col h-full rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 ${colorClasses.border} bg-white shadow-lg`}
    >
      {/* "HELLO MY NAME IS" Header */}
      <div className={`${colorClasses.header} px-4 py-2 md:px-6 md:py-3 text-center`}>
        <p className="text-white text-lg md:text-2xl font-black tracking-wider">HELLO</p>
        <p className="text-white text-xs md:text-sm font-bold tracking-wide">MY NAME IS</p>
      </div>

      {/* White Content Section */}
      <div className="flex-1 bg-white px-4 py-4 md:px-6 md:py-6 space-y-4 md:space-y-5">
        {/* Name Section - Big, centered, takes 2-3 lines */}
        <div className="min-h-[80px] md:min-h-[120px] flex flex-col items-center justify-center py-4">
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight text-center">
            {submission.name}
          </h3>
          <p className="text-base md:text-xl text-gray-600 text-center mt-0.5 md:mt-1">
            {submission.role}
          </p>
        </div>

        {/* Quote */}
        <blockquote className="pt-2">
          <p className="text-sm md:text-base text-gray-800 italic leading-relaxed">
            "{submission.advice}"
          </p>
        </blockquote>

        {/* Ownership / Hiring Trait */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Would hire for:</p>
          <p className={`text-lg md:text-xl font-bold ${colorClasses.text}`}>{submission.hiringTrait}</p>
        </div>
      </div>

      {/* Footer - Voting */}
      <div className={`flex items-center justify-between ${colorClasses.footer} px-4 py-2 md:px-6 md:py-3`}>
        <Button
          onClick={handleVote}
          disabled={hasVoted || isVoting}
          variant="outline"
          size="sm"
          className={
            hasVoted
              ? `bg-white ${colorClasses.text} border-white font-bold text-xs md:text-sm cursor-not-allowed`
              : `bg-white ${colorClasses.text} hover:bg-gray-100 border-white font-bold text-xs md:text-sm`
          }
        >
          {isVoting ? (
            '⏳ Voting...'
          ) : hasVoted ? (
            '✓ Voted'
          ) : (
            '↑ Upvote'
          )}
        </Button>

        <div className="flex items-center gap-2 md:gap-3 text-white">
          <span className="text-xs md:text-sm font-bold">
            {localVotes} {localVotes === 1 ? 'vote' : 'votes'}
          </span>
          <span className="text-[10px] md:text-xs opacity-90">{relativeTime}</span>
        </div>
      </div>
    </div>
  );
}
