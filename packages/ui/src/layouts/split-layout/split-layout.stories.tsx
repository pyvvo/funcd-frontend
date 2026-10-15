import type { Meta, StoryObj } from '@storybook/react';
import { HMDataGrid, StatusCell } from '@/molecules';
import { Group, NavLink, Paper, Stack, Text, Title } from '@mantine/core';
import { IconCloudComputing } from '@tabler/icons-react';
import { FC, useState } from 'react';
import SplitLayout, { SplitSidePositionType } from './split-layout';

type Story = StoryObj<typeof SplitLayout>;

const meta: Meta<typeof SplitLayout> = {
  title: 'Layouts/SplitLayout',
  component: SplitLayout
};

export default meta;

const collectors = [
  { id: 'orange-birdz', operator: 'orange', status: 'Ready' },
  { id: 'sfr-meters', operator: 'sfr', status: 'Ready' },
  { id: 'bouygues-gas', operator: 'bouygues', status: 'Idle' },
  { id: 'free-water', operator: 'free', status: 'Ready' }
];

const runs = [
  { id: 'run-42', started: '2026-10-15 16:20', messages: 1048 },
  { id: 'run-41', started: '2026-10-15 15:20', messages: 997 },
  { id: 'run-40', started: '2026-10-15 14:20', messages: 1102 }
];

// A list on one side and the open item's detail on the other.
const Collectors: FC<{
  sidePosition?: SplitSidePositionType;
  width?: number;
}> = (props) => {
  const { sidePosition, width } = props;
  const [selected, setSelected] = useState(collectors[0]);

  return (
    <div style={{ width }}>
      <SplitLayout
        sidePosition={sidePosition}
        side={
          <Paper p="xs" radius="var(--mantine-card-border-radius)" withBorder>
            {collectors.map((collector) => (
              <NavLink
                key={collector.id}
                label={collector.id}
                description={collector.operator}
                leftSection={<IconCloudComputing size={18} />}
                active={collector.id === selected.id}
                onClick={() => setSelected(collector)}
              />
            ))}
          </Paper>
        }>
        <Paper p="lg" radius="var(--mantine-card-border-radius)" withBorder>
          <Group justify="space-between" mb="xs">
            <Title order={4}>{selected.id}</Title>
            <StatusCell
              label={selected.status}
              color={selected.status === 'Ready' ? 'green' : 'gray'}
            />
          </Group>
          <Text size="sm" c="dimmed">
            Operator {selected.operator}
          </Text>
        </Paper>
        <HMDataGrid
          rowKeyGetter={(row) => row.id}
          columns={[
            { key: 'id', name: 'Run' },
            { key: 'started', name: 'Started' },
            { key: 'messages', name: 'Messages' }
          ]}
          rows={runs}
        />
      </SplitLayout>
    </div>
  );
};

export const Left: Story = {
  render: () => <Collectors />
};

export const Right: Story = {
  render: () => <Collectors sidePosition="right" />
};

// The side on the left, then on the right, then in a narrow box: the layout
// follows its own width, so there the side moves above the detail.
export const Showcase: Story = {
  name: 'Showcase',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex h-full flex-col items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6 text-gray-900">
      <div className="w-full">
        <h6 className="font-semibold">Side on the left</h6>
        <p className="mt-2 text-sm text-gray-600">
          A list of 320px, the open item takes the rest
        </p>
        <Stack className="mt-2">
          <Collectors />
        </Stack>
      </div>

      <div className="w-full">
        <h6 className="font-semibold">Side on the right</h6>
        <p className="mt-2 text-sm text-gray-600">
          sidePosition=&quot;right&quot;
        </p>
        <Stack className="mt-2">
          <Collectors sidePosition="right" />
        </Stack>
      </div>

      <div className="w-full">
        <h6 className="font-semibold">Narrow</h6>
        <p className="mt-2 text-sm text-gray-600">
          In a 480px box, the side moves above the detail
        </p>
        <Stack className="mt-2">
          <Collectors width={480} />
        </Stack>
      </div>
    </div>
  )
};
