import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import RTF from './reactive-range';
import { RangeCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<RangeCustomProps>>;

const meta: Meta<typeof RTF> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveRange',
  component: RTF,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveRange: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );
    // Mark labels ignore the pointer, so move the thumb with the keyboard.
    const thumbRef = within(fieldRef).getByRole('slider');
    thumbRef.focus();
    await userEvent.keyboard('{ArrowRight>50/}');
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: 50
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Range',
    options: {
      required: true
    },
    customProps: {
      disabled: false,
      marks: [
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' }
      ]
    }
  }
};
