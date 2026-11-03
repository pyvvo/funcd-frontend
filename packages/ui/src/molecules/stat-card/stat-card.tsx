import { Box, Group, MantineColor, Text, ThemeIcon } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './stat-card.module.css';

interface IStatCard {
  label: string;
  value: string;
  hint?: string;
  color?: MantineColor;
  icon?: ReactNode;
}

// A number tile: its label, the value, and an optional hint under it.
const StatCard: FC<IStatCard> = (props) => {
  const { label, value, hint, color = 'primary', icon, ...rest } = props;

  return (
    <Box p="md" className={styles.root} {...rest}>
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Text c="dimmed" fw={700} size="xs" tt="uppercase">
          {label}
        </Text>
        {icon && (
          <ThemeIcon variant="light" color={color} size="md" radius="md">
            {icon}
          </ThemeIcon>
        )}
      </Group>
      <Text className={styles.value} fw={700}>
        {value}
      </Text>
      {hint && (
        <Text c="dimmed" size="sm">
          {hint}
        </Text>
      )}
    </Box>
  );
};

export default StatCard;
