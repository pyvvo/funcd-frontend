import { Box, BoxProps } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './icon-label-cell.module.css';

interface IIconLabelCell extends BoxProps {
  label: string;
  icon: ReactNode;
}

const IconLabelCell: FC<IIconLabelCell> = (props) => {
  const { label, icon, ...rest } = props;

  return (
    <Box className={styles.root} {...rest}>
      {icon}
      {label}
    </Box>
  );
};

export default IconLabelCell;
