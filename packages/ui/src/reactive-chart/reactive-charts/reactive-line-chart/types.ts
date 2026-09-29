import { JSONData, NestedKeyOf } from '@/types';
import { IChartSeries } from '../types/reactive-chart-base';

export type LineChartCustomProps<TRow extends JSONData = JSONData> = {
  /** Row key of the x axis values */
  xKey: NestedKeyOf<TRow>;
  series: IChartSeries<TRow>[];
  /** Draws curved lines */
  smooth?: boolean;
  /** Fills the area under each line */
  area?: boolean;
};
