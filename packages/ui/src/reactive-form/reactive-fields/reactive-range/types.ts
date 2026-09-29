/* oxlint-disable import/extensions */
/* oxlint-disable import/no-cycle */
import { MantineSize } from '@mantine/core';

export type RangeCustomProps = {
  /** Marks which will be placed on the track */
  marks?: {
    value: number;
    label?: React.ReactNode;
  }[];
  size?: MantineSize;
  step?: number;
  thumbSize?: number;
  /** Thumb children, can be used to add icon */
  thumbChildren?: React.ReactNode;
  max?: number;
  min?: number;
  inverted?: boolean;
  /** A transformation function, to change the scale of the slider */
  scale?: (value: number) => number;
};
