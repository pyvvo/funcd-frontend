import { Textarea, TextareaProps } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { getMantineError } from '../utils';
import { TextareaFieldCustomProps } from './types';

const ReactiveTextareaField: FC<IReactiveField<TextareaFieldCustomProps>> = (
  props
) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const { size, disabled, hidden, handleChange, minRows, maxRows } =
    customProps;
  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const fieldProps: ReactiveFieldProps<TextareaProps> = {
    id: fieldKey,
    // 'aria-describedby': helperId,
    'data-testid': fieldKey,
    size,
    disabled,
    withAsterisk: !!options?.required,
    style: {
      width: '100%',
      display: hidden ? 'none' : undefined
    },
    minRows,
    maxRows,
    autosize: true,
    error: getMantineError(error)
  };
  const customHandlechange = useCallback(
    (params: HandleChangeParams) => {
      if (handleChange) {
        handleChange({ ...params });
      }
    },
    [handleChange]
  );

  return (
    <Controller
      control={control}
      name={fieldKey}
      // defaultValue=""
      rules={{ ...options }}
      render={({ field: { onChange, ref, ...rest } }) => (
        <Textarea
          {...fieldProps}
          onChange={(event) => {
            customHandlechange({ form, event });
            onChange(event);
          }}
          ref={ref}
          {...rest}
          label={label}
        />
      )}
    />
  );
};
export default ReactiveTextareaField;
