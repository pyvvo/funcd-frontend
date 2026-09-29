import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import RTF from './reactive-text-field';
import { TextFieldCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<TextFieldCustomProps>>;

const meta: Meta<typeof RTF> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveTextField ',
  component: RTF,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveTextField: Story = {
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
      // required: { message: 'test', value: true },
      // required: true,
      minLength: ((val) => {
        return { message: `min lenght ${val}`, value: val };
      })(3)
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
