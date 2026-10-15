import { Box, BoxProps, Image, Text } from '@mantine/core';
import { FC, ReactNode } from 'react';
import styles from './title-cell.module.css';

interface ITitleCell extends BoxProps {
  title: string;
  subtitle?: string;
  leftIcon?: ReactNode;
  leftImage?: string;
}

const TitleCell: FC<ITitleCell> = (props) => {
  const { title, subtitle, leftIcon, leftImage, ...rest } = props;

  return (
    <Box className={styles.root} {...rest}>
      {leftIcon ? (
        <Box className={styles.leftIcon}>{leftIcon}</Box>
      ) : leftImage ? (
        <Image src={leftImage} alt={title} className={styles.leftImage} />
      ) : null}
      <Box className={styles.text}>
        <Text className={styles.title} truncate>
          {title}
        </Text>
        {subtitle && (
          <Text className={styles.subtitle} truncate>
            {subtitle}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default TitleCell;
