/* oxlint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
/* oxlint-disable array-callback-return */
/* oxlint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* oxlint-disable @typescript-eslint/no-non-null-assertion */
/* oxlint-disable no-console */
import { HMDrawer, IReactiveFieldMeta, ReactiveForm } from '@humaapi/ui';
import { Box, Button } from '@mantine/core';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import Store from './store.service';

type Data = ReturnType<typeof Store.getRows>[0];

const defaultValues = {
  email: '',
  password: 'secret'
};

const Collector: FC = () => {
  const form = useForm<Data>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues
  });
  console.log('ici');

  const onSubmit = (submitedData: Data) => {
    console.log(submitedData);
  };

  const meta: IReactiveFieldMeta<Data>[] = [
    {
      name: 'fddffd',
      fields: [
        {
          fieldKey: 'email',
          label: 'Email',
          type: 'text',
          options: {
            required: true
          }
        },
        {
          fieldKey: 'password',
          label: 'Password',
          type: 'password'
          // customProps: {
          //   label: 'ff'
          // }
        },
        {
          fieldKey: 'operator',
          label: 'Operator',
          type: 'text'
        },
        {
          fieldKey: 'subscriber',
          label: 'Subscriber',
          type: 'text'
        }
      ]
    }
  ];

  return (
    <HMDrawer>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Box>
          <Button type="submit">Edit</Button>
        </Box>
        <ReactiveForm form={form} meta={meta} />
      </form>
    </HMDrawer>
  );
};

export default Collector;
