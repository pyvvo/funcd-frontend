import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor } from 'storybook/test';
import { getReactiveRef, ReactiveFieldDecorator } from '@/story-utils';
import { ReactiveFieldStoryType } from '../types';
import RTF from './reactive-list-field';
import { ListFieldColumnType, ListFieldCustomProps } from './types';
import { IHMColumn } from '@/molecules/table/types';

type Story = StoryObj<ReactiveFieldStoryType<ListFieldCustomProps<IRow>>>;

const rows: IRow[] = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' }
];

const defaultValues = {
  rows
};

const meta: Meta<typeof RTF> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Reactive Field/ReactiveListField ',
  component: RTF,
  decorators: [ReactiveFieldDecorator(defaultValues)]
};

export default meta;

export interface IRow {
  position: number;
  mass: number;
  symbol: string;
  name: string;
}

const columns: ListFieldColumnType<IRow>[] = [
  {
    fieldKey: 'position',
    label: 'Element position',
    type: 'number'
  },
  {
    fieldKey: 'name',
    label: 'Element name',
    type: 'text',
    options: {
      required: true
    }
  },
  {
    fieldKey: 'symbol',
    label: 'Symbol',
    type: 'text'
  },
  {
    fieldKey: 'mass',
    label: 'Atomic mass',
    type: 'number'
  }
];

export const ReactiveListField: Story = {
  args: {
    fieldKey: 'rows',
    label: 'My liste',
    options: {
      // required: { message: 'test', value: true },
      // required: true,
      minLength: ((val) => {
        return { message: `min lenght ${val}`, value: val };
      })(3)
    },
    customProps: {
      columns
    }
  }
};
