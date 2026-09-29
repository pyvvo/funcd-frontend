/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import { ActionIcon, NumberInput } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';
import { IconCopy, IconTrash } from '@tabler/icons-react';
import HmTable, { IHmTable } from './index';
import { IHMColumn, IRowAction } from './types';

type HMTableProps = IHmTable<IRow>;

type Story = StoryObj<HMTableProps>;

const meta: Meta<HMTableProps> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Molecules/Table',
  component: HmTable
};

export default meta;

interface IRow {
  position: number;
  mass: number;
  symbol: string;
  name: string;
}

const rows: IRow[] = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' }
];

const columns: IHMColumn<IRow>[] = [
  {
    key: 'position',
    label: 'Element position',
    rowRender: (val: number) => (
      <NumberInput value={val} placeholder="Input placeholder" />
    )
  },
  {
    key: 'name',
    label: 'Element name'
  },
  {
    key: 'symbol',
    label: 'Symbol'
  },
  {
    key: 'mass',
    label: 'Atomic mass'
  }
];

const actions: IRowAction<IRow>[] = [
  {
    name: 'delete',
    fn: (val, idx) => console.log(val, idx),
    actionRender: ({ name }) => (
      <ActionIcon name={name} variant="filled" aria-label="Delete" color="red">
        <IconTrash style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    )
  },
  {
    name: 'copy',
    fn: (val, idx) => console.log('copied', idx),
    actionRender: ({ name }) => (
      <ActionIcon name={name} variant="filled" aria-label="Add">
        <IconCopy style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    )
  }
];

export const TableStandard: Story = {
  args: {
    columns,
    rows,
    actions,
    withTableBorder: true,
    highlightOnHover: true
  }
};
