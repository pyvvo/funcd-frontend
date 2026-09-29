import { Flatten, NestedKeyOf } from '@/types';
import { JSX } from 'react';
import { DataGridProps, RenderCheckboxProps } from 'react-data-grid';

type Key = string | number;
type TRowBase = Record<string, any>;
export type RowType = 'text' | 'checkbox' | 'date';

export interface IComponentRender {
  DGSelectComponent: (props: RenderCheckboxProps) => React.ReactNode;
}

export interface ICellRenderProps<TRow extends TRowBase> {
  rowIndex: number;
  // row: TRow;
  row: Flatten<TRow>;
}

export interface IColumn<TRow extends TRowBase> {
  /** The name of the column. By default it will be displayed in the header cell
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/docs/pages/examples/AsyncExample.tsx#L72
   * @see  {react-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/docs/pages/examples/AsyncExample.tsx#L78
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableColumn.ts#L17
   */
  name: string;

  /** Render row type    */
  type?: RowType;

  /** A unique key to distinguish each column
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/docs/pages/examples/AsyncExample.tsx#L72
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/types.ts#L11
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableColumn.ts#L10
   */
  key: NestedKeyOf<TRow>;

  /** Column width. If not specified, it will be determined automatically
   * based on grid width and specified widths of other columns
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/docs/pages/examples/AsyncExample.tsx#L80
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/website/demos/AllFeatures.tsx#L48
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableColumn.ts#L37
   */
  width?: number | string;

  /** Cell Render props
   * @param idx // row current index
   * @param record // current record object
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/main/docs/pages/examples/AsyncExample.tsx#L105
   * ~~~~~~~~~~~~~~~~~~~~~~~~~ https://github.com/TanStack/table/blob/7b9295332306abcc18f23f96be20fe020862c7dd/packages/table-core/src/types.ts#L202
   * ~~~~~~~~~~~~~~~~~~~~~~~~~ https://github.com/TanStack/table/blob/main/packages/table-core/src/core/cell.ts#L4
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/types.ts#L22
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableColumn.ts#L22
   */
  render?: (props: ICellRenderProps<TRow>) => JSX.Element;

  /** Enables cell editing. If set and no editor property specified,
   *  then a textinput will be used as the cell editor
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/types.ts#L28
   *
   */
  // editable?: boolean | ((row: TRow) => boolean) | null;

  /** Enable resizing of a column
   * @see  {mantine-data-grid} https://github.com/TanStack/table/blob/7b9295332306abcc18f23f96be20fe020862c7dd/packages/table-core/src/features/ColumnSizing.ts#L51
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/types.ts#L33
   *
   */
  resizable?: boolean;

  /** Enable sorting of a column
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/cac102521eb3f8040be68a9142214e60471757d9/docs/pages/examples/InitialStateExample.tsx#L25
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/types.ts#L35
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableColumn.ts#L32
   *
   */
  sortable?: boolean;

  // /** Header renderer for the column
  //  * @see  {mantine-data-grid} https://github.com/TanStack/table/blob/main/packages/table-core/src/types.ts#L218
  //  * ~~~~~~~~~~~~~~~~~~~~~~~~~https://tanstack.com/table/v8/docs/examples/react/column-pinning
  //  * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/types.ts#L53
  //  * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableColumn.ts#L17
  //  *
  //  */
  // headerRenderer?: React.ComponentType<
  //   HeaderRendererProps<TRow, TSummaryRow>
  // > | null;
}

type SortDirection = 'ASC' | 'DESC';

export interface ISortColumn<T extends TRowBase> {
  readonly columnKey: keyof T;
  readonly direction: SortDirection;
}
export interface IHMDataGrid<TRow extends TRowBase> {
  /** An array of objects representing each column on the grid
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L48
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L103
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableProps.ts#L67
   */
  columns: IColumn<TRow>[];

  /** Used for multi column sortin
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L145
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/1799b88de1d99c2aba31ba8b1f20731d7ccdea9f/package/types/DataTableSortProps.ts#L12
   */
  sortColumns?: ISortColumn<TRow>[];

  /**
   * @see {react-data-grid}  https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L116
   */
  onRowsChange?: (rows: TRow[]) => void;

  /** Grid Data
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L50
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L105
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableProps.ts#L79
   */
  rows: TRow[];

  /** Set of selected row key
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/docs/pages/examples/RowSelectionExample.tsx#L27
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L141
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/1799b88de1d99c2aba31ba8b1f20731d7ccdea9f/package/types/DataTableSelectionProps.ts#L11
   */
  selectedRows?: ReadonlySet<string>;

  /** The height of each row in pixels
   * @default 35
   * @see  {mantine-data-grid} https://kuechlin.github.io/mantine-data-grid/#/example/styles
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L125
   * @see  {mantine-data-table} https://icflorescu.github.io/mantine-datatable/examples/basic-table-properties
   */
  rowHeight?: number;

  /** The height of each row in pixels
   * @default 35
   * @see  {mantine-data-grid} https://kuechlin.github.io/mantine-data-grid/#/example/styles
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L130
   * @see  {mantine-data-table} https://icflorescu.github.io/mantine-datatable/examples/basic-table-properties
   */
  headerRowHeight?: number;

  /** Enable sorting of a column
   * @see  {mantine-data-grid} https://kuechlin.github.io/mantine-data-grid/#/example/rowselection
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L147
   * @see  {mantine-data-table} https://icflorescu.github.io/mantine-datatable/examples/sorting
   *
   */
  withSorting?: boolean;

  /** Enables column resizing by default on all columns
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L91
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L147
   */
  withColumnResizing?: boolean;

  /** Enables row selection
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L138
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L147
   */
  withRowSelection?: boolean;

  /** Callback called whenever a row is clicked
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L157
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/adef894589808b857d4428aa104cf10c7317b8fe/src/DataGrid.tsx#L169
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableProps.ts#L94
   */
  onRowClick?: (row: TRow) => void;

  /** Callback called whenever row selection is changed
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L142
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L143
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/1799b88de1d99c2aba31ba8b1f20731d7ccdea9f/package/types/DataTableSelectionProps.ts#L16
   */
  onSelectedRowsChange?: (rows: Set<string>) => void;

  /** Callback called when sorting column changed
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L135
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L146
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/1799b88de1d99c2aba31ba8b1f20731d7ccdea9f/package/types/DataTableSortProps.ts#L17
   */
  onSort?: (params: ISortColumn<TRow>[]) => void;

  /** The getter should return a unique key for each row, it's required for row
   * selection with react-data-grid
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/921fc3d6b6c8b8778af3017aa1688e650a8994d9/src/DataGrid.tsx#L115
   * @see  {mantine-data-table} https://github.com/icflorescu/mantine-datatable/blob/main/package/types/DataTableProps.ts#L74
   */
  rowKeyGetter?: (row: TRow) => unknown;

  /** Header renderer for the column
   * @see  {mantine-data-grid} https://github.com/Kuechlin/mantine-data-grid/blob/18b1fcc5b2b40f6af6ad9e82d3ee49ccb2111642/src/types.ts#L182
   * @see  {react-data-grid} https://github.com/adazzle/react-data-grid/blob/adef894589808b857d4428aa104cf10c7317b8fe/src/DataGrid.tsx#L201
   *
   */
  components?: IComponentRender;
}

export enum RowHeight {
  small = 20,
  standard = 36,
  big = 45
}

export type DataGridProviderType = 'rdg' | 'mdg';

export type RDGParserParams<TRow extends TRowBase> = IHMDataGrid<TRow> & {
  setSortColumns: (param: ISortColumn<TRow>[]) => void;
};

export type ParserParams<TRow extends TRowBase> = IHMDataGrid<TRow>;

export type ParserType<
  TProvider extends DataGridProviderType,
  TRow extends TRowBase
> = TProvider extends 'rdg'
  ? (params: RDGParserParams<TRow>) => DataGridProps<TRow, unknown, Key>
  : (params: ParserParams<TRow>) => IHMDataGrid<TRow>;
