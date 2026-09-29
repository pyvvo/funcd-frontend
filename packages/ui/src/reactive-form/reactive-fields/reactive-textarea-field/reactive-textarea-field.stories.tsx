import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import RTF from './reactive-textarea-field';
import { TextareaFieldCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<TextareaFieldCustomProps>>;

const meta: Meta<typeof RTF> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveTextareaField ',
  component: RTF,
  decorators: [ReactiveFieldDecorator()],
  parameters: {
    deepControls: { enabled: true }
  }
};

export default meta;

export const ReactiveTextareaField: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );

    await userEvent.type(fieldRef, 'example');
    await userEvent.click(submitRef);

    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: 'example'
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'test',
    options: {
      minLength: ((val) => {
        return { message: `min lenght ${val}`, value: val };
      })(3)
    },
    customProps: {
      disabled: false,
      minRows: 2,
      maxRows: 4
    }
  }
};
