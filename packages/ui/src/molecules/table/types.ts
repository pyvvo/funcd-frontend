import { FC, JSX, ReactNode } from 'react';

export interface IHMColumn<TRow = Record<string, any>> {
  key: keyof TRow;
  label: string;
  rowRender?: (val: any, index: number, id: string) => JSX.Element;
}

export interface IRowAction<TRow = Record<string, any>> {
  name: string;
  fn: (row: TRow, index: number) => void;
  actionRender: FC<{ row: TRow; index: number; name: string }>;
}
