import { FuncdLogo } from '@funcd-dev/ui/logo';
import type { CSSProperties, ReactNode } from 'react';

// Isometric blocks on a grid: cell (i, j) sits at x = (i - j) · W/2,
// y = (i + j) · H/2. A block's height is a CSS variable, so a whole district
// rises or settles with a CSS transition when its class changes.
export const W = 60;
export const H = W / 2;
const SKEW = (Math.atan(H / W) * 180) / Math.PI;

export type Material =
  | 'ground'
  | 'road'
  | 'core'
  | 'screen'
  | 'slate'
  | 'crop'
  | 'soil'
  | 'hall'
  | 'machine'
  | 'belt'
  | 'water'
  | 'bronze'
  | 'silver'
  | 'gold';

export type WorldId = 'video' | 'farm' | 'ops' | 'lake';

export const iso = (i: number, j: number) => ({
  x: (i - j) * (W / 2),
  y: (i + j) * (H / 2)
});

// The funcd mark laid flat on a block's top face: its input on the left, its
// output on the right.
const S = 100;
const MarkDecal = () => (
  <g
    transform={`matrix(${W / 2 / S} ${H / 2 / S} ${-W / 2 / S} ${H / 2 / S} 0 ${-H / 2})`}>
    <FuncdLogo
      x={16}
      y={16}
      size={68}
      color="#ffffff"
      accentColor="rgba(255, 255, 255, 0.5)"
      aria-hidden
    />
  </g>
);

type BlockProps = {
  i: number;
  j: number;
  h: number;
  m: Material;
  d?: number;
  mark?: boolean;
  children?: ReactNode;
};

export const Block = ({ i, j, h, m, d = 0, mark, children }: BlockProps) => {
  const { x, y } = iso(i, j);
  return (
    <g
      className={`blk m-${m}`}
      transform={`translate(${x} ${y})`}
      style={{ '--h': h, '--d': d, '--j': j } as CSSProperties}>
      <g transform={`translate(${-W / 2} 0) skewY(${SKEW})`}>
        <rect className="fl" y={-1} width={W / 2} height={1} />
      </g>
      <g transform={`translate(0 ${H / 2}) skewY(${-SKEW})`}>
        <rect className="fr" y={-1} width={W / 2} height={1} />
      </g>
      <g className="ft">
        <polygon points={`0,${-H / 2} ${W / 2},0 0,${H / 2} ${-W / 2},0`} />
        {mark && <MarkDecal />}
        {children}
      </g>
    </g>
  );
};

// Each world fills a 6 × 6 district: its plan gives every cell a height (0 to
// 1, as a share of the tallest block) and a material.
const plans: Record<WorldId, (a: number, b: number) => [number, Material]> = {
  // A screen playing frames, and the render nodes facing it.
  video: (a, b) => {
    if (a === 1) return [0.95, 'screen'];
    if (a >= 3 && a <= 4 && b >= 1 && b <= 4) return [0.14, 'slate'];
    return [0.04, 'ground'];
  },
  // Crop rows, and the box that runs funcd at the corner of the field.
  farm: (a, b) => {
    if (a === 0 && b === 5) return [0.42, 'core'];
    return b % 2 === 0 ? [0.13, 'crop'] : [0.05, 'soil'];
  },
  // A hall with its chimney, the machines and the belt between them.
  ops: (a, b) => {
    if (a === 0 && b === 1) return [1, 'hall'];
    if (a >= 1 && a <= 3 && b >= 1 && b <= 2) return [0.5, 'hall'];
    if ((a === 4 && (b === 1 || b === 3)) || (a === 2 && b === 4))
      return [0.26, 'machine'];
    if (b === 3 && a >= 1 && a <= 3) return [0.1, 'belt'];
    return [0.04, 'ground'];
  },
  // Raw, refined and curated data as three towers, and a lake to query.
  lake: (a, b) => {
    if (b === 0 && a === 0) return [0.3, 'bronze'];
    if (b === 0 && a === 1) return [0.52, 'silver'];
    if (b === 0 && a === 2) return [0.74, 'gold'];
    if (a >= 1 && a <= 4 && b >= 2 && b <= 4) return [0.025, 'water'];
    return [0.04, 'ground'];
  }
};

export const District = ({
  id,
  origin: [i0, j0],
  awake
}: {
  id: WorldId;
  origin: readonly [number, number];
  awake: boolean;
}) => {
  const cells: { a: number; b: number; h: number; m: Material }[] = [];
  for (let a = 0; a < 6; a++)
    for (let b = 0; b < 6; b++) {
      const [h, m] = plans[id](a, b);
      cells.push({ a, b, h, m });
    }
  // Back to front, so a nearer block covers a farther one.
  cells.sort((p, q) => p.a + p.b - (q.a + q.b));
  return (
    <g className={awake ? 'district awake' : 'district'}>
      {cells.map(({ a, b, h, m }) => (
        <Block
          key={`${a}-${b}`}
          i={i0 + a}
          j={j0 + b}
          h={h}
          m={m}
          d={a + b}
          mark={id === 'farm' && m === 'core'}
        />
      ))}
    </g>
  );
};

// The earth under an n × n patch of cells, seen on its two front sides.
export const Slab = ({ n, depth }: { n: number; depth: number }) => {
  const left = { x: -n * (W / 2), y: (n - 1) * (H / 2) };
  const bottom = { x: 0, y: (n - 1) * H + H / 2 };
  const right = { x: n * (W / 2), y: left.y };
  return (
    <g className="slab">
      <polygon
        className="sl"
        points={`${left.x},${left.y} ${bottom.x},${bottom.y} ${bottom.x},${bottom.y + depth} ${left.x},${left.y + depth}`}
      />
      <polygon
        className="sr"
        points={`${bottom.x},${bottom.y} ${right.x},${right.y} ${right.x},${right.y + depth} ${bottom.x},${bottom.y + depth}`}
      />
    </g>
  );
};
