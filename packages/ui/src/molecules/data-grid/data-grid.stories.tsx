import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Chance } from 'chance';
import { useState } from 'react';
import { Column, DataGridProps, SelectColumn } from 'react-data-grid';
import DGRID from './data-grid';
import styles from './data-grid.module.css';
import RenderCheckbox from './hm/render-checkbox';
import { renderRows } from './hm/render-row';

// For testing the native DataGrid

export interface Row {
  id: string;
  avatar: string;
  email: string;
  title: string;
  firstName: string;
  street: string;
  isCompleted: boolean;
}

const chance = new Chance();
type Story = StoryObj<DataGridProps<Row>>;

function createRows(): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < 2000; i++) {
    rows.push({
      id: `id_${i}`,
      avatar: chance.avatar(),
      email: chance.email(),
      title: chance.prefix(),
      firstName: chance.name(),
      street: chance.address(),
      isCompleted: true
    });
  }

  return rows;
}

const columns: readonly Column<Row>[] = [
  {
    ...SelectColumn,
    headerCellClass: styles.header,
    cellClass: styles.header
  },
  {
    key: 'id',
    name: 'ID'
  },
  {
    key: 'avatar',
    name: 'Avatar'
  },
  {
    key: 'title',
    name: 'Title'
  },
  {
    key: 'firstName',
    name: 'First Name'
  },
  {
    key: 'isCompleted',
    name: 'Completed',
    renderCell: (rows) => renderRows['checkbox'](rows)
  }
];

const meta: Meta<typeof DGRID> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Features/DataGrid',
  component: DGRID
};

export default meta;

export const LocalGrid: Story = {
  render: (args) => {
    const { onCellClick, ...rest } = args;
    const [rows, setRows] = useState(createRows);
    const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(
      () => new Set()
    );

    return (
      <DGRID
        rowKeyGetter={(row) => row.id}
        columns={columns}
        rows={rows}
        onRowsChange={setRows as any}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows as any}
        onCellClick={onCellClick}
        rowClass={() => styles.rdgCell}
        renderers={{
          renderCheckbox: (props) => <RenderCheckbox {...props} />
        }}
      />
    );
  },
  args: {
    onCellClick: (row) => action('row')(row)
  }
};
