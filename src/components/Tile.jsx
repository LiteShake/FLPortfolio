import React from 'react';

export default function Tile({ color, title, icon, image, style, className = "" }) {
  return (
    <div
      style={style}
      className={`${color} absolute flex flex-col shadow-lg transition-all duration-200 overflow-hidden group ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      )}

      {icon && <div className="self-end mt-auto p-3 z-10 drop-shadow-md text-white">{icon}</div>}
    </div>
  );
}