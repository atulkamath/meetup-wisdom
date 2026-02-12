import SubmissionForm from '@/components/SubmissionForm';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-left md:text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Meetup Wisdom Board</h1>
          <p className="text-lg text-muted-foreground mb-3">
            Share your professional insights and advice for the next generation of coders.
          </p>
          <div className="flex items-center justify-start md:justify-center gap-2 text-sm text-gray-500 mb-6">
            <span>built by</span>
            <a
              href="https://www.linkedin.com/in/atul-kamath/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Atul Kamath
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <Link href="/wall" className="block">
            <Button className="w-full bg-gray-900 hover:bg-gray-800" size="lg">
              View what others have said
            </Button>
          </Link>
        </header>

        <Card>
          <CardContent className="pt-6">
            <SubmissionForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
