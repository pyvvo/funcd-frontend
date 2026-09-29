/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* oxlint-disable import/prefer-default-export */
/* eslint-disable react/require-default-props */
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
import { JSONData } from '@/types';
import {
  FormBuilder,
  IReactiveFieldMeta,
  IReactiveForm,
  ReactiveAutocomplete,
  ReactiveCheckbox,
  ReactiveMultiSelect,
  ReactiveNumberField,
  ReactivePasswordField,
  ReactiveRadio,
  ReactiveRange,
  ReactiveSelect,
  ReactiveSwitch,
  ReactiveTextareaField,
  ReactiveTextField,
  ReactiveListField
} from '@/reactive-form';
import { IDecoratorParams } from './common';

FormBuilder.defineWidget({ name: 'text', component: ReactiveTextField });
FormBuilder.defineWidget({
  name: 'textarea',
  component: ReactiveTextareaField
});
FormBuilder.defineWidget({ name: 'number', component: ReactiveNumberField });
FormBuilder.defineWidget({
  name: 'password',
  component: ReactivePasswordField
});
FormBuilder.defineWidget({ name: 'checkbox', component: ReactiveCheckbox });
FormBuilder.defineWidget({ name: 'switch', component: ReactiveSwitch });

FormBuilder.defineWidget({
  name: 'autocomplete',
  component: ReactiveAutocomplete
});
FormBuilder.defineWidget({
  name: 'multi-select',
  component: ReactiveMultiSelect
});
FormBuilder.defineWidget({ name: 'radio', component: ReactiveRadio });
FormBuilder.defineWidget({ name: 'range', component: ReactiveRange });
FormBuilder.defineWidget({ name: 'select', component: ReactiveSelect });

FormBuilder.defineWidget({ name: 'list', component: ReactiveListField });

// ############################ Reactive form ######################

type ReactiveFormChildren = ReactElement<IReactiveForm<JSONData>>;
interface IReactiveFormWrapper {
  meta: IReactiveFieldMeta<JSONData>[];
  children?: ReactiveFormChildren;
  defaultValues: JSONData;
}

const ReactiveFormWrapper: FC<IReactiveFormWrapper> = (props) => {
  const { children, meta, defaultValues } = props;
  const [value, setValue] = useState('');
  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues
  });

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
            meta,
            form
          }
        });
      }
      return child;
    });

  // console.log(modifiedChildren);

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

export const ReactiveFormDecorator =
  (defaultValues: JSONData) =>
  (Story: IDecoratorParams['Story'], props: IDecoratorParams['props']) => {
    const {
      args: { meta }
    } = props;

    return (
      <ReactiveFormWrapper meta={meta as never} defaultValues={defaultValues}>
        <Story />
      </ReactiveFormWrapper>
    );
  };
