"use client";

import React, { useState } from 'react';
import StakeHeader from './StakeHeader';
import StakeSidebar from './StakeSidebar';

interface StakeLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  transparentHeader?: boolean;
}

export default function StakeLayout({
  children,
  showSidebar = true,
  transparentHeader = false,
}: StakeLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen stake-bg-primary">
      {/* Header */}
      <StakeHeader
        transparent={transparentHeader}
        fixed={true}
        onMenuToggle={handleMenuToggle}
      />

      {/* Main Content Area */}
      <div className="flex pt-16">
        {/* Sidebar */}
        {showSidebar && (
          <StakeSidebar
            isOpen={isMobileMenuOpen}
            onClose={handleMenuClose}
          />
        )}

        {/* Main Content */}
        <main
          className={`
            flex-1 min-h-[calc(100vh-4rem)]
            transition-all duration-stake-normal
            ${showSidebar ? 'lg:ml-64' : ''}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
