/* oxlint-disable import/extensions */
/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line object-curly-newline
import { TextInput, TextInputProps } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { TextFieldCustomProps } from './types';
import { getMantineError } from '../utils';

const ReactiveTextField: FC<IReactiveField<TextFieldCustomProps>> = (props) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const { size, disabled, hidden, handleChange } = customProps;
  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const fieldProps: ReactiveFieldProps<TextInputProps> = {
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
        <TextInput
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
export default ReactiveTextField;
