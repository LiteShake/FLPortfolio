import React, { useEffect, useRef, useState } from 'react';

/**
 * Caption that only scrolls when it doesn't fit.
 *  - fits            -> plain static text
 *  - wider than box  -> scrolls sideways in a loop (two copies, one wide gap between them)
 * vertical = true runs the text top-to-bottom (photo viewer side margin).
 */
const GAP_EM = 3;  // space between the end of the text and its repeat
const SPEED = 45;  // px per second

export default function Caption({ text, vertical = false, className = '', style }) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const [m, setM] = useState({ over: false, dur: 20 });

  useEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return undefined;

    const measure = () => {
      const bs = box.getBoundingClientRect();
      const ts = el.getBoundingClientRect();
      const boxSize = vertical ? bs.height : bs.width;
      const textSize = vertical ? ts.height : ts.width;
      const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
      setM({
        over: boxSize > 0 && textSize > boxSize + 1,
        dur: Math.max(6, (textSize + fs * GAP_EM) / SPEED),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(el);
    document.fonts?.ready.then(measure); // re-check once the custom font has loaded
    return () => ro.disconnect();
  }, [text, vertical]);

  if (!text) return null;

  const fade = vertical
    ? 'linear-gradient(to bottom, #000 82%, transparent)'
    : 'linear-gradient(to right, #000 88%, transparent)';

  const gap = (
    <span aria-hidden="true" className="shrink-0" style={{ display: 'inline-block', inlineSize: `${GAP_EM}em` }} />
  );

  return (
    <div
      ref={boxRef}
      className={`overflow-hidden pointer-events-none ${className}`}
      style={{
        ...(vertical ? { writingMode: 'vertical-rl' } : {}),
        ...(m.over ? { WebkitMaskImage: fade, maskImage: fade } : {}),
        ...style,
      }}
      aria-label={text}
    >
      <style>{`
        @keyframes capSlideX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes capSlideY { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        .cap-track { display: flex; white-space: nowrap; }
        .cap-track-x { width: max-content; will-change: transform; animation: capSlideX var(--cap-dur) linear infinite; }
        .cap-track-y { inline-size: max-content; will-change: transform; animation: capSlideY var(--cap-dur) linear infinite; }
        @media (prefers-reduced-motion: reduce) { .cap-track-x, .cap-track-y { animation: none; } }
      `}</style>
      <div
        className={`cap-track ${m.over ? (vertical ? 'cap-track-y' : 'cap-track-x') : ''}`}
        style={{ '--cap-dur': `${m.dur}s` }}
        aria-hidden="true"
      >
        <span ref={textRef} className="shrink-0">{text}</span>
        {m.over && (
          <>
            {gap}
            <span className="shrink-0">{text}</span>
            {gap}
          </>
        )}
      </div>
    </div>
  );
}