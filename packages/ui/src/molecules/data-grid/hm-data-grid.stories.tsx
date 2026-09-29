import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import HMDG from './hm-data-grid';
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
