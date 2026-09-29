/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import CNDIcon from './cnd';

type Story = StoryObj<typeof CNDIcon>;

const meta: Meta<typeof CNDIcon> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/Logos/CND',
  component: CNDIcon
};

export default meta;

export const CND: Story = {
  args: {
    height: 'auto',
    width: '200px'
  }
};
