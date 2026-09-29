import { PyColorsType } from '@/mantine.theme';
import { ECOption } from '@/molecules/hm-chart';
import { JSONData, NestedKeyOf } from '@/types';
import { ECElementEvent } from 'echarts/core';

export type ChartType = 'bar' | 'line' | 'pie';

export interface IChartClickParams {
  chartKey: string;
  /** The clicked row, as it is in `data` */
  row: JSONData;
  event: ECElementEvent;
}

export interface IChartSeries<TRow extends JSONData = JSONData> {
  /** Row key holding the values */
  key: NestedKeyOf<TRow>;
  /** Legend and tooltip label */
  name: string;
  /** Theme palette of the series; by default the chart theme picks one */
  color?: PyColorsType;
}

export type CommonChartProps<TChartProps extends JSONData> = {
  hidden?: boolean;
} & TChartProps;

export interface IReactiveChart<
  TChartProps extends JSONData,
  TChartData extends JSONData = JSONData
> {
  /** Key is used for the React key and the test id */
  chartKey: string;
  /** Path to the chart's rows in `data` */
  dataKey: string;
  /** Title displayed above the chart */
  title: string;
  /** ECharts option merged last, for what the custom props don't cover */
  options?: ECOption;
  data: TChartData;
  loading?: boolean;
  onChartClick?: (params: IChartClickParams) => void;
  customProps: CommonChartProps<TChartProps>;
}

export type ReactiveChartStoryType<
  TChartProps extends JSONData,
  TChartData extends JSONData = JSONData
> = Omit<IReactiveChart<TChartProps, TChartData>, 'data' | 'onChartClick'>;
