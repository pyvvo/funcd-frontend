/* oxlint-disable @typescript-eslint/ban-types */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

export type Merge<A, B> = {
  [K in keyof A | keyof B]?: K extends keyof A & keyof B
    ? [A[K], B[K]] extends [object, object]
      ? Merge<A[K], B[K]>
      : A[K] | B[K]
    : K extends keyof A
      ? A[K]
      : K extends keyof B
        ? B[K]
        : never;
};

export type RequireAtLeastOne<
  ObjectType,
  KeysType extends keyof ObjectType = keyof ObjectType
> = {
  // For each `Key` in `KeysType` make a mapped type:
  [Key in KeysType]-?: Required<Pick<ObjectType, Key>> & // 1. Make `Key`'s type required
    // 2. Make all other keys in `KeysType` optional
    Partial<Pick<ObjectType, Exclude<KeysType, Key>>>;
}[KeysType] &
  // 3. Add the remaining keys not in `KeysType`
  Omit<ObjectType, KeysType>;

// ############ Flatten
type Entry = { key: string; value: any; optional: boolean };

// eslint-disable-next-line @typescript-eslint/naming-convention
type _Explode<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? Explode<T[K]> extends infer E
          ? E extends Entry
            ? {
                key: `${K}${E['key'] extends '' ? '' : '.'}${E['key']}`;
                value: E['value'];
                optional: E['key'] extends ''
                  ? {} extends Pick<T, K>
                    ? true
                    : false
                  : E['optional'];
              }
            : never
          : never
        : never;
    }[keyof T]
  : { key: ''; value: T; optional: false };

type Explode<T> = _Explode<T extends readonly any[] ? { '0': T[number] } : T>;

// oxlint-disable-next-line @typescript-eslint/no-redeclare
type Collapse<T extends Entry> = {
  [E in Extract<T, { optional: false }> as E['key']]: E['value'];
} & Partial<{
  [E in Extract<T, { optional: true }> as E['key']]: E['value'];
}> extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

type Flat<T> = Collapse<Explode<T>>;

export type Flatten<T> = Flat<T>;
