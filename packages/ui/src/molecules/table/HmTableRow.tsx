import { Table } from '@mantine/core';
import { IHMColumn, IRowAction } from './types';
import HMTableAction from './HmTableAction';

interface IHmTableRow<TRow extends Record<string, any>> {
  rows: TRow[];
  columns: IHMColumn<TRow>[];
  actions?: IRowAction<TRow>[];
}

const HmTableRow = <TRow extends Record<string, any>>(
  props: IHmTableRow<TRow>
) => {
  const { rows, columns, actions = [] } = props;
  return (
    <Table.Tbody>
      {rows.map((row, rowIndex) => (
        <Table.Tr key={rowIndex}>
          {columns.map((col, colIndex) => {
            const cellValue = row[col.key];
            const cellKey = `${rowIndex}-${colIndex}`;

            return (
              <Table.Td key={cellKey}>
                {col.rowRender
                  ? col.rowRender(cellValue, rowIndex, row.id)
                  : cellValue}
              </Table.Td>
            );
          })}
          <HMTableAction actions={actions} row={row} index={rowIndex} />
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default HmTableRow;
