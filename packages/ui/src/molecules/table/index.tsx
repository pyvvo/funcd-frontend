import { Table, TableProps } from '@mantine/core';
import styles from './table.module.css';
import { IHMColumn, IRowAction } from './types';
import HmTableHead from './HmTableHead';
import HmTableRow from './HmTableRow';

export interface IHmTable<TRow extends Record<string, any>> extends TableProps {
  columns: IHMColumn<TRow>[];
  rows: TRow[];
  actions?: IRowAction<TRow>[];
}

const HmTable = <TRow extends Record<string, any>>(props: IHmTable<TRow>) => {
  const { columns, rows, actions = [], ...rest } = props;
  return (
    <Table captionSide="bottom" className={styles.table} {...rest}>
      {/* <Table.Caption>Some elements from periodic table</Table.Caption> */}
      <HmTableHead columns={columns} actions={actions} />
      <HmTableRow rows={rows} columns={columns} actions={actions} />
    </Table>
  );
};

export default HmTable;
