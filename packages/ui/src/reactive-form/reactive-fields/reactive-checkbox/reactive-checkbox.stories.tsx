import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { userEvent, waitFor, within } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import ReactiveField from './reactive-checkbox';
import { CheckCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<CheckCustomProps>>;

const meta: Meta<typeof ReactiveField> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveCheckbox ',
  component: ReactiveField,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveCheckbox: Story = {
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
    label: 'test',
    options: {
      required: false
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
