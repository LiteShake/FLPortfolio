import React, { useRef, useEffect, useState } from 'react';
import Tile from '../components/Tile';
import { TILES, pack } from '../data/gallery';
import { ArrowLeft24Regular, ChevronDown24Regular, Color24Regular } from '@fluentui/react-icons';
import ColorPicker from '../components/ColorPicker';

export default function PageOne({ bgColor, setBgColor, onNextSection, onBack }) {
  const [unitSize, setUnitSize] = useState(140);
  const [cols, setCols] = useState(10);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const scrollRef = useRef(null);
  const isDesktopRef = useRef(false);

  const { pos, rows } = pack(TILES, cols);

  useEffect(() => {
    const calculateSize = () => {
      const width = window.innerWidth;
      const isDesktop = width >= 768;
      isDesktopRef.current = isDesktop;
      const currentPad = isDesktop ? 96 : 32;
      const GAP = 16;

      if (!isDesktop) {
        const availableWidth = width - (currentPad * 2) - (GAP * 5);
        setUnitSize(Math.max(40, availableWidth / 6));
        setCols(6);
      } else {
        const baseUnitSize = 140;
        const availableWidth = width - (currentPad * 2);
        const fitCols = Math.floor((availableWidth + GAP) / (baseUnitSize + GAP));
        const totalCols = fitCols + 6;
        setUnitSize(baseUnitSize);
        setCols(totalCols);
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  // Smooth horizontal scroll on desktop — lerp-based easing.
  // Wheel deltas accumulate into a target, and each rAF frame eases
  // the actual scrollLeft toward it (≈ 0.14 per frame → subtle smoothness).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const state = { target: el.scrollLeft, rafId: null };
    const EASE = 0.14; // lower = smoother / slower, higher = snappier

    const step = () => {
      const diff = state.target - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = state.target;
        state.rafId = null;
        return;
      }
      el.scrollLeft = el.scrollLeft + diff * EASE;
      state.rafId = requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (!isDesktopRef.current) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // let trackpad horizontal pass through
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      const max = el.scrollWidth - el.clientWidth;
      state.target = Math.max(0, Math.min(max, state.target + e.deltaY));
      if (!state.rafId) state.rafId = requestAnimationFrame(step);
    };

    // Sync target when the user scrolls via other means (keyboard, touchpad native)
    const onScroll = () => {
      if (state.rafId) return; // animation is driving it — don't fight it
      state.target = el.scrollLeft;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
      if (state.rafId) cancelAnimationFrame(state.rafId);
    };
  }, []);

  const GAP = 16;
  const gridWidth = Math.max(0, cols * unitSize + (cols - 1) * GAP);
  const gridHeight = Math.max(0, rows * unitSize + (rows - 1) * GAP);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden text-white relative">
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <header className="h-[15vh] min-h-[100px] px-8 md:px-24 flex items-end pb-4 md:pb-6 justify-between z-30 shrink-0">
        <h1 className="text-5xl md:text-7xl font-signpainter tracking-widest text-white leading-none drop-shadow-md">
          Gallery
        </h1>

        <div className="flex gap-4 mb-1">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
            aria-label="Change Background Color"
          >
            <Color24Regular className="text-xl md:text-2xl" />
          </button>

          <button
            onClick={onBack}
            className="w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
            aria-label="Back to Name"
          >
            <ArrowLeft24Regular className="text-xl md:text-2xl" />
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 relative overflow-hidden">
        <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/20 to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          className="hide-scrollbar h-full w-full overflow-y-auto md:overflow-x-auto md:overflow-y-hidden flex px-8 md:px-24 py-6 md:py-8"
        >
          <div
            className="relative shrink-0 mt-0 mb-auto"
            style={{ width: gridWidth, height: gridHeight }}
          >
            {TILES.map((tile) => {
              const p = pos[tile.id];
              if (!p) return null;

              const style = {
                top: p.r * (unitSize + GAP),
                left: p.c * (unitSize + GAP),
                width: tile.w * unitSize + (tile.w - 1) * GAP,
                height: tile.h * unitSize + (tile.h - 1) * GAP,
              };

              return (
                <Tile
                  key={tile.id}
                  color={tile.color}
                  title={tile.label}
                  subtitle={tile.subtitle}
                  image={tile.image}
                  style={style}
                />
              );
            })}
          </div>
        </div>
      </main>

      <footer className="h-[15vh] min-h-[100px] px-8 md:px-24 flex items-center justify-end z-30 shrink-0">
        <button
          onClick={onNextSection}
          className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm group"
          aria-label="Next Section"
        >
          <ChevronDown24Regular className="text-2xl group-hover:translate-y-1 transition-transform" />
        </button>
      </footer>

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