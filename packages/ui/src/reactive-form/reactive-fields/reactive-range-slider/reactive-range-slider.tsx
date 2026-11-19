import {
  Input,
  InputWrapperProps,
  RangeSlider,
  RangeSliderProps
} from '@mantine/core';
import { FC, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { getMantineError } from '../utils';
import { RangeSliderCustomProps } from './types';

const ReactiveRangeSlider: FC<IReactiveField<RangeSliderCustomProps>> = (
  props
) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const {
    size,
    disabled,
    hidden,
    handleChange,
    marks,
    min,
    max,
    step,
    minRange,
    maxRange,
    label: valueLabel,
    thumbSize,
    thumbChildren,
    inverted,
    scale
  } = customProps;

  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const wrapperProps: ReactiveFieldProps<InputWrapperProps> = {
    label,
    style: {
      marginTop: '12px',
      marginBottom: '14px',
      width: '100%',
      display: hidden ? 'none' : undefined
    },
    withAsterisk: !!options?.required,
    'data-testid': `${fieldKey}-wrapper`,
    children: undefined,
    error: getMantineError(error)
  };

  const fieldProps: ReactiveFieldProps<RangeSliderProps> = {
    id: fieldKey,
    'data-testid': fieldKey,
    marks,
    size,
    disabled,
    min,
    max,
    step,
    minRange,
    maxRange,
    label: valueLabel,
    thumbSize,
    thumbChildren,
    inverted,
    scale,
    style: {
      width: '100%',
      display: hidden ? 'none' : undefined
    }
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
      render={({ field: { onChange, value, ref, name, onBlur } }) => (
        <Input.Wrapper {...wrapperProps}>
          <RangeSlider
            {...fieldProps}
            onChange={(event) => {
              customHandlechange({ form, event });
              onChange(event);
            }}
            value={value}
            ref={ref}
            name={name}
            onBlur={onBlur}
          />
        </Input.Wrapper>
      )}
    />
  );
};
export default ReactiveRangeSlider;
