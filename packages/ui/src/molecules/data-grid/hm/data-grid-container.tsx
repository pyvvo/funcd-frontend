/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
import { FC, ReactNode } from 'react';
import { Box, MantineTheme, Paper, PaperProps, Text } from '@mantine/core';
import styles from './data-grid-container.module.css';

interface IDataGridContainer extends PaperProps {
  theme: MantineTheme;
  selectedRowCount?: number;
  footer?: ReactNode;
  children: ReactNode;
}

const DataGridContainer: FC<IDataGridContainer> = (props) => {
  const { children, theme, selectedRowCount = 0, footer, ...rest } = props;

  return (
    <Paper
      radius="var(--mantine-grid-border-radius)"
      classNames={{ root: styles.root }}
      {...rest}>
      {selectedRowCount ? (
        <Box className={styles.header}>
          <Text variant="text">{selectedRowCount} item(s) selected</Text>
        </Box>
      ) : null}
      <Box className={styles.list}>{children}</Box>
      <Box className={styles.footer}>{footer}</Box>
    </Paper>
  );
};

export default DataGridContainer;
