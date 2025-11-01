'use client';

import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

export default function SeasonalGarland() {
  const { activeTheme } = useSeasonalTheme();

  if (activeTheme === 'default') return null;

  return (
    <>
      {/* Guirnalda de Halloween */}
      {activeTheme === 'halloween' && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          {/* Desktop */}
          <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path
              d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10"
              stroke="#2a2a2a"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            {[...Array(25)].map((_, i) => {
              const x = (i * 48) + 24;
              const y = 10 + Math.sin(i * 0.5) * 8;
              const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#2a2a2a" strokeWidth="1" opacity="0.5" />
                  <ellipse cx={x} cy={y + 20} rx="4" ry="6" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 1} cy={y + 18} rx="1.5" ry="2" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
          {/* Mobile */}
          <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
            <path d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8" stroke="#2a2a2a" strokeWidth="1.5" fill="none" opacity="0.6" />
            {[...Array(10)].map((_, i) => {
              const x = (i * 40) + 20;
              const y = 8 + Math.sin(i * 0.5) * 5;
              const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-mobile-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#2a2a2a" strokeWidth="0.8" opacity="0.5" />
                  <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 0.8} cy={y + 12} rx="1" ry="1.5" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Guirnalda de Navidad */}
      {activeTheme === 'christmas' && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          {/* Desktop */}
          <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path
              d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10"
              stroke="#2a2a2a"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            {[...Array(25)].map((_, i) => {
              const x = (i * 48) + 24;
              const y = 10 + Math.sin(i * 0.5) * 8;
              const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#2a2a2a" strokeWidth="1" opacity="0.5" />
                  <ellipse cx={x} cy={y + 20} rx="4" ry="6" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 1} cy={y + 18} rx="1.5" ry="2" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
          {/* Mobile */}
          <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
            <path d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8" stroke="#2a2a2a" strokeWidth="1.5" fill="none" opacity="0.6" />
            {[...Array(10)].map((_, i) => {
              const x = (i * 40) + 20;
              const y = 8 + Math.sin(i * 0.5) * 5;
              const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-mobile-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#2a2a2a" strokeWidth="0.8" opacity="0.5" />
                  <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 0.8} cy={y + 12} rx="1" ry="1.5" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </>
  );
}
