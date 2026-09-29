import { Box, Grid, rem } from '@mantine/core';
import { FC, ReactNode } from 'react';
import { IChartLayout } from '../dashboard/types';
import styles from './layout-grid-item.module.css';

export interface ILayoutGridItem {
  layout: IChartLayout;
  /** Set by LayoutGrid: empty columns before the item in its row */
  offset?: number;
  children?: ReactNode;
}

const LayoutGridItem: FC<ILayoutGridItem> = (props) => {
  const { layout, offset = 0, children } = props;
  const { w, h, minRows, maxRows, maxWidth } = layout;
  const isAutoHeight = h === undefined;

  // On small screens every chart takes the full width, so the charts stack
  // in one column, by row then column. The CSS turns the rows into heights;
  // `minRows` and `maxRows` only apply without `h`.
  return (
    <Grid.Col
      span={{ base: 12, sm: w }}
      offset={{ base: 0, sm: offset }}
      className={styles.root}>
      <Box
        className={styles.chart}
        mod={{ 'auto-height': isAutoHeight }}
        style={{
          '--chart-rows': h,
          '--chart-min-rows': isAutoHeight ? minRows : undefined,
          '--chart-max-rows': isAutoHeight ? maxRows : undefined,
          '--chart-max-width': maxWidth ? rem(maxWidth) : undefined
        }}>
        {children}
      </Box>
    </Grid.Col>
  );
};

export default LayoutGridItem;
