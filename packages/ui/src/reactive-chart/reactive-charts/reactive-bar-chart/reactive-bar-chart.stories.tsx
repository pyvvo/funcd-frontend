import { getChartRef, ReactiveChartDecorator } from '@/story-utils';
import { chartData } from '@/story-utils/payload/chart.payload';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { waitFor, within } from 'storybook/test';
import { ReactiveChartStoryType } from '../types';
import RBC from './reactive-bar-chart';
import { BarChartCustomProps } from './types';

type Story = StoryObj<ReactiveChartStoryType<BarChartCustomProps>>;

const meta: Meta<typeof RBC> = {
  title: 'Reactive Chart/ReactiveBarChart',
  component: RBC,
  decorators: [ReactiveChartDecorator(chartData)]
};

export default meta;

export const ReactiveBarChart: Story = {
  play: async ({ canvasElement, args: { chartKey, title } }) => {
    const { chartRef } = getChartRef(canvasElement, chartKey);

    await expect(within(chartRef).getByText(title)).toBeInTheDocument();
    await waitFor(async () => {
      await expect(chartRef.querySelector('canvas')).not.toBeNull();
    });
  },
  args: {
    chartKey: 'runs-per-day',
    dataKey: 'dailyRuns',
    title: 'Runs per day',
    customProps: {
      xKey: 'day',
      series: [{ key: 'runs.success', name: 'Success' }]
    }
  }
};

export const Stacked: Story = {
  args: {
    chartKey: 'runs-per-day-stacked',
    dataKey: 'dailyRuns',
    title: 'Runs per day',
    customProps: {
      xKey: 'day',
      stacked: true,
      series: [
        { key: 'runs.success', name: 'Success' },
        { key: 'runs.failed', name: 'Failed', color: 'alert' }
      ]
    }
  }
};

export const Horizontal: Story = {
  args: {
    chartKey: 'runs-per-day-horizontal',
    dataKey: 'dailyRuns',
    title: 'Runs per day',
    customProps: {
      xKey: 'day',
      horizontal: true,
      series: [{ key: 'runs.success', name: 'Success', color: 'secondary' }]
    }
  }
};

export const Currency: Story = {
  args: {
    chartKey: 'sales-per-day',
    dataKey: 'dailySales',
    title: 'Sales per day',
    customProps: {
      xKey: 'day',
      series: [
        {
          key: 'revenue',
          name: 'Revenue',
          format: { style: 'currency', currency: 'EUR' }
        }
      ]
    }
  }
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

// Rows in long form, one per month and category, draw one series per
// category. March keeps its slot without a row, and the expenses without a
// category draw the "Other" series.
export const SplitBy: Story = {
  args: {
    chartKey: 'expenses-per-month',
    dataKey: 'monthlyExpenses',
    title: 'Expenses per month',
    customProps: {
      xKey: 'month',
      splitBy: 'category',
      xValues: months,
      stacked: true,
      series: [
        {
          key: 'amount',
          name: 'Other',
          format: { style: 'currency', currency: 'EUR' }
        }
      ]
    }
  }
};

export const Empty: Story = {
  play: async ({ canvasElement, args: { chartKey } }) => {
    const { chartRef } = getChartRef(canvasElement, chartKey);

    await expect(
      within(chartRef).getByText('Nothing to show')
    ).toBeInTheDocument();
    await expect(chartRef.querySelector('canvas')).toBeNull();
  },
  args: {
    chartKey: 'no-runs',
    dataKey: 'noRuns',
    title: 'Runs per day',
    customProps: {
      xKey: 'day',
      series: [{ key: 'runs.success', name: 'Success' }]
    }
  }
};
