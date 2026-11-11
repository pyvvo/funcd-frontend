import { IconArrowRight } from '@tabler/icons-react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import release from '../../content/release.json';
import { BlockWorld } from '../components/landing/block-world';
import InstallCommand from '../components/landing/install-command';
import {
  Blocks,
  FinalCta,
  Footer,
  OneBinary,
  Worlds
} from '../components/landing/sections';
import { homeOptions } from '../lib/layout.shared';
import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [
  { title: 'funcd · Building blocks for the world of tomorrow' },
  {
    name: 'description',
    content:
      'funcd is a lightweight, modular serverless platform in a single binary for Linux, designed for the agent era.'
  }
];

const Hero = () => (
  <section className="hero relative overflow-hidden">
    <div
      aria-hidden
      className="hero-grid pointer-events-none absolute inset-0"
    />
    <div className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-4 pb-6 pt-14 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.16fr)] lg:gap-4 lg:pb-16 lg:pt-20">
      <div className="max-w-xl">
        <a
          href={`https://github.com/pyvvo/funcd/releases/tag/${release.latest}`}
          className="inline-flex items-center gap-2 rounded-full border bg-fd-background/60 py-1 pl-1 pr-3 text-xs text-fd-muted-foreground backdrop-blur transition-colors hover:text-fd-foreground">
          <span className="rounded-full bg-fd-primary/10 px-2 py-0.5 font-mono font-medium text-fd-primary">
            {release.latest}
          </span>
          Latest release
          <IconArrowRight size={13} />
        </a>
        <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] text-balance sm:text-6xl lg:text-[4.4rem]">
          Building blocks for the{' '}
          <span className="hero-gradient">world of tomorrow</span>
        </h1>
        <p className="mt-6 text-lg text-fd-muted-foreground text-pretty">
          funcd is a lightweight, modular serverless platform in a single binary
          for Linux. Its Functions, agents and workflows fit together into the
          systems of tomorrow, from data-driven video generation to the edge
          that supervises a farm.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            to="/docs/get-started/install"
            className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90">
            Get started
            <IconArrowRight size={16} />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center rounded-full border bg-fd-background/60 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-fd-accent">
            Read the docs
          </Link>
        </div>
        <InstallCommand className="mt-5 w-fit" />
        <p className="mt-4 font-mono text-xs text-fd-muted-foreground">
          funcdctl for macOS and Linux · funcd for Linux
        </p>
      </div>
      <div className="relative">
        <div aria-hidden className="hero-halo pointer-events-none absolute" />
        <BlockWorld />
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <HomeLayout {...homeOptions()}>
      <main className="flex flex-1 flex-col">
        <Hero />
        <Worlds />
        <Blocks />
        <OneBinary />
        <FinalCta />
      </main>
      <Footer />
    </HomeLayout>
  );
}
