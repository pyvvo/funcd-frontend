import HmTable from '@/molecules/table';
import { IHMColumn, IRowAction } from '@/molecules/table/types';
import DynamicField from '@/reactive-form/form/dynamic-field';
import { JSONData, NestedKeyOf } from '@/types';
import { ActionIcon, Input, InputWrapperProps } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { FieldArray, set, useFieldArray } from 'react-hook-form';
import {
  InputType,
  IReactiveField,
  ReactiveFieldErrorType,
  ReactiveFieldProps
} from '../types';
import { errorsArrayToObject, getMantineError } from '../utils';
import { ListFieldCustomProps } from './types';

// Value of each column type in a new row.
const emptyValueMap = {
  text: '',
  textarea: '',
  password: '',
  number: '',
  autocomplete: '',
  checkbox: false,
  switch: false,
  select: null,
  radio: null,
  'multi-select': [],
  range: 0
} satisfies Record<Exclude<InputType, 'list'>, unknown>;

const ReactiveListField = <TFormValues extends JSONData>(
  props: IReactiveField<ListFieldCustomProps<TFormValues>, TFormValues>
) => {
  const { form, fieldKey, label, options, error, customProps } = props;
  const { control } = form;

  const { columns, disabled, hidden } = customProps;

  // `options` validates the whole list, for example its number of rows.
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldKey as never,
    rules: options as never
  });

  const handleAppend = () => {
    // Build the row from the columns: an empty list has no row to copy, and
    // a copied row also carries react-hook-form's `id`.
    const row = {};
    columns.forEach((col) => set(row, col.fieldKey, emptyValueMap[col.type]));
    append(row as FieldArray<TFormValues>);
  };

  const wrapperProps: ReactiveFieldProps<InputWrapperProps> = {
    label,
    style: {
      display: hidden ? 'none' : undefined
    },
    withAsterisk: !!options?.required,
    'data-testid': `${fieldKey}-wrapper`,
    // react-hook-form keeps the list's own error in `root`, next to the row
    // errors.
    error: getMantineError((error as JSONData | undefined)?.root)
  };

  const errors = error
    ? errorsArrayToObject(error as ReactiveFieldErrorType[], fieldKey)
    : {};

  const newCollumns = columns.map((col) => {
    const { rowRender, fieldKey: fK, ...field } = col;
    // delete the nested field label
    field.label = '';
    if (disabled) {
      field.customProps = { ...field.customProps, disabled };
    }
    return {
      key: col.fieldKey,
      label: col.label,
      rowRender: (val, idx, id) => {
        const nestedFieldKey =
          `${fieldKey}.${idx}.${fK}` as NestedKeyOf<TFormValues>;
        return (
          <DynamicField
            key={id}
            field={{ fieldKey: nestedFieldKey, ...field }}
            form={form}
            errors={errors}
          />
        );
      }
    } as IHMColumn<TFormValues>;
  });

  const actions: IRowAction<TFormValues>[] = [
    {
      name: 'delete',
      fn: (val, idx) => {
        // The table handles clicks on the cell, so a disabled button alone
        // does not stop them.
        if (disabled) {
          return;
        }
        remove(idx);
      },
      actionRender: ({ name }) => (
        <ActionIcon
          name={name}
          variant="filled"
          aria-label="Delete"
          color="red"
          disabled={disabled}>
          <IconTrash style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      )
    }
  ];

  // const customHandleChange = useCallback(
  //   (index: number, value: string) => {
  //     // Handle any custom behavior here if needed
  //     if (customProps?.handleChange) {
  //       customProps.handleChange({ index, value });
  //     }
  //   },
  //   [customProps]
  // );

  return (
    <Input.Wrapper {...wrapperProps}>
      <div style={{ marginBottom: 5 }}></div>
      <HmTable
        id={fieldKey}
        columns={newCollumns}
        actions={actions}
        rows={fields as unknown as TFormValues[]}
        withTableBorder
      />
      <ActionIcon
        style={{ marginTop: 10 }}
        name="add"
        variant="filled"
        aria-label="Add"
        disabled={disabled}
        onClick={handleAppend}>
        <IconPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    </Input.Wrapper>
  );
};

export default ReactiveListField;
