import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from 'storybook/test';
import { waitFor, within } from '@testing-library/dom';
import { expect } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import ReactiveField from './reactive-multi-select';
import { MultiSelectCustomProps } from './types';
import { wait } from '@/utils';

type Story = StoryObj<ReactiveFieldStoryType<MultiSelectCustomProps>>;

const meta: Meta<typeof ReactiveField> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveMultiSelect',
  component: ReactiveField,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveMultiSelect: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    async function selectOption(option: string, canvasElement: HTMLElement) {
      const canvas = within(canvasElement);

      const optionRef = canvas.getByText(option);
      await userEvent.click(optionRef);
    }
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );

    await userEvent.click(fieldRef);
    await wait(200);

    // Mantine renders the options in a portal, outside the canvas.
    const { body } = canvasElement.ownerDocument;
    await selectOption('React', body);
    await selectOption('Angular', body);

    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: ['React', 'Angular']
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Multi select',
    options: {
      required: { message: 'not empty', value: true }
    },
    customProps: {
      disabled: false,
      data: ['React', 'Angular', 'Svelte', 'Vue']
    }
  }
};
