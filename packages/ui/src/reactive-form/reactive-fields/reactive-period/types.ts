import { MantineSize } from '@mantine/core';

// A preset counts back from the caller's `now`: seven days; one, three or six months; the year to date; one year;
// or every value.
export type PeriodPresetType = '7d' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'all';

// What the field picks: whole days or whole months.
export type PeriodUnitType = 'day' | 'month';

// A period field's value: a preset, kept as one so that it follows `now`, or a custom range whose ends are both
// included, as YYYY-MM-DD days or YYYY-MM months.
export type PeriodValueType =
  | { preset: PeriodPresetType }
  | { from: string; to: string };

export type PeriodCustomProps = {
  /** The preset buttons, in order */
  presets: PeriodPresetType[];
  /** What a custom range picks, day by default */
  unit?: PeriodUnitType;
  /** The day or month that the custom range's calendar opens on, today by default */
  defaultDate?: string;
  /** The custom range button's label while no range is picked, Custom by default */
  customLabel?: string;
  size?: MantineSize;
};
