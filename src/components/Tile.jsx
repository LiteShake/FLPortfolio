import React from 'react';

export default function Tile({ color, title, subtitle, icon, image, style, className = "" }) {
  return (
    <div 
      style={style}
      className={`${color} absolute p-5 flex flex-col shadow-lg transition-all duration-200 overflow-hidden group ${className}`}
    >
      {image && (
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
        />
      )}

      <div className="z-10 relative pointer-events-none flex flex-col">
        <h3 className="text-2xl font-print font-bold drop-shadow-lg text-white leading-tight">{title}</h3>
        
        {/* Make subtitle larger and solid white */}
        {subtitle && (
          <p className="text-base font-print mt-1 drop-shadow-lg text-white font-semibold">
            {subtitle}
          </p>
        )}
      </div>
      
      {icon && <div className="self-end mt-auto z-10 drop-shadow-md text-white">{icon}</div>}
      
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/70 to-transparent z-0 pointer-events-none" />
    </div>
  );
}