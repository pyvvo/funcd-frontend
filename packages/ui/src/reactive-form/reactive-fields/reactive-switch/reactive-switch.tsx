/* oxlint-disable import/extensions */
/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line object-curly-newline
import { Checkbox, CheckboxProps, Switch, SwitchProps } from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { SwitchCustomProps } from './types';
import { getMantineError } from '../utils';

const ReactiveSwitch: FC<IReactiveField<SwitchCustomProps>> = (props) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const { size, disabled, hidden, handleChange } = customProps;

  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const fieldProps: ReactiveFieldProps<SwitchProps> = {
    id: fieldKey,
    'data-testid': fieldKey,
    label,
    // 'aria-describedby': helperId,
    size,
    disabled,
    style: {
      marginBlock: '12px',
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
      rules={{ ...options }}
      render={({ field: { onChange, value, ...rest } }) => (
        <Switch
          {...fieldProps}
          onChange={(event) => {
            customHandlechange({ form, event });
            onChange(event);
          }}
          checked={value}
          {...rest}
        />
      )}
    />
  );
};
export default ReactiveSwitch;
