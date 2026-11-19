import { StatCard } from '@/molecules';
import { FormProps, JSONData } from '@/types';
import { Box } from '@mantine/core';
import { FC, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { IReactiveChart } from '../types';
import {
  ChartContainer,
  getChartNumber,
  getFormatError,
  getValueFormatter,
  useChartRows
} from '../utils';
import styles from './reactive-card.module.css';
import { CardCustomProps, CardValueType, ICardContext } from './types';

type ReactiveCardProps = IReactiveChart<CardCustomProps>;

interface ICardBody extends Omit<ReactiveCardProps, 'filtersForm'> {
  filters: JSONData;
}

interface IFilteredCard extends Omit<ReactiveCardProps, 'filtersForm'> {
  filtersForm: FormProps<JSONData>;
}

const noFilters: JSONData = {};
// What a card shows without a value, as its tile does elsewhere
const noValue = '–';

const isMissing = (value: unknown) =>
  value === null || value === undefined || value === '';

// The value at a row key, as the charts read it from a flattened row
const getKeyValue = (row: JSONData | undefined, key: string): CardValueType => {
  const found: unknown = row?.[key];
  return typeof found === 'number' || typeof found === 'string' ? found : null;
};

// A value written with Intl options: a number, or a numeric text such as a SQL
// decimal, in the browser's locale; any other text as it is.
const formatValue = (
  value: CardValueType,
  format?: Intl.NumberFormatOptions
) => {
  if (isMissing(value)) return noValue;
  if (typeof value === 'string' && Number.isNaN(getChartNumber(value))) {
    return value;
  }
  return getValueFormatter(format)(value);
};

const CardBody: FC<ICardBody> = (props) => {
  const {
    chartKey,
    dataKey,
    title,
    data,
    loading = false,
    filters,
    customProps
  } = props;
  const { hidden, value, format, hint, color, icon, renderCard } = customProps;
  const { rows, flatRows } = useChartRows({ data, dataKey });
  const ctx = useMemo<ICardContext>(
    () => ({ rows, data, filters, loading }),
    [rows, data, filters, loading]
  );

  // Intl options, which the card checks first as the charts do; a callback
  // writes the value itself.
  const formatOptions = typeof format === 'function' ? undefined : format;
  const formatError = formatOptions
    ? getFormatError([formatOptions])
    : undefined;
  if (formatError) {
    return (
      <ChartContainer chartKey={chartKey} title={title} error={formatError} />
    );
  }

  // A callback that throws shows an error card in the card's place, as a meta
  // that can't be drawn does, instead of breaking the dashboard.
  let shown: {
    value: CardValueType;
    formatted: string;
    hint?: string;
  };
  try {
    // While the first rows load, the card shows no value, not a sum of none.
    const isWaiting = loading && rows.length === 0;
    const computed = isWaiting
      ? null
      : typeof value === 'function'
        ? value(ctx)
        : getKeyValue(flatRows[0], value);
    shown = {
      value: computed,
      formatted:
        typeof format === 'function' && !isWaiting
          ? format({ ...ctx, value: computed })
          : formatValue(computed, formatOptions),
      hint: typeof hint === 'function' ? hint(ctx) : hint
    };
  } catch (error) {
    return (
      <ChartContainer
        chartKey={chartKey}
        title={title}
        error={`The card could not compute its value: ${(error as Error).message}`}
      />
    );
  }

  return (
    <Box className={styles.root} mod={{ hidden }} data-testid={chartKey}>
      <StatCard
        label={title}
        value={shown.formatted}
        hint={shown.hint}
        color={color}
        icon={icon}>
        {renderCard?.({
          ...ctx,
          value: shown.value,
          formatted: shown.formatted
        })}
      </StatCard>
    </Box>
  );
};

// The card under a filter bar: its context follows the bar's values.
const FilteredCard: FC<IFilteredCard> = (props) => {
  const { filtersForm, ...rest } = props;
  const filters = useWatch({ control: filtersForm.control }) as JSONData;

  return <CardBody {...rest} filters={filters} />;
};

/**
 * One number, or a short text, in a card: taken from the first row at a key,
 * or computed, formatted and drawn by callbacks that receive the card's
 * context (its rows, the dashboard's data and the filter bar's values).
 */
const ReactiveCard: FC<ReactiveCardProps> = (props) => {
  const { filtersForm, ...rest } = props;

  return filtersForm ? (
    <FilteredCard {...rest} filtersForm={filtersForm} />
  ) : (
    <CardBody {...rest} filters={noFilters} />
  );
};

export default ReactiveCard;
