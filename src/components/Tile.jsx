import React from 'react';
import Caption from './Caption';

const FLAG_FONT = '"Segoe Print", "Segoe Script", "Bradley Hand", "Comic Sans MS", Roboto';

export default function Tile({
  color,
  title,
  caption = false,
  isNew = false,
  accent = '#1ba1e2',
  icon,
  image,
  style,
  onClick,
  className = '',
}) {
  // "New" tiles get a white photo-print border with a handwritten flag in the top-left.
  // Border sizes scale with the tile so 2x2 and 4x4 tiles look the same.
  const size = Math.min(
    typeof style?.width === 'number' ? style.width : 160,
    typeof style?.height === 'number' ? style.height : 160,
  );
  const pad = Math.round(size * 0.085);
  const flagH = Math.max(20, Math.round(size * 0.115));
  const frame = isNew
    ? { left: pad, right: pad, bottom: pad, top: flagH + Math.round(pad * 0.4) }
    : { inset: 0 };

  return (
    <div
      style={isNew ? { ...style, backgroundColor: '#ffffff' } : style}
      onClick={onClick}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open ${title}${isNew ? ' (new)' : ''}` : undefined}
      className={`${onClick ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ' : ''}${color} absolute shadow-lg transition-all duration-200 overflow-hidden group ${className}`}
    >
      {isNew && (
        <span
          aria-hidden="true"
          className="absolute pointer-events-none select-none whitespace-nowrap"
          style={{
            left: pad,
            top: Math.round(pad * 0.45),
            fontFamily: FLAG_FONT,
            fontWeight: 700,
            color: accent,
            fontSize: Math.max(11, Math.round(size * 0.065)),
            lineHeight: 1.2,
          }}
        >
          NEW !
        </span>
      )}

      <div className="absolute overflow-hidden flex flex-col" style={frame}>
        {image && (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        )}

        {caption && (
          <div
            className={`absolute bottom-0 left-0 w-full z-10 pointer-events-none bg-gradient-to-t from-black/50 to-transparent ${
              size < 120 ? 'px-2 pb-1 pt-5' : 'px-3 pb-2 pt-8'
            }`}
          >
            <Caption
              text={title}
              className={`font-print font-semibold leading-snug text-white drop-shadow ${
                size < 120 ? 'text-xs' : 'text-sm md:text-base'
              }`}
            />
          </div>
        )}

        {icon && <div className="self-end mt-auto p-3 z-10 drop-shadow-md text-white">{icon}</div>}
      </div>
    </div>
  );
}