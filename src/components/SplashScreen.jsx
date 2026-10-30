import React, { useState } from 'react';
import { ChevronDown24Regular, Color24Regular } from '@fluentui/react-icons';
import ColorPicker from './ColorPicker';

export default function SplashScreen({ bgColor, setBgColor, onEnter }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div
      // 1. Apply the dynamic background color directly to this container
      // 2. Add isolation: 'isolate' to create a new stacking context for proper blending
      style={{ backgroundColor: bgColor, isolation: 'isolate' }}
      className="h-screen w-full flex flex-col items-center justify-center text-white relative"
    >
      
      <div className="w-full max-w-4xl px-8 flex flex-col items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          // 3. Add a slight opacity for Firefox compatibility (can be removed if not needed)
          style={{ opacity: 0.98 }}
          className="w-full h-auto max-h-[50vh] object-contain mix-blend-screen"
        >
          <source src="/intro.webm" type="video/webm" />
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        <p className="text-xl md:text-3xl font-script text-white/80 tracking-widest uppercase mt-6 text-center animate-pulse">
          Artist / Illustrator
        </p>
      </div>
      
      <button 
        onClick={() => setIsPickerOpen(true)}
        className="absolute top-12 right-12 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
        aria-label="Change Background Color"
      >
        <Color24Regular className="text-2xl" />
      </button>

      <button 
        onClick={onEnter}
        className="absolute bottom-12 right-12 w-16 h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group"
        aria-label="Enter"
      >
        <ChevronDown24Regular className="text-3xl group-hover:translate-y-1 transition-transform duration-300" />
      </button>

      <ColorPicker 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onApplyColor={(hex) => {
          setBgColor(hex);
          setIsPickerOpen(false);
        }}
        initialColor={bgColor}
      />
    </div>
  );
}