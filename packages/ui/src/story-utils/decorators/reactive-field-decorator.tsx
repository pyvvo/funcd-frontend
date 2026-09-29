/* oxlint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* oxlint-disable import/prefer-default-export */
/* eslint-disable react/require-default-props */
import {
  FieldMeta,
  getError,
  InputType,
  IReactiveField
} from '@/reactive-form';
import { JSONData } from '@/types';
import { Button, Flex, JsonInput } from '@mantine/core';
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { IDecoratorParams } from './common';

interface IReactiveFieldWrapper {
  field: FieldMeta<JSONData, InputType>;
  children?: ReactiveField;
  defaultValues: Record<string, any>;
}

type ReactiveField = ReactElement<IReactiveField<JSONData, JSONData>>;
const ReactiveFieldWrapper: FC<IReactiveFieldWrapper> = (props) => {
  const { children, field, defaultValues } = props;
  const [value, setValue] = useState('');
  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues
  });
  const {
    formState: { errors }
  } = form;
  const { type, ...fieldProps } = field;
  const error = getError(field.fieldKey, errors);

  const onSubmit = (data: any) => {
    setValue(data);
  };
  const handleSubmit = (data: any) => {
    // action(`'[React Hooks Form] Submit'`);
    onSubmit(JSON.stringify(data));
  };

  const modifiedChildren =
    children &&
    Children.map<any, any>(children, (child) => {
      // Checking isValidElement is the safe way and avoids a typescript
      // error too.
      if (isValidElement(child)) {
        // @see https://medium.com/@justynazet/passing-props-to-props-children-using-react-cloneelement-and-render-props-pattern-896da70b24f6
        return cloneElement(child as any, {
          args: {
            ...fieldProps,
            form,
            error
          }
        });
      }
      return child;
    });

  return (
    <form
      style={{ minWidth: '400px' }}
      onSubmit={form.handleSubmit(handleSubmit)}>
      <Flex
        mih={50}
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        style={{ marginTop: '18px' }}
        wrap="wrap">
        {modifiedChildren}
        <Button
          styles={{ root: { marginTop: '12px' } }}
          type="submit"
          data-testid="submit">
          Submit
        </Button>
        <JsonInput
          label="Result"
          placeholder="Input result"
          // validationError="Invalid json"
          data-testid="form-result"
          formatOnBlur
          autosize
          minRows={4}
          style={{
            width: '100%'
          }}
          // defaultValue="tt"
          value={value}
          onChange={() => {}}
        />
      </Flex>
    </form>
  );
};

export const ReactiveFieldDecorator =
  (defaultValues: JSONData = {}) =>
  (Story: IDecoratorParams['Story'], props: IDecoratorParams['props']) => {
    const { args } = props;
    return (
      // @ts-ignore
      <ReactiveFieldWrapper field={{ ...args }} defaultValues={defaultValues}>
        <Story />
      </ReactiveFieldWrapper>
    );
  };
