import React, { useEffect, useRef, useState } from 'react';

const COLORS = [
  "#f3b200", "#77b900", "#2572eb", "#ad103c", "#632f00", 
  "#b01e00", "#c1004f", "#7200ac", "#4617b4", "#006ac1", 
  "#008287", "#199900", "#00c13f", "#ff981d", "#ff2e12", 
  "#ff1d77", "#aa40ff", "#1faeff", "#56c5ff", "#00d8cc", 
  "#91d100", "#e1b700", "#ff76bc", "#00a3a3", "#fe7c22",
  "#1a1a1a", // Matte Black
  "#333333"  // Dark Gray
];

const ITEM_HEIGHT = 48;

export default function ColorPicker({ isOpen, onClose, onApplyColor, initialColor }) {
  const [activeColor, setActiveColor] = useState(initialColor || COLORS[0]);
  const scrollRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const index = COLORS.indexOf(initialColor.toLowerCase());
      const targetIndex = index !== -1 ? index : 0;
      
      setTimeout(() => {
        scrollToIndex(targetIndex, false);
        setActiveColor(COLORS[targetIndex]);
      }, 150);
    }
  }, [isOpen, initialColor]);

  const scrollToIndex = (index, smooth = true) => {
    if (index < 0) index = 0;
    if (index >= COLORS.length) index = COLORS.length - 1;
    
    const targetItem = itemsRef.current[index];
    if (targetItem && scrollRef.current) {
      const targetScroll = targetItem.offsetTop - (scrollRef.current.clientHeight / 2) + (ITEM_HEIGHT / 2);
      scrollRef.current.scrollTo({
        top: targetScroll,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerCenter = container.scrollTop + (container.clientHeight / 2);
    
    let closestIndex = 0;
    let minDistance = Infinity;

    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      const itemCenter = item.offsetTop + (ITEM_HEIGHT / 2);
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (COLORS[closestIndex] !== activeColor) {
      setActiveColor(COLORS[closestIndex]);
    }
  };

  return (
    <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
      <div 
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 pointer-events-auto ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />

      <div 
        className={`absolute top-0 right-0 h-full w-full md:w-[390px] flex flex-col pointer-events-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: activeColor }}
      >
        <div className="w-full px-6 pt-12 pb-4 flex flex-col items-end gap-3 text-right">
          <h1 className="text-4xl font-light text-white tracking-normal lowercase">
            choose color
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <button onClick={onClose} className="w-11 h-11 border-2 border-white rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <button onClick={() => onApplyColor(activeColor)} className="w-11 h-11 border-2 border-white rounded-full flex items-center justify-center text-white bg-transparent hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </button>
          </div>
        </div>

        <div className="relative flex-1 w-full flex flex-row items-center overflow-hidden">
          <div className="relative w-[80px] h-full flex justify-center">
            <div className="absolute top-2 bottom-2 w-[48px] border border-white z-20 pointer-events-none box-border"></div>
            <div className="absolute top-1/2 -translate-y-1/2 w-[48px] h-[48px] border-4 border-white box-border z-30 pointer-events-none bg-transparent"></div>

            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="w-[48px] h-full overflow-y-scroll no-scrollbar z-10 snap-y snap-mandatory flex flex-col items-center"
            >
              {/* Top Spacer: Pushes first item to exactly center */}
              <div style={{ height: 'calc(50% - 24px)' }} className="shrink-0"></div>

              {COLORS.map((color, i) => (
                <div 
                  key={color}
                  ref={el => itemsRef.current[i] = el}
                  onClick={() => scrollToIndex(i)}
                  className="w-[48px] h-[48px] shrink-0 snap-center cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}

              {/* Bottom Spacer: Allows last item to reach center */}
              <div style={{ height: 'calc(50% - 24px)' }} className="shrink-0"></div>
            </div>
          </div>

          <div className="pl-6 flex-1">
            <span className="text-2xl font-bold text-white tracking-wider font-mono lowercase">
              {activeColor}
            </span>
          </div>
        </div>

        <div className="w-full pb-8 flex flex-col items-center gap-4 z-30">
          <div className="px-8 py-2 w-full flex justify-between items-center bg-black/20">
            <button onClick={() => scrollToIndex(COLORS.indexOf(activeColor) - 1)} className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button onClick={() => scrollToIndex(COLORS.indexOf(activeColor) + 1)} className="w-9 h-9 border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}