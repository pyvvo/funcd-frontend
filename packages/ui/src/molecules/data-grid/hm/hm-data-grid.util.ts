import { Flatten } from '@/types';
import { fieldRegex } from '@/utils';
import {
  CellClickArgs,
  CellMouseEvent,
  DataGridProps,
  RenderCellProps,
  RenderCheckboxProps,
  SelectColumn,
  SortColumn
} from 'react-data-grid';
import { IColumn, RDGParserParams } from './types';

export const reactDataGridParser = <TRow extends Record<string, any>>(
  params: RDGParserParams<Flatten<TRow>>
) => {
  const {
    components,
    columns,
    withSorting,
    withColumnResizing,
    withRowSelection,
    rowHeight,
    headerRowHeight,
    rows,
    rowKeyGetter,
    onRowClick,
    sortColumns,
    onSort,
    setSortColumns,
    selectedRows,
    onSelectedRowsChange
  } = params;

  const renderCell = (column: IColumn<Flatten<TRow>>) => {
    const dataGridRenderCell = (fProps: RenderCellProps<Flatten<TRow>>) =>
      column.render!({
        row: fProps.row,
        rowIndex: fProps.rowIdx
      });

    if (column.render !== undefined) {
      return dataGridRenderCell;
    }

    return undefined;
  };
  const onCellClick = onRowClick
    ? (
        ...props: [
          args: CellClickArgs<NoInfer<Flatten<TRow>>, unknown>,
          event: CellMouseEvent
        ]
      ) => {
        const [args, event] = props;
        if (args.column.key === 'select-row') {
          event.preventGridDefault();
          return;
        }
        return onRowClick(args.row);
      }
    : undefined;
  const parsedParam: DataGridProps<Flatten<TRow>> = {
    columns: columns.map((column) => ({
      name: column.name,
      key: column.key,
      width: column.width,
      renderCell: renderCell(column),
      resizable: column.resizable,
      sortable: column.sortable
    })),
    defaultColumnOptions: {
      sortable: withSorting,
      resizable: withColumnResizing
    },
    rows,
    rowHeight,
    headerRowHeight,
    rowKeyGetter: rowKeyGetter as unknown as (row: unknown) => any,
    onCellClick: onCellClick,
    sortColumns: sortColumns as readonly SortColumn[] | undefined,
    onSortColumnsChange: (columns) => {
      const typedColumn = columns as Parameters<typeof setSortColumns>[0];
      setSortColumns(typedColumn);
      if (onSort) {
        onSort(typedColumn);
      }
    },
    onSelectedRowsChange: onSelectedRowsChange
      ? (rows) => onSelectedRowsChange(rows as Set<string>)
      : undefined,
    selectedRows,
    renderers: {
      renderCheckbox: components
        ? (props) => components.DGSelectComponent(props)
        : undefined
    }
  };

  if (withRowSelection) {
    parsedParam.columns = [SelectColumn, ...parsedParam.columns];
  }

  return parsedParam;
};

type Comparator<TRow> = (a: TRow, b: TRow) => number;

export const getComparator = <TRow extends Record<string, any>, TValue>(
  value: TValue,
  sortColumn: keyof TRow
): Comparator<TRow> => {
  const type = typeof value;
  switch (type) {
    case 'number':
      return (a, b) => a[sortColumn] - b[sortColumn];
    case 'string':
      // oxlint-disable-next-line no-case-declarations
      const val = value as string;
      if (fieldRegex.dateISO.test(val)) {
        return (a, b) => {
          const date1 = new Date(a[sortColumn]);
          const date2 = new Date(b[sortColumn]);
          return date1.getTime() - date2.getTime();
        };
      }
      return (a, b) => a[sortColumn].localeCompare(b[sortColumn]);

    case 'boolean':
      return (a, b) =>
        a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1;
    default:
      throw new Error(`unsupported typeof value: "${String(sortColumn)}"`);
  }
};
