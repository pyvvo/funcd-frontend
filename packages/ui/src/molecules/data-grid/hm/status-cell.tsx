import { Box, BoxProps, MantineColor } from '@mantine/core';
import { FC } from 'react';
import styles from './status-cell.module.css';

interface IStatusCell extends BoxProps {
  label: string;
  color: MantineColor;
}

const StatusCell: FC<IStatusCell> = (props) => {
  const { label, color, ...rest } = props;

  return (
    <Box
      className={styles.root}
      style={{ '--status-color': `var(--mantine-color-${color}-6)` }}
      {...rest}>
      <Box component="span" className={styles.dot} />
      {label}
    </Box>
  );
};

export default StatusCell;
