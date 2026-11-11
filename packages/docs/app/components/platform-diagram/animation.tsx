import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue
} from 'motion/react';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type PropsWithChildren
} from 'react';

// The clock and the pulses of an animated diagram, after the zvec-grep demo
// (output/zvec-grep): one clock per diagram, and each block pulses within its
// own window of it. Highlights take funcd UI's primary color (primary 9).
const highlight = '#6c5ce7';
const faint = 'rgba(108, 92, 231, 0.25)';
const tint = (alpha: number) => `rgba(108, 92, 231, ${alpha})`;

const ClockContext = createContext<MotionValue<number> | null>(null);

// Pausing freezes every pulse in place. Under reduced motion the clock stays at
// 0, which leaves the still diagram.
export const AnimationLoop = ({
  children,
  paused = false,
  duration = 6
}: PropsWithChildren<{ paused?: boolean; duration?: number }>) => {
  const time = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const playback = useRef<{ play(): void; pause(): void } | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (paused) playback.current?.pause();
    else playback.current?.play();
  }, [paused, duration, reducedMotion]);

  return <ClockContext.Provider value={time}>{children}</ClockContext.Provider>;
};

// A smooth 0 → 1 → 0 pulse within a window of the diagram's clock.
const usePulse = (at: number, duration: number) => {
  const time = useContext(ClockContext);
  if (!time) throw new Error('Animated blocks must be inside AnimationLoop.');
  return useTransform(time, [at, at + duration / 2, at + duration], [0, 1, 0], {
    ease: (value: number) => value * value * (3 - 2 * value)
  });
};

// A block that lifts, lights its border and glows during its pulse.
export const AnimatedBlock = ({
  children,
  className,
  at,
  duration = 0.8,
  lift = 0,
  glow = 0
}: PropsWithChildren<{
  className?: string;
  at: number;
  duration?: number;
  lift?: number;
  glow?: number;
}>) => {
  const pulse = usePulse(at, duration);
  const y = useTransform(pulse, [0, 1], [0, lift]);
  const borderColor = useTransform(pulse, [0, 1], [faint, highlight]);
  const boxShadow = useTransform(
    pulse,
    [0, 1],
    [`0 0 0px ${tint(0)}`, `0 0 ${glow}px ${tint(0.35)}`]
  );

  return (
    <motion.div className={className} style={{ y, borderColor, boxShadow }}>
      {children}
    </motion.div>
  );
};
