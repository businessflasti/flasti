'use client';


import React from 'react';

interface CasinoLayoutProps {
  children: React.ReactNode;
}

export default function CasinoLayout({ children }: CasinoLayoutProps) {
  return (
    <div className="casino-layout">
      <main className="casino-main">
        {children}
      </main>
    </div>
  );
}
