import React, { useState } from 'react';
import { ArrowUp24Regular, Color24Regular } from '@fluentui/react-icons';
import ColorPicker from '../components/ColorPicker';

export default function EmptySection({ bgColor, setBgColor, onBack }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white relative">
      <h2 className="text-5xl md:text-7xl font-signpainter mb-8 text-white/50 tracking-wider">
        About / Contact
      </h2>
      
      <div className="absolute top-12 right-12 flex gap-4">
        <button 
          onClick={() => setIsPickerOpen(true)}
          className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
          aria-label="Change Background Color"
        >
          <Color24Regular className="text-2xl" />
        </button>

        <button 
          onClick={onBack}
          className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
          aria-label="Back to Top"
        >
          <ArrowUp24Regular className="text-2xl" />
        </button>
      </div>

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