import { ComboboxData, MantineSize } from '@mantine/core';
import { ReactNode } from 'react';

export type AutocompleteCustomProps = {
  data: ComboboxData;
  size?: MantineSize;
  placeholder?: string;
  limit?: number;
  maxDropdownHeight?: number;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onDropdownOpen?: () => void;
};
