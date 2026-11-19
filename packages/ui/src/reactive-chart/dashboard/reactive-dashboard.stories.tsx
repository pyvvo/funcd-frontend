import {
  IReactiveFieldMeta,
  PeriodValueType,
  resolvePeriod
} from '@/reactive-form';
import { ReactiveDashboardDecorator } from '@/story-utils';
import { chartData } from '@/story-utils/payload/chart.payload';
import { Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import { useForm, useWatch } from 'react-hook-form';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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

// A year of daily runs in two environments, up to the latest day, which the
// period's presets count back from.
const latestDay = '2026-06-30';
const environments = ['prod', 'staging'];
const dailyRuns = Array.from({ length: 365 }, (_, i) =>
  dayjs(latestDay)
    .subtract(364 - i, 'day')
    .format('YYYY-MM-DD')
).flatMap((day, i) =>
  environments.map((env, j) => ({
    day,
    env,
    runs: 20 + ((i * 7 + j * 11) % 30)
  }))
);

type FilterValues = { period: PeriodValueType | null; env: string | null };
type FilteredData = {
  runs: typeof dailyRuns;
  byEnv: { env: string; runs: number }[];
};

const filterMeta: IReactiveFieldMeta<FilterValues>[] = [
  {
    fields: [
      {
        type: 'period',
        fieldKey: 'period',
        label: 'Period',
        customProps: {
          presets: ['7d', '1M', '3M', 'YTD', '1Y', 'all'],
          defaultDate: latestDay
        }
      },
      {
        type: 'select',
        fieldKey: 'env',
        label: 'Environment',
        customProps: { data: environments }
      }
    ]
  }
];

const filteredMeta: IReactiveChartMeta<FilteredData>[] = [
  {
    groupKey: 'runs',
    charts: [
      {
        chartKey: 'runs-per-day',
        type: 'bar',
        dataKey: 'runs',
        title: 'Runs per day',
        layout: { x: 0, y: 0, w: 8, h: 2 },
        customProps: {
          xKey: 'day',
          splitBy: 'env',
          stacked: true,
          series: [{ key: 'runs', name: 'Runs' }]
        }
      },
      {
        chartKey: 'runs-by-env',
        type: 'pie',
        dataKey: 'byEnv',
        title: 'Runs by environment',
        layout: { x: 8, y: 0, w: 4, h: 2 },
        customProps: { nameKey: 'env', valueKey: 'runs', donut: true }
      }
    ]
  }
];

// The caller owns the filters' form, and passes the rows that its values keep.
const FilteredDashboard = () => {
  const form = useForm<FilterValues>({
    defaultValues: { period: { preset: '3M' }, env: null }
  });
  const { period, env } = useWatch({ control: form.control });
  const bounds = period
    ? resolvePeriod(period as PeriodValueType, latestDay)
    : undefined;
  const kept = dailyRuns.filter(
    (row) =>
      (!bounds || (row.day >= bounds.from && row.day <= bounds.to)) &&
      (!env || row.env === env)
  );
  const byEnv = environments.map((name) => ({
    env: name,
    runs: kept
      .filter((row) => row.env === name)
      .reduce((sum, row) => sum + row.runs, 0)
  }));

  return (
    <>
      <RD
        meta={filteredMeta}
        data={{ runs: kept, byEnv }}
        filters={{ meta: filterMeta, form }}
      />
      <Text size="sm" c="dimmed" data-testid="filter-result">
        {JSON.stringify({
          ...bounds,
          days: new Set(kept.map((row) => row.day)).size
        })}
      </Text>
    </>
  );
};

// A bar of filters above the charts: every chart follows the period and the
// environment that the bar holds.
export const WithFilters: Story = {
  render: () => <FilteredDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const result = () =>
      JSON.parse(canvas.getByTestId('filter-result').textContent ?? '{}');
    await expect(result()).toEqual({
      from: '2026-03-31',
      to: latestDay,
      days: 92
    });
    await userEvent.click(canvas.getByText('7d'));
    await waitFor(async () => {
      await expect(result()).toEqual({
        from: '2026-06-24',
        to: latestDay,
        days: 7
      });
    });
  }
};
