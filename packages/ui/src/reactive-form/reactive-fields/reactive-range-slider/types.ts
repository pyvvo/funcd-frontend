import { MantineSize } from '@mantine/core';
import { ReactNode } from 'react';

export type RangeSliderCustomProps = {
  /** Marks which will be placed on the track */
  marks?: {
    value: number;
    label?: ReactNode;
  }[];
  size?: MantineSize;
  step?: number;
  max?: number;
  min?: number;
  /** Smallest gap between the two thumbs, 10 by default */
  minRange?: number;
  /** Largest gap between the two thumbs */
  maxRange?: number;
  /** Thumb label, or a function that makes it from the value; null hides it */
  label?: ReactNode | ((value: number) => ReactNode);
  thumbSize?: number;
  /** Thumb children, can be used to add icon */
  thumbChildren?: ReactNode;
  inverted?: boolean;
  /** A transformation function, to change the scale of the slider */
  scale?: (value: number) => number;
};
