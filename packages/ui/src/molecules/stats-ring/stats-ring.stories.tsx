/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import SR from './index';

type Story = StoryObj<typeof SR>;

const meta: Meta<typeof SR> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Molecules/StatsRing',
  component: SR
};

export default meta;

export const Exemple1: Story = {
  args: {
    label: 'Page views',
    stats: '456,578',
    progress: 65,
    color: 'teal',
    icon: 'up'
  }
};

export const Exemple2: Story = {
  args: {
    label: 'New users',
    stats: '2,550',
    progress: 72,
    color: 'blue',
    icon: 'up'
  }
};

export const Exemple3: Story = {
  args: {
    label: 'Orders',
    stats: '4,735',
    progress: 52,
    color: 'red',
    icon: 'down'
  }
};
