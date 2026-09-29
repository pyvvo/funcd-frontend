/* oxlint-disable import/extensions */
/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line object-curly-newline
import { Select, SelectProps } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { SelectCustomProps } from './types';
import { getMantineError } from '../utils';

const ReactiveSelect: FC<IReactiveField<SelectCustomProps>> = (props) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const { size, disabled, hidden, handleChange, onDropdownOpen, data } =
    customProps;

  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const fieldProps: ReactiveFieldProps<SelectProps> = {
    id: fieldKey,
    'data-testid': fieldKey,
    label,
    placeholder: 'Pick value',
    // 'aria-describedby': helperId,
    size,
    disabled,
    withAsterisk: !!options?.required,
    style: {
      width: '100%',
      display: hidden ? 'none' : undefined
    },
    onDropdownOpen,
    data,
    searchable: true,
    clearable: true,
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
      rules={{ ...options }}
      render={({ field: { onChange, value, ...rest } }) => (
        <Select
          {...fieldProps}
          onChange={(event) => {
            customHandlechange({ form, event });
            onChange(event);
          }}
          value={value ?? null}
          {...rest}
        />
      )}
    />
  );
};
export default ReactiveSelect;
