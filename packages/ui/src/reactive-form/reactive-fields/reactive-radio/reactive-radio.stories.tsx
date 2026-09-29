import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { userEvent, waitFor, within } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import ReactiveField from './reactive-radio';
import { RadioCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<RadioCustomProps>>;

const meta: Meta<typeof ReactiveField> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveRadio',
  component: ReactiveField,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveRadio: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      'react'
    );

    await userEvent.click(fieldRef);

    await userEvent.click(fieldRef);
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: 'react'
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'test',
    options: {
      required: false
    },
    customProps: {
      data: [
        { value: 'react', label: 'React' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'ng', label: 'Angular' },
        { value: 'vue', label: 'Vue' }
      ],
      disabled: false
    }
  }
};

// const defaultValues = {
//   username: '',
//   password: ''
// };

// type Data = typeof defaultValues;

// export const ReactiveText: Story<Data> = {
//   args: {
//     meta: [
//       {
//         name: 'fddffd',
//         fields: [
//           {
//             fieldKey: 'username',
//             label: 'username',
//             type: 'text',
//             options: {
//               required: true
//             }
//           }
//         ]
//       }
//     ]
//   }
// };
