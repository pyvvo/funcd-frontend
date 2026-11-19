import {
  Button,
  Group,
  Input,
  InputWrapperProps,
  Popover,
  SegmentedControl
} from '@mantine/core';
import { DatePicker, DatesRangeValue, MonthPicker } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { FC, useCallback, useState } from 'react';
import { Controller } from 'react-hook-form';
import { IReactiveField, ReactiveFieldProps } from '../types';
import { getMantineError } from '../utils';
import { PeriodCustomProps, PeriodPresetType, PeriodValueType } from './types';

const presetLabels = {
  '7d': '7d',
  '1M': '1M',
  '3M': '3M',
  '6M': '6M',
  YTD: 'YTD',
  '1Y': '1Y',
  all: 'All'
} satisfies Record<PeriodPresetType, string>;

const ReactivePeriod: FC<IReactiveField<PeriodCustomProps>> = (props) => {
  const { form, fieldKey, label, options, error, customProps } = props;

  const {
    size = 'sm',
    disabled,
    hidden,
    handleChange,
    presets,
    unit = 'day',
    defaultDate,
    customLabel = 'Custom'
  } = customProps;

  type CustomProps = typeof customProps;
  type HandleChangeParams = Parameters<
    NonNullable<CustomProps['handleChange']>
  >['0'];
  const { control } = form;
  const [opened, setOpened] = useState(false);
  const [range, setRange] = useState<DatesRangeValue<string>>([null, null]);

  const wrapperProps: ReactiveFieldProps<InputWrapperProps> = {
    label,
    style: {
      display: hidden ? 'none' : undefined
    },
    withAsterisk: !!options?.required,
    'data-testid': `${fieldKey}-wrapper`,
    children: undefined,
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
      render={({ field: { onChange, value, ref, onBlur } }) => {
        const period = value as PeriodValueType | null | undefined;
        const custom = period && 'from' in period ? period : undefined;
        const change = (event: PeriodValueType) => {
          customHandlechange({ form, event });
          onChange(event);
        };
        // A custom range is picked once both its ends are; a month keeps its YYYY-MM.
        const handleRange = (picked: DatesRangeValue<string>) => {
          setRange(picked);
          const [from, to] = picked;
          if (!from || !to) return;
          change(
            unit === 'month'
              ? { from: from.slice(0, 7), to: to.slice(0, 7) }
              : { from, to }
          );
          setOpened(false);
        };
        const pickerProps = {
          type: 'range' as const,
          value: range,
          onChange: handleRange,
          defaultDate
        };

        return (
          <Input.Wrapper {...wrapperProps}>
            <Group
              gap="xs"
              wrap="nowrap"
              ref={ref}
              onBlur={onBlur}
              data-testid={fieldKey}>
              <SegmentedControl
                size={size}
                disabled={disabled}
                data={presets.map((preset) => ({
                  value: preset,
                  label: presetLabels[preset]
                }))}
                value={period && 'preset' in period ? period.preset : ''}
                onChange={(preset) =>
                  change({ preset: preset as PeriodPresetType })
                }
              />
              <Popover
                opened={opened}
                onChange={setOpened}
                position="bottom-end">
                <Popover.Target>
                  <Button
                    size={size}
                    radius="xl"
                    variant={custom ? 'filled' : 'elevated'}
                    disabled={disabled}
                    leftSection={<IconCalendar size={16} />}
                    onClick={() => setOpened((isOpened) => !isOpened)}>
                    {custom ? `${custom.from} – ${custom.to}` : customLabel}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  {unit === 'month' ? (
                    <MonthPicker {...pickerProps} />
                  ) : (
                    <DatePicker {...pickerProps} />
                  )}
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Input.Wrapper>
        );
      }}
    />
  );
};
export default ReactivePeriod;
