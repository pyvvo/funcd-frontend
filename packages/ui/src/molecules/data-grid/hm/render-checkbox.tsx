import { Checkbox } from '@mantine/core';
import { FC } from 'react';
import { RenderCheckboxProps } from 'react-data-grid';

const RenderCheckbox = ({ onChange, ...rest }: RenderCheckboxProps) => {
  if (!onChange) return undefined;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  };
  return <Checkbox {...rest} size="xs" radius="sm" onChange={handleChange} />;
};

export default RenderCheckbox;
