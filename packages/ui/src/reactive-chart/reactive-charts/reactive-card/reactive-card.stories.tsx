import { ReactiveDashboardDecorator } from '@/story-utils';
import { chartData } from '@/story-utils/payload/chart.payload';
import { Progress, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconAlertTriangle,
  IconClockHour4,
  IconReceiptEuro,
  IconTrophy
} from '@tabler/icons-react';
import { expect, waitFor, within } from 'storybook/test';
import RD, { IReactiveDashboard } from '../../dashboard/reactive-dashboard';
import { IReactiveChartMeta } from '../../dashboard/types';

type Data = typeof chartData;
type Story = StoryObj<Omit<IReactiveDashboard<Data>, 'data' | 'onChartClick'>>;
type ChartsType = IReactiveChartMeta<Data>['charts'];

// Cards are a chart type of the dashboard: each story places them in a
// dashboard, one layout row high, as a page does.
const meta: Meta<typeof RD> = {
  title: 'Reactive Chart/ReactiveCard',
  component: RD,
  decorators: [ReactiveDashboardDecorator(chartData)]
};

export default meta;

const euros: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR' };

const inGroup = (charts: ChartsType): IReactiveChartMeta<Data>[] => [
  { groupKey: 'cards', charts }
];

const runsOf = (row: Data['dailyRuns'][number]) =>
  row.runs.success + row.runs.failed;

// Checks the text that a card shows once the dashboard has drawn it.
const expectCard = async (
  canvasElement: HTMLElement,
  chartKey: string,
  ...texts: string[]
) => {
  const card = await within(canvasElement).findByTestId(chartKey);
  await waitFor(async () => {
    for (const text of texts) {
      await expect(card).toHaveTextContent(text);
    }
  });
};

// A plain meta, which can be saved: the value at a key of the first row, and
// a hint written in the meta.
export const ReactiveCard: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'successful-runs', '276', 'this week');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'successful-runs',
        type: 'card',
        dataKey: 'statusCounts',
        title: 'Successful runs',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: { value: 'count', hint: 'this week' }
      }
    ])
  }
};

// The value computed from the card's rows: the year's expenses add up, in
// euros, and the hint counts the categories.
export const ComputedValue: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'expenses', '€18,916.34', '4 categories');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'expenses',
        type: 'card',
        dataKey: 'expensesByCategory',
        title: 'Expenses',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: {
          value: ({ rows }) => rows.reduce((sum, row) => sum + row.amount, 0),
          format: euros,
          hint: ({ rows }) => `${rows.length} categories`,
          icon: <IconReceiptEuro size={18} />
        }
      }
    ])
  }
};

// A callback writes the value: the average run time, in seconds.
export const FormatCallback: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'run-time', '12.1 s');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'run-time',
        type: 'card',
        dataKey: 'dailyRuns',
        title: 'Run time',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: {
          value: ({ rows }) =>
            rows.reduce((sum, row) => sum + row.duration, 0) / rows.length,
          format: ({ value }) => `${Number(value).toFixed(1)} s`,
          hint: 'on average, this week',
          icon: <IconClockHour4 size={18} />
        }
      }
    ])
  }
};

// A share as a percentage, its icon in the theme's alert color.
export const PercentAndColor: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'failure-rate', '5.8%', '17 of 293 runs');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'failure-rate',
        type: 'card',
        dataKey: 'dailyRuns',
        title: 'Failure rate',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: {
          value: ({ rows }) =>
            rows.reduce((sum, row) => sum + row.runs.failed, 0) /
            rows.reduce((sum, row) => sum + runsOf(row), 0),
          format: { style: 'percent', maximumFractionDigits: 1 },
          hint: ({ rows }) =>
            `${rows.reduce((sum, row) => sum + row.runs.failed, 0)} of ${rows.reduce((sum, row) => sum + runsOf(row), 0)} runs`,
          color: 'alert',
          icon: <IconAlertTriangle size={18} />
        }
      }
    ])
  }
};

// A text value: the best day of the week, and its revenue as the hint.
export const TextValue: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'best-day', 'Sat', '€2,650.90');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'best-day',
        type: 'card',
        dataKey: 'dailySales',
        title: 'Best day',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: {
          value: ({ rows }) =>
            rows.reduce((best, row) =>
              row.revenue > best.revenue ? row : best
            ).day,
          hint: ({ rows }) =>
            new Intl.NumberFormat(undefined, euros).format(
              Math.max(...rows.map((row) => row.revenue))
            ),
          color: 'warning',
          icon: <IconTrophy size={18} />
        }
      }
    ])
  }
};

// The card's own body under its title: the success rate and a bar of it.
export const RenderCard: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'success-rate', '92.3%');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'success-rate',
        type: 'card',
        dataKey: 'statusCounts',
        title: 'Success rate',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: {
          value: ({ rows }) =>
            (rows.find((row) => row.status === 'Success')?.count ?? 0) /
            rows.reduce((sum, row) => sum + row.count, 0),
          format: { style: 'percent', maximumFractionDigits: 1 },
          renderCard: ({ value, formatted }) => (
            <Stack gap={8} mt="xs">
              <Text fw={700} fz={28} lh={1.2}>
                {formatted}
              </Text>
              <Progress value={Number(value) * 100} color="green" />
            </Stack>
          )
        }
      }
    ])
  }
};

// Cards over charts: a row of cards, one layout row high, then the charts,
// each card reading its own rows of the dashboard's data.
export const CardsAndCharts: Story = {
  args: {
    meta: [
      {
        groupKey: 'week',
        name: 'This week',
        charts: [
          {
            chartKey: 'week-runs',
            type: 'card',
            dataKey: 'dailyRuns',
            title: 'Runs',
            layout: { x: 0, y: 0, w: 3, h: 1 },
            customProps: {
              value: ({ rows }) =>
                rows.reduce((sum, row) => sum + runsOf(row), 0),
              hint: 'over 7 days'
            }
          },
          {
            chartKey: 'week-failures',
            type: 'card',
            dataKey: 'statusCounts',
            title: 'Failed',
            layout: { x: 3, y: 0, w: 3, h: 1 },
            customProps: {
              value: ({ rows }) =>
                rows.find((row) => row.status === 'Failed')?.count ?? 0,
              color: 'alert',
              icon: <IconAlertTriangle size={18} />
            }
          },
          {
            chartKey: 'week-revenue',
            type: 'card',
            dataKey: 'dailySales',
            title: 'Revenue',
            layout: { x: 6, y: 0, w: 3, h: 1 },
            customProps: {
              value: ({ rows }) =>
                rows.reduce((sum, row) => sum + row.revenue, 0),
              format: { ...euros, maximumFractionDigits: 0 },
              icon: <IconReceiptEuro size={18} />
            }
          },
          {
            chartKey: 'week-run-time',
            type: 'card',
            dataKey: 'dailyRuns',
            title: 'Run time',
            layout: { x: 9, y: 0, w: 3, h: 1 },
            customProps: {
              value: ({ rows }) =>
                rows.reduce((sum, row) => sum + row.duration, 0) / rows.length,
              format: ({ value }) => `${Number(value).toFixed(1)} s`,
              icon: <IconClockHour4 size={18} />
            }
          },
          {
            chartKey: 'week-runs-per-day',
            type: 'bar',
            dataKey: 'dailyRuns',
            title: 'Runs per day',
            layout: { x: 0, y: 1, w: 8, h: 2 },
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
            chartKey: 'week-sales',
            type: 'line',
            dataKey: 'dailySales',
            title: 'Sales',
            layout: { x: 8, y: 1, w: 4, h: 2 },
            customProps: {
              xKey: 'day',
              area: true,
              series: [{ key: 'revenue', name: 'Revenue', format: euros }]
            }
          }
        ]
      }
    ]
  }
};

// No row: a key or a sum of nothing shows a dash, and a callback can say why.
export const Empty: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'no-runs-key', '–');
    await expectCard(canvasElement, 'no-runs-sum', '–', 'No run this week');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'no-runs-key',
        type: 'card',
        dataKey: 'noRuns',
        title: 'First run time',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: { value: 'duration' }
      },
      {
        chartKey: 'no-runs-sum',
        type: 'card',
        dataKey: 'noRuns',
        title: 'Runs',
        layout: { x: 4, y: 0, w: 4, h: 1 },
        customProps: {
          value: ({ rows }) =>
            rows.length
              ? rows.reduce((sum, row) => sum + runsOf(row), 0)
              : null,
          hint: ({ rows }) => (rows.length ? 'this week' : 'No run this week')
        }
      }
    ])
  }
};

// A format that Intl.NumberFormat rejects, and a callback that throws, each
// show an error card in their card's place; the dashboard keeps the others.
export const ErrorCards: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, 'bad-format', 'Invalid format');
    await expectCard(
      canvasElement,
      'bad-callback',
      'The card could not compute its value'
    );
    await expectCard(canvasElement, 'good-card', '276');
  },
  args: {
    meta: inGroup([
      {
        chartKey: 'bad-format',
        type: 'card',
        dataKey: 'statusCounts',
        title: 'Wrong currency',
        layout: { x: 0, y: 0, w: 4, h: 1 },
        customProps: {
          value: 'count',
          format: { style: 'currency', currency: 'EURO' }
        }
      },
      {
        chartKey: 'bad-callback',
        type: 'card',
        dataKey: 'statusCounts',
        title: 'Broken callback',
        layout: { x: 4, y: 0, w: 4, h: 1 },
        customProps: {
          value: () => {
            throw new Error('no such column');
          }
        }
      },
      {
        chartKey: 'good-card',
        type: 'card',
        dataKey: 'statusCounts',
        title: 'Successful runs',
        layout: { x: 8, y: 0, w: 4, h: 1 },
        customProps: { value: 'count' }
      }
    ])
  }
};
