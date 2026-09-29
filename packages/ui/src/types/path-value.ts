import { JSONData } from './common';
import { NestedKeyOf } from './nested-props';

/** Type of the value at a dot path (`'stats.daily'`) of `T` */
export type PathValue<
  T,
  TPath extends string
> = TPath extends `${infer TKey}.${infer TRest}`
  ? TKey extends keyof T
    ? PathValue<NonNullable<T[TKey]>, TRest>
    : never
  : TPath extends keyof T
    ? T[TPath]
    : never;

/** Dot paths of `T` that lead to an array of rows */
export type DataKeyOf<T extends object> = {
  [TKey in NestedKeyOf<T>]: NonNullable<
    PathValue<T, TKey>
  > extends readonly object[]
    ? TKey
    : never;
}[NestedKeyOf<T>];

/** Row type of the array at the dot path `TDataKey` of `T` */
export type RowOf<T extends object, TDataKey extends string> =
  NonNullable<PathValue<T, TDataKey>> extends readonly (infer TRow extends
    JSONData)[]
    ? TRow
    : JSONData;
