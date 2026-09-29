import { useHmFlowChildrenDeps } from '@/hm-flow';
import { ActionIcon, Box } from '@mantine/core';
import { FC, useCallback, useMemo } from 'react';
import styles from './toolbar.module.css';
import { IToolbarAction } from './toolbar.types';

interface IToolbar {
  actions: IToolbarAction[];
}

const Toolbar: FC<IToolbar> = (props) => {
  const { actions } = props;
  const { deps } = useHmFlowChildrenDeps();

  const createActionHandler = useCallback(
    (action: IToolbarAction) => () => {
      action.onClick({ deps });
    },
    [deps]
  );

  const rightActions = useMemo(
    () => actions.filter((item) => item.position === 'right'),
    [actions]
  );

  const mainAction = useMemo(
    () => actions.find((item) => item.position === 'main'),
    [actions]
  );

  return (
    <div className={styles.root}>
      {mainAction && (
        <div className={styles.mainAction} key={mainAction.name}>
          <div
            className={styles.mainInner}
            onClick={createActionHandler(mainAction)}>
            {mainAction.icon}
          </div>
        </div>
      )}
      <div className={styles.inner}>
        <Box className={styles.rightActions}>
          {rightActions.map((action) => (
            <ActionIcon
              key={action.name}
              size={40}
              radius={800}
              variant={action.variant}
              mod={{ color: action.color ?? 'default' }}
              onClick={createActionHandler(action)}>
              {action.icon}
            </ActionIcon>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default Toolbar;
