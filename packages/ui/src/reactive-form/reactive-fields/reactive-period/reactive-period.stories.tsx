import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ReactiveFieldStoryType } from '../types';
import RP from './reactive-period';
import { PeriodCustomProps } from './types';

type Story = StoryObj<ReactiveFieldStoryType<PeriodCustomProps>>;

const meta: Meta<typeof RP> = {
  title: 'Reactive Field/ReactivePeriod',
  component: RP,
  decorators: [ReactiveFieldDecorator()]
};

export default meta;

export const ReactivePeriod: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );
    await userEvent.click(within(fieldRef).getByText('3M'));
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: { preset: '3M' }
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Period',
    customProps: {
      presets: ['7d', '1M', '3M', 'YTD', '1Y', 'all']
    }
  }
};

// A custom range of months: the calendar opens on the given month, and two
// clicks pick its ends.
export const MonthRange: Story = {
  play: async ({ canvasElement, args: { fieldKey } }) => {
    const { fieldRef, submitRef, resultRef } = getReactiveRef(
      canvasElement,
      fieldKey
    );
    await userEvent.click(
      within(fieldRef).getByRole('button', { name: /Custom/ })
    );
    // Mantine renders the calendar in a portal, outside the canvas.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole('button', { name: 'Jan' }));
    await userEvent.click(body.getByRole('button', { name: 'Mar' }));
    await userEvent.click(submitRef);
    await waitFor(async () => {
      await expect(JSON.parse(resultRef.value)).toEqual({
        value: { from: '2026-01', to: '2026-03' }
      });
    });
  },
  args: {
    fieldKey: 'value',
    label: 'Period',
    customProps: {
      presets: ['3M', '6M', 'YTD', '1Y', 'all'],
      unit: 'month',
      defaultDate: '2026-06-01'
    }
  }
};
