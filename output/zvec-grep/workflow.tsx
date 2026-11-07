import React from 'react';
import { useReducedMotion } from 'motion/react';
import {
  IconFileCode,
  IconFileText,
  IconFileTypography,
  IconBraces,
  IconTerminal2,
  IconZoomCode,
  IconArrowDown,
  IconUser,
  IconRobot,
  IconGitBranch,
  IconMapPin,
  IconLock,
  IconZoomScan,
  type TablerIcon
} from '@tabler/icons-react';
import {
  AnimationLoop,
  AnimatedBlock,
  BlinkingCursor,
  SearchMethod,
  SearchSweep,
  ResultLine
} from './animation';

// All stage timing lives here; blocks know only their own start and duration.
const timing = {
  duration: 6,
  sources: { at: 0, stagger: 0.18 },
  search: { at: 1.4, duration: 1.5 },
  methods: { at: 1.5, stagger: 0.18 },
  arrow: { at: 2.8, duration: 0.8 },
  evidence: { at: 3.4, duration: 1.2 },
  lines: { at: 3.4, stagger: 0.12 },
  audiences: { at: 4.5, stagger: 0.18 }
};

const sources = [
  { label: 'CODE', Icon: IconFileCode },
  { label: 'MD', Icon: IconFileText },
  { label: 'TXT', Icon: IconFileTypography },
  { label: 'DATA', Icon: IconBraces }
];

function IconTile({ Icon }: { Icon: TablerIcon }) {
  return (
    <span className="zg-icon-tile">
      <Icon aria-hidden="true" />
    </span>
  );
}

export function SourceTile({
  label,
  Icon,
  at
}: {
  label: string;
  Icon: TablerIcon;
  at: number;
}) {
  return (
    <AnimatedBlock
      className="zg-source"
      at={at}
      lift={-5}
      border="#294e67"
      glow={18}>
      <Icon aria-hidden="true" stroke={1.65} />
      <span>{label}</span>
    </AnimatedBlock>
  );
}

export function SearchEngine() {
  return (
    <AnimatedBlock
      className="zg-engine"
      {...timing.search}
      border="#2387bb"
      highlight="#51caff"
      glow={26}>
      <SearchSweep at={timing.search.at} duration={1.4} />
      <div className="zg-command">
        <IconTile Icon={IconTerminal2} />
        <span className="zg-wordmark">
          <span className="zg-prompt">›</span>zg
          <BlinkingCursor />
        </span>
        <IconTile Icon={IconZoomCode} />
      </div>
      <div className="zg-methods" aria-label="Search methods">
        {['exact', 'BM25', 'vector', 'hybrid'].map((method, index) => (
          <SearchMethod
            key={method}
            at={timing.methods.at + index * timing.methods.stagger}>
            {method}
          </SearchMethod>
        ))}
      </div>
    </AnimatedBlock>
  );
}

export function EvidenceCard({
  title = 'Ranked evidence',
  metadata = 'paths · symbols · lines'
}: {
  title?: string;
  metadata?: string;
}) {
  return (
    <AnimatedBlock
      className="zg-evidence"
      {...timing.evidence}
      border="#286181"
      glow={22}>
      <div className="zg-result-preview" aria-hidden="true">
        <IconTile Icon={IconZoomScan} />
        <div className="zg-result-lines">
          {[0, 1, 2].map((index) => (
            <ResultLine
              key={index}
              at={timing.lines.at + index * timing.lines.stagger}
            />
          ))}
        </div>
      </div>
      <strong>{title}</strong>
      <span className="zg-metadata">{metadata}</span>
    </AnimatedBlock>
  );
}

export function Audience({
  label,
  Icon,
  at
}: {
  label: string;
  Icon: TablerIcon;
  at: number;
}) {
  return (
    <AnimatedBlock at={at} duration={0.9} lift={-6} scale={1.12}>
      <Icon aria-hidden="true" stroke={1.5} />
      <span>{label}</span>
    </AnimatedBlock>
  );
}

export function ZvecGrepWorkflow() {
  const [paused, setPaused] = React.useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <AnimationLoop paused={paused} duration={timing.duration}>
      <div className="zg-demo">
        <figure
          className="zg-workflow"
          aria-label="Code, documents, and data flow through Zvec-Grep to people and AI agents">
          <div className="zg-sources" aria-label="Source formats">
            {sources.map((source, index) => (
              <SourceTile
                key={source.label}
                {...source}
                at={timing.sources.at + index * timing.sources.stagger}
              />
            ))}
          </div>
          <SearchEngine />
          <AnimatedBlock className="zg-arrow" {...timing.arrow} lift={7}>
            <IconArrowDown aria-hidden="true" stroke={1.8} />
          </AnimatedBlock>
          <EvidenceCard />
          <div className="zg-audiences">
            <Audience label="People" Icon={IconUser} at={timing.audiences.at} />
            <Audience
              label="AI agents"
              Icon={IconRobot}
              at={timing.audiences.at + timing.audiences.stagger}
            />
          </div>
          <figcaption className="zg-benefits">
            <span>
              <IconGitBranch aria-hidden="true" />
              Beyond keywords
            </span>
            <span>
              <IconMapPin aria-hidden="true" />
              Source-linked
            </span>
            <span>
              <IconLock aria-hidden="true" />
              Local CLI + MCP
            </span>
          </figcaption>
        </figure>
        <button
          className="zg-animation-toggle"
          type="button"
          hidden={reducedMotion === true}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}>
          {paused ? 'Play animation' : 'Pause animation'}
        </button>
      </div>
    </AnimationLoop>
  );
}
