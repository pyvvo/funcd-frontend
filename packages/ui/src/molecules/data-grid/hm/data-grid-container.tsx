/* oxlint-disable react/display-name */
/* eslint-disable react/require-default-props */
import {
  Children,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  cloneElement,
  isValidElement
} from 'react';
import {
  Box,
  MantineTheme,
  Paper,
  Text,
  useComputedColorScheme
} from '@mantine/core';
import styles from './data-grid-container.module.css';

const EmptyRowsRenderer = () => (
  <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>
    Nothing to show
    <span lang="ja" title="ショボーン">
      (´・ω・`)
    </span>
  </div>
);

interface IDataGridContainer extends ComponentPropsWithoutRef<'div'> {
  theme: MantineTheme;
  children: ReactNode;
}

const DataGridContainer: FC<IDataGridContainer> = (props) => {
  const { children, theme, ...rest } = props;
  const computedColorScheme = useComputedColorScheme('light');
  let selectedRowCount = 0;
  const modifiedChildren = Children.map(children as any, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (isValidElement(child as any)) {
      selectedRowCount = child.props.selectedRows
        ? child.props.selectedRows.size
        : 0;

      return cloneElement<any>(child, {
        className: computedColorScheme === 'dark' ? 'rdg-dark' : 'rdg-light',
        components: { noRowsFallback: <EmptyRowsRenderer /> }
      });
    }
    return child;
  });
  return (
    <Paper
      radius="var(--mantine-grid-border-radius)"
      classNames={{ root: styles.root }}
      {...rest}>
      {/* <Global
        styles={{
          '.rdg ': {
            '--row-count': `${rowCount}`,
            minHeight: `${
              rowCount >= 13
                ? 'calc(100vh - 310px)'
                : 'calc(var(--header-row-height) * var(--row-count))'
            }`,
          }
        }}
      /> */}
      {selectedRowCount ? (
        <Box className={styles.header}>
          <Text variant="text">{selectedRowCount} item(s) selected</Text>
        </Box>
      ) : null}
      <Box className={styles.list}>{modifiedChildren}</Box>
      <Box className={styles.footer}>
        {/* <Button>
          <NavigateBefore />
        </Button>
        <Button >
          <NavigateNext />
        </Button>

        <LoadMore color="primary" variant="contained" size="small">
          Load more
        </LoadMore> */}
      </Box>
    </Paper>
  );
};

export default DataGridContainer;
