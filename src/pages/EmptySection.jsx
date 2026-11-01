import React, { useState } from 'react';
import { ArrowUp24Regular, Color24Regular } from '@fluentui/react-icons';
import RoundButton from '../components/RoundButton';
import ColorPicker from '../components/ColorPicker';

export default function EmptySection({ bgColor, setBgColor, onBack }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white relative">
      <h2 className="text-5xl md:text-7xl font-signpainter mb-8 text-white/50 tracking-wider">
        About / Contact
      </h2>

      <div className="absolute top-12 right-12 flex gap-4">
        <RoundButton
          onClick={() => setIsPickerOpen(true)}
          accent={bgColor}
          label="Change Background Color"
          className="w-14 h-14"
        >
          <Color24Regular className="text-2xl" />
        </RoundButton>

        <RoundButton onClick={onBack} accent={bgColor} label="Back to Top" className="w-14 h-14">
          <ArrowUp24Regular className="text-2xl" />
        </RoundButton>
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