import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  MantineColor,
  Text
} from '@mantine/core';
import {
  IconBrandNodejs,
  IconBrandPython,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconSearch,
  IconTrash
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { ReactNode, useState } from 'react';
import HMDG from './hm-data-grid';
import IconLabelCell from './hm/icon-label-cell';
import ProgressCell from './hm/progress-cell';
import StatusCell from './hm/status-cell';
import TimeAgoCell from './hm/time-ago-cell';
import TitleCell from './hm/title-cell';
import { IColumn, IHMDataGrid } from './hm/types';

type Story = StoryObj<IHMDataGrid<ICollector>>;

const _rows: ICollector[] = [
  {
    id: 'sdsds',
    name: 'Test1',
    operator: 'orange',
    subscriber: 'birdz1',
    email: 'test1@mail.coom',
    password: '',
    isActive: true
  },
  {
    id: 'sddsdgdds',
    name: 'Test2',
    operator: 'orange',
    subscriber: 'birdz2',
    email: 'test2@mail.coom',
    password: '',
    isActive: true
  },
  {
    id: 'sdsdsae',
    name: 'Test3',
    operator: 'orange',
    subscriber: 'birdz3',
    email: 'test3@mail.coom',
    password: '',
    isActive: false
  },
  {
    id: 'sdsdsz32',
    name: 'Test4',
    operator: 'orange',
    subscriber: 'birdz4',
    email: 'test3@mail.coom',
    password: '',
    isActive: false
  }
];

const meta: Meta<typeof HMDG> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Features/DataGrid',
  component: HMDG
};

export default meta;

interface ICollector {
  id: string;
  name: string;
  operator: string;
  subscriber: string;
  email: string;
  password: string;
  isActive: boolean;
}

const columns: IColumn<ICollector>[] = [
  {
    key: 'id',
    name: 'ID'
  },
  {
    key: 'name',
    name: 'Name'
  },
  { key: 'operator', name: 'Operator' },
  { key: 'subscriber', name: 'Subscriber' },
  { key: 'isActive', name: 'Active' }
];

export const DataGrid: Story = {
  render: (args) => {
    const { onRowClick, ...rest } = args;
    const [rows, setRows] = useState(_rows);
    const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(
      () => new Set()
    );

    return (
      <HMDG
        withRowSelection
        withSorting
        rowKeyGetter={(row) => row.id}
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        onRowClick={onRowClick}
      />
    );
  },
  args: {
    onRowClick: (row) => action('row')(row)
  }
};

const manyRows: ICollector[] = Array.from({ length: 20 }, (_, index) => ({
  ..._rows[index % _rows.length],
  id: `collector-${index + 1}`,
  name: `Test${index + 1}`
}));

interface IFunction {
  id: string;
  name: string;
  trigger: string;
  runtime: 'Node.js' | 'Python';
  status: 'Ready' | 'Idle';
  successRate: number;
  lastDeployed: string;
}

const runtimeIcons: Record<IFunction['runtime'], ReactNode> = {
  'Node.js': <IconBrandNodejs size={22} color="var(--mantine-color-green-6)" />,
  Python: <IconBrandPython size={22} color="var(--mantine-color-blue-6)" />
};

const statusColors: Record<IFunction['status'], MantineColor> = {
  Ready: 'green',
  Idle: 'gray'
};

// Green from 99%, yellow from 95%, red below.
const successColor = (rate: number): MantineColor =>
  rate >= 99 ? 'green' : rate >= 95 ? 'yellow' : 'red';

const functionNames = [
  ['process-webhook', 'HTTP trigger', 'Node.js', 'Ready', 99.8, 12],
  ['summarize-document', 'Event trigger', 'Python', 'Ready', 97.2, 38],
  ['resize-image', 'HTTP trigger', 'Python', 'Ready', 100, 120],
  ['sync-customer', 'Schedule', 'Node.js', 'Idle', 88.5, 180],
  ['send-invoice', 'Event trigger', 'Node.js', 'Ready', 99.1, 240],
  ['score-lead', 'HTTP trigger', 'Python', 'Ready', 94.6, 300],
  ['archive-logs', 'Schedule', 'Python', 'Idle', 72.4, 420],
  ['notify-slack', 'Event trigger', 'Node.js', 'Ready', 99.9, 600],
  ['translate-text', 'HTTP trigger', 'Python', 'Ready', 96.3, 900],
  ['cleanup-uploads', 'Schedule', 'Node.js', 'Idle', 81, 1440],
  ['generate-report', 'Schedule', 'Python', 'Ready', 98.7, 2880],
  ['refresh-cache', 'Event trigger', 'Node.js', 'Idle', 91.2, 4320]
] as const;

const functions: IFunction[] = functionNames.map(
  ([name, trigger, runtime, status, successRate, minutesAgo]) => ({
    id: name,
    name,
    trigger,
    runtime,
    status,
    successRate,
    lastDeployed: dayjs().subtract(minutesAgo, 'minute').toISOString()
  })
);

const functionColumns: IColumn<IFunction>[] = [
  {
    key: 'name',
    name: 'Function',
    render: ({ row }) => (
      <TitleCell
        title={row.name}
        subtitle={row.trigger}
        leftIcon={<IconCode size={20} />}
      />
    )
  },
  {
    key: 'runtime',
    name: 'Runtime',
    render: ({ row }) => (
      <IconLabelCell icon={runtimeIcons[row.runtime]} label={row.runtime} />
    )
  },
  {
    key: 'status',
    name: 'Status',
    render: ({ row }) => (
      <StatusCell label={row.status} color={statusColors[row.status]} />
    )
  },
  {
    key: 'successRate',
    name: 'Success rate',
    render: ({ row }) => (
      <ProgressCell
        value={row.successRate}
        color={successColor(row.successRate)}
      />
    )
  },
  {
    key: 'lastDeployed',
    name: 'Last deployed',
    render: ({ row }) => <TimeAgoCell date={row.lastDeployed} />
  },
  {
    key: 'id',
    name: '',
    width: 56,
    sortable: false,
    render: () => (
      <IconChevronRight size={18} color="var(--mantine-color-dimmed)" />
    )
  }
];

// Rows come in batches, the way a server returns them from a cursor: the
// arrows load the previous or the next batch.
const FunctionsTable = () => {
  const batchSize = 4;
  const [start, setStart] = useState(0);
  const rows = functions.slice(start, start + batchSize);
  const isFirst = start === 0;
  const isLast = start + batchSize >= functions.length;

  return (
    <HMDG
      withSorting
      rowKeyGetter={(row) => row.id}
      columns={functionColumns}
      rows={rows}
      rowHeight={64}
      headerRowHeight={48}
      onRowClick={(row) => action('row')(row)}
      footer={
        <Group justify="space-between" w="100%">
          <Text size="sm" c="dimmed">
            Showing {start + 1}–{start + rows.length} of {functions.length}{' '}
            functions
          </Text>
          <Group gap="xs">
            <ActionIcon
              variant="default"
              radius="md"
              aria-label="Previous functions"
              disabled={isFirst}
              onClick={() => setStart(start - batchSize)}>
              <IconChevronLeft size={16} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              radius="md"
              aria-label="Next functions"
              disabled={isLast}
              onClick={() => setStart(start + batchSize)}>
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
        </Group>
      }
    />
  );
};

// The grid shows `maxRows` rows, then scrolls inside.
export const MaxRows: Story = {
  render: (args) => {
    const { onRowClick, maxRows } = args;

    return (
      <HMDG
        withSorting
        rowKeyGetter={(row) => row.id}
        columns={columns}
        rows={manyRows}
        maxRows={maxRows}
        onRowClick={onRowClick}
      />
    );
  },
  args: {
    maxRows: 5,
    onRowClick: (row) => action('row')(row)
  }
};

// The grid takes the height of its parent (400px here) and scrolls inside.
export const Fill: Story = {
  render: (args) => {
    const { onRowClick } = args;

    return (
      <Box h={400}>
        <HMDG
          withFill
          withSorting
          rowKeyGetter={(row) => row.id}
          columns={columns}
          rows={manyRows}
          onRowClick={onRowClick}
        />
      </Box>
    );
  },
  args: {
    onRowClick: (row) => action('row')(row)
  }
};

export const Empty: Story = {
  render: () => (
    <HMDG rowKeyGetter={(row) => row.id} columns={columns} rows={[]} />
  )
};

// What the grid can build, one table per section.
export const Showcase: Story = {
  name: 'Showcase',
  parameters: { layout: 'padded' },
  render: () => {
    function Main() {
      const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(
        () => new Set(['sdsds'])
      );

      return (
        <div className="flex h-full flex-col items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6 text-gray-900">
          <div className="w-full">
            <h6 className="font-semibold">Functions</h6>
            <p className="mt-2 text-sm text-gray-600">
              The five built-in cells in 64px rows, with arrow navigation in the
              footer
            </p>
            <div className="mt-2">
              <FunctionsTable />
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Cells</h6>
            <p className="mt-2 text-sm text-gray-600">
              Built-in pieces for a column&apos;s render: TitleCell,
              IconLabelCell, StatusCell, ProgressCell and TimeAgoCell
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-10 rounded-xl bg-white p-6">
              <TitleCell
                title="process-webhook"
                subtitle="HTTP trigger"
                leftIcon={<IconCode size={20} />}
              />
              <IconLabelCell icon={runtimeIcons['Node.js']} label="Node.js" />
              <StatusCell label="Ready" color="green" />
              <StatusCell label="Failed" color="red" />
              <ProgressCell value={97.4} color="green" />
              <ProgressCell value={62} color="red" />
              <TimeAgoCell date={functions[0].lastDeployed} />
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Row selection</h6>
            <p className="mt-2 text-sm text-gray-600">
              Sorting and checkboxes; the selection bar counts the rows and
              holds bulk actions
            </p>
            <div className="mt-2">
              <HMDG
                withRowSelection
                withSorting
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={_rows}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                selectionActions={
                  <Button
                    variant="subtle"
                    size="xs"
                    mod={{ color: 'alert' }}
                    leftSection={<IconTrash size={14} />}
                    onClick={() => action('delete')([...selectedRows])}>
                    Delete
                  </Button>
                }
              />
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Max rows</h6>
            <p className="mt-2 text-sm text-gray-600">
              20 rows, 5 shown, the rest scrolls inside the grid
            </p>
            <div className="mt-2">
              <HMDG
                withSorting
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={manyRows}
                maxRows={5}
              />
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Fill</h6>
            <p className="mt-2 text-sm text-gray-600">
              The grid takes its parent&apos;s height (280px) and scrolls inside
            </p>
            <div className="mt-2 h-[280px]">
              <HMDG
                withFill
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={manyRows}
              />
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Empty</h6>
            <p className="mt-2 text-sm text-gray-600">
              The default icon and text, then your own with emptyIcon and
              emptyText
            </p>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <HMDG
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={[]}
              />
              <HMDG
                rowKeyGetter={(row) => row.id}
                columns={columns}
                rows={[]}
                emptyIcon={<IconSearch size={24} />}
                emptyText="No collector matches your search"
              />
            </div>
          </div>
        </div>
      );
    }

    return <Main />;
  }
};
