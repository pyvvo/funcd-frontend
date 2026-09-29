import { Box, Center, Group, RingProgress, Text } from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';
import { FC } from 'react';
import styles from './stats-ring.module.css';

interface IStatsRing {
  label: string;
  stats: string;
  progress: number;
  color: string;
  icon: 'up' | 'down';
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight
};

const StatsRing: FC<IStatsRing> = (props) => {
  const { label, stats, progress, color, icon, ...rest } = props;
  const Icon = icons[icon];

  return (
    <Box p="md" className={styles.root} {...rest}>
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: progress, color }]}
          label={
            <Center>
              <Icon size={22} stroke={1.5} />
            </Center>
          }
        />

        <Box>
          <Text c="dimmed" fw={700} size="xs" tt="uppercase">
            {label}
          </Text>
          <Text
            style={{
              fontWeight: 700
            }}
            size="xl">
            {stats}
          </Text>
        </Box>
      </Group>
    </Box>
  );
};

export default StatsRing;
