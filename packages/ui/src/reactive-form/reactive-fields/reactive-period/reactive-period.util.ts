import dayjs from 'dayjs';
import { PeriodPresetType, PeriodUnitType, PeriodValueType } from './types';

// The months that each preset reaches back over; the week, the year to date and every value have rules of their own.
const presetMonths = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12
} satisfies Record<Exclude<PeriodPresetType, '7d' | 'YTD' | 'all'>, number>;

/**
 * A period's first and last day, or month when the unit is month, both included: a custom range as it is, a preset
 * counted back from `now`, or none for every value.
 */
export const resolvePeriod = (
  value: PeriodValueType,
  now: string,
  unit: PeriodUnitType = 'day'
): { from: string; to: string } | undefined => {
  if ('from' in value) return { from: value.from, to: value.to };
  const end = dayjs(now);
  const format = unit === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD';
  const to = end.format(format);
  if (value.preset === 'all') return undefined;
  if (value.preset === 'YTD') {
    return { from: end.startOf('year').format(format), to };
  }
  if (value.preset === '7d') {
    const start = unit === 'month' ? end : end.subtract(6, 'day');
    return { from: start.format(format), to };
  }
  const months = presetMonths[value.preset];
  const start =
    unit === 'month'
      ? end.subtract(months - 1, 'month')
      : end.subtract(months, 'month').add(1, 'day');
  return { from: start.format(format), to };
};
