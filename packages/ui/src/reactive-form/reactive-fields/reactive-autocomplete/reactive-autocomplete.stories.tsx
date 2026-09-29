import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from 'storybook/test';
import { waitFor, within } from '@testing-library/dom';
import { expect } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import ReactiveField from './reactive-autocomplete';
import { AutocompleteCustomProps } from './types';
import { wait } from '@/utils';

type Story = StoryObj<ReactiveFieldStoryType<AutocompleteCustomProps>>;

const meta: Meta<typeof ReactiveField> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveAutocomplete',
  component: ReactiveField,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveAutocomplete: Story = {
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

    await userEvent.type(fieldRef, 'Re');
    await wait(200);

    // Mantine renders the options in a portal, outside the canvas.
    await selectOption('React', canvasElement.ownerDocument.body);

    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: 'React'
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Autocomplete',
    options: {
      required: false
    },
    customProps: {
      disabled: false,
      data: ['React', 'Angular', 'Svelte', 'Vue']
    }
  }
};
