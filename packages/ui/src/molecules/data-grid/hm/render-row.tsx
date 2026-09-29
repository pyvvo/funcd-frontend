import { Checkbox } from '@mantine/core';
import dayjs from 'dayjs';
// import React from "react";
import type { RowType } from './types';
import { JSX } from 'react';

type RenderRowType<TRowType extends RowType> = {
  [K in TRowType]: (value: any) => JSX.Element;
};

export const renderRows: RenderRowType<RowType> = {
  text: (value: any) => <>{String(value)}</>,

  checkbox: (value: boolean) => {
    const onChange = () => undefined;
    return <Checkbox radius="sm" checked={value} onChange={onChange} />;
  },

  date: (value: string) => <>{dayjs(value).format('DD/MM/YYYY')}</>
};
