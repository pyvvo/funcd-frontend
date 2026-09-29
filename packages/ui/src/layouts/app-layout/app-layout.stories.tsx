import {
  IStoryRoutes,
  MantineSpotlightDecorator,
  ReactRouterDecoratorWithOutlet,
  ReactRouterLoggerDecorator
} from '@/story-utils';
import { Simplify } from '@/types';
import { SpotlightActionData } from '@mantine/spotlight';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconAffiliate,
  IconAssembly,
  IconBrandSafari,
  IconCloudComputing,
  IconDashboard,
  IconDots,
  IconFileText,
  IconHome,
  IconShieldHalfFilled
} from '@tabler/icons-react';
import Chance from 'chance';
import AL from './app-layout';

type ComponentProps = Simplify<
  Parameters<typeof AL>[0] & {
    routes: IStoryRoutes[];
    location?: undefined;
    actions: SpotlightActionData[];
  }
>;

type Story = StoryObj<ComponentProps>;

const meta: Meta<typeof AL> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Layouts/AppLayout',
  component: AL,
  decorators: [
    ReactRouterLoggerDecorator,
    ReactRouterDecoratorWithOutlet,
    MantineSpotlightDecorator
  ]
};

export default meta;

const chance = new Chance();

const RandomTextComponent = () => {
  const text = chance.paragraph({ sentences: 1000 });
  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

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

export const AppLayout: Story = {
  args: {
    modules: [
      {
        icon: IconBrandSafari,
        label: 'Dashboard',
        color: 'indigo',
        isBottom: false,
        to: '/dashboard'
      },
      {
        icon: IconCloudComputing,
        label: 'Collector',
        color: 'indigo',
        to: '/collector'
      },
      {
        icon: IconAffiliate,
        label: 'Dispatcher',
        color: 'grape',
        to: '/dispatcher'
      },
      {
        icon: IconShieldHalfFilled,
        label: 'IAM',
        to: '/iam'
      },
      {
        icon: IconDots,
        label: 'More',
        to: '/'
      },
      {
        icon: IconAssembly,
        label: 'Settings',
        isBottom: true,
        to: '/settings'
      }
    ],
    routes: [
      {
        to: '/dashboard',
        element: <div>dashboard</div>
      },
      {
        to: '/collector',
        element: <div>Collector</div>
      },
      {
        to: '/dispatcher',
        element: <RandomTextComponent />
      }
    ],
    imageSrc: chance.avatar({ protocol: 'https' }),
    offset: 12,
    actions
  },
  argTypes: {
    withHeader: {
      control: {
        type: 'boolean'
      }
    }
  }
};
