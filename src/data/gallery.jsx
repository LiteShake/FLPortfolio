// src/data/gallery.js

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

export function pack(tiles, cols) {
  const occ = [];
  const pos = {};

  const free = (r, c, w, h) => {
    for (let dr = 0; dr < h; dr++)
      for (let dc = 0; dc < w; dc++) if (occ[r + dr]?.[c + dc]) return false;
    return true;
  };

  for (const t of tiles) {
    let placed = false;
    for (let r = 0; !placed; r++) {
      for (let c = 0; c <= cols - t.w; c++) {
        if (free(r, c, t.w, t.h)) {
          for (let dr = 0; dr < t.h; dr++) {
            occ[r + dr] = occ[r + dr] ?? Array(cols).fill(false);
            for (let dc = 0; dc < t.w; dc++) occ[r + dr][c + dc] = true;
          }
          pos[t.id] = { r, c };
          placed = true;
          break;
        }
      }
    }
  }
  return { pos, rows: Math.max(1, occ.length) };
}