import {
  IconBolt,
  IconBraces,
  IconBucket,
  IconBuildingFactory2,
  IconClock,
  IconMathFunction,
  IconMovie,
  IconPlant2,
  IconRipple,
  IconRobot,
  IconSitemap,
  IconTable,
  IconWorld
} from '@tabler/icons-react';
import type { WorldId } from './iso';

// The blocks a world is assembled from, with the page that documents each.
export const blocks = {
  Agent: { Icon: IconRobot, href: '/docs' },
  Bucket: { Icon: IconBucket, href: '/docs/platform/services/bucket' },
  Event: { Icon: IconBolt, href: '/docs/platform/events-and-workflows/events' },
  Function: {
    Icon: IconMathFunction,
    href: '/docs/platform/workloads/function'
  },
  HTTP: { Icon: IconWorld, href: '/docs/platform/workloads/function' },
  KV: { Icon: IconBraces, href: '/docs/platform/services/kv' },
  Lake: { Icon: IconRipple, href: '/docs/platform/services/lake' },
  SQL: { Icon: IconTable, href: '/docs/platform/services/sql' },
  Timer: {
    Icon: IconClock,
    href: '/docs/platform/events-and-workflows/events'
  },
  Workflow: {
    Icon: IconSitemap,
    href: '/docs/platform/events-and-workflows/workflows'
  }
};

export type BlockName = keyof typeof blocks;

// Worlds that the blocks can build. They are examples, not deployments.
export const worlds: {
  id: WorldId;
  name: string;
  tab: string;
  Icon: typeof IconMovie;
  short: string;
  title: string;
  text: string;
  recipe: BlockName[];
}[] = [
  {
    id: 'video',
    name: 'Video generation',
    tab: 'Video',
    Icon: IconMovie,
    short: 'Data in, videos out.',
    title: 'Data-driven video generation',
    text: 'A Workflow reads each record from a Lake, an agent writes its script, a rendering step produces the video, and a Bucket keeps it. Each step is a Function that scales to zero between runs.',
    recipe: ['Lake', 'Workflow', 'Agent', 'Bucket']
  },
  {
    id: 'farm',
    name: 'Farm supervision',
    tab: 'Farm',
    Icon: IconPlant2,
    short: 'The whole platform on one small machine in the field.',
    title: 'Farm supervision at the edge',
    text: 'One small Linux machine in the field runs the whole platform. Sensors call Functions over HTTP, the readings go into a SQL database, and a timer starts the agent that writes the morning report.',
    recipe: ['HTTP', 'Function', 'SQL', 'Timer', 'Agent']
  },
  {
    id: 'ops',
    name: 'Operations',
    tab: 'Operations',
    Icon: IconBuildingFactory2,
    short: 'Agents that start on an event, decide and act.',
    title: 'Agents that operate machines',
    text: 'Each agent watches the machines that it operates. It starts on an event, reads the state that it keeps in KV, decides, and calls the next Function.',
    recipe: ['Event', 'Agent', 'KV', 'Function']
  },
  {
    id: 'lake',
    name: 'Data lakehouse',
    tab: 'Lakehouse',
    Icon: IconRipple,
    short: 'Raw files in, answers out.',
    title: 'A lakehouse from raw files',
    text: 'Files arrive in a Bucket, Workflows refine them layer by layer, and a Lake answers SQL over the result. Every query is checked before it runs.',
    recipe: ['Bucket', 'Workflow', 'Lake']
  }
];
