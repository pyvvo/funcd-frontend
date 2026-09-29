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
