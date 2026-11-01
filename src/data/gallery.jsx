// src/data/gallery.js
// Add `isNew: true` to a tile to give it the white "NEW !" photo-print look.
// Sizes: 1x1, 2x2, 2x4 (tall), 4x2 (wide), 4x4. Tiles are auto-packed in the order listed.

export const TILES = [
  { id: 't16', isNew: true, label: 'Halloween 2026', subtitle: 'Halloween', w: 4, h: 4, color: 'bg-metro-teal', image: '/images/16.webp' },

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
 * Auto-packs tiles with no gaps wherever possible.
 *
 * Instead of dropping each tile at its first free spot (which strands holes that later, bigger
 * tiles can't use), this walks the grid cell by cell: at each empty cell it places the FIRST tile
 * in list order that fits there. Big tiles that don't fit yet simply wait for a spot where they do,
 * and smaller tiles listed later back-fill the holes. List order is therefore a priority, not a
 * guaranteed position. See PACK_MODE below.
 *
 * horizontal = true  -> fixed number of ROWS (`lanes`), tiles flow to the right (desktop)
 * horizontal = false -> fixed number of COLS (`lanes`), tiles flow downward (mobile)
 *
 * Returns { pos, cols, rows }. `pos` is an ARRAY indexed like `tiles` (not keyed by id), so a
 * duplicate or missing id can never make two tiles share a slot. Each entry is
 * { r, c, w, h } in grid cells (w/h already clamped to fit the lanes).
 */
// 'dense'   -> at each empty cell, place the BIGGEST tile that fits (fewest holes; list order only
//              breaks ties). Best for a tidy wall.
// 'ordered' -> at each empty cell, place the FIRST tile in list order that fits (keeps your curation
//              order more closely, but can leave holes beside big tiles).
export const PACK_MODE = 'dense';

export function pack(tiles, lanes, horizontal = true, mode = PACK_MODE) {
  const occ = []; // occ[flow][lane]
  const pos = [];

  // Effective size of every tile along (lane, flow) axes, clamped to the lanes
  const dims = tiles.map((t) => {
    const w = Math.max(1, Math.min(t.w, horizontal ? Infinity : lanes));
    const h = Math.max(1, Math.min(t.h, horizontal ? lanes : Infinity));
    return { w, h, la: horizontal ? h : w, lb: horizontal ? w : h };
  });

  const free = (b, a, lb, la) => {
    if (a + la > lanes) return false;
    for (let db = 0; db < lb; db++)
      for (let da = 0; da < la; da++) if (occ[b + db]?.[a + da]) return false;
    return true;
  };

  const remaining = tiles.map((_, i) => i);

  for (let b = 0; remaining.length; b++) {
    for (let a = 0; a < lanes && remaining.length; a++) {
      if (occ[b]?.[a]) continue; // cell already taken

      let k = -1;
      for (let j = 0; j < remaining.length; j++) {
        const d = dims[remaining[j]];
        if (!free(b, a, d.lb, d.la)) continue;
        if (mode === 'ordered') { k = j; break; }
        const best = k === -1 ? -1 : dims[remaining[k]].w * dims[remaining[k]].h;
        if (d.w * d.h > best) k = j; // dense: biggest fitting tile wins; earlier index wins ties
      }
      if (k === -1) continue; // nothing fits here; leave it empty

      const i = remaining.splice(k, 1)[0];
      const { w, h, la, lb } = dims[i];
      for (let db = 0; db < lb; db++) {
        occ[b + db] = occ[b + db] ?? Array(lanes).fill(false);
        for (let da = 0; da < la; da++) occ[b + db][a + da] = true;
      }
      pos[i] = horizontal ? { r: a, c: b, w, h } : { r: b, c: a, w, h };
    }
  }

  const flow = Math.max(1, occ.length);
  return { pos, cols: horizontal ? flow : lanes, rows: horizontal ? lanes : flow };
}