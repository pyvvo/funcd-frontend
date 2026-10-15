import { Box, BoxProps, rem, SimpleGrid } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './card-grid-layout.module.css';

interface ICardGridLayout extends BoxProps {
  /** Shown above the cards, such as a search or filters */
  header?: ReactNode;
  /** The narrowest a card gets before the grid drops a column, in pixels */
  itemMinWidth?: number;
  children?: ReactNode;
}

// A gallery of cards: as many columns as fit, every card the same width.
const CardGridLayout: FC<ICardGridLayout> = (props) => {
  const { header, itemMinWidth = 280, children, ...rest } = props;

  return (
    <Box className={styles.root} {...rest}>
      {header && <Box className={styles.header}>{header}</Box>}
      <SimpleGrid
        minColWidth={rem(itemMinWidth)}
        autoFlow="auto-fill"
        spacing="md">
        {children}
      </SimpleGrid>
    </Box>
  );
};

export default CardGridLayout;
