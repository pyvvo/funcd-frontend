/* oxlint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, ReactNode } from 'react';
import {
  FormFieldOption,
  IConditionalProp,
  InputType
} from '@/reactive-form/reactive-fields/types';
import { JSONData, NestedKeyOf } from '@/types';

type PartialOption<TFormValues extends JSONData> = Omit<
  FormFieldOption<TFormValues>,
  'onChange' | 'onBlur'
>;

// type InputKeyType<
//   TFormValues extends JSONData,
//   TInputType extends InputType
// > = NestedKeyOf<IFilterKeys<TFormValues>[TInputType]>;

type Data = {
  username: string;
  password: string;
  isActive: boolean;
};

// type TTT = InputKeyType<Data, 'text'>;

type TT = IPatialReactiveField<Data, 'text'>;

// // type TTTT = FieldMeta<Data, 'switch'>['customProps'];

const meta: IReactiveFieldMeta<Data> = {
  fields: [{ type: 'text', fieldKey: 'password', label: 'fdf' }]
};

interface IPatialReactiveField<
  TFormValues extends JSONData,
  TInputType extends InputType
> {
  /** Key is used for register, input id and array map key */
  fieldKey: NestedKeyOf<TFormValues>;
  /** label is used for the input displayed name */
  label: string;
  /** react-hook-form register's options  */
  options?: PartialOption<TFormValues>;
  /** Field type => "text", "switch" ...  */
  type: TInputType;
}

type ReactiveFieldMeta<
  TInputType extends InputType,
  TFormValues extends JSONData
> = IConditionalProp<TFormValues>[TInputType] &
  IPatialReactiveField<TFormValues, TInputType>;

export type FieldMeta<
  TFormValues extends JSONData,
  TInputType extends InputType
> = TInputType extends InputType
  ? ReactiveFieldMeta<TInputType, TFormValues>
  : never;

export interface IReactiveFieldMeta<TFormValues extends JSONData> {
  name?: string;
  fields: ReturnType<
    <TInputType extends InputType>(
      params: FieldMeta<TFormValues, TInputType>[]
    ) => typeof params
  >;
  // fieldKey: InputKeyType<TField, U>;
  // type: InputType;
}

// #############################
// #############################
// #############################
// ############### form group type

export type FormGroupComponentType = ReactElement<{
  title: string;
  children: ReactNode;
}>;
