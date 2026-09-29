/* oxlint-disable import/extensions */
/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line object-curly-newline
import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { getMantineError } from '../utils';
import { MultiSelectCustomProps } from './types';

const ReactiveMultiSelect: FC<IReactiveField<MultiSelectCustomProps>> = (
  props
) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const {
    size,
    disabled,
    hidden,
    handleChange,
    onDropdownOpen,
    leftSection,
    rightSection,
    limit,
    maxDropdownHeight,
    placeholder,
    data
  } = customProps;

  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const fieldProps: ReactiveFieldProps<MultiSelectProps> = {
    id: fieldKey,
    'data-testid': fieldKey,
    label,
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
    leftSection,
    rightSection,
    placeholder,
    limit,
    maxDropdownHeight,
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
        <MultiSelect
          {...fieldProps}
          onChange={(event) => {
            customHandlechange({ form, event });
            onChange(event);
          }}
          value={value}
          {...rest}
        />
      )}
    />
  );
};
export default ReactiveMultiSelect;
