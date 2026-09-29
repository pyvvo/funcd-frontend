/* oxlint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
/* oxlint-disable array-callback-return */
/* oxlint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable no-console */
import { IReactiveChartMeta, ReactiveDashboard, StatsRing } from '@humaapi/ui';
import { Box, SimpleGrid } from '@mantine/core';
import { FC } from 'react';

interface IData {
  label: string;
  stats: string;
  progress: number;
  color: string;
  icon: 'up' | 'down';
}

const data: IData[] = [
  {
    label: 'Collector',
    stats: '16.75 msg/sec',
    progress: 65,
    color: 'teal',
    icon: 'up'
  },
  {
    label: 'Dispatcher',
    stats: '17.27  msg/sec',
    progress: 30,
    color: 'blue',
    icon: 'up'
  },
  {
    label: 'Datamodels',
    stats: '31.65 teleo data lines / sec',
    progress: 52,
    color: 'red',
    icon: 'down'
  }
];

const chartData = {
  messagesPerDay: [
    { day: 'Mon', messages: 120 },
    { day: 'Tue', messages: 200 },
    { day: 'Wed', messages: 150 },
    { day: 'Thu', messages: 80 },
    { day: 'Fri', messages: 70 },
    { day: 'Sat', messages: 110 },
    { day: 'Sun', messages: 130 }
  ],
  trafficByService: [
    { service: 'Collector', value: 1048 },
    { service: 'Dispatcher', value: 735 },
    { service: 'Transcoder', value: 580 },
    { service: 'Datalake', value: 484 },
    { service: 'Datamodels', value: 300 }
  ]
};

const chartMeta: IReactiveChartMeta<typeof chartData>[] = [
  {
    groupKey: 'traffic',
    name: 'Traffic',
    charts: [
      {
        chartKey: 'messages-per-day',
        type: 'bar',
        dataKey: 'messagesPerDay',
        title: 'Messages per day',
        layout: { x: 0, y: 0, w: 8, minRows: 2, maxRows: 3 },
        customProps: {
          xKey: 'day',
          series: [{ key: 'messages', name: 'Messages' }]
        }
      },
      {
        chartKey: 'traffic-by-service',
        type: 'pie',
        dataKey: 'trafficByService',
        title: 'Traffic by service',
        layout: { x: 8, y: 0, w: 4, minRows: 2, maxRows: 3 },
        customProps: { nameKey: 'service', valueKey: 'value', donut: true }
      }
    ]
  }
];

const Dashboard: FC = () => (
  <Box style={{ marginTop: '24px', marginBottom: '24px' }}>
    <SimpleGrid cols={{ base: 1, sm: 3 }} style={{ marginBottom: '12px' }}>
      {data.map((value) => (
        <StatsRing
          key={value.label}
          color={value.color}
          icon={value.icon}
          label={value.label}
          stats={value.stats}
          progress={value.progress}
        />
      ))}
    </SimpleGrid>
    <ReactiveDashboard data={chartData} meta={chartMeta} />
  </Box>
);

export default Dashboard;
