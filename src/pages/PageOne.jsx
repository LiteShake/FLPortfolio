import React, { useRef, useEffect, useState } from 'react';
import Tile from '../components/Tile';
import { TILES, pack } from '../data/gallery';
import { ArrowLeft24Regular, ChevronDown24Regular, Color24Regular } from '@fluentui/react-icons';
import RoundButton from '../components/RoundButton';
import ColorPicker from '../components/ColorPicker';
import ImageViewer from '../components/ImageViewer';

const GAP = 16;
const GAP_COMPACT = 8;
const ROWS = 6; // desktop gallery is exactly 6 unit tiles tall
const COMPACT_BELOW = 560; // px of viewport height: phones in landscape use the compact layout

export default function PageOne({ bgColor, setBgColor, onNextSection, onBack }) {
  const [viewport, setViewport] = useState({ width: 1280, height: 800, mainH: 600 });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const scrollRef = useRef(null);
  const mainRef = useRef(null);
  const isDesktopRef = useRef(false);

  const isDesktop = viewport.width >= 768;
  isDesktopRef.current = isDesktop;

  // Short viewports (a phone in landscape): slimmer header/footer, tighter padding and gap, so the
  // 6 rows still fit instead of being clipped by the fixed-height tile area.
  const compact = viewport.height < COMPACT_BELOW;
  const gap = compact ? GAP_COMPACT : GAP;
  const padY = compact ? 12 : 32; // vertical padding of the scroll area (each side)
  const padX = compact ? 24 : 32; // mobile horizontal padding (each side)

  // Unit size is derived from the measured space on every render, so it always
  // matches ROWS (no stale value after hot reload or a ROWS change).
  const unitSize = isDesktop
    ? Math.max(12, (viewport.mainH - padY * 2 - gap * (ROWS - 1)) / ROWS) // 6 rows fill the whole tile area
    : Math.max(24, (viewport.width - padX * 2 - gap * 5) / 6);

  // Desktop: ROWS fixed rows, tiles flow right. Mobile: 6 fixed cols, tiles flow down.
  const { pos, cols, rows } = pack(TILES, isDesktop ? ROWS : 6, isDesktop);

  useEffect(() => {
    const measure = () =>
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        mainH: mainRef.current?.clientHeight ?? window.innerHeight * 0.7,
      });

    measure();
    const ro = new ResizeObserver(measure);
    if (mainRef.current) ro.observe(mainRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
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

  const gridWidth = Math.max(0, cols * unitSize + (cols - 1) * gap);
  const gridHeight = Math.max(0, rows * unitSize + (rows - 1) * gap);

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

      <header
        className={`${
          compact ? 'h-14 px-6 pb-2' : 'h-[15vh] min-h-[100px] px-8 md:px-24 pb-4 md:pb-6'
        } flex items-end justify-between z-30 shrink-0`}
      >
        <h1
          className={`${
            compact ? 'text-3xl' : 'text-5xl md:text-7xl'
          } font-signpainter tracking-widest text-white leading-none drop-shadow-md`}
        >
          Gallery
        </h1>

        <div className={`flex ${compact ? 'gap-3' : 'gap-4 mb-1'}`}>
          <RoundButton
            onClick={() => setIsPickerOpen(true)}
            accent={bgColor}
            label="Change Background Color"
            className={compact ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'}
          >
            <Color24Regular className={compact ? 'text-xl' : 'text-xl md:text-2xl'} />
          </RoundButton>

          <RoundButton
            onClick={onBack}
            accent={bgColor}
            label="Back to Name"
            className={compact ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'}
          >
            <ArrowLeft24Regular className={compact ? 'text-xl' : 'text-xl md:text-2xl'} />
          </RoundButton>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 min-h-0 relative overflow-hidden">
        <div
          className={`hidden md:block absolute inset-y-0 left-0 ${compact ? 'w-12' : 'w-32'} bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none`}
        />
        <div
          className={`hidden md:block absolute inset-y-0 right-0 ${compact ? 'w-12' : 'w-32'} bg-gradient-to-l from-black/20 to-transparent z-20 pointer-events-none`}
        />

        <div
          ref={scrollRef}
          className={`hide-scrollbar h-full w-full overflow-y-auto md:overflow-x-auto md:overflow-y-hidden flex ${
            compact ? 'px-6 py-3' : 'px-8 md:px-24 py-6 md:py-8'
          }`}
        >
          <div className="relative shrink-0 mt-0 mb-auto" style={{ width: gridWidth, height: gridHeight }}>
            {TILES.map((tile, i) => {
              const p = pos[i]; // positions are looked up by index, so duplicate ids can't collide
              if (!p) return null;

              const style = {
                top: p.r * (unitSize + gap),
                left: p.c * (unitSize + gap),
                width: p.w * unitSize + (p.w - 1) * gap,
                height: p.h * unitSize + (p.h - 1) * gap,
              };

              return (
                <Tile
                  key={`${tile.id}-${i}`}
                  color={tile.color}
                  title={tile.label}
                  image={tile.image}
                  style={style}
                  onClick={() => setActiveTile(tile)}
                  caption={p.w * p.h > 1} // no caption on small 1x1 tiles
                  isNew={!!tile.isNew}
                  accent={bgColor}
                />
              );
            })}
          </div>
        </div>
      </main>

      <footer
        className={`${
          compact ? 'h-14 px-6' : 'h-[15vh] min-h-[100px] px-8 md:px-24'
        } flex items-center justify-end z-30 shrink-0`}
      >
        <RoundButton
          onClick={onNextSection}
          accent={bgColor}
          label="Next Section"
          className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} group`}
        >
          <ChevronDown24Regular
            className={`${compact ? 'text-xl' : 'text-2xl'} group-hover:translate-y-1 transition-transform`}
          />
        </RoundButton>
      </footer>

      {activeTile && <ImageViewer tile={activeTile} bgColor={bgColor} onClose={() => setActiveTile(null)} />}

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