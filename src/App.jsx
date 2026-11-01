import React, { useState } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import SplashArt from './components/SplashArt';
import SplashScreen from './components/SplashScreen';
import PageOne from './pages/PageOne';
import EmptySection from './pages/EmptySection';

export default function App() {
  const [view, setView] = useState('splash');
  const [bgColor, setBgColor] = useState('#333333');

  const splashSlide = view === 'splash' ? 'translate-y-0' : '-translate-y-full';

  return (
    // No background color here: <ParallaxBackground/> is the single global background.
    <div className="w-full h-screen overflow-hidden text-white selection:bg-metro-teal relative">
      <ParallaxBackground bgColor={bgColor} />

      {/* Splash video + subtitle. `mix-blend-screen` is on this wrapper (not the <video>) so it
          blends with the global background behind it. Same slide as the splash controls below. */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none mix-blend-screen transition-transform duration-700 ease-in-out ${splashSlide}`}
      >
        <SplashArt />
      </div>

      {/* Splash controls (color picker + enter) — normal blending */}
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${splashSlide}`}
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