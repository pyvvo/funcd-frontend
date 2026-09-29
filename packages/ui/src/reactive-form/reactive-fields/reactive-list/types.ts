/* oxlint-disable import/extensions */
/* oxlint-disable import/no-cycle */
import { IHMColumn } from '@/molecules/table/types';
import { FieldMeta } from '@/reactive-form/form/types';
import { MantineSize } from '@mantine/core';
import { InputType } from '../types';
import { JSONData } from '@/types';

export type ListFieldColumnType<TFormValues extends JSONData> = FieldMeta<
  TFormValues,
  Exclude<InputType, 'list'>
> &
  Pick<IHMColumn, 'rowRender'>;

export type ListFieldCustomProps<TFormValues extends JSONData> = {
  size?: MantineSize;
  columns: ListFieldColumnType<TFormValues>[];
};
