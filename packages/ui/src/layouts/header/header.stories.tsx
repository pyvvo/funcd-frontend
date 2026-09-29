import type { Meta, StoryObj } from '@storybook/react';
import Chance from 'chance';
import { IconHome, IconDashboard, IconFileText } from '@tabler/icons-react';
import {
  MantineSpotlightDecorator,
  ReactRouterDecorator,
  ReactRouterLoggerDecorator
} from '@/story-utils';
import H from './header';
import { Simplify } from '@/types';
import { SpotlightActionData } from '@mantine/spotlight';

type ComponentProps = Simplify<
  Parameters<typeof H>[0] & {
    actions: SpotlightActionData[];
  }
>;

type Story = StoryObj<ComponentProps>;

const meta: Meta<ComponentProps> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Layouts/Header',
  component: H,
  decorators: [
    ReactRouterLoggerDecorator,
    ReactRouterDecorator,
    MantineSpotlightDecorator
  ]
};

export default meta;

const chance = new Chance();
const actions: SpotlightActionData[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Get to home page',
    onClick: () => console.log('Home'),
    leftSection: <IconHome size={18} />
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Get full information about current system status',
    onClick: () => console.log('Dashboard'),
    leftSection: <IconDashboard size={18} />
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Visit documentation to lean more about all features',
    onClick: () => console.log('Documentation'),
    leftSection: <IconFileText size={18} />
  }
];

export const Header: Story = {
  args: {
    moduleName: 'Dashboard',
    imageSrc: chance.avatar({ protocol: 'https' }),
    offset: 0,
    actions
  }
};
