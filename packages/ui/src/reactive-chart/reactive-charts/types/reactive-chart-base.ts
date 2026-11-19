import { PyColorsType } from '@/mantine.theme';
import { ECOption } from '@/molecules/hm-chart';
import { FormProps, JSONData, NestedKeyOf } from '@/types';
import { ECElementEvent } from 'echarts/core';

export type ChartType = 'bar' | 'line' | 'pie' | 'card';

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
  /**
   * Number format of the values in the tooltip and on the value axis, in the
   * browser's locale: `{ style: 'currency', currency: 'EUR' }`, or
   * `{ style: 'unit', unit: 'percent' }` for values from 0 to 100. The value
   * axis takes the first series' format, in compact notation (€1.5K) unless
   * the format sets its own `notation`. A format that `Intl.NumberFormat`
   * rejects shows an error card instead of the chart.
   */
  format?: Intl.NumberFormatOptions;
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
  /**
   * The form of the dashboard's filter bar, whose values a card's callbacks
   * receive
   */
  filtersForm?: FormProps<JSONData>;
  onChartClick?: (params: IChartClickParams) => void;
  customProps: CommonChartProps<TChartProps>;
}

export type ReactiveChartStoryType<
  TChartProps extends JSONData,
  TChartData extends JSONData = JSONData
> = Omit<
  IReactiveChart<TChartProps, TChartData>,
  'data' | 'filtersForm' | 'onChartClick'
>;
