import { getChartRef, ReactiveChartDecorator } from '@/story-utils';
import { chartData } from '@/story-utils/payload/chart.payload';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { waitFor, within } from 'storybook/test';
import { ReactiveChartStoryType } from '../types';
import RLC from './reactive-line-chart';
import { LineChartCustomProps } from './types';

type Story = StoryObj<ReactiveChartStoryType<LineChartCustomProps>>;

const meta: Meta<typeof RLC> = {
  title: 'Reactive Chart/ReactiveLineChart',
  component: RLC,
  decorators: [ReactiveChartDecorator(chartData)]
};

export default meta;

export const ReactiveLineChart: Story = {
  play: async ({ canvasElement, args: { chartKey, title } }) => {
    const { chartRef } = getChartRef(canvasElement, chartKey);

    await expect(within(chartRef).getByText(title)).toBeInTheDocument();
    await waitFor(async () => {
      await expect(chartRef.querySelector('canvas')).not.toBeNull();
    });
  },
  args: {
    chartKey: 'duration',
    dataKey: 'dailyRuns',
    title: 'Average duration (s)',
    customProps: {
      xKey: 'day',
      series: [{ key: 'duration', name: 'Average duration' }]
    }
  }
};

export const Area: Story = {
  args: {
    chartKey: 'duration-area',
    dataKey: 'dailyRuns',
    title: 'Average duration (s)',
    customProps: {
      xKey: 'day',
      smooth: true,
      area: true,
      series: [{ key: 'duration', name: 'Average duration' }]
    }
  }
};

export const MultipleSeries: Story = {
  args: {
    chartKey: 'runs-per-day-lines',
    dataKey: 'dailyRuns',
    title: 'Runs per day',
    customProps: {
      xKey: 'day',
      smooth: true,
      series: [
        { key: 'runs.success', name: 'Success' },
        { key: 'runs.failed', name: 'Failed', color: 'alert' }
      ]
    }
  }
};
