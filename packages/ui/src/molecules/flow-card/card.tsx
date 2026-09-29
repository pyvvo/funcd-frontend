import { ActionIcon, Box, Card, CardProps, Image } from '@mantine/core';
import { IconEyeEdit, IconTrashFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { FC, ReactNode } from 'react';
import styles from './card.module.css';

interface IFlowCard extends CardProps {
  flowName: string;
  subtitle?: string;
  lastUpdated?: Date;
  leftIcon?: ReactNode;
  leftImage?: string;
  withRightSection?: boolean;
  onClick?: (param: any) => void;
  onDelete?: (param: any) => void;
}

const FlowCard: FC<IFlowCard> = (props) => {
  const {
    flowName,
    subtitle,
    lastUpdated,
    leftIcon,
    leftImage,
    withRightSection = true,
    onClick,
    onDelete,
    ...rest
  } = props;

  const formattedDate = lastUpdated
    ? dayjs(lastUpdated).format('YYYY-MM-DD | HH:mm')
    : '';

  return (
    <Card padding={0} className={styles.root} {...rest}>
      <Box className={styles.inner}>
        <Card.Section onClick={onClick}>
          <Box className={styles.rightSection}>
            {leftIcon ? (
              <Box className={styles.leftIcon}>{leftIcon}</Box>
            ) : leftImage ? (
              <Box className={styles.leftImageRoot}>
                <Image src={leftImage} alt={leftImage} />
              </Box>
            ) : null}
            <Box>
              <Box className={styles.flowName}>{flowName}</Box>
              {subtitle ? (
                <Box className={styles.subtitle}>{subtitle}</Box>
              ) : (
                <Box className={styles.subtitle}>
                  <IconEyeEdit /> {formattedDate}
                </Box>
              )}
            </Box>
          </Box>
        </Card.Section>
        {withRightSection && (
          <Card.Section>
            <ActionIcon
              variant="light"
              size="lg"
              radius={20}
              mod={{ color: 'alert' }}
              onClick={onDelete}>
              <IconTrashFilled size={18} />
            </ActionIcon>
          </Card.Section>
        )}
      </Box>
    </Card>
  );
};
export default FlowCard;
