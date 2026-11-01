import React from 'react';

/**
 * The app's round icon button: always a WHITE circle with an accent-colored symbol.
 * `accent` is the current background color (bgColor). The icon inherits it via currentColor.
 * White is set inline on purpose — a utility class like bg-white can be overridden by global CSS.
 */
export default function RoundButton({ accent = '#333333', label, className = '', style, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...rest}
      className={`rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{ backgroundColor: '#ffffff', color: accent, border: 'none', padding: 0, ...style }}
    >
      {children}
    </button>
  );
}