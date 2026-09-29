/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import TCM from './index';

type Story = StoryObj<typeof TCM>;

const meta: Meta<typeof TCM> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Molecules/ToggleThemeMode',
  component: TCM
};

export default meta;

export const ToggleThemeMode: Story = {};
