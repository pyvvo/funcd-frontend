import { JSONData } from '@/types';
import { fieldRegex } from '@/utils';

export type ChartAxisType = 'category' | 'value' | 'time';

/** Axis type of the values at `key`, read from the first row like the data grid does */
export const getChartAxisType = (
  rows: JSONData[],
  key: string
): ChartAxisType => {
  const value = rows[0]?.[key];
  if (typeof value === 'number') return 'value';
  if (typeof value === 'string' && fieldRegex.dateISO.test(value)) {
    return 'time';
  }
  return 'category';
};

const isPlainObject = (value: unknown): value is JSONData =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Deep-merges `override` into `option`. Arrays such as `series` are merged
 * item by item, so an override can change one series and keep the others.
 */
export const mergeChartOptions = <TOption extends JSONData>(
  option: TOption,
  override?: JSONData
): TOption => {
  if (!override) return option;
  const merged: JSONData = { ...option };

  Object.keys(override).forEach((key) => {
    const value = override[key];
    const current = merged[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      merged[key] = mergeChartOptions(current, value);
    } else if (Array.isArray(value) && Array.isArray(current)) {
      merged[key] = Array.from(
        { length: Math.max(value.length, current.length) },
        (_, index) => {
          const item = value[index];
          const currentItem = current[index];
          if (item === undefined) return currentItem;
          return isPlainObject(item) && isPlainObject(currentItem)
            ? mergeChartOptions(currentItem, item)
            : item;
        }
      );
    } else {
      merged[key] = value;
    }
  });

  return merged as TOption;
};

/**
 * A chart value as a number, read the way ECharts reads data values: a
 * numeric string such as a SQL decimal is a number, and an empty value is NaN
 */
export const getChartNumber = (value: unknown) =>
  value === null || value === undefined || value === '' ? NaN : Number(value);

/**
 * Formats chart values with `format`, in the browser's locale. A value that
 * isn't a number shows as a dash, as in ECharts' own tooltip.
 */
export const getValueFormatter = (format?: Intl.NumberFormatOptions) => {
  const numberFormat = new Intl.NumberFormat(undefined, format);
  return (value: unknown) => {
    const number = getChartNumber(value);
    return Number.isNaN(number) ? '-' : numberFormat.format(number);
  };
};

/**
 * Value axis labels in a series' `format`, compact like the labels without
 * a format (€1.5K) unless the format sets its own `notation`
 */
export const getValueAxisLabel = (format: Intl.NumberFormatOptions) => ({
  formatter: getValueFormatter({ notation: 'compact', ...format })
});

/**
 * One id per series, from its name in `names`, a repeated name getting a
 * suffix. HMChart replaces the series on each update, and ECharts keeps a
 * series whose id it already draws: the series then moves to its new values
 * instead of being drawn anew from zero.
 */
export const getSeriesIds = (names: string[]) => {
  const counts = new Map<string, number>();
  return names.map((name) => {
    const count = counts.get(name) ?? 0;
    counts.set(name, count + 1);
    return count ? `${name}-${count}` : name;
  });
};

/**
 * Message of the error card for the first format that `Intl.NumberFormat`
 * rejects, such as a currency code that isn't three letters
 */
export const getFormatError = (
  formats: (Intl.NumberFormatOptions | undefined)[]
) => {
  try {
    formats.forEach(
      (format) => format && new Intl.NumberFormat(undefined, format)
    );
  } catch (error) {
    return `Invalid format: ${(error as Error).message}`;
  }
  return undefined;
};
