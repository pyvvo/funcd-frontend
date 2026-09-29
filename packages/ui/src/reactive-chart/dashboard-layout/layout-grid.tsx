import { Grid, rem, Stack } from '@mantine/core';
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  ReactNode
} from 'react';
import { ILayoutGridItem } from './layout-grid-item';

type LayoutGridItemType = ReactElement<ILayoutGridItem>;

interface ILayoutGrid {
  /** Height of one layout row, in pixels */
  rowHeight?: number;
  children?: ReactNode;
}

const LayoutGrid: FC<ILayoutGrid> = (props) => {
  const { rowHeight = 150, children } = props;

  // Mantine's Grid places columns row by row: group the items by `y`, sort
  // each row by `x`, and turn the gap before an item into its offset.
  const rows = Children.toArray(children)
    .filter((child): child is LayoutGridItemType => isValidElement(child))
    .sort(
      (a, b) =>
        a.props.layout.y - b.props.layout.y ||
        a.props.layout.x - b.props.layout.x
    )
    .reduce<LayoutGridItemType[][]>((acc, item) => {
      const lastRow = acc[acc.length - 1];
      if (lastRow && lastRow[0].props.layout.y === item.props.layout.y) {
        lastRow.push(item);
      } else {
        acc.push([item]);
      }
      return acc;
    }, []);

  return (
    <Stack gap="lg" style={{ '--layout-row-height': rem(rowHeight) }}>
      {rows.map((row) => (
        <Grid key={row[0].props.layout.y} columns={12} gap="lg">
          {row.map((item, index) => {
            const previous = row[index - 1]?.props.layout;
            const previousEnd = previous ? previous.x + previous.w : 0;
            return cloneElement(item, {
              offset: Math.max(item.props.layout.x - previousEnd, 0)
            });
          })}
        </Grid>
      ))}
    </Stack>
  );
};

export default LayoutGrid;
