import { Box, Group, MantineColor, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { FC } from 'react';
import styles from './timeline-bar.module.css';

export interface ITimelineSegment {
  start: string | Date;
  end: string | Date;
  color: MantineColor;
  label: string;
}

export interface ITimelineBar {
  from: string | Date;
  to: string | Date;
  segments: ITimelineSegment[];
  height?: number;
}

const format = (date: string | Date) => dayjs(date).format('MMM D, HH:mm');

// Colored spans over a time range, each with its label and span on hover, and the range's ends under the bar.
const TimelineBar: FC<ITimelineBar> = (props) => {
  const { from, to, segments, height = 12 } = props;
  const rangeStart = dayjs(from).valueOf();
  const rangeEnd = dayjs(to).valueOf();
  const span = Math.max(rangeEnd - rangeStart, 1);

  const placed = segments
    .map((segment) => ({
      segment,
      start: Math.max(dayjs(segment.start).valueOf(), rangeStart),
      end: Math.min(dayjs(segment.end).valueOf(), rangeEnd)
    }))
    .filter(({ start, end }) => end > start);

  return (
    <Box className={styles.root}>
      <Box className={styles.track} style={{ height }}>
        {placed.map(({ segment, start, end }) => (
          <Tooltip
            key={`${start}-${end}-${segment.label}`}
            label={`${segment.label} · ${format(segment.start)} – ${format(segment.end)}`}
            withArrow>
            <Box
              component="span"
              className={styles.segment}
              style={{
                left: `${((start - rangeStart) / span) * 100}%`,
                width: `max(2px, ${((end - start) / span) * 100}%)`,
                backgroundColor: `var(--mantine-color-${segment.color}-6)`
              }}
            />
          </Tooltip>
        ))}
      </Box>
      <Group justify="space-between" mt={4}>
        <Text c="dimmed" size="xs">
          {format(from)}
        </Text>
        <Text c="dimmed" size="xs">
          {format(to)}
        </Text>
      </Group>
    </Box>
  );
};

export default TimelineBar;
