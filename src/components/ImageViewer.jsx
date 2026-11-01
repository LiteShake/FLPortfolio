import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import Caption from './Caption';

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5; // 200%

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function ImageViewer({ tile, bgColor, onClose }) {
  const accent = bgColor || '#1ba1e2';
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 }); // visible stage size
  const [nat, setNat] = useState(null);           // image natural size (null until known)
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  // Size of the picture itself when it fits the stage at 100% (object-contain)
  const fit = (() => {
    if (!box.w || !box.h) return { w: 0, h: 0 };
    if (!nat) return { w: box.w, h: box.h };
    const s = Math.min(box.w / nat.w, box.h / nat.h);
    return { w: nat.w * s, h: nat.h * s };
  })();

  // Keep panning inside the zoomed picture's edges
  const limit = (o, z) => {
    const mx = Math.max(0, (fit.w * z - box.w) / 2);
    const my = Math.max(0, (fit.h * z - box.h) / 2);
    return { x: clamp(o.x, -mx, mx), y: clamp(o.y, -my, my) };
  };

  const applyZoom = (z) => {
    const nz = clamp(z, MIN_ZOOM, MAX_ZOOM);
    setZoom(nz);
    setOffset((o) => limit(o, nz));
  };

  // Stage size (responsive)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Natural size — also handles images that were already cached (onLoad may not fire)
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth) {
      setNat({ w: img.naturalWidth, h: img.naturalHeight });
    }
  }, [tile.image]);

  useEffect(() => {
    setOffset((o) => limit(o, zoom));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.w, box.h, nat]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onPointerDown = (e) => {
    if (zoom <= MIN_ZOOM) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    setOffset(limit({ x: d.ox + e.clientX - d.sx, y: d.oy + e.clientY - d.sy }, zoom));
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center text-white viewer-in"
      role="dialog"
      aria-modal="true"
      aria-label={tile.label}
    >
      <style>{`
        @keyframes viewerIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes frameIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
        .viewer-in { animation: viewerIn 180ms ease-out; }
        .viewer-frame-anim { animation: frameIn 240ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .viewer-in, .viewer-frame-anim { animation: none; } }

        /* Floating square frame (taller on phones) */
        .viewer-frame { width: min(92vw, 82vh, 720px); aspect-ratio: 1 / 1; }
        .viewer-stage { left: 7%; right: 7%; top: 64px; bottom: 84px; }
        .viewer-back  { top: 12px; right: 12px; width: 44px; height: 44px; }
        .viewer-zoom  { left: 7%; right: 7%; bottom: 20px; }
        .viewer-cap-top  { left: 7%; right: 72px; top: 12px; height: 44px; display: flex; align-items: center; }
        .viewer-cap-side { display: none; }
        @media (max-width: 767px) {
          .viewer-frame { width: min(92vw, 70vh); aspect-ratio: 4 / 5; }
        }
        @media (min-width: 768px) {
          .viewer-stage { left: 8%; right: 22%; top: 8%; bottom: 22%; }
          .viewer-back  { top: 8%; right: 5%; width: 56px; height: 56px; }
          .viewer-zoom  { left: 8%; right: 5%; bottom: 7%; }
          .viewer-cap-top  { display: none; }
          .viewer-cap-side { display: block; right: 5%; width: 56px; top: calc(8% + 76px); bottom: 22%; }
        }

        .metro-range { -webkit-appearance: none; appearance: none; width: 100%; height: 32px; background: transparent; cursor: pointer; touch-action: none; }
        .metro-range:focus { outline: none; }
        .metro-range::-webkit-slider-runnable-track { height: 3px; background: #fff; }
        .metro-range::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 28px; margin-top: -12.5px; background: #fff; border: 0; border-radius: 0; }
        .metro-range::-moz-range-track { height: 3px; background: #fff; }
        .metro-range::-moz-range-thumb { width: 10px; height: 28px; background: #fff; border: 0; border-radius: 0; }
        .metro-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgba(255,255,255,.5); }
      `}</style>

      {/* Click outside the frame to close; gallery stays visible behind, darkened and blurred */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="viewer-frame viewer-frame-anim relative shadow-2xl"
        style={{ background: accent }}
      >
        {/* Hand-drawn white border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M1.2 1.8 L98.6 0.6 L99.2 98.4 L0.6 99.4 Z"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Image stage */}
        <div
          ref={stageRef}
          className={`viewer-stage absolute overflow-hidden select-none ${
            zoom > MIN_ZOOM ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
          style={{ touchAction: zoom > MIN_ZOOM ? 'none' : 'auto' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onWheel={(e) => applyZoom(zoom - e.deltaY * 0.002)}
          onDoubleClick={() => applyZoom(zoom > MIN_ZOOM ? MIN_ZOOM : MAX_ZOOM)}
        >
          <img
            ref={imgRef}
            src={tile.image}
            alt={tile.label}
            draggable={false}
            onLoad={(e) => setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              maxWidth: 'none',
              objectFit: 'contain',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transition: dragging ? 'none' : 'transform 120ms ease-out',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Back button, top right of the frame */}
        <button
          onClick={onClose}
          className="viewer-back absolute z-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
          style={{ backgroundColor: '#ffffff', color: accent, border: 'none', padding: 0 }}
          aria-label="Back to Gallery"
        >
          <ArrowLeft24Regular className="text-2xl" style={{ color: accent }} />
        </button>

        {/* Caption: horizontal on phones (top left), sideways in the right margin on desktop */}
        <div className="viewer-cap-top absolute z-20">
          <Caption
            text={tile.label}
            className="flex-1 min-w-0 font-print font-semibold text-white drop-shadow"
            style={{ fontSize: '30px', lineHeight: '44px' }}
          />
        </div>
        <div className="viewer-cap-side absolute z-20 flex justify-center">
          {/* text is as big as the 56px back button: 40px glyphs on a 56px-wide line */}
          <Caption
            vertical
            text={tile.label}
            className="h-full font-print font-semibold text-white drop-shadow"
            style={{ fontSize: '40px', lineHeight: '56px' }}
          />
        </div>

        {/* Metro zoom slider */}
        <div className="viewer-zoom absolute z-20 flex items-center gap-3">
          <input
            type="range"
            className="metro-range"
            min={MIN_ZOOM * 100}
            max={MAX_ZOOM * 100}
            step={1}
            value={Math.round(zoom * 100)}
            onChange={(e) => applyZoom(Number(e.target.value) / 100)}
            aria-label="Zoom"
          />
          <span className="w-12 text-right text-base md:text-lg font-semibold tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}