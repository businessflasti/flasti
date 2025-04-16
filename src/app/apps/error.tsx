'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-xl p-6 space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gradient">Something went wrong</h2>
          <p className="text-muted-foreground">
            Sorry, there was an error loading the apps.
          </p>
          <Button
            onClick={reset}
            className="glow-effect mt-4"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}