import { ChangeEvent, Ref } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { JSONData, Simplify } from '@/types';
import { FormProps } from '../../../types/form';

export type InputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'password'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'multi-select'
  | 'radio'
  | 'range'
  | 'autocomplete'
  | 'list';

// // | 'list'
// | 'datepicker'

export type FormFieldOption<TFieldValues extends JSONData> =
  RegisterOptions<TFieldValues>;

export type ErrorFormType = {
  type: string;
  message: string;
  ref: Ref<HTMLElement>;
};

export type ReactiveFieldErrorType = ErrorFormType | Record<string, any>;

export type ReactiveFieldProps<TFieldProps extends JSONData> = Simplify<
  { 'data-testid': string } & TFieldProps
>;

export interface IReactiveField<
  TFieldProps extends JSONData,
  TFormValues extends JSONData = JSONData
> {
  /** Key is used for register, input id and array map key */
  fieldKey: string;
  /** label is used for the input displayed name */
  label: string;
  /** react-hook-form register's options  */
  options?: FormFieldOption<TFormValues>;

  form: FormProps<TFormValues>;

  customProps: CommonProps<TFieldProps, TFormValues>;

  error?: ReactiveFieldErrorType;
}

export type ReactiveFieldStoryType<
  TFieldProps extends JSONData,
  TFormValues extends JSONData = JSONData
> = Omit<IReactiveField<TFieldProps, TFormValues>, 'error' | 'form'>;

export type CommonProps<
  // T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  TFieldProps extends JSONData,
  TFormValues extends JSONData = JSONData
> = {
  disabled?: boolean;
  hidden?: boolean;
  handleChange?: (params: {
    form: FormProps<TFormValues>;
    // `any` already subsumes ChangeEvent<TFieldProps>; keeping both made the
    // union redundant and hid the fact that this parameter is untyped.
    event: any;
  }) => void;
} & TFieldProps;
