/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
import { FC, ReactNode } from 'react';
import {
  Box,
  Button,
  Group,
  MantineTheme,
  Paper,
  PaperProps,
  Text
} from '@mantine/core';
import styles from './data-grid-container.module.css';

interface IDataGridContainer extends PaperProps {
  theme: MantineTheme;
  selectedRowCount?: number;
  selectionActions?: ReactNode;
  selectedText?: (count: number) => string;
  clearText?: string;
  onClearSelection?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

const DataGridContainer: FC<IDataGridContainer> = (props) => {
  const {
    children,
    theme,
    selectedRowCount = 0,
    selectionActions,
    selectedText = (count) => `${count} selected`,
    clearText = 'Clear',
    onClearSelection,
    footer,
    ...rest
  } = props;

  return (
    <Paper
      radius="var(--mantine-grid-border-radius)"
      classNames={{ root: styles.root }}
      {...rest}>
      {selectedRowCount ? (
        <Box className={styles.header}>
          <Text className={styles.selectedText}>
            {selectedText(selectedRowCount)}
          </Text>
          <Group gap="xs">
            {selectionActions}
            {onClearSelection && (
              <Button variant="subtle" size="xs" onClick={onClearSelection}>
                {clearText}
              </Button>
            )}
          </Group>
        </Box>
      ) : null}
      <Box className={styles.list}>{children}</Box>
      <Box className={styles.footer}>{footer}</Box>
    </Paper>
  );
};

export default DataGridContainer;
