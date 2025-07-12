'use client';


import React from 'react';

interface CasinoLayoutProps {
  children: React.ReactNode;
}

export default function CasinoLayout({ children }: CasinoLayoutProps) {
  return (
    <div className="casino-layout">
      <div className="w-full flex items-center justify-center" style={{ minHeight: 120 }}>
        {/* Banner Google AdSense centrado */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8330194041691289" crossOrigin="anonymous"></script>
          <ins className="adsbygoogle"
            style={{ display: 'inline-block', width: 728, height: 90 }}
            data-ad-client="ca-pub-8330194041691289"
            data-ad-slot="9912099670"></ins>
          <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
        </div>
      </div>
      <main className="casino-main">
        {children}
      </main>
    </div>
  );
}
