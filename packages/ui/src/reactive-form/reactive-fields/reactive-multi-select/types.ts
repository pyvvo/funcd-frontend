/* oxlint-disable import/extensions */
/* oxlint-disable import/no-cycle */
import { ComboboxData, MantineSize } from '@mantine/core';
import { ReactNode } from 'react';

export type MultiSelectCustomProps = {
  data: ComboboxData;
  size?: MantineSize;
  placeholder?: string;
  limit?: number;
  maxDropdownHeight?: number;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onDropdownOpen?: () => void;
};
