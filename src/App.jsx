import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import PageOne from './pages/PageOne';
import EmptySection from './pages/EmptySection';

export default function App() {
  const [view, setView] = useState('splash'); 
  const [bgColor, setBgColor] = useState('#333333'); 

  return (
    <div 
      className="w-full h-screen overflow-hidden text-white selection:bg-metro-teal transition-colors duration-500 ease-in-out relative"
      style={{ backgroundColor: bgColor }}
    >
      <div 
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
          view === 'splash' ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <SplashScreen 
          bgColor={bgColor}
          setBgColor={setBgColor}
          onEnter={() => setView('page1')} 
        />
      </div>

      <div 
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
          view === 'page1' ? 'translate-y-0' : view === 'page2' ? '-translate-y-full' : 'translate-y-full'
        }`}
      >
        <PageOne 
          bgColor={bgColor}
          setBgColor={setBgColor}
          onNextSection={() => setView('page2')} 
          onBack={() => setView('splash')} 
        />
      </div>
      
      <div 
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
          view === 'page2' ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <EmptySection 
          bgColor={bgColor}
          setBgColor={setBgColor}
          onBack={() => setView('page1')} 
        />
      </div>
    </div>
  );
}