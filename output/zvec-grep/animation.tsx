import React from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue
} from 'motion/react';

const ClockContext = React.createContext<MotionValue<number> | null>(null);

/** One clock per diagram; pausing freezes every derived animation in place. */
export function AnimationLoop({
  children,
  paused = false,
  duration = 6
}: React.PropsWithChildren<{ paused?: boolean; duration?: number }>) {
  const time = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const playback = React.useRef<{ play(): void; pause(): void } | null>(null);

  React.useEffect(() => {
    time.set(0);
    if (reducedMotion !== false) return;

    const controls = animate(time, [0, duration], {
      duration,
      repeat: Infinity,
      ease: 'linear'
    });
    playback.current = controls;
    return () => {
      controls.stop();
      playback.current = null;
    };
  }, [time, duration, reducedMotion]);

  React.useEffect(() => {
    if (paused) playback.current?.pause();
    else playback.current?.play();
  }, [paused, duration, reducedMotion]);

  return <ClockContext.Provider value={time}>{children}</ClockContext.Provider>;
}

export function useAnimationTime() {
  const time = React.useContext(ClockContext);
  if (!time) throw new Error('Animated blocks must be inside AnimationLoop.');
  return time;
}

/** A smooth 0 → 1 → 0 pulse within a window of the shared clock. */
export function usePulse(at: number, duration: number) {
  const time = useAnimationTime();
  return useTransform(time, [at, at + duration / 2, at + duration], [0, 1, 0], {
    ease: (value: number) => value * value * (3 - 2 * value)
  });
}

type AnimatedBlockProps = React.PropsWithChildren<{
  className?: string;
  at: number;
  duration?: number;
  lift?: number;
  scale?: number;
  border?: string;
  highlight?: string;
  glow?: number;
}>;

/** Reusable pulse surface for source tiles, engine/evidence cards, and audiences. */
export function AnimatedBlock({
  children,
  className,
  at,
  duration = 0.8,
  lift = 0,
  scale: peakScale = 1,
  border,
  highlight = '#14b5fa',
  glow = 0
}: AnimatedBlockProps) {
  const pulse = usePulse(at, duration);
  const y = useTransform(pulse, [0, 1], [0, lift]);
  const scale = useTransform(pulse, [0, 1], [1, peakScale]);
  const borderColor = useTransform(
    pulse,
    [0, 1],
    [border ?? highlight, highlight]
  );
  const boxShadow = useTransform(
    pulse,
    [0, 1],
    ['0 0 0px #14b5fa00', `0 0 ${glow}px #14b5fa35`]
  );

  return (
    <motion.div
      className={className}
      style={{
        y,
        scale,
        ...(border ? { borderColor } : {}),
        ...(glow ? { boxShadow } : {})
      }}>
      {children}
    </motion.div>
  );
}

export function SearchSweep({
  at,
  duration
}: {
  at: number;
  duration: number;
}) {
  const time = useAnimationTime();
  const x = useTransform(time, [at, at + duration], ['-110%', '110%']);
  return (
    <motion.span className="zg-search-sweep" style={{ x }} aria-hidden="true" />
  );
}

export function BlinkingCursor() {
  const time = useAnimationTime();
  const opacity = useTransform(time, (value) =>
    Math.floor(value * 2) % 2 === 0 ? 1 : 0
  );
  return (
    <motion.span className="zg-cursor" style={{ opacity }}>
      _
    </motion.span>
  );
}

export function SearchMethod({
  children,
  at
}: React.PropsWithChildren<{ at: number }>) {
  const pulse = usePulse(at, 0.7);
  const color = useTransform(pulse, [0, 1], ['#a6b1c7', '#e9edfb']);
  const backgroundColor = useTransform(
    pulse,
    [0, 1],
    ['#14b5fa00', '#14b5fa35']
  );
  const borderColor = useTransform(pulse, [0, 1], ['#294e67', '#14b5fa']);
  return (
    <motion.span style={{ color, backgroundColor, borderColor }}>
      {children}
    </motion.span>
  );
}

export function ResultLine({ at }: { at: number }) {
  const pulse = usePulse(at, 0.75);
  const scaleX = useTransform(pulse, [0, 1], [1, 0.2]);
  return <motion.i style={{ scaleX }} />;
}
