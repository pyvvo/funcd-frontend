import { JSONData } from '@/types';
import { IChartSeries } from '../types';
import { getChartNumber } from '../utils';

export interface IChartPivotSeries extends IChartSeries {
  /** One [x value, sum] pair per category; the sum is null without a value */
  data: [string | number, number | null][];
  /** First row of each category, as it is in `data` */
  rows: JSONData[];
}

interface IChartPivotParams {
  /** The chart's rows, as they are in `data` */
  rows: JSONData[];
  /** The same rows, flattened */
  flatRows: JSONData[];
  xKey: string;
  series: IChartSeries[];
  splitBy?: string;
  xValues?: (string | number)[];
}

interface IPivotSums {
  series: IChartSeries;
  /** Sums by category index */
  sums: number[];
  /** First rows by category index */
  rows: JSONData[];
}

const isEmptyValue = (value: unknown) =>
  value === null || value === undefined || value === '';

/**
 * Sums the rows' values per x value and series, for `splitBy` and `xValues`.
 * Every series gets one pair per category, in the same order, so the
 * category axis collects the categories in that order and a listed x value
 * without a row keeps its slot.
 */
export const getChartPivot = (params: IChartPivotParams) => {
  const { rows, flatRows, xKey, series, splitBy, xValues } = params;
  const categories: (string | number)[] = [];
  // Values match by their text: 1 and '1' are the same x value.
  const categoryIndexes = new Map<string, number>();
  const addCategory = (value: string | number) => {
    const index = categoryIndexes.get(String(value)) ?? categories.length;
    if (index === categories.length) {
      categoryIndexes.set(String(value), index);
      categories.push(value);
    }
    return index;
  };
  xValues?.forEach(addCategory);

  // Without `splitBy`, a row adds to every series. With it, a row adds to
  // the series named after its split value, created where it first appears;
  // without a color, the split series take the theme's colors in order.
  const pivotSums: IPivotSums[] = splitBy
    ? []
    : series.map((item) => ({ series: item, sums: [], rows: [] }));
  const splitIndexes = new Map<string, number>();
  const getSplitSums = (value?: string | number | null) => {
    const [{ key, name, format }] = series;
    const splitName = isEmptyValue(value) ? name : String(value);
    const index = splitIndexes.get(splitName) ?? pivotSums.length;
    if (index === pivotSums.length) {
      splitIndexes.set(splitName, index);
      pivotSums.push({
        series: { key, name: splitName, format },
        sums: [],
        rows: []
      });
    }
    return pivotSums[index];
  };

  flatRows.forEach((flatRow, rowIndex) => {
    const x = flatRow[xKey];
    if (isEmptyValue(x) || (xValues && !categoryIndexes.has(String(x)))) {
      return;
    }
    const index = addCategory(x);
    const targets = splitBy ? [getSplitSums(flatRow[splitBy])] : pivotSums;
    targets.forEach(({ series: { key }, sums, rows: firstRows }) => {
      const value = getChartNumber(flatRow[key]);
      if (!Number.isNaN(value)) sums[index] = (sums[index] ?? 0) + value;
      firstRows[index] ??= rows[rowIndex];
    });
  });
  // With no row to draw, one empty series still draws the listed slots.
  if (splitBy && pivotSums.length === 0) getSplitSums();

  return pivotSums.map(
    ({ series: item, sums, rows: firstRows }): IChartPivotSeries => ({
      ...item,
      data: categories.map((x, index) => [x, sums[index] ?? null]),
      rows: firstRows
    })
  );
};
