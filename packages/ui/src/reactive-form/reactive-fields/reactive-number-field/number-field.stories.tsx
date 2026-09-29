import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import RTF from './number-field';
import { NumberFieldCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<NumberFieldCustomProps>>;

const meta: Meta<typeof RTF> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveNumberField',
  component: RTF,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveNumberField: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );

    await userEvent.type(fieldRef, '10');
    await userEvent.click(submitRef);
    // expect(JSON.parse(resultRef.value)).toEqual({
    //   value: 'example'
    // });
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: 10
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Number',
    options: {
      required: true
    },
    customProps: {
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
