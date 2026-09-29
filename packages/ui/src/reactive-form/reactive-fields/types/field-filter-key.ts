import { DeepOmitVariableKind, JSONData } from '@/types';

// type InputKeyType<
//   TFormValues extends JSONData,
//   TInputType extends InputType
// > = NestedKeyOf<IFilterKeys<TFormValues>[TInputType]>;

export interface IFilterKeys<TFormValues extends JSONData> {
  text: DeepOmitVariableKind<TFormValues, boolean | any[]>;
  checkbox: DeepOmitVariableKind<TFormValues, number | any[] | string>;
  switch: DeepOmitVariableKind<TFormValues, number | any[] | string>;
  // password: DeepOmitVariableKind<TFormValues, boolean | any[]>;
  // range: DeepOmitVariableKind<TFormValues, boolean | any[] | string>;

  // select: DeepOmitVariableKind<TFormValues, boolean | any[]>;
  // 'multi-select': DeepOmitVariableKind<
  //   TFormValues,
  //   boolean | number | string | Record<string, any>[]
  // >;
  // radio: DeepOmitVariableKind<TFormValues, boolean | any[]>;

  // list: DeepOmitVariableKind<
  //   TFormValues,
  //   boolean | Primitive[] | string | number
  // >;
  // datepicker: DeepOmitVariableKind<TFormValues, boolean | any[]>;
  // autocomplete: DeepOmitVariableKind<
  //   TFormValues,
  //   boolean | number | string | Record<string, any>[]
  // >;
}
