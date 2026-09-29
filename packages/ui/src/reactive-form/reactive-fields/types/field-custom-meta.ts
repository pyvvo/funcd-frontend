import { JSONData } from '@/types';
import { ICustomProps } from './field-custom-props';
import { InputType } from './reactive-field-base';

type CustomProps<TInputType extends InputType, TFormValues extends JSONData> = {
  customProps: ICustomProps<TFormValues>[TInputType];
};

export type ConditionalProp<
  TInputType extends InputType,
  TFormValues extends JSONData = JSONData,
  IsPartialProps extends boolean = false
> = IsPartialProps extends true
  ? Partial<CustomProps<TInputType, TFormValues>>
  : CustomProps<TInputType, TFormValues>;

export interface IConditionalProp<TFormValues extends JSONData> {
  autocomplete: ConditionalProp<'autocomplete', TFormValues>;
  text: ConditionalProp<'text', TFormValues, true>;
  textarea: ConditionalProp<'textarea', TFormValues, true>;
  password: ConditionalProp<'password', TFormValues, true>;
  number: ConditionalProp<'number', TFormValues, true>;
  checkbox: ConditionalProp<'checkbox', TFormValues, true>;
  switch: ConditionalProp<'switch', TFormValues, true>;
  select: ConditionalProp<'select', TFormValues, true>;
  radio: ConditionalProp<'radio', TFormValues>;
  range: ConditionalProp<'range', TFormValues>;
  'multi-select': ConditionalProp<'multi-select', TFormValues>;
  list: ConditionalProp<'list'>;
  // datepicker: ConditionalProp<'datepicker', true>;
}
