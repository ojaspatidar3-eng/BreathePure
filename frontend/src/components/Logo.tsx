import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const textClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5 group">
      {/* Elegant Airflow + Leaf Hybrid Icon */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-forest-500 shadow-md shadow-emerald-900/20 text-white`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 drop-shadow-sm"
        >
          {/* Airflow waves flowing into an organic leaf */}
          <path
            d="M3 8C6 8 8 6 12 6C16 6 18 8 21 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />
          <path
            d="M3 12C6.5 12 8.5 10 13 10C17.5 10 19.5 12 21 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Botanical leaf contour embracing clean air */}
          <path
            d="M6 18C8 18 10 16 14 16C18.5 16 21 13 21 13C21 13 20 18 16 20C12 22 8 20 6 18Z"
            fill="currentColor"
            className="text-mint-300"
          />
          <path
            d="M10 17.5L15 15.5"
            stroke="#064e3b"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold tracking-tight text-slate-900 ${textClass}`}>
            Breathe<span className="text-emerald-600 font-extrabold">Pure</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mb-1"></span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide uppercase text-emerald-800/80 -mt-0.5">
            Smarter Air. Healthier Life.
          </span>
        )}
      </div>
    </div>
  );
};
