import type { Meta, StoryObj } from '@storybook/react';
import { FlowCard } from '@/molecules';
import { Button, TextInput } from '@mantine/core';
import { IconJumpRope, IconPlus, IconSearch } from '@tabler/icons-react';
import { FC } from 'react';
import CardGridLayout from './card-grid-layout';

type Story = StoryObj<typeof CardGridLayout>;

const meta: Meta<typeof CardGridLayout> = {
  title: 'Layouts/CardGridLayout',
  component: CardGridLayout
};

export default meta;

const workflows = [
  'Ingest meters',
  'Transcode payloads',
  'Dispatch alerts',
  'Archive logs',
  'Sync customers',
  'Score leads',
  'Send invoices'
];

const Workflows: FC<{ count?: number; width?: number }> = (props) => {
  const { count = workflows.length, width } = props;

  return (
    <div style={{ width }}>
      <CardGridLayout
        header={
          <>
            <TextInput
              placeholder="Search workflows"
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
            />
            <Button leftSection={<IconPlus size={16} />}>New</Button>
          </>
        }>
        {workflows.slice(0, count).map((name) => (
          <FlowCard
            key={name}
            flowName={name}
            lastUpdated={new Date()}
            leftIcon={<IconJumpRope size={18} />}
          />
        ))}
      </CardGridLayout>
    </div>
  );
};

export const Gallery: Story = {
  render: () => <Workflows />
};

// Many cards, a few cards, then a narrow box: every card keeps the same width
// and the grid fits as many columns as the layout allows.
export const Showcase: Story = {
  name: 'Showcase',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex h-full flex-col items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6 text-gray-900">
      <div className="w-full">
        <h6 className="font-semibold">Gallery</h6>
        <p className="mt-2 text-sm text-gray-600">
          A search and a button in the header, then seven FlowCards
        </p>
        <div className="mt-2">
          <Workflows />
        </div>
      </div>

      <div className="w-full">
        <h6 className="font-semibold">A few cards</h6>
        <p className="mt-2 text-sm text-gray-600">
          Two cards keep their width instead of stretching across the row
        </p>
        <div className="mt-2">
          <Workflows count={2} />
        </div>
      </div>

      <div className="w-full">
        <h6 className="font-semibold">Narrow</h6>
        <p className="mt-2 text-sm text-gray-600">
          In a 480px box, one card per row
        </p>
        <div className="mt-2">
          <Workflows width={480} />
        </div>
      </div>
    </div>
  )
};
