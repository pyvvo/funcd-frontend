import { JSONData, NestedKeyOf } from '@/types';
import { MantineColor } from '@mantine/core';
import { ReactNode } from 'react';

/** What a card's callbacks receive */
export interface ICardContext<TRow extends JSONData = JSONData> {
  /** The rows at the card's `dataKey` */
  rows: TRow[];
  /** The dashboard's whole `data` */
  data: JSONData;
  /**
   * The values of the dashboard's filter bar as the user sets them, before the
   * rows that they keep arrive; empty without a bar
   */
  filters: JSONData;
  loading: boolean;
}

/** A card's value: a number, a text, or null for none */
export type CardValueType = number | string | null;

export type CardCustomProps<TRow extends JSONData = JSONData> = {
  /**
   * A row key, whose value the card takes from the first row, or a callback
   * that computes the value from the context, such as a sum of the rows
   */
  value: NestedKeyOf<TRow> | ((ctx: ICardContext<TRow>) => CardValueType);
  /**
   * Number format of a number value, in the browser's locale, as the charts'
   * `format`; or a callback that writes the value. Without it a number shows
   * in the locale's format and a text as it is. A missing value shows `–`.
   */
  format?:
    | Intl.NumberFormatOptions
    | ((input: ICardContext<TRow> & { value: CardValueType }) => string);
  /** Text under the value, or a callback that gives it */
  hint?: string | ((ctx: ICardContext<TRow>) => string | undefined);
  /** Theme color of the icon */
  color?: MantineColor;
  /** Icon on the right of the title; a callback-free meta can be saved */
  icon?: ReactNode;
  /**
   * Draws the card's body under its title instead of the value and the hint,
   * from the value, the written value and the context
   */
  renderCard?: (
    input: ICardContext<TRow> & { value: CardValueType; formatted: string }
  ) => ReactNode;
};
