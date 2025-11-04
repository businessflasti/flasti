"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showOnPages?: string[];
}

class StickyBannerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StickyBanner Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fail silently, don't show anything
    }

    return this.props.children;
  }
}

export const StickyBanner: React.FC<StickyBannerProps> = ({
  children,
  className,
  style,
  showOnPages = ['/']
}) => {

  try {
    return (
      <StickyBannerErrorBoundary>
        <div
          className={cn(
            "relative w-full px-2 py-1.5 sm:px-4 sm:py-2 text-center",
            className
          )}
          style={style}
        >
          <div className="mx-auto max-w-[95%] sm:max-w-[90%]">
            {children}
          </div>
        </div>
      </StickyBannerErrorBoundary>
    );
  } catch (error) {
    console.error('StickyBanner render error:', error);
    return null; // Fail silently
  }
};

export default StickyBanner;