import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ReactiveFieldStoryType } from '../types';
import RRS from './reactive-range-slider';
import { RangeSliderCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<RangeSliderCustomProps>>;

const meta: Meta<typeof RRS> = {
  title: 'Reactive Field/ReactiveRangeSlider',
  component: RRS,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactiveRangeSlider: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );
    // Mark labels ignore the pointer, so move the thumbs with the keyboard.
    // The keys move the thumb that Mantine saw get focus, and the browser
    // sends focus events only while its window has focus.
    const [fromRef, toRef] = within(fieldRef).getAllByRole('slider');
    fromRef.focus();
    await userEvent.keyboard('{ArrowRight>20/}');
    toRef.focus();
    await userEvent.keyboard('{ArrowLeft>30/}');
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: [20, 70]
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Range slider',
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

const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];

// A label function shows each value as a month, and minRange 0 lets both
// thumbs stop on the same month.
export const MonthLabels: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );
    const [fromRef, toRef] = within(fieldRef).getAllByRole('slider');
    fromRef.focus();
    await userEvent.keyboard('{ArrowRight>3/}');
    toRef.focus();
    await userEvent.keyboard('{ArrowLeft>1/}');
    // A focused thumb shows its label.
    await expect(within(toRef).getByText('2026-04')).toBeInTheDocument();
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: [3, 3]
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Months',
    customProps: {
      min: 0,
      max: months.length - 1,
      minRange: 0,
      label: (value) => months[value]
    }
  }
};
