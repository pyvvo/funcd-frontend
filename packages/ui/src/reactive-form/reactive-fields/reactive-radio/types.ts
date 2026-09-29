/* oxlint-disable import/extensions */
/* oxlint-disable import/no-cycle */
import { MantineSize } from '@mantine/core';

export type RadioCustomProps = {
  data: { value: string; label: string }[];
  /** Space between label and inputs */
  size?: MantineSize;
};
