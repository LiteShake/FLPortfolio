import React, { useEffect, useRef } from 'react';

/**
 * Global app background: the accent color + stacked white-on-black pattern layers that move
 * OPPOSITE to the mouse, each at its own rate.
 *
 *  - Layers are blended with `screen`, so the black of each image disappears and only the white
 *    pattern shows over the background color.
 *  - Layer 0 (back) is the faintest and slowest (25% opacity); the last layer (front) is the
 *    strongest and fastest (75%). Any number of images works; opacities spread evenly 25% -> 75%.
 *  - Depth of field: blur is the inverse of opacity. The faintest/back layer is the blurriest,
 *    the strongest/front layer the sharpest (see MIN_BLUR / MAX_BLUR). Blur is spread evenly between those for any number of images.
 *  - Each layer is oversized by its own max travel PLUS ~3x its blur radius on every side. The
 *    travel keeps the screen fully covered; the blur margin stops the blur from fading the layer's
 *    edges into view (blur samples "outside" the image as transparent). The wrapper clips the extra.
 */
const DEFAULT_IMAGES = ['/bg/1.webp', '/bg/2.webp', '/bg/3.webp'];
const MIN_OPACITY = 0.25;
const MAX_OPACITY = 0.75;
// Depth of field: the front layer is nearly sharp, the back layer is softest. Screen px.
const MIN_BLUR = 0.5; // px, highest-opacity (front) layer
const MAX_BLUR = 3; // px, lowest-opacity (back) layer
const BLUR_EDGE = 3; // extra overscan, in multiples of the blur radius

export default function ParallaxBackground({
  bgColor,
  images = DEFAULT_IMAGES,
  maxShift = 90, // px the front-most layer can travel from center (back layers travel less)
  ease = 0.08,   // lower = floatier
}) {
  const n = images.length;
  const layerRefs = useRef([]);

  const shifts = images.map((_, i) => (maxShift * (i + 1)) / n);
  const opacities = images.map((_, i) =>
    n === 1 ? MAX_OPACITY : MIN_OPACITY + ((MAX_OPACITY - MIN_OPACITY) * i) / (n - 1)
  );
  const blurs = images.map((_, i) =>
    n === 1 ? MIN_BLUR : MAX_BLUR - ((MAX_BLUR - MIN_BLUR) * i) / (n - 1)
  );

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const layerShifts = Array.from({ length: n }, (_, i) => (maxShift * (i + 1)) / n);
    const s = { tx: 0, ty: 0, x: 0, y: 0, raf: null }; // normalized -1..1 (target / current)

    const apply = () => {
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        // opposite to the mouse: pointer right/down -> layer moves left/up
        el.style.transform = `translate3d(${-s.x * layerShifts[i]}px, ${-s.y * layerShifts[i]}px, 0)`;
      });
    };

    const step = () => {
      s.x += (s.tx - s.x) * ease;
      s.y += (s.ty - s.y) * ease;
      if (Math.abs(s.tx - s.x) < 0.0005 && Math.abs(s.ty - s.y) < 0.0005) {
        s.x = s.tx;
        s.y = s.ty;
        apply();
        s.raf = null;
        return;
      }
      apply();
      s.raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(step);
    };

    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const onMove = (e) => {
      if (e.pointerType === 'touch') return; // mouse / pen only
      s.tx = clamp((e.clientX / window.innerWidth) * 2 - 1);
      s.ty = clamp((e.clientY / window.innerHeight) * 2 - 1);
      kick();
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
      kick();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [n, maxShift, ease]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        backgroundColor: bgColor,
        isolation: 'isolate', // blend layers against the color above, not the page behind
        transition: 'background-color 300ms ease',
      }}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          ref={(el) => (layerRefs.current[i] = el)}
          className="absolute mix-blend-screen"
          style={{
            inset: -(shifts[i] + blurs[i] * BLUR_EDGE), // travel + blur overscan => never underflows
            filter: `blur(${blurs[i]}px)`,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: opacities[i],
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}