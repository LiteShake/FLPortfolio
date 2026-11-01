import React from 'react';
import Caption from './Caption';

export default function Tile({ color, title, subtitle, caption = false, icon, image, style, onClick, className = "" }) {
  return (
    <div
      style={style}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open ${title}` : undefined}
      className={`${onClick ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ' : ''}${color} absolute flex flex-col shadow-lg transition-all duration-200 overflow-hidden group ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      )}

      {caption && (
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none px-3 pb-2 pt-8 bg-gradient-to-t from-black/50 to-transparent">
          <Caption
            text={title}
            className="font-print font-semibold text-sm md:text-base leading-snug text-white drop-shadow"
          />
        </div>
      )}

      {icon && <div className="self-end mt-auto p-3 z-10 drop-shadow-md text-white">{icon}</div>}
    </div>
  );
}