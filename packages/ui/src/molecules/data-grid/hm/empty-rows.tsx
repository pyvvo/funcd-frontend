import { Box, ThemeIcon } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import { FC, ReactNode } from 'react';
import styles from './empty-rows.module.css';

interface IEmptyRows {
  icon?: ReactNode;
  text?: string;
}

// What a grid without rows shows under its header.
const EmptyRows: FC<IEmptyRows> = (props) => {
  const { icon = <IconInbox size={24} />, text = 'Nothing to show' } = props;

  return (
    <Box className={styles.root}>
      <ThemeIcon variant="light" size={48} radius="xl">
        {icon}
      </ThemeIcon>
      <Box className={styles.text}>{text}</Box>
    </Box>
  );
};

export default EmptyRows;
