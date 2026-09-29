/* oxlint-disable import/extensions */
/* oxlint-disable import/no-cycle */
import { MantineSize } from '@mantine/core';
import { FC } from 'react';

export type PasswordFieldCustomProps = {
  /** Adds icon on the left side of input */
  size?: MantineSize;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  visibilityToggleIcon?: FC<{
    reveal: boolean;
  }>;
};
