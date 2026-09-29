/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable @typescript-eslint/no-explicit-any */
import { Flatten } from '@/types';
import { fieldRegex, flattenObj } from '@/utils';
import { useMemo } from 'react';
import { renderRows } from './render-row';
import { IColumn, IHMDataGrid, RowType } from './types';

export default function useRenderRow<TRow extends Record<string, any>>(
  params: IHMDataGrid<TRow>
) {
  const parsedData = useMemo(
    () => {
      const { columns, rows } = params;
      const row = rows ? rows[0] : undefined;
      if (!row) {
        return params as unknown as IHMDataGrid<Flatten<TRow>>;
      }
      const flatedrows = rows.map((row) => flattenObj(row));

      const newColumn = (
        columnType: RowType,
        column: IColumn<TRow>,
        columnKey: IColumn<TRow>['key']
      ): typeof column => ({
        ...column,
        render: (props) => {
          const rowKey = columnKey as unknown as keyof typeof props.row;
          const value = props.row[rowKey];

          const Component = renderRows[columnType];
          return Component(value);
        }
      });

      const newColumns = columns.map((column) => {
        const { type, key, render } = column;
        // A column with its own `render` keeps it.
        if (render) {
          return column;
        }
        const columnType = type ?? 'text';

        const value = row[key];

        const typeofValue = typeof value;

        if (!type) {
          switch (typeofValue) {
            case 'number':
              return newColumn('text', column, key);

            case 'string':
              if (fieldRegex.dateISO.test(value)) {
                return newColumn('date', column, key);
              }
              return newColumn('text', column, key);

            case 'boolean':
              return newColumn('checkbox', column, key);
            default:
              return newColumn(columnType, column, key);
          }
        }

        return newColumn(columnType, column, key);
      });

      const newData = {
        ...params,
        columns: newColumns,
        rows: flatedrows as unknown as Flatten<TRow>[]
      };
      return newData as IHMDataGrid<Flatten<TRow>>;
    },
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [params.rows, params.columns, params.selectedRows]
  );

  return parsedData;
}
