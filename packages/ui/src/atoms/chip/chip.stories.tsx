/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@mantine/core';

type Story = StoryObj<typeof Chip>;

const meta: Meta<typeof Chip> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/Chip',
  component: Chip,
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    radius: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    variant: {
      options: ['filled', 'outline', 'light'],
      control: { type: 'select' }
    },
    disabled: {
      options: ['true', 'false'],
      control: { type: 'boolean' }
    },
    checked: {
      options: ['true', 'false'],
      control: { type: 'boolean' }
    },
    children: {
      control: { type: 'text' }
    }
  }
};
export default meta;

export const _Chip: Story = {
  args: {
    size: 'md',
    radius: 'xl',
    children: 'Awesome chip'
  }
};
