/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@mantine/core';

type Story = StoryObj<typeof Radio>;

const meta: Meta<typeof Radio> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/Radio',
  component: Radio,
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
    variant: {
      options: ['filled', 'outline'],
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
    }
  }
};
export default meta;

export const _Radio: Story = {
  args: {
    size: 'md',
    radius: 'md',
    label: 'I agree to sell my privacy',
    error: 'Accept to continue'
  }
};
