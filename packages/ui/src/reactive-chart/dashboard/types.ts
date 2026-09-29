import { ECOption } from '@/molecules/hm-chart';
import { DataKeyOf, JSONData, RowOf } from '@/types';
import { ReactElement, ReactNode } from 'react';
import {
  ChartType,
  CommonChartProps,
  IConditionalChartProp
} from '../reactive-charts/types';

export interface IChartLayout {
  /** Start column, from 0 to 11 */
  x: number;
  /** Start row, from 0 */
  y: number;
  /** Width in columns, from 1 to 12 */
  w: number;
  /** Height in rows; leave it out for a height that follows the width */
  h?: number;
  /** Minimum height in rows, ignored when `h` is set */
  minRows?: number;
  /** Maximum height in rows, ignored when `h` is set */
  maxRows?: number;
  /** Maximum width of the chart, in pixels */
  maxWidth?: number;
}

interface IPartialReactiveChart<
  TChartType extends ChartType,
  TDataKey extends string
> {
  /** Stable id of the chart: React key, test id and saved layouts */
  chartKey: string;
  /** Path to the chart's rows in the dashboard's `data` */
  dataKey: TDataKey;
  /** Title displayed above the chart */
  title: string;
  /** Position on the group's 12-column grid */
  layout: IChartLayout;
  /** ECharts option merged last; plain values only, so the meta can be saved */
  options?: ECOption;
  /** Chart type => "bar", "line", "pie" */
  type: TChartType;
}

type ReactiveChartMeta<
  TChartData extends JSONData,
  TDataKey extends string,
  TChartType extends ChartType
> = IConditionalChartProp<RowOf<TChartData, TDataKey>>[TChartType] &
  IPartialReactiveChart<TChartType, TDataKey>;

/** One chart; its custom props are typed from the rows at its `dataKey` */
export type ChartMeta<
  TChartData extends JSONData,
  TChartType extends ChartType = ChartType
> = {
  [TDataKey in DataKeyOf<TChartData>]: TChartType extends ChartType
    ? ReactiveChartMeta<TChartData, TDataKey, TChartType>
    : never;
}[DataKeyOf<TChartData>];

/**
 * A chart's meta without the typing that ties its keys to the dashboard's
 * data. DynamicChart takes this shape: TypeScript can't relate two
 * `ChartMeta<TChartData>` built inside a generic component.
 */
export interface IDynamicChartMeta extends IPartialReactiveChart<
  ChartType,
  string
> {
  customProps: CommonChartProps<JSONData>;
}

export interface IReactiveChartMeta<TChartData extends JSONData> {
  /** Stable id of the group */
  groupKey: string;
  /** Title displayed above the group */
  name?: string;
  charts: ChartMeta<TChartData>[];
}

export type ChartGroupComponentType = ReactElement<{ children?: ReactNode }>;
