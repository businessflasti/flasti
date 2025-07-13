'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        success: {
          style: {
            background: 'var(--success)',
            color: 'var(--success-foreground)',
          },
        },
        error: {
          style: {
            background: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
          },
        },
      }}
    />
  );
}
