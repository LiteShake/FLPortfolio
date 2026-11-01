import React from 'react';

/**
 * The splash video + subtitle.
 *
 * Rendered by App.jsx inside its OWN slide wrapper that has `mix-blend-screen`, so the video's
 * black drops out against the global ParallaxBackground. It must live outside SplashScreen:
 * a blend only sees what is in the same stacking context, and every slide wrapper in App
 * (translate-y) creates its own. Keep the blend on that wrapper, not on the <video>.
 */
export default function SplashArt() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-4xl px-8 flex flex-col items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto max-h-[50vh] object-contain"
        >
          <source src="/intro.webm" type="video/webm" />
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        <p className="text-xl md:text-3xl font-script text-white/80 tracking-widest uppercase mt-6 text-center animate-pulse">
          Artist / Illustrator
        </p>
      </div>
    </div>
  );
}