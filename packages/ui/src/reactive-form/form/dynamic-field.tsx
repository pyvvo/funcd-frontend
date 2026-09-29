/* oxlint-disable @typescript-eslint/no-shadow */
import {
  getError,
  InputType,
  ReactiveFieldErrorType
} from '@/reactive-form/reactive-fields';
import { useCallback, useMemo } from 'react';
import { FormProps, JSONData } from '../../types';
import FormBuilder from '../form-builder';
import { FieldMeta } from './types';

// Field meta may leave out `customProps`, but every field destructures it, so
// pass a stable empty object instead of `undefined`.
const emptyCustomProps = {};

interface IDynamicField<TFormValues extends JSONData> {
  field: FieldMeta<TFormValues, InputType>;
  form: FormProps<TFormValues>;
  errors: ReactiveFieldErrorType;
}

const DynamicField = <TFormValues extends JSONData>(
  props: IDynamicField<TFormValues>
) => {
  const { field, form, errors } = props;
  const MemoizedRenderField = useCallback(() => {
    const RenderField = FormBuilder.getField<JSONData, TFormValues>(field.type);
    return RenderField;
  }, [field.type])();
  const { customProps, options } = field;
  // Kept identity-stable so the memo below can depend on the whole object.
  // Previously it depended only on `fieldProps.fieldKey`/`.label`, so changes
  // to any other field prop produced a stale render.
  const fieldProps = useMemo(() => {
    const {
      type: _type,
      customProps: _customProps,
      options: _options,
      ...rest
    } = field;
    return rest;
  }, [field]);
  const error = getError(field.fieldKey, errors);

  return useMemo(
    () => (
      <MemoizedRenderField
        {...fieldProps}
        options={options as never}
        form={form}
        customProps={customProps ?? emptyCustomProps}
        error={error}
      />
    ),

    [MemoizedRenderField, options, fieldProps, form, customProps, error]
  );
};

export default DynamicField;
