import { rem, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import styles from './hm-data-grid.module.css';
import DataGridContainer from './hm/data-grid-container';
import EmptyRows from './hm/empty-rows';
import RenderCheckbox from './hm/render-checkbox';
import { IHMDataGrid, RowHeight } from './hm/types';
import useRGDParser from './hm/use-data-gri-parser.hook';
import useRenderRow from './hm/use-render-row.hook';

const HMDataGrid = <TRow extends Record<string, any>>(
  props: IHMDataGrid<TRow>
) => {
  const theme = useMantineTheme();
  const {
    columns,
    components = { DGSelectComponent: RenderCheckbox },
    onRowsChange,
    rows,
    selectedRows,
    headerRowHeight,
    rowHeight = RowHeight.standard,
    maxRows,
    onRowClick,
    onSelectedRowsChange,
    onSort,
    rowKeyGetter = (row: TRow) => row.id,
    withColumnResizing = false,
    withRowSelection = false,
    withSorting = false,
    withFill = false,
    footer,
    emptyIcon,
    emptyText,
    withCellOutline = false,
    selectionActions,
    selectedText,
    clearText
  } = props;
  const computedColorScheme = useComputedColorScheme('light');

  const params = {
    components,
    columns,
    rows,
    onRowsChange,
    selectedRows,
    headerRowHeight,
    rowHeight,
    onRowClick,
    onSelectedRowsChange,
    onSort,
    rowKeyGetter,
    withColumnResizing,
    withRowSelection,
    withSorting
  };

  // this hook is required for flattering row and row render
  const data = useRenderRow<TRow>(params);

  const parsedData = useRGDParser<TRow>(data);

  return (
    <>
      <DataGridContainer
        theme={theme}
        className={styles.root}
        selectedRowCount={selectedRows?.size ?? 0}
        selectionActions={selectionActions}
        selectedText={selectedText}
        clearText={clearText}
        onClearSelection={
          onSelectedRowsChange
            ? () => onSelectedRowsChange(new Set())
            : undefined
        }
        footer={footer}
        mod={{
          fill: withFill,
          clickable: !!onRowClick,
          'cell-outline': withCellOutline
        }}
        style={{
          '--data-grid-row-height': rem(rowHeight),
          '--data-grid-max-rows': maxRows
        }}>
        {/* The CSS turns the row height and `maxRows` into the grid's maximum
            height; without `maxRows` the grid shows every row. */}
        <DataGrid
          {...parsedData}
          className={computedColorScheme === 'dark' ? 'rdg-dark' : 'rdg-light'}
          renderers={{
            ...parsedData.renderers,
            noRowsFallback: <EmptyRows icon={emptyIcon} text={emptyText} />
          }}
        />
      </DataGridContainer>
      {/* <Pagination total={10} /> */}
    </>
  );
};

export default HMDataGrid;
