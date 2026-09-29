import { Table } from '@mantine/core';
import { IHMColumn, IRowAction } from './types';

interface IHmTableHead<TRow extends Record<string, any>> {
  columns: IHMColumn<TRow>[];
  actions?: IRowAction<TRow>[];
}

const HmTableHead = <TRow extends Record<string, any>>(
  props: IHmTableHead<TRow>
) => {
  const { columns, actions = [] } = props;
  const hasActions = actions.length > 0;
  return (
    <Table.Thead>
      <Table.Tr>
        {columns.map((col, index) => (
          <Table.Th key={index}>{col.label}</Table.Th>
        ))}
        {hasActions ? <Table.Th>Actions</Table.Th> : undefined}
      </Table.Tr>
    </Table.Thead>
  );
};

export default HmTableHead;
