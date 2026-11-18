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
  /**
   * Row key whose values each draw one series, for rows in long form (one
   * row per x value and split value). `series` then holds exactly one entry:
   * its `key` holds the values and its `format` applies to every series;
   * otherwise the chart shows an error card. The series follow the order in
   * which their values first appear and take the theme's colors in that
   * order, so `series[0].color` is ignored. Rows whose split value is empty
   * (null, undefined or '') draw the series named after `series[0].name`,
   * and rows with the same x value and split value add up to one bar. Rows
   * without an x value are left out. With `stacked`, the series stack. The
   * legend shows when there is more than one series. `onChartClick` gets the
   * first row of `data` with the bar's x value and split value.
   */
  splitBy?: NestedKeyOf<TRow>;
  /**
   * The x values of the axis, in order, drawn as categories even when they
   * are dates. A listed value without a row keeps its slot and draws no bar,
   * and a row whose x value isn't listed is left out. Values match by their
   * text, so `1` matches `'1'`, and rows with the same x value add up to one
   * bar.
   */
  xValues?: (string | number)[];
};
