import React, { useState } from 'react';

interface PixelImageProps {
  src: string;
  alt: string;
  className?: string; // custom classes for the <img> tag
  containerClassName?: string; // custom classes for the wrapping div
  itemType: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'portal';
  rank?: string;
  zoomOnHover?: boolean;
}

export const PixelImage: React.FC<PixelImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  itemType,
  rank = 'E',
  zoomOnHover = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Rank-based retro color scheme
  const getRankColor = (r: string) => {
    switch (r.toUpperCase()) {
      case 'S': return { text: '#ef4444', bg: 'bg-red-950/80', border: 'border-red-500', glow: 'shadow-[0_0_10px_#ef4444]' };
      case 'A': return { text: '#f97316', bg: 'bg-orange-950/80', border: 'border-orange-500', glow: 'shadow-[0_0_10px_#f97316]' };
      case 'B': return { text: '#a855f7', bg: 'bg-purple-950/80', border: 'border-purple-500', glow: 'shadow-[0_0_10px_#a855f7]' };
      case 'C': return { text: '#3b82f6', bg: 'bg-blue-950/80', border: 'border-blue-500', glow: 'shadow-[0_0_10px_#3b82f6]' };
      case 'D': return { text: '#10b981', bg: 'bg-emerald-950/80', border: 'border-emerald-500', glow: 'shadow-[0_0_10px_#10b981]' };
      case 'E':
      default:
        return { text: '#94a3b8', bg: 'bg-slate-900/80', border: 'border-slate-500', glow: 'shadow-[0_0_10px_#94a3b8]' };
    }
  };

  const colors = getRankColor(rank);

  // Render a beautifully styled pixel-art CSS/SVG replacement when image fails or is empty
  const renderFallback = () => {
    switch (itemType) {
      case 'portal':
        return (
          <div className={`w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-black border-4 ${colors.border} p-1 text-center font-mono ${colors.glow}`}>
            {/* Pulsing energetic portal vortex */}
            <div className={`absolute inset-2 border-4 border-dashed rounded-full ${colors.border} animate-spin`} style={{ animationDuration: '12s' }}></div>
            <div className={`absolute inset-4 border-4 border-dotted rounded-full ${colors.border} animate-spin`} style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            <div className={`absolute w-8 h-8 rounded-full bg-black border-4 ${colors.border} flex items-center justify-center animate-pulse`}>
              <span className="text-xs font-black" style={{ color: colors.text }}>{rank}</span>
            </div>
            {/* Portal Energy Ripples */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between p-2 pointer-events-none opacity-40">
              <span className="text-[7px]" style={{ color: colors.text }}>GATE</span>
              <span className="text-[7px]" style={{ color: colors.text }}>PORTAL</span>
            </div>
          </div>
        );

      case 'weapon':
        return (
          <div className={`w-full h-full flex flex-col justify-center items-center relative overflow-hidden ${colors.bg} border-2 ${colors.border} p-1 text-center font-mono`}>
            {/* Swords silhouette pattern */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className="animate-pulse" style={{ imageRendering: 'pixelated' }}>
              <path d="M18 14l-6 6M11 9l-4 4M21 3L11 13" />
              <path d="M3 21l3-3M6 18H3v-3" />
            </svg>
            <span className="text-[8px] font-black absolute bottom-0.5 right-1" style={{ color: colors.text }}>{rank}</span>
          </div>
        );

      case 'armor':
        return (
          <div className={`w-full h-full flex flex-col justify-center items-center relative overflow-hidden ${colors.bg} border-2 ${colors.border} p-1 text-center font-mono`}>
            {/* Shield pattern */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className="animate-pulse" style={{ imageRendering: 'pixelated' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[8px] font-black absolute bottom-0.5 right-1" style={{ color: colors.text }}>{rank}</span>
          </div>
        );

      case 'accessory':
        return (
          <div className={`w-full h-full flex flex-col justify-center items-center relative overflow-hidden ${colors.bg} border-2 ${colors.border} p-1 text-center font-mono`}>
            {/* Jewel ring pattern */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className="animate-pulse" style={{ imageRendering: 'pixelated' }}>
              <circle cx="12" cy="14" r="6" />
              <path d="M12 2l4 4-4 4-4-4z" />
            </svg>
            <span className="text-[8px] font-black absolute bottom-0.5 right-1" style={{ color: colors.text }}>{rank}</span>
          </div>
        );

      case 'consumable':
        return (
          <div className={`w-full h-full flex flex-col justify-center items-center relative overflow-hidden ${colors.bg} border-2 ${colors.border} p-1 text-center font-mono`}>
            {/* Potion Pattern */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className="animate-pulse" style={{ imageRendering: 'pixelated' }}>
              <path d="M10 2h4M12 2v6M8 8h8M6 21h12M6 21C6 13.8 8.4 11 12 11s6 2.8 6 10" />
            </svg>
            <span className="text-[8px] font-black absolute bottom-0.5 right-1" style={{ color: colors.text }}>{rank}</span>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#222] border-2 border-gray-600 font-mono text-[9px] text-gray-500">
            ITEM
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {src && !error && (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className={`w-full h-full object-contain pixelated relative z-0 transition-transform duration-200
            ${zoomOnHover ? 'group-hover:scale-125' : ''}
            ${className}`}
          style={{ imageRendering: 'pixelated' }}
        />
      )}
      {(!src || error) && renderFallback()}
    </div>
  );
};
