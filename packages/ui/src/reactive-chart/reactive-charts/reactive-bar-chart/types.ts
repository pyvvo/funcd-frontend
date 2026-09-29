import { JSONData, NestedKeyOf } from '@/types';
import { IChartSeries } from '../types/reactive-chart-base';

export type BarChartCustomProps<TRow extends JSONData = JSONData> = {
  /** Row key of the categories */
  xKey: NestedKeyOf<TRow>;
  series: IChartSeries<TRow>[];
  /** Stacks the series on top of each other */
  stacked?: boolean;
  /** Draws the bars from left to right */
  horizontal?: boolean;
};
