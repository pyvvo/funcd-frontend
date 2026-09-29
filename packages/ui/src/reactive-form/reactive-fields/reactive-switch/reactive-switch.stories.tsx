import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from 'storybook/test';
import { waitFor } from '@testing-library/dom';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import ReactiveField from './reactive-switch';
import { SwitchCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<SwitchCustomProps>>;

const meta: Meta<typeof ReactiveField> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveSwitch',
  component: ReactiveField,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveSwitch: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );

    await userEvent.click(fieldRef);
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: true
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'switch',
    options: {
      required: false
    },
    customProps: {
      disabled: false
    }
  }
};
