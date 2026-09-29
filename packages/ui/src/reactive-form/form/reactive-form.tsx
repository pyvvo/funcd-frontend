/* oxlint-disable @typescript-eslint/no-shadow */
import { useMemo } from 'react';
import { FormProps, JSONData } from '../../types';
import LayoutFlex from '../form-layout/layout-flex';
import FormGroup from './form-group';
import { IReactiveFieldMeta } from './types';
import DynamicField from './dynamic-field';

export interface IReactiveForm<TFormValues extends JSONData> {
  meta: IReactiveFieldMeta<TFormValues>[];
  form: FormProps<TFormValues>;
}

const ReactiveForm = <TFormValues extends JSONData>(
  props: IReactiveForm<TFormValues>
) => {
  const { meta, form } = props;

  const {
    formState: { errors }
  } = form;

  return useMemo(
    () => (
      <>
        {meta.map(({ name, fields }) => (
          <FormGroup key={name} name={name} component={<LayoutFlex />}>
            {fields.map((field) => (
              <DynamicField
                key={field.fieldKey}
                field={field}
                form={form}
                errors={errors}
              />
            ))}
          </FormGroup>
        ))}
      </>
    ),
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [meta, JSON.stringify(errors)]
  );
};

export default ReactiveForm;
