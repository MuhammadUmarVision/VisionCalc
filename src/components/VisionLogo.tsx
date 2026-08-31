import React from 'react';

interface VisionLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const VisionLogo: React.FC<VisionLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: { box: 'w-7 h-7', svg: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', svg: 36, text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', svg: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', svg: 64, text: 'text-3xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon combining Eye / Iris with Integral / Math geometry */}
      <div
        className={`relative ${iconDimensions.box} rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-0.5 shadow-md flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105`}
        title="VisionCalc - Vision + Mathematics"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Subtle glow background */}
          <circle cx="24" cy="24" r="16" fill="#4F46E5" fillOpacity="0.3" />
          
          {/* Eye Contour - mathematical lens curves */}
          <path
            d="M 6 24 C 12 13, 36 13, 42 24 C 36 35, 12 35, 6 24 Z"
            stroke="white"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Inner Iris ring */}
          <circle
            cx="24"
            cy="24"
            r="8.5"
            stroke="#A78BFA"
            strokeWidth="2"
            strokeDasharray="2 1.5"
          />

          {/* Mathematical Integral symbol interwoven in the pupil */}
          <path
            d="M 27 18 C 26 16.5, 23.5 16.5, 23 18.5 L 21 29.5 C 20.5 31.5, 22.5 31.8, 25 30.5"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Focal Math Point */}
          <circle cx="24" cy="24" r="2.2" fill="white" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-extrabold tracking-tight ${iconDimensions.text} text-slate-900 dark:text-white flex items-center`}>
            <span>Vision</span>
            <span className="text-blue-600 dark:text-blue-400">Calc</span>
          </div>
          <span className={`font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase ${iconDimensions.sub} mt-0.5`}>
            Math Studio
          </span>
        </div>
      )}
    </div>
  );
};
