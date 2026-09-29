/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable import/extensions */
/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
// eslint-disable-next-line object-curly-newline
import {
  Checkbox,
  CheckboxProps,
  Group,
  Radio,
  RadioGroupProps,
  RadioProps
} from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { RadioCustomProps } from './types';
import { getMantineError } from '../utils';

const ReactiveRadio: FC<IReactiveField<RadioCustomProps>> = (props) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const { data, size, disabled, hidden, handleChange } = customProps;

  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;

  const radiogroupsprops: Omit<RadioGroupProps, 'children'> = {
    id: fieldKey,
    style: {
      marginTop: '14px',
      marginBottom: '12px'
    }
  };

  const fieldProps: ReactiveFieldProps<RadioProps> = {
    id: fieldKey,
    'data-testid': fieldKey,
    label,
    // 'aria-describedby': helperId,
    size,
    disabled,
    required: !!options?.required,
    style: {
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
      // defaultValue={false}
      rules={{ ...options }}
      render={({ field: { onChange, value, ref, name, onBlur } }) => (
        <Radio.Group
          {...radiogroupsprops}
          ref={ref}
          name={name}
          onBlur={onBlur}
          onChange={(event) => {
            customHandlechange({ form, event });
            onChange(event);
          }}
          value={value}
          label={label}>
          <Group mt="xs">
            {data.map(({ label, value }) => (
              <Radio
                {...fieldProps}
                id={`${fieldKey}-${value}`}
                key={value}
                value={value}
                label={label}
                data-testid={value}
              />
            ))}
          </Group>
        </Radio.Group>
      )}
    />
  );
};
export default ReactiveRadio;
