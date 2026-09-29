export type WithoutPrivate<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};
