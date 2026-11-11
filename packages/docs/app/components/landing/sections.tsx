import { FuncdLogo, FuncdWordmark } from '@funcd-dev/ui/logo';
import {
  IconArrowRight,
  IconDatabase,
  IconMathFunction,
  IconRobot,
  IconSitemap,
  IconStack2,
  IconWorldWww
} from '@tabler/icons-react';
import { useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import InstallCommand from './install-command';
import { Block, District, Slab, type Material, type WorldId } from './iso';
import { blocks, worlds } from './worlds';

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-fd-primary">
    {children}
  </p>
);

const Heading = ({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
      {title}
    </h2>
    <p className="mt-5 text-base text-fd-muted-foreground text-pretty sm:text-lg">
      {lead}
    </p>
  </div>
);

// A world's district assembles itself when it scrolls into view.
const WorldVignette = ({ id }: { id: WorldId }) => {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  return (
    <svg
      ref={ref}
      viewBox="-200 -128 400 330"
      className="iso mx-auto block h-auto w-full max-w-[340px]"
      aria-hidden>
      <Slab n={6} depth={18} />
      <District id={id} origin={[0, 0]} awake={seen} />
    </svg>
  );
};

export const Worlds = () => (
  <section className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6 sm:py-32">
    <Heading
      eyebrow="Worlds to build"
      title="From data-driven video to the edge of a field"
      lead="The same few blocks assemble into very different worlds. Here are four of them."
    />
    <div className="mt-16 grid gap-5 md:grid-cols-2">
      {worlds.map((world) => (
        <article
          key={world.id}
          className="group relative flex flex-col overflow-hidden rounded-3xl border bg-fd-card/40 transition-colors hover:border-fd-primary/40">
          <div className="relative border-b px-6 pt-6">
            <WorldVignette id={world.id} />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <div className="flex items-center gap-2 text-fd-primary">
              <world.Icon size={18} stroke={1.75} />
              <span className="font-mono text-xs uppercase tracking-[0.16em]">
                {world.name}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
              {world.title}
            </h3>
            <p className="mt-3 text-fd-muted-foreground text-pretty">
              {world.text}
            </p>
            <ol className="mt-6 flex flex-wrap items-center gap-1.5">
              {world.recipe.map((name, k) => {
                const { Icon, href } = blocks[name];
                return (
                  <li key={name} className="flex items-center gap-1.5">
                    {k > 0 && (
                      <IconArrowRight
                        size={14}
                        className="text-fd-muted-foreground/60"
                        aria-hidden
                      />
                    )}
                    <Link
                      to={href}
                      className="flex items-center gap-1.5 rounded-full border bg-fd-background px-2.5 py-1 font-mono text-xs transition-colors hover:border-fd-primary/50 hover:text-fd-primary">
                      <Icon size={14} stroke={1.75} />
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const tiles = [
  {
    name: 'Functions',
    Icon: IconMathFunction,
    text: 'Code in TypeScript or Python, called over HTTP, by an event or on a timer.',
    href: '/docs/platform/workloads/function'
  },
  {
    name: 'Agents',
    Icon: IconRobot,
    text: 'Event-driven code that runs in bursts and keeps its state in platform services.',
    href: '/docs'
  },
  {
    name: 'Workflows',
    Icon: IconSitemap,
    text: 'Steps that each run a Function, in order or by their dependencies.',
    href: '/docs/platform/events-and-workflows/workflows'
  },
  {
    name: 'Data services',
    Icon: IconDatabase,
    text: 'KV tables, Buckets, SQL databases and Lakes, bound to a Function by name.',
    href: '/docs/platform/services'
  },
  {
    name: 'Apps',
    Icon: IconStack2,
    text: 'A whole app in one resource, rolled out and rolled back through its revisions.',
    href: '/docs/platform/workloads/app'
  },
  {
    name: 'Sites',
    Icon: IconWorldWww,
    text: 'A static web app, served from its own Bucket and Route.',
    href: '/docs/platform/workloads/site'
  }
];

export const Blocks = () => (
  <section className="relative border-y bg-fd-card/30">
    <div className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6 sm:py-32">
      <Heading
        eyebrow="The blocks"
        title="A few blocks that fit together"
        lead="Each block does one job. funcd deploys, runs, exposes and monitors all of them from one binary."
      />
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ name, Icon, text, href }) => (
          <Link
            key={name}
            to={href}
            className="group relative flex gap-4 overflow-hidden rounded-2xl border bg-fd-background p-6 transition-colors hover:border-fd-primary/40">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-fd-primary/10 text-fd-primary">
                  <Icon size={19} stroke={1.75} />
                </span>
                <h3 className="font-semibold">{name}</h3>
              </div>
              <p className="mt-3 text-sm text-fd-muted-foreground text-pretty">
                {text}
              </p>
            </div>
            <svg
              viewBox="-34 -58 68 82"
              className="iso mini -mr-1 h-14 w-12 shrink-0 self-end"
              aria-hidden>
              <Block i={0} j={0} h={0.3} m="core" mark />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// Three small scenes on a 3 × 3 patch: each cell's height and material, and
// whether it carries the funcd mark.
type Scene = (i: number, j: number) => [number, Material, boolean?];

const laptop: Scene = (i, j) => {
  if (i === 1 && j < 2) return [0.55, 'screen'];
  if (i === 2 && j < 2) return [0.06, 'slate'];
  return [0.03, 'ground'];
};

const server: Scene = (i, j) =>
  i === 1 ? [0.85, 'hall', j === 1] : [0.03, 'ground'];

const field: Scene = (i, j) => {
  if (i === 0 && j === 0) return [0.42, 'core', true];
  return j % 2 === 0 ? [0.13, 'crop'] : [0.05, 'soil'];
};

const SceneArt = ({ scene }: { scene: Scene }) => {
  const cells = Array.from({ length: 9 }, (_, k) => [
    Math.floor(k / 3),
    k % 3
  ]).sort(([a, b], [c, d]) => a + b - (c + d));
  return (
    <svg viewBox="-100 -95 200 195" className="iso h-40 w-auto" aria-hidden>
      <Slab n={3} depth={12} />
      {cells.map(([i, j]) => {
        const [h, m, mark] = scene(i, j);
        return (
          <Block
            key={`${i}-${j}`}
            i={i}
            j={j}
            h={h}
            m={m}
            d={i + j}
            mark={mark}
          />
        );
      })}
    </svg>
  );
};

const stops = [
  {
    name: 'Laptop',
    scene: laptop,
    text: 'funcdctl dev runs the Functions and an embedded platform on macOS or Linux.'
  },
  {
    name: 'Server',
    scene: server,
    text: 'funcd runs on a Linux server as one binary and one systemd unit.'
  },
  {
    name: 'Field',
    scene: field,
    text: 'The same binary runs on a small Linux machine at the edge.'
  }
];

const facts = [
  { value: '1', label: 'binary for the whole platform' },
  { value: '0', label: 'workers while a Function is idle' },
  { value: '2', label: 'languages: TypeScript and Python' },
  { value: 'Apache 2.0', label: 'open source' }
];

export const OneBinary = () => (
  <section className="mx-auto w-full max-w-[1200px] px-4 py-24 sm:px-6 sm:py-32">
    <Heading
      eyebrow="One binary"
      title="The same platform, from a laptop to the field"
      lead="One funcd binary holds the API, the controller, the gateway and the runtime that starts the workers. The same manifests run under funcdctl dev on a laptop and on any Linux machine that runs funcd, in a rack or beside the crops."
    />
    <div className="relative mt-16">
      <div
        aria-hidden
        className="journey-line absolute inset-x-[16%] top-28 hidden h-px md:block"
      />
      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-4">
        {stops.map(({ name, scene, text }) => (
          <li key={name} className="flex flex-col items-center text-center">
            <SceneArt scene={scene} />
            <h3 className="mt-4 font-semibold">{name}</h3>
            <p className="mt-2 max-w-xs text-sm text-fd-muted-foreground text-pretty">
              {text}
            </p>
          </li>
        ))}
      </ol>
    </div>
    <dl className="mt-16 grid grid-cols-2 overflow-hidden rounded-3xl border lg:grid-cols-4">
      {facts.map(({ value, label }) => (
        <div
          key={label}
          className="border-fd-border p-6 even:border-l max-lg:[&:nth-child(n+3)]:border-t lg:border-l lg:first:border-l-0">
          <dt className="sr-only">{label}</dt>
          <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {value}
          </dd>
          <dd className="mt-1 text-sm text-fd-muted-foreground">{label}</dd>
        </div>
      ))}
    </dl>
  </section>
);

export const FinalCta = () => (
  <section className="relative overflow-hidden border-t">
    <div
      aria-hidden
      className="cta-glow pointer-events-none absolute inset-0"
    />
    <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 py-28 text-center sm:px-6 sm:py-36">
      <FuncdLogo
        size={72}
        color="currentColor"
        accentColor="var(--funcd-primary-9)"
        className="cta-mark text-fd-foreground"
        aria-hidden
      />
      <h2 className="mt-8 text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
        Start building tomorrow
      </h2>
      <p className="mt-5 max-w-xl text-fd-muted-foreground sm:text-lg">
        Install funcdctl, then run a first Function on the local machine.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/docs/get-started/quickstart"
          className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90">
          Quickstart
          <IconArrowRight size={16} />
        </Link>
        <Link
          to="/docs/get-started/install"
          className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:bg-fd-accent">
          Install
        </Link>
      </div>
      <InstallCommand className="mt-6" />
    </div>
  </section>
);

export const Footer = () => (
  <footer className="border-t">
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-10 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3 text-fd-foreground">
        <FuncdLogo size={26} color="currentColor" aria-hidden />
        <FuncdWordmark width={70} color="currentColor" />
        <span className="ml-2 text-fd-muted-foreground">
          Apache License 2.0 · The funcd Authors
        </span>
      </div>
      <nav className="flex gap-6">
        <Link to="/docs" className="hover:text-fd-foreground">
          Documentation
        </Link>
        <a
          href="https://github.com/pyvvo/funcd/releases"
          className="hover:text-fd-foreground">
          Releases
        </a>
        <a
          href="https://github.com/pyvvo/funcd"
          className="hover:text-fd-foreground">
          GitHub
        </a>
      </nav>
    </div>
  </footer>
);
