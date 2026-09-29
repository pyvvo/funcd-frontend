/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconAffiliate,
  IconAssembly,
  IconBrandSafari,
  IconCalendarStats,
  IconCloudComputing,
  IconDeviceDesktopAnalytics,
  IconDots,
  IconGauge,
  IconHome2,
  IconSettings,
  IconShieldHalfFilled,
  IconSwitchHorizontal,
  TablerIcon
} from '@tabler/icons-react';
import {
  ReactRouterDecorator,
  ReactRouterLoggerDecorator
} from '@/story-utils';
import SB from './sidebar';

type Story = StoryObj<typeof SB>;

const meta: Meta<typeof SB> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Layouts/SideBar',
  component: SB,
  decorators: [ReactRouterLoggerDecorator, ReactRouterDecorator]
};

export default meta;

export const SideBar: Story = {
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
    ]
  }
};
