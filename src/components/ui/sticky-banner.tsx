"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
  showOnPages?: string[];
  onClose?: () => void;
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
  showOnPages = ['/'],
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  try {
    return (
      <StickyBannerErrorBoundary>
        <div
          className={cn(
            "relative w-full px-2 py-2 sm:px-4 sm:py-3 text-center",
            className
          )}
        >
          <div className="mx-auto max-w-[95%] sm:max-w-[90%] relative">
            {children}
            <button
              onClick={handleClose}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              aria-label="Cerrar banner"
            >
              <X size={18} />
            </button>
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