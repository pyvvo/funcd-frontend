import { JSONData } from '@/types';
import { AutocompleteCustomProps } from '../reactive-autocomplete';
import { CheckCustomProps } from '../reactive-checkbox';
import { MultiSelectCustomProps } from '../reactive-multi-select';
import { NumberFieldCustomProps } from '../reactive-number-field';
import { PasswordFieldCustomProps } from '../reactive-password-field';
import { RadioCustomProps } from '../reactive-radio';
import { RangeCustomProps } from '../reactive-range';
import { SelectCustomProps } from '../reactive-select';
import { SwitchCustomProps } from '../reactive-switch';
import { TextFieldCustomProps } from '../reactive-text-field';
import { CommonProps, InputType } from './reactive-field-base';
import { ListFieldCustomProps } from '../reactive-list';
import { TextareaFieldCustomProps } from '../reactive-textarea-field';

export type CustomPropsType = Record<InputType, any>;

export interface ICustomProps<TFormValues extends JSONData> {
  autocomplete: CommonProps<AutocompleteCustomProps, TFormValues>;
  text: CommonProps<TextFieldCustomProps, TFormValues>;
  textarea: CommonProps<TextareaFieldCustomProps, TFormValues>;
  password: CommonProps<PasswordFieldCustomProps, TFormValues>;
  number: CommonProps<NumberFieldCustomProps, TFormValues>;
  checkbox: CommonProps<CheckCustomProps, TFormValues>;
  switch: CommonProps<SwitchCustomProps, TFormValues>;
  select: CommonProps<SelectCustomProps, TFormValues>;
  radio: CommonProps<RadioCustomProps, TFormValues>;
  range: CommonProps<RangeCustomProps, TFormValues>;
  'multi-select': CommonProps<MultiSelectCustomProps, TFormValues>;
  list: CommonProps<ListFieldCustomProps<TFormValues>, TFormValues>;
  // range: never;
  // datepicker: never;
  // autocomplete: never;
}
