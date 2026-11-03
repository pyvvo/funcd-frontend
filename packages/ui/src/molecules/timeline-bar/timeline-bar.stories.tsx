import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import TimelineBar from './timeline-bar';

type Story = StoryObj<typeof TimelineBar>;

const meta: Meta<typeof TimelineBar> = {
  title: 'Molecules/TimelineBar',
  component: TimelineBar,
  parameters: { layout: 'padded' }
};

export default meta;

const now = dayjs().startOf('hour');
const at = (hoursAgo: number) => now.subtract(hoursAgo, 'hour').toISOString();

export const _TimelineBar: Story = {
  args: {
    from: at(7 * 24),
    to: at(0),
    segments: [
      { start: at(7 * 24), end: at(130), color: 'green', label: 'Up' },
      { start: at(130), end: at(124), color: 'orange', label: 'Degraded' },
      { start: at(124), end: at(80), color: 'green', label: 'Up' },
      { start: at(80), end: at(77), color: 'red', label: 'Down' },
      { start: at(77), end: at(20), color: 'green', label: 'Up' },
      { start: at(20), end: at(0), color: 'red', label: 'Down' }
    ]
  }
};

export const Day: Story = {
  args: {
    from: at(24),
    to: at(0),
    segments: [
      { start: at(24), end: at(9), color: 'green', label: 'Up' },
      { start: at(9), end: at(7.5), color: 'red', label: 'Down' },
      { start: at(7.5), end: at(0), color: 'green', label: 'Up' }
    ]
  }
};

export const ShortSegments: Story = {
  args: {
    from: at(30 * 24),
    to: at(0),
    height: 16,
    segments: [
      { start: at(600), end: at(599.8), color: 'red', label: 'Down' },
      { start: at(400), end: at(399.5), color: 'orange', label: 'Degraded' },
      { start: at(150), end: at(149.9), color: 'red', label: 'Down' }
    ]
  }
};

export const Empty: Story = {
  args: {
    from: at(7 * 24),
    to: at(0),
    segments: []
  }
};
