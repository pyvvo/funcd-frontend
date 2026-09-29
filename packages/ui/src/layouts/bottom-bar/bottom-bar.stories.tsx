/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconAffiliate,
  IconAssembly,
  IconBrandSafari,
  IconCloudComputing,
  IconDots,
  IconShieldHalfFilled
} from '@tabler/icons-react';
import {
  ReactRouterDecorator,
  ReactRouterLoggerDecorator
} from '@/story-utils';
import BB from './bottom-bar';

type Story = StoryObj<typeof BB>;

const meta: Meta<typeof BB> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Layouts/BottomBar',
  component: BB,
  decorators: [ReactRouterLoggerDecorator, ReactRouterDecorator]
};

export default meta;

export const BottomBar: Story = {
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
    visible: true
  }
};
