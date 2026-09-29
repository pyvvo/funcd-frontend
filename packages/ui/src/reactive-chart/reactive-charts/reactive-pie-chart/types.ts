import { PyColorsType } from '@/mantine.theme';
import { JSONData, NestedKeyOf } from '@/types';

export type PieChartCustomProps<TRow extends JSONData = JSONData> = {
  /** Row key of the slice names */
  nameKey: NestedKeyOf<TRow>;
  /** Row key of the slice values */
  valueKey: NestedKeyOf<TRow>;
  /** Draws a ring instead of a full pie, with the total in the middle */
  donut?: boolean;
  /** Theme palette per slice name, for slices that mean a status; by default the chart theme picks one */
  colors?: Record<string, PyColorsType>;
};
