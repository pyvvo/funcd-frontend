import { Box, BoxProps, rem, SimpleGrid } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './content-layout.module.css';

interface IContentLayout extends BoxProps {
  /** Shown above the content, such as stat cards; its items take as many
   * columns as fit */
  header?: ReactNode;
  /** A side panel at a third of the width, under the content when narrow */
  aside?: ReactNode;
  /** The narrowest a header item gets before the header wraps, in pixels */
  headerItemMinWidth?: number;
  children?: ReactNode;
}

// Arranges a page's content under the app header: its header, then the main
// content and its aside. It follows its own width, not the screen's.
const ContentLayout: FC<IContentLayout> = (props) => {
  const { header, aside, headerItemMinWidth = 220, children, ...rest } = props;

  return (
    <Box className={styles.root} {...rest}>
      {header && (
        <SimpleGrid
          minColWidth={rem(headerItemMinWidth)}
          autoFlow="auto-fit"
          spacing="md">
          {header}
        </SimpleGrid>
      )}
      <Box className={styles.body} mod={{ 'with-aside': !!aside }}>
        <Box className={styles.main}>{children}</Box>
        {aside && (
          <Box component="aside" className={styles.aside}>
            {aside}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContentLayout;
