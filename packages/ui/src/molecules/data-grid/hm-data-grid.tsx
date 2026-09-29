import { useMantineTheme } from '@mantine/core';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import styles from './hm-data-grid.module.css';
import DataGridContainer from './hm/data-grid-container';
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
    onRowClick,
    onSelectedRowsChange,
    onSort,
    rowKeyGetter = (row: TRow) => row.id,
    withColumnResizing = false,
    withRowSelection = false,
    withSorting = false
  } = props;

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
      <DataGridContainer theme={theme} className={styles.root}>
        <DataGrid {...parsedData} />
      </DataGridContainer>
      {/* <Pagination total={10} /> */}
    </>
  );
};

export default HMDataGrid;
