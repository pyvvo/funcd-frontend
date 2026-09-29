import { getChartRef, ReactiveChartDecorator } from '@/story-utils';
import { chartData } from '@/story-utils/payload/chart.payload';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { waitFor, within } from 'storybook/test';
import { ReactiveChartStoryType } from '../types';
import RPC from './reactive-pie-chart';
import { PieChartCustomProps } from './types';

type Story = StoryObj<ReactiveChartStoryType<PieChartCustomProps>>;

const meta: Meta<typeof RPC> = {
  title: 'Reactive Chart/ReactivePieChart',
  component: RPC,
  decorators: [ReactiveChartDecorator(chartData)]
};

export default meta;

export const ReactivePieChart: Story = {
  play: async ({ canvasElement, args: { chartKey, title } }) => {
    const { chartRef } = getChartRef(canvasElement, chartKey);

    await expect(within(chartRef).getByText(title)).toBeInTheDocument();
    await waitFor(async () => {
      await expect(chartRef.querySelector('canvas')).not.toBeNull();
    });
  },
  args: {
    chartKey: 'status',
    dataKey: 'statusCounts',
    title: 'Status',
    customProps: {
      nameKey: 'status',
      valueKey: 'count',
      colors: { Failed: 'alert', Running: 'warning' }
    }
  }
};

export const Donut: Story = {
  args: {
    chartKey: 'status-donut',
    dataKey: 'statusCounts',
    title: 'Status',
    customProps: {
      nameKey: 'status',
      valueKey: 'count',
      donut: true,
      colors: { Failed: 'alert', Running: 'warning' }
    }
  }
};
