/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@mantine/core';

type Story = StoryObj<typeof Switch>;

const meta: Meta<typeof Switch> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    label: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    error: {
      control: 'text'
    },
    color: {
      options: ['blue', 'red', 'cyan', 'yellow', 'gray'],
      control: { type: 'select' }
    },
    radius: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
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
    labelPosition: {
      options: ['right', 'left'],
      control: { type: 'select' }
    },
    onLabel: {
      control: 'text'
    },
    offLabel: {
      control: 'text'
    }
  }
};
export default meta;

export const _Switch: Story = {
  args: {
    size: 'md',
    radius: 'lg',
    label: 'I agree to sell my privacy',
    error: 'Accept to continue'
  }
};
