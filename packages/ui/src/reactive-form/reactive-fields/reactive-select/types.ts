/* oxlint-disable import/extensions */
/* oxlint-disable import/no-cycle */
import { ComboboxData, MantineSize } from '@mantine/core';

export type SelectCustomProps = {
  data: ComboboxData;
  size?: MantineSize;
  onDropdownOpen?: () => void;
};
