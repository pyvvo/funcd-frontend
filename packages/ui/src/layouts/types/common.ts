import { MantineColor } from '@mantine/core';
import { TablerIcon } from '@tabler/icons-react';

export interface IModuleLink {
  label: string;
  icon: TablerIcon;
  color?: MantineColor;
  to?: string;
  isBottom?: boolean;
  isIndex?: boolean;
}
