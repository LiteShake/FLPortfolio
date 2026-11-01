import React, { useState } from 'react';
import { ChevronDown24Regular, Color24Regular } from '@fluentui/react-icons';
import RoundButton from './RoundButton';
import ColorPicker from './ColorPicker';

// Controls only (color picker + enter). The video/subtitle live in <SplashArt/> so they can
// blend into the global background — see App.jsx.
export default function SplashScreen({ bgColor, setBgColor, onEnter }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="h-screen w-full text-white relative">
      <RoundButton
        onClick={() => setIsPickerOpen(true)}
        accent={bgColor}
        label="Change Background Color"
        className="absolute top-12 right-12 w-14 h-14"
      >
        <Color24Regular className="text-2xl" />
      </RoundButton>

      <RoundButton
        onClick={onEnter}
        accent={bgColor}
        label="Enter"
        className="absolute bottom-12 right-12 w-16 h-16 group"
      >
        <ChevronDown24Regular className="text-3xl group-hover:translate-y-1 transition-transform duration-300" />
      </RoundButton>

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