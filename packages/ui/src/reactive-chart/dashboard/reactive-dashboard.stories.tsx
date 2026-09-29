import { ReactiveDashboardDecorator } from '@/story-utils';
import { chartData } from '@/story-utils/payload/chart.payload';
import type { Meta, StoryObj } from '@storybook/react';
import RD, { IReactiveDashboard } from './reactive-dashboard';
import { IReactiveChartMeta } from './types';

type Data = typeof chartData;
type Story = StoryObj<Omit<IReactiveDashboard<Data>, 'data' | 'onChartClick'>>;

const meta: Meta<typeof RD> = {
  title: 'Reactive Dashboard/ReactiveDashboard',
  component: RD,
  decorators: [ReactiveDashboardDecorator(chartData)]
};

export default meta;

const dashboardMeta: IReactiveChartMeta<Data>[] = [
  {
    groupKey: 'executions',
    name: 'Executions',
    charts: [
      {
        chartKey: 'runs-per-day',
        type: 'bar',
        dataKey: 'dailyRuns',
        title: 'Runs per day',
        layout: { x: 0, y: 0, w: 8, h: 2 },
        customProps: {
          xKey: 'day',
          stacked: true,
          series: [
            { key: 'runs.success', name: 'Success' },
            { key: 'runs.failed', name: 'Failed', color: 'alert' }
          ]
        }
      },
      {
        chartKey: 'status',
        type: 'pie',
        dataKey: 'statusCounts',
        title: 'Status',
        layout: { x: 8, y: 0, w: 4, h: 2 },
        customProps: {
          nameKey: 'status',
          valueKey: 'count',
          donut: true,
          colors: { Failed: 'alert', Running: 'warning' }
        }
      },
      {
        chartKey: 'duration',
        type: 'line',
        dataKey: 'dailyRuns',
        title: 'Average duration (s)',
        layout: { x: 0, y: 2, w: 12, h: 2 },
        customProps: {
          xKey: 'day',
          smooth: true,
          area: true,
          series: [{ key: 'duration', name: 'Average duration' }]
        }
      }
    ]
  }
];

export const ReactiveDashboard: Story = {
  args: {
    meta: dashboardMeta
  }
};

// Charts without `h` follow their width, between `minRows` and `maxRows`;
// `maxWidth` stops a chart from stretching on wide screens.
export const AutoHeight: Story = {
  args: {
    meta: [
      {
        groupKey: 'auto-height',
        name: 'Auto height',
        charts: [
          {
            chartKey: 'fixed-height',
            type: 'bar',
            dataKey: 'dailyRuns',
            title: 'Fixed height (h: 2)',
            layout: { x: 0, y: 0, w: 6, h: 2 },
            customProps: {
              xKey: 'day',
              series: [{ key: 'runs.success', name: 'Success' }]
            }
          },
          {
            chartKey: 'auto-height',
            type: 'line',
            dataKey: 'dailyRuns',
            title: 'Auto height (2 to 3 rows)',
            layout: { x: 6, y: 0, w: 6, minRows: 2, maxRows: 3 },
            customProps: {
              xKey: 'day',
              area: true,
              series: [{ key: 'duration', name: 'Average duration' }]
            }
          },
          {
            chartKey: 'max-width',
            type: 'pie',
            dataKey: 'statusCounts',
            title: 'Max width (480px)',
            layout: { x: 0, y: 1, w: 12, minRows: 2, maxWidth: 480 },
            customProps: {
              nameKey: 'status',
              valueKey: 'count',
              donut: true,
              colors: { Failed: 'alert', Running: 'warning' }
            }
          }
        ]
      }
    ]
  }
};

// A meta saved to a store and loaded back, with two stale charts: a chart
// type the app doesn't register, and a dataset that no longer exists.
const savedMeta = JSON.stringify([
  ...dashboardMeta,
  {
    groupKey: 'stale',
    name: 'Stale charts',
    charts: [
      {
        chartKey: 'unknown-type',
        type: 'scatter',
        dataKey: 'dailyRuns',
        title: 'Unregistered chart type',
        layout: { x: 0, y: 0, w: 6, h: 1 },
        customProps: {}
      },
      {
        chartKey: 'missing-rows',
        type: 'bar',
        dataKey: 'weeklyRuns',
        title: 'Dataset that no longer exists',
        layout: { x: 6, y: 0, w: 6, h: 1 },
        customProps: { xKey: 'week', series: [] }
      }
    ]
  }
]);

export const SavedMeta: Story = {
  args: {
    meta: JSON.parse(savedMeta)
  }
};
