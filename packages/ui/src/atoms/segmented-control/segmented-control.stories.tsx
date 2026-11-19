import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from '@mantine/core';

type Story = StoryObj<typeof SegmentedControl>;

const meta: Meta<typeof SegmentedControl> = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
};

export default meta;

export const _SegmentedControl: Story = {
  args: {
    data: ['7d', '1M', '3M', 'YTD', '1Y', 'All'],
    defaultValue: '3M'
  }
};
