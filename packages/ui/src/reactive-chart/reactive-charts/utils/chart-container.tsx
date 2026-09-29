import { Box, Text, Title } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './chart-container.module.css';

interface IChartContainer {
  chartKey: string;
  title: string;
  hidden?: boolean;
  loading?: boolean;
  isEmpty?: boolean;
  /** Replaces the chart, for a meta that can't be drawn */
  error?: string;
  children?: ReactNode;
}

const ChartContainer: FC<IChartContainer> = (props) => {
  const { chartKey, title, hidden, loading, isEmpty, error, children } = props;
  const message =
    error ?? (isEmpty && !loading ? 'Nothing to show' : undefined);

  return (
    <Box p="lg" className={styles.root} mod={{ hidden }} data-testid={chartKey}>
      <Title order={5} className={styles.title}>
        {title}
      </Title>
      {message ? (
        <Text
          size="sm"
          c={error ? 'alert' : 'dimmed'}
          className={styles.message}>
          {message}
        </Text>
      ) : (
        <Box className={styles.chart}>{children}</Box>
      )}
    </Box>
  );
};

export default ChartContainer;
