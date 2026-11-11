import { FuncdLogo } from '@funcd-dev/ui/logo';
import {
  IconArrowDown,
  IconBraces,
  IconBucket,
  IconChartLine,
  IconClock,
  IconDatabase,
  IconDatabaseEdit,
  IconListCheck,
  IconLogs,
  IconMathFunction,
  IconPlug,
  IconProgressCheck,
  IconRipple,
  IconRobot,
  IconSitemap,
  IconTable,
  IconTimeline,
  IconTimelineEvent,
  IconWorld
} from '@tabler/icons-react';
import { useReducedMotion } from 'motion/react';
import { useState, type PropsWithChildren } from 'react';
import { AnimatedBlock, AnimationLoop } from './animation';

// All stage timing lives here; a block knows only its own window.
const timing = {
  duration: 5.5,
  triggers: { at: 0, stagger: 0.18 },
  toFuncd: { at: 0.7, duration: 0.6 },
  funcd: { at: 0.9, duration: 2.2 },
  features: { at: 1.1, stagger: 0.18 },
  toServices: { at: 1.8, duration: 0.6 },
  services: { at: 2.1, stagger: 0.18 },
  observability: { at: 2.4, stagger: 0.18 },
  toStorage: { at: 3, duration: 0.6 },
  storage: { at: 3.3, stagger: 0.18 }
};

// A part that is not built yet is drawn dashed and never pulses.
type Part = { label: string; Icon: typeof IconWorld; planned?: boolean };

const triggers: Part[] = [
  { label: 'HTTP', Icon: IconWorld },
  { label: 'Timer', Icon: IconClock },
  { label: 'Data change', Icon: IconDatabaseEdit },
  { label: 'Custom connector', Icon: IconPlug, planned: true }
];

const features: Part[] = [
  { label: 'Functions', Icon: IconMathFunction },
  { label: 'Workflows', Icon: IconSitemap },
  { label: 'Agents', Icon: IconRobot },
  { label: 'Jobs', Icon: IconProgressCheck, planned: true }
];

const services: Part[] = [
  { label: 'S3', Icon: IconBucket },
  { label: 'KV', Icon: IconBraces },
  { label: 'SQL', Icon: IconTable },
  { label: 'Lake', Icon: IconRipple }
];

const observability: Part[] = [
  { label: 'Logs', Icon: IconLogs },
  { label: 'Metrics', Icon: IconChartLine },
  { label: 'Traces', Icon: IconTimeline }
];

const storage: Part[] = [
  { label: 'Metastore', Icon: IconDatabase },
  { label: 'Event store', Icon: IconTimelineEvent },
  { label: 'Run state', Icon: IconListCheck }
];

const tile =
  'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center text-xs font-medium';

const Row = ({
  parts,
  at,
  stagger,
  surface,
  columns = 'grid-cols-2 sm:grid-cols-4'
}: {
  parts: Part[];
  at: number;
  stagger: number;
  surface: string;
  columns?: string;
}) => (
  <div className={`grid w-full gap-2 ${columns}`}>
    {parts.map(({ label, Icon, planned }, index) =>
      planned ? (
        <div
          key={label}
          className={`${tile} border-dashed text-fd-muted-foreground`}>
          <Icon aria-hidden="true" size={20} stroke={1.6} />
          <span>{label}</span>
          <span className="rounded-full border px-1.5 text-[10px] font-normal">
            planned
          </span>
        </div>
      ) : (
        <AnimatedBlock
          key={label}
          className={`${tile} ${surface}`}
          at={at + index * stagger}
          lift={-5}
          glow={16}>
          <Icon aria-hidden="true" size={20} stroke={1.6} />
          <span>{label}</span>
        </AnimatedBlock>
      )
    )}
  </div>
);

const Group = ({
  title,
  className = 'w-full',
  children
}: PropsWithChildren<{ title: string; className?: string }>) => (
  <div className={`flex flex-col gap-2 rounded-lg border p-3 ${className}`}>
    <span className="text-xs font-medium text-fd-muted-foreground">
      {title}
    </span>
    {children}
  </div>
);

const Arrow = ({ at, duration }: { at: number; duration: number }) => (
  <AnimatedBlock
    className="flex justify-center text-fd-muted-foreground"
    at={at}
    duration={duration}
    lift={6}>
    <IconArrowDown aria-hidden="true" size={18} />
  </AnimatedBlock>
);

// What starts the code, what runs on funcd and the services it uses, what
// observes them, and the storage layer under them, as one animated loop.
export const PlatformDiagram = () => {
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <AnimationLoop paused={paused} duration={timing.duration}>
      <div className="not-prose my-8 flex flex-col items-center gap-3">
        <figure
          className="flex w-full max-w-2xl flex-col items-center gap-3"
          aria-label="HTTP calls, timers and data changes start Functions, Workflows and agents on funcd, which keep their data in its S3, KV, SQL and Lake services. Beside them, funcd's observability records logs, metrics and traces. Under them, funcd's storage layer holds the metastore, the event store and the run state. Custom connectors and Jobs are planned.">
          <Group title="Triggers">
            <Row
              parts={triggers}
              {...timing.triggers}
              surface="bg-fd-card text-fd-card-foreground"
            />
          </Group>
          <Arrow {...timing.toFuncd} />
          <AnimatedBlock
            className="flex w-full flex-col gap-3 rounded-xl border bg-fd-card p-4 text-fd-card-foreground"
            {...timing.funcd}
            glow={26}>
            <div className="flex items-center gap-2 font-semibold">
              <FuncdLogo size={22} color="currentColor" aria-hidden />
              funcd
              <span className="text-xs font-normal text-fd-muted-foreground">
                one binary
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Group title="Features">
                  <Row
                    parts={features}
                    {...timing.features}
                    surface="bg-fd-background"
                  />
                </Group>
                <Arrow {...timing.toServices} />
                <Group title="Services">
                  <Row
                    parts={services}
                    {...timing.services}
                    surface="bg-fd-background"
                  />
                </Group>
              </div>
              {/* Beside both layers: funcd observes the Features and the Services alike. */}
              <Group title="Observability" className="w-full sm:w-28">
                <Row
                  parts={observability}
                  {...timing.observability}
                  surface="bg-fd-background"
                  columns="grid-cols-3 sm:flex-1 sm:grid-cols-1 sm:auto-rows-fr"
                />
              </Group>
            </div>
          </AnimatedBlock>
          <Arrow {...timing.toStorage} />
          <Group title="Storage layer">
            <Row
              parts={storage}
              {...timing.storage}
              surface="bg-fd-card text-fd-card-foreground"
              columns="grid-cols-3"
            />
          </Group>
        </figure>
        <button
          type="button"
          className="rounded-md border px-2.5 py-1 text-xs text-fd-muted-foreground hover:bg-fd-accent"
          hidden={reducedMotion === true}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}>
          {paused ? 'Play animation' : 'Pause animation'}
        </button>
      </div>
    </AnimationLoop>
  );
};
