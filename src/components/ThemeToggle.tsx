import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  variant?: 'compact' | 'pill' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  variant = 'switch',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <button
        id="theme-toggle-compact-btn"
        type="button"
        onClick={onToggle}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors cursor-pointer border ${
          isDark 
            ? 'bg-[#23233a] hover:bg-[#2e2e4a] text-[#FFD700] border-white/20' 
            : 'bg-white/10 hover:bg-white/20 text-[#FAF9F6] border-white/15'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 transition-transform rotate-0 scale-100" />
        ) : (
          <Moon className="w-3.5 h-3.5 transition-transform -rotate-12 scale-100 text-sky-200" />
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        id="theme-toggle-pill-btn"
        type="button"
        onClick={onToggle}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
          isDark
            ? 'bg-[#1b1b2d] hover:bg-[#25253d] text-[#FFD700] border-white/15'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-gray-200">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-[#0E01B5]" />
            <span className="text-gray-700">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default interactive sliding switch with icons & labels
  return (
    <div 
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
      title={isDark ? 'Currently Dark Mode — Click to toggle' : 'Currently Light Mode — Click to toggle'}
    >
      <button
        id="theme-mode-toggle-switch"
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={onToggle}
        className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out border focus:outline-hidden focus:ring-2 focus:ring-[#0E01B5] focus:ring-offset-1 ${
          isDark 
            ? 'bg-[#0E01B5] border-[#FFD700]/40' 
            : 'bg-gray-200 border-gray-300'
        }`}
      >
        <span className="sr-only">Toggle dark and light mode</span>
        
        {/* Decorative background icons inside the track */}
        <span className="absolute left-1.5 flex items-center justify-center text-amber-500 opacity-80 pointer-events-none">
          <Sun className="w-3 h-3" />
        </span>
        <span className="absolute right-1.5 flex items-center justify-center text-sky-200 opacity-80 pointer-events-none">
          <Moon className="w-3 h-3" />
        </span>

        {/* Sliding Thumb */}
        <span
          className={`pointer-events-none inline-flex h-6.5 w-6.5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            isDark ? 'translate-x-7 bg-[#171728] text-[#FFD700]' : 'translate-x-0 bg-white text-[#0E01B5]'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-[#FFD700]" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
        </span>
      </button>
      <span className="hidden sm:inline-block text-[11px] font-semibold text-gray-600 dark:text-gray-300">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </div>
  );
};
