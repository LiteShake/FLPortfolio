// src/data/gallery.js
// Add `isNew: true` to a tile to give it the white "NEW !" photo-print look.
// Sizes: 1x1, 2x2, 2x4 (tall), 4x2 (wide), 4x4. Tiles are auto-packed in the order listed.

export const TILES = [
  // --- Row 1-4 (Massive 4x4 Anchor) ---
  { id: 't16', isNew: true, label: 'Halloween 2026', subtitle: 'Halloween', w: 4, h: 4, color: 'bg-metro-teal', image: '/images/16.webp' },

  // --- Row 5-6 (Squares) ---
  { id: 't2', label: 'Car Mirror', subtitle: 'Street', w: 2, h: 2, color: 'bg-metro-red', image: '/images/2.webp' },
  { id: 't4', label: 'City Mountain', subtitle: 'Nature', w: 2, h: 2, color: 'bg-metro-blue', image: '/images/4.webp' },

  // --- Row 7-8 (Squares) ---
  { id: 't3', label: 'Cassette', subtitle: 'Retro', w: 2, h: 2, color: 'bg-metro-purple', image: '/images/3.webp' }, // Changed from 2x4 to 2x2
  { id: 't5', label: 'Cover 1', subtitle: 'Illustration', w: 2, h: 2, color: 'bg-metro-orange', image: '/images/5.webp' },

  // --- Row 9-10 (Squares) ---
  { id: 't6', label: 'Cover E', subtitle: 'Illustration', w: 2, h: 2, color: 'bg-metro-green', image: '/images/6.webp' },
  { id: 't15', label: 'Wordle Chan', subtitle: 'Anime', w: 2, h: 2, color: 'bg-metro-blue', image: '/images/15.webp' }, // Changed from 2x4 to 2x2

  // --- Row 11-12 (Wide Feature) ---
  { id: 't1', label: 'Blackhole', subtitle: 'Space', w: 4, h: 2, color: 'bg-metro-teal', image: '/images/1.webp' },

  // --- Row 13 (1x1 Cluster - Perfectly fills a row of 4) ---
  { id: 't7', label: 'Faucet', w: 1, h: 1, color: 'bg-metro-pink', image: '/images/7.webp' },
  { id: 't8', label: 'Hikarin', w: 1, h: 1, color: 'bg-metro-teal', image: '/images/8.webp' },
  { id: 't9', label: 'Kasa', w: 1, h: 1, color: 'bg-metro-red', image: '/images/9.webp' },
  { id: 't10', label: 'Lemonade', w: 1, h: 1, color: 'bg-metro-blue', image: '/images/10.webp' },

  // --- Row 14-15 (Squares) ---
  { id: 't12', label: 'Muffin', subtitle: 'Food', w: 2, h: 2, color: 'bg-metro-orange', image: '/images/12.webp' },
  { id: 't13', label: 'Sage Green', subtitle: 'Portrait', w: 2, h: 2, color: 'bg-metro-red', image: '/images/13.webp' },

  // --- Row 16-19 (Massive 4x4 Anchor) ---
  { id: 't11', label: 'Maki Pink', subtitle: 'Character', w: 4, h: 4, color: 'bg-metro-blue', image: '/images/11.webp' },

  // --- Row 20-21 (Wide Feature) ---
  { id: 't14', label: 'Ukka Pumpkin', subtitle: 'Halloween', w: 4, h: 2, color: 'bg-metro-green', image: '/images/14.webp' },
];

/**
 * Auto-packs tiles (first-fit, fills holes).
 *
 * horizontal = true  -> fixed number of ROWS (`lanes`), tiles flow to the right (desktop)
 * horizontal = false -> fixed number of COLS (`lanes`), tiles flow downward (mobile)
 *
 * Returns { pos, cols, rows }. `pos` is an ARRAY indexed like `tiles` (not keyed by id), so a
 * duplicate or missing id can never make two tiles share a slot. Each entry is
 * { r, c, w, h } in grid cells (w/h already clamped to fit the lanes).
 */
export function pack(tiles, lanes, horizontal = true) {
  const occ = []; // occ[flow][lane]
  const pos = [];

  const free = (b, a, lb, la) => {
    for (let db = 0; db < lb; db++)
      for (let da = 0; da < la; da++) if (occ[b + db]?.[a + da]) return false;
    return true;
  };

  tiles.forEach((t, i) => {
    const w = Math.max(1, Math.min(t.w, horizontal ? Infinity : lanes));
    const h = Math.max(1, Math.min(t.h, horizontal ? lanes : Infinity));
    const la = horizontal ? h : w;
    const lb = horizontal ? w : h;
    let placed = false;

    for (let b = 0; !placed; b++) {
      for (let a = 0; a <= lanes - la; a++) {
        if (!free(b, a, lb, la)) continue;
        for (let db = 0; db < lb; db++) {
          occ[b + db] = occ[b + db] ?? Array(lanes).fill(false);
          for (let da = 0; da < la; da++) occ[b + db][a + da] = true;
        }
        pos[i] = horizontal ? { r: a, c: b, w, h } : { r: b, c: a, w, h };
        placed = true;
        break;
      }
    }
  });

  const flow = Math.max(1, occ.length);
  return { pos, cols: horizontal ? flow : lanes, rows: horizontal ? lanes : flow };
}