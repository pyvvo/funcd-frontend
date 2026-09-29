/* oxlint-disable import/extensions */
/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line object-curly-newline
import { Autocomplete, AutocompleteProps } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { AutocompleteCustomProps } from './types';
import { getMantineError } from '../utils';

const ReactiveAutocomplete: FC<IReactiveField<AutocompleteCustomProps>> = (
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
  const fieldProps: ReactiveFieldProps<AutocompleteProps> = {
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
      // defaultValue={false}
      rules={{ ...options }}
      render={({ field: { onChange, value, ...rest } }) => (
        <Autocomplete
          {...fieldProps}
          onChange={(event) => {
            customHandlechange({ form, event });
            onChange(event);
          }}
          value={value ?? ''}
          {...rest}
        />
      )}
    />
  );
};
export default ReactiveAutocomplete;
