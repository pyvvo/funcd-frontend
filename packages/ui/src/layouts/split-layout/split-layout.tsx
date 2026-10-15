import { Box, BoxProps, rem } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './split-layout.module.css';

export type SplitSidePositionType = 'left' | 'right';

interface ISplitLayout extends BoxProps {
  /** A list or a navigation beside the detail; above it when narrow */
  side: ReactNode;
  /** The side's width in pixels */
  sideWidth?: number;
  sidePosition?: SplitSidePositionType;
  children?: ReactNode;
}

// A side panel and a detail next to each other, such as a list and the item
// open from it. It follows its own width, not the screen's.
const SplitLayout: FC<ISplitLayout> = (props) => {
  const {
    side,
    sideWidth = 320,
    sidePosition = 'left',
    children,
    ...rest
  } = props;

  return (
    <Box
      className={styles.root}
      mod={{ 'side-position': sidePosition }}
      style={{ '--split-side-width': rem(sideWidth) }}
      {...rest}>
      <Box className={styles.grid}>
        <Box className={styles.side}>{side}</Box>
        <Box className={styles.detail}>{children}</Box>
      </Box>
    </Box>
  );
};

export default SplitLayout;
