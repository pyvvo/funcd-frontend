import type { Meta, StoryObj } from '@storybook/react';
import { SimpleGrid } from '@mantine/core';
import {
  IconActivity,
  IconAlertTriangle,
  IconPlugConnectedX
} from '@tabler/icons-react';
import StatCard from './stat-card';

type Story = StoryObj<typeof StatCard>;

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard
};

export default meta;

export const _StatCard: Story = {
  args: {
    label: 'Availability',
    value: '97.4%',
    hint: 'Last 7 days',
    color: 'green',
    icon: <IconActivity size={18} />
  }
};

export const WithoutHint: Story = {
  args: {
    label: 'Open incidents',
    value: '3',
    color: 'red',
    icon: <IconPlugConnectedX size={18} />
  }
};

export const WithoutIcon: Story = {
  args: {
    label: 'Requests',
    value: '12,480',
    hint: 'Since midnight'
  }
};

export const Row: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <SimpleGrid type="container" cols={{ base: 1, '400px': 2, '800px': 4 }}>
      <StatCard
        label="Availability"
        value="97.4%"
        hint="Last 7 days"
        color="green"
        icon={<IconActivity size={18} />}
      />
      <StatCard
        label="Degraded"
        value="6 h 12 min"
        hint="1.8% of the time"
        color="yellow"
        icon={<IconAlertTriangle size={18} />}
      />
      <StatCard
        label="Down now"
        value="2"
        color="red"
        icon={<IconPlugConnectedX size={18} />}
      />
      <StatCard label="Incidents" value="14" hint="Last 7 days" />
    </SimpleGrid>
  )
};
