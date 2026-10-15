import type { Meta, StoryObj } from '@storybook/react';
import {
  ECOption,
  HMChart,
  HMDataGrid,
  StatsRing,
  StatusCell
} from '@/molecules';
import { Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { FC, ReactNode } from 'react';
import ContentLayout from './content-layout';

type Story = StoryObj<typeof ContentLayout>;

const meta: Meta<typeof ContentLayout> = {
  title: 'Layouts/ContentLayout',
  component: ContentLayout
};

export default meta;

const stats = [
  {
    label: 'Collector',
    stats: '16.75 msg/sec',
    progress: 65,
    color: 'teal',
    icon: 'up'
  },
  {
    label: 'Dispatcher',
    stats: '17.27 msg/sec',
    progress: 30,
    color: 'blue',
    icon: 'up'
  },
  {
    label: 'Datamodels',
    stats: '31.65 lines/sec',
    progress: 52,
    color: 'red',
    icon: 'down'
  },
  {
    label: 'Transcoder',
    stats: '8.12 msg/sec',
    progress: 81,
    color: 'grape',
    icon: 'up'
  }
] as const;

const statCards = (count: number) =>
  stats.slice(0, count).map((stat) => <StatsRing key={stat.label} {...stat} />);

const barOption: ECOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80, 70, 110, 130] }]
};

const lineOption: ECOption = {
  xAxis: {
    type: 'category',
    data: ['00:00', '06:00', '12:00', '18:00', '24:00']
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: {},
      data: [80, 120, 380, 520, 160]
    }
  ]
};

const Panel: FC<{ title: string; children: ReactNode }> = (props) => {
  const { title, children } = props;

  return (
    <Paper p="lg" radius="var(--mantine-card-border-radius)" withBorder>
      <Title order={5} mb="md">
        {title}
      </Title>
      {children}
    </Paper>
  );
};

const charts = (
  <>
    <Panel title="Messages per day">
      <HMChart option={barOption} style={{ height: 260 }} />
    </Panel>
    <Panel title="Invocation activity">
      <HMChart option={lineOption} style={{ height: 220 }} />
    </Panel>
  </>
);

const functions = [
  { id: 'process-webhook', runtime: 'Node.js', status: 'Ready' },
  { id: 'summarize-document', runtime: 'Python', status: 'Ready' },
  { id: 'sync-customer', runtime: 'Node.js', status: 'Idle' }
];

const list = (
  <HMDataGrid
    rowKeyGetter={(row) => row.id}
    columns={[
      { key: 'id', name: 'Function' },
      { key: 'runtime', name: 'Runtime' },
      {
        key: 'status',
        name: 'Status',
        render: ({ row }) => (
          <StatusCell
            label={row.status}
            color={row.status === 'Ready' ? 'green' : 'gray'}
          />
        )
      }
    ]}
    rows={functions}
  />
);

const aside = (
  <>
    <Panel title="Recent activity">
      <Stack gap="sm">
        {functions.map((fn) => (
          <Group key={fn.id} justify="space-between">
            <Text size="sm">{fn.id} deployed</Text>
            <Text size="xs" c="dimmed">
              {fn.runtime}
            </Text>
          </Group>
        ))}
      </Stack>
    </Panel>
    <Panel title="Runtime health">
      <Stack gap="sm">
        <Text size="sm">CPU 24%</Text>
        <Progress value={24} />
        <Text size="sm">Memory 41%</Text>
        <Progress value={41} />
      </Stack>
    </Panel>
  </>
);

export const Dashboard: Story = {
  render: () => <ContentLayout header={statCards(3)}>{charts}</ContentLayout>
};

export const WithAside: Story = {
  render: () => (
    <ContentLayout header={statCards(4)} aside={aside}>
      {charts}
      {list}
    </ContentLayout>
  )
};

// The same layouts side by side, then in a narrow box: the layout follows its
// own width, so there the header wraps and the aside moves under the content.
export const Showcase: Story = {
  name: 'Showcase',
  parameters: { layout: 'padded' },
  render: () => {
    function Main() {
      return (
        <div className="flex h-full flex-col items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6 text-gray-900">
          <div className="w-full">
            <h6 className="font-semibold">Dashboard</h6>
            <p className="mt-2 text-sm text-gray-600">
              A header of three stat cards, then the main content
            </p>
            <div className="mt-2">
              <ContentLayout header={statCards(3)}>{charts}</ContentLayout>
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">With aside</h6>
            <p className="mt-2 text-sm text-gray-600">
              A header of four stat cards, the main content at two thirds and an
              aside at one third
            </p>
            <div className="mt-2">
              <ContentLayout header={statCards(4)} aside={aside}>
                {charts}
                {list}
              </ContentLayout>
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">List</h6>
            <p className="mt-2 text-sm text-gray-600">Main content only</p>
            <div className="mt-2">
              <ContentLayout>{list}</ContentLayout>
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Narrow</h6>
            <p className="mt-2 text-sm text-gray-600">
              The with-aside layout in a 480px box: the header wraps and the
              aside moves under the main content
            </p>
            <div className="mt-2" style={{ width: 480 }}>
              <ContentLayout header={statCards(4)} aside={aside}>
                {charts}
              </ContentLayout>
            </div>
          </div>
        </div>
      );
    }

    return <Main />;
  }
};
