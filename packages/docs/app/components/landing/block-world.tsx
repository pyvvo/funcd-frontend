import { useAnimationFrame, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { Block, District, iso, Slab, type Material, type WorldId } from './iso';
import { worlds } from './worlds';

// An island of 13 × 13 cells: funcd's core at the center, its roads on row and
// column 6, and one world in each quarter. The worlds become active in turn,
// and calls leave the core for the active one.
const N = 13;
const ROAD = 6;
const CYCLE = 4600;
const SPAWN = 460;
const LIFE = 1400;
const SLOTS = 5;

const origins: Record<WorldId, readonly [number, number]> = {
  video: [0, 0],
  farm: [7, 0],
  ops: [0, 7],
  lake: [7, 7]
};

const routes: Record<WorldId, [number, number][]> = {
  video: [
    [6, 6],
    [6, 2.5],
    [5.3, 2.5]
  ],
  farm: [
    [6, 6],
    [6, 2.5],
    [6.7, 2.5]
  ],
  ops: [
    [6, 6],
    [6, 9.5],
    [5.3, 9.5]
  ],
  lake: [
    [6, 6],
    [6, 9.5],
    [6.7, 9.5]
  ]
};

// A point at fraction f of a route's length, on the road's surface.
const along = (route: [number, number][]) => {
  const points = route.map(([i, j]) => {
    const { x, y } = iso(i, j);
    return [x, y - 3] as const;
  });
  const lengths = [0];
  for (let k = 1; k < points.length; k++)
    lengths.push(
      lengths[k - 1] +
        Math.hypot(
          points[k][0] - points[k - 1][0],
          points[k][1] - points[k - 1][1]
        )
    );
  const total = lengths[lengths.length - 1];
  return (f: number) => {
    const target = f * total;
    let k = 1;
    while (k < points.length - 1 && lengths[k] < target) k++;
    const t = Math.min(
      1,
      Math.max(0, (target - lengths[k - 1]) / (lengths[k] - lengths[k - 1]))
    );
    return [
      points[k - 1][0] + (points[k][0] - points[k - 1][0]) * t,
      points[k - 1][1] + (points[k][1] - points[k - 1][1]) * t
    ] as const;
  };
};

const paths = {
  video: along(routes.video),
  farm: along(routes.farm),
  ops: along(routes.ops),
  lake: along(routes.lake)
};

// Blocks that float around the island, waiting to be placed: a position on
// the screen, a height, a material, and the period of its bob in seconds.
const floating: [
  x: number,
  y: number,
  h: number,
  m: Material,
  period: number
][] = [
  [-300, -30, 0.28, 'core', 5.2],
  [170, -72, 0.2, 'slate', 6.1],
  [322, 20, 0.24, 'gold', 4.6],
  [372, 300, 0.18, 'core', 5.7],
  [-330, 316, 0.22, 'crop', 6.6]
];

const Floating = ({ behind }: { behind: boolean }) =>
  floating
    .filter(([, y]) => y < 100 === behind)
    .map(([x, y, h, m, period]) => (
      <g
        key={`${x},${y}`}
        className="float"
        style={{ animationDuration: `${period}s` }}>
        <Block
          i={(x / 30 + y / 15) / 2}
          j={(y / 15 - x / 30) / 2}
          h={h}
          m={m}
          mark={m === 'core'}
        />
      </g>
    ));

const roads = Array.from({ length: N * N }, (_, k) => [
  Math.floor(k / N),
  k % N
]).filter(([i, j]) => (i === ROAD) !== (j === ROAD));

export const BlockWorld = () => {
  const id = useId().replace(/:/g, '');
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const reduced = useReducedMotion();
  const running = inView && !reduced;
  const activeId = worlds[active].id;

  useEffect(() => {
    if (!running || held) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % worlds.length),
      CYCLE
    );
    return () => clearInterval(timer);
  }, [running, held]);

  // A chosen world stays awake for a while, then the tour goes on.
  useEffect(() => {
    if (!held) return;
    const timer = setTimeout(() => setHeld(false), 12000);
    return () => clearTimeout(timer);
  }, [held, active]);

  const awake = useRef<WorldId>(activeId);
  useEffect(() => {
    awake.current = activeId;
  }, [activeId]);

  const pulses = useRef<(SVGGElement | null)[]>([]);
  const flow = useRef({
    last: -Infinity,
    next: 0,
    slots: Array.from({ length: SLOTS }, () => ({
      t0: -Infinity,
      world: 'video' as WorldId
    }))
  });

  useAnimationFrame((time) => {
    const state = flow.current;
    if (running && time - state.last > SPAWN) {
      state.slots[state.next] = { t0: time, world: awake.current };
      state.next = (state.next + 1) % SLOTS;
      state.last = time;
    }
    state.slots.forEach((slot, k) => {
      const element = pulses.current[k];
      if (!element) return;
      const progress = (time - slot.t0) / LIFE;
      if (!running || progress < 0 || progress > 1) {
        element.setAttribute('opacity', '0');
        return;
      }
      const [x, y] = paths[slot.world](1 - (1 - progress) ** 2);
      element.setAttribute('transform', `translate(${x} ${y})`);
      element.setAttribute(
        'opacity',
        String(Math.min(1, progress * 8, (1 - progress) * 4))
      );
    });
  });

  return (
    <div ref={root}>
      <svg
        viewBox="-400 -118 800 600"
        className="iso block h-auto w-full overflow-visible"
        role="img"
        aria-label={`An island of blocks with funcd at its center and four worlds around it. ${worlds[active].name} is active.`}>
        <defs>
          <radialGradient id={`${id}-shadow`}>
            <stop offset="0" stopColor="var(--iso-shadow)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--iso-shadow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor="#6c5ce7" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6c5ce7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={0} cy={448} rx={340} ry={30} fill={`url(#${id}-shadow)`} />
        <Floating behind />
        <Slab n={N} depth={28} />
        {roads.map(([i, j]) => (
          <Block key={`${i}-${j}`} i={i} j={j} h={0.02} m="road" />
        ))}
        <District
          id="video"
          origin={origins.video}
          awake={activeId === 'video'}
        />
        <District id="ops" origin={origins.ops} awake={activeId === 'ops'} />
        <District id="farm" origin={origins.farm} awake={activeId === 'farm'} />
        <ellipse
          className="core-glow"
          cx={0}
          cy={180}
          rx={80}
          ry={40}
          fill={`url(#${id}-glow)`}
        />
        <Block i={ROAD} j={ROAD} h={0.62} m="core" mark />
        <District id="lake" origin={origins.lake} awake={activeId === 'lake'} />
        {Array.from({ length: SLOTS }, (_, k) => (
          <g
            key={k}
            ref={(element) => {
              pulses.current[k] = element;
            }}
            opacity={0}>
            <circle r={18} fill={`url(#${id}-glow)`} />
            <circle r={4} className="pulse" />
          </g>
        ))}
        <Floating behind={false} />
      </svg>
      <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {worlds.map((world, k) => (
          <button
            key={world.id}
            type="button"
            aria-pressed={k === active}
            onClick={() => {
              setActive(k);
              setHeld(true);
            }}
            className={`relative flex items-center gap-2 overflow-hidden rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
              k === active
                ? 'border-fd-primary/50 bg-fd-primary/10 text-fd-foreground'
                : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground'
            }`}>
            <world.Icon size={16} stroke={1.75} className="shrink-0" />
            <span className="truncate">{world.tab}</span>
            {k === active && running && !held && (
              <span
                key={active}
                className="world-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-fd-primary"
                style={{ animationDuration: `${CYCLE}ms` }}
              />
            )}
          </button>
        ))}
      </div>
      <p
        className="mt-3 text-center text-sm text-fd-muted-foreground"
        aria-live="polite">
        {worlds[active].short}
      </p>
    </div>
  );
};
