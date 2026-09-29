import { useHmFlowChildrenDeps } from '@/hm-flow/hooks';
import { ActionIcon, Box } from '@mantine/core';
import { FC, useCallback, useMemo } from 'react';
import styles from './header-status.module.css';
import { IHeaderAction } from './header-status.types';

export type HmFlowHeaderStatus =
  | 'green'
  | 'red'
  | 'yellow'
  | 'purple'
  | 'orange';

interface IHmFlowHeader {
  title: string;
  textStatus: string;
  color?: HmFlowHeaderStatus;
  actions: IHeaderAction[];
}

const HeaderStatus: FC<IHmFlowHeader> = (props) => {
  const { title, textStatus, color = 'green', actions } = props;
  const { deps } = useHmFlowChildrenDeps();

  const editAction = useMemo(
    () => actions.find((item) => item.type === 'edit'),
    [actions]
  );

  const createActionHandler = useCallback(
    (action: IHeaderAction) => () => {
      action.onClick({ deps });
    },
    [deps]
  );

  return (
    <div className={styles.root} data-status={color}>
      <div className={styles.inner}>
        {editAction && (
          <ActionIcon
            variant="subtle"
            onClick={createActionHandler(editAction)}>
            {editAction.icon}
          </ActionIcon>
        )}
        <h2 className={styles.title}>{title}</h2>
        <Box className={styles.status} data-status={color}>
          {textStatus}
        </Box>
      </div>
    </div>
  );
};

export default HeaderStatus;
