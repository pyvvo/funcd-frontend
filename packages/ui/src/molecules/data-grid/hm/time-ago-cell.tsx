import { Box, BoxProps, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC } from 'react';
import styles from './time-ago-cell.module.css';

dayjs.extend(relativeTime);

interface ITimeAgoCell extends BoxProps {
  date: string | Date;
}

// "12 minutes ago", with the full date on hover.
const TimeAgoCell: FC<ITimeAgoCell> = (props) => {
  const { date, ...rest } = props;

  return (
    <Tooltip label={dayjs(date).format('YYYY-MM-DD | HH:mm')} withArrow>
      <Box component="span" className={styles.root} {...rest}>
        {dayjs(date).fromNow()}
      </Box>
    </Tooltip>
  );
};

export default TimeAgoCell;
