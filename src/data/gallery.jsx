// src/data/gallery.js
// Sizes: 1x1, 2x2, 2x4 (tall), 4x2 (wide), 4x4. Tiles are auto-packed in the order listed.

export const TILES = [
  // 4x2 (Wide)
  { id: 't1', label: 'Blackhole', subtitle: 'Space', w: 4, h: 2, color: 'bg-metro-teal', image: '/images/1.webp' },
  // 2x2 (Square)
  { id: 't2', label: 'Car Mirror', subtitle: 'Street', w: 2, h: 2, color: 'bg-metro-red', image: '/images/2.webp' },
  // 2x4 (Tall)
  { id: 't3', label: 'Cassette', subtitle: 'Retro', w: 2, h: 4, color: 'bg-metro-purple', image: '/images/3.webp' },
  // 2x2 (Square)
  { id: 't4', label: 'City Mountain', subtitle: 'Nature', w: 2, h: 2, color: 'bg-metro-blue', image: '/images/4.webp' },
  // 2x2 (Square)
  { id: 't5', label: 'Cover 1', subtitle: 'Illustration', w: 2, h: 2, color: 'bg-metro-orange', image: '/images/5.webp' },
  // 2x2 (Square)
  { id: 't6', label: 'Cover E', subtitle: 'Illustration', w: 2, h: 2, color: 'bg-metro-green', image: '/images/6.webp' },

  // 1x1 (Small Squares)
  { id: 't7', label: 'Faucet', w: 1, h: 1, color: 'bg-metro-pink', image: '/images/7.webp' },
  { id: 't8', label: 'Hikarin', w: 1, h: 1, color: 'bg-metro-teal', image: '/images/8.webp' },
  { id: 't9', label: 'Kasa', w: 1, h: 1, color: 'bg-metro-red', image: '/images/9.webp' },
  { id: 't10', label: 'Lemonade', w: 1, h: 1, color: 'bg-metro-blue', image: '/images/10.webp' },

  // 4x4 (Massive Feature)
  { id: 't11', label: 'Maki Pink', subtitle: 'Character', w: 4, h: 4, color: 'bg-metro-blue', image: '/images/11.webp' },

  // 2x2 (Squares)
  { id: 't12', label: 'Muffin', subtitle: 'Food', w: 2, h: 2, color: 'bg-metro-orange', image: '/images/12.webp' },
  { id: 't13', label: 'Sage Green', subtitle: 'Portrait', w: 2, h: 2, color: 'bg-metro-red', image: '/images/13.webp' },

  // 4x2 (Wide)
  { id: 't14', label: 'Ukka Pumpkin', subtitle: 'Halloween', w: 4, h: 2, color: 'bg-metro-green', image: '/images/14.webp' },
  // 2x4 (Tall)
  { id: 't15', label: 'Wordle Chan', subtitle: 'Anime', w: 2, h: 4, color: 'bg-metro-blue', image: '/images/15.webp' },
];

/**
 * Auto-packs tiles (first-fit, fills holes).
 *
 * horizontal = true  -> fixed number of ROWS (`lanes`), tiles flow to the right (desktop)
 * horizontal = false -> fixed number of COLS (`lanes`), tiles flow downward (mobile)
 *
 * Returns { pos: { [id]: { r, c } }, cols, rows } in grid cells.
 */
export function pack(tiles, lanes, horizontal = true) {
  const occ = []; // occ[flow][lane]
  const pos = {};

  const free = (b, a, lb, la) => {
    for (let db = 0; db < lb; db++)
      for (let da = 0; da < la; da++) if (occ[b + db]?.[a + da]) return false;
    return true;
  };

  for (const t of tiles) {
    const la = Math.min(horizontal ? t.h : t.w, lanes);
    const lb = horizontal ? t.w : t.h;
    let placed = false;

    for (let b = 0; !placed; b++) {
      for (let a = 0; a <= lanes - la; a++) {
        if (!free(b, a, lb, la)) continue;
        for (let db = 0; db < lb; db++) {
          occ[b + db] = occ[b + db] ?? Array(lanes).fill(false);
          for (let da = 0; da < la; da++) occ[b + db][a + da] = true;
        }
        pos[t.id] = horizontal ? { r: a, c: b } : { r: b, c: a };
        placed = true;
        break;
      }
    }
  }

  const flow = Math.max(1, occ.length);
  return { pos, cols: horizontal ? flow : lanes, rows: horizontal ? lanes : flow };
}