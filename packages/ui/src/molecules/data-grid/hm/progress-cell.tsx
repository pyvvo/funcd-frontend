import { Box, BoxProps, MantineColor } from '@mantine/core';
import { FC } from 'react';
import styles from './progress-cell.module.css';

interface IProgressCell extends BoxProps {
  value: number;
  color: MantineColor;
}

// A percentage as a thin bar and its value, "97.4%".
const ProgressCell: FC<IProgressCell> = (props) => {
  const { value, color, ...rest } = props;
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <Box
      className={styles.root}
      style={{ '--progress-color': `var(--mantine-color-${color}-6)` }}
      {...rest}>
      <Box component="span" className={styles.track}>
        <Box
          component="span"
          className={styles.bar}
          style={{ width: `${width}%` }}
        />
      </Box>
      <Box component="span" className={styles.value}>
        {value.toFixed(1)}%
      </Box>
    </Box>
  );
};

export default ProgressCell;
