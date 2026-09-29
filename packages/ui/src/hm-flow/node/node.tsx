import { ActionIcon, Box, Group, HoverCard, Image } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Handle, NodeProps, Position, useStore } from '@xyflow/react';
import { FC, useCallback, useMemo } from 'react';
import { useHmFlowChildrenDeps } from '../hooks';
import styles from './node.module.css';
import {
  ActionHandlerDepsType,
  IActionsHandlersParams,
  INodeAction,
  NodeActionType,
  PyNodeType
} from './types';

interface INodeActionHandlersParams {
  node: NodeProps<PyNodeType>;
  action: INodeAction;
  deps: ActionHandlerDepsType;
}

const PyNode: FC<NodeProps<PyNodeType>> = (props) => {
  const { id, selected, data, ...rest } = props;
  const { actions, ...restData } = data;
  const { deps } = useHmFlowChildrenDeps();

  const exludedActions: NodeActionType[] = ['add', 'selectSearchItem'];
  const edges = useStore((store) => store.edges);
  const hasOutgoingEdge = useMemo(
    () => edges.some((edge) => edge.source === id),
    [edges, id]
  );

  const onNodeAddClick = useCallback(
    (params: IActionsHandlersParams) => {
      const handler = actions.find((action) => action.type === 'add');
      if (!handler) return;
      handler.onClick(params);
    },
    [actions]
  );

  const actionHandlersFactory = useCallback(
    (params: INodeActionHandlersParams) => {
      const { node, action, deps } = params;
      return () => action.onClick({ node, deps });
    },
    []
  );

  return (
    <div className={styles.root}>
      <HoverCard
        classNames={{ dropdown: styles.dropdown }}
        radius={400}
        shadow="md">
        <div className={styles.main}>
          <div className={styles.inner}>
            <HoverCard.Target>
              <Box
                mod={{ 'data-selected': selected }}
                className={styles.section}
                style={
                  {
                    '--hover-color': restData.color
                  } as React.CSSProperties
                }>
                <Image src={restData.icon} className={styles.icon} />
              </Box>
            </HoverCard.Target>

            <HoverCard.Dropdown>
              {actions && (
                <Group gap="xs">
                  {actions
                    .filter((action) => !exludedActions.includes(action.type))
                    .map((action, index) => (
                      <ActionIcon
                        key={index}
                        size={restData.actionSize}
                        variant={action.variant}
                        mod={{ 'data-color': action.color }}
                        onClick={() => {
                          const actionHandler = actionHandlersFactory({
                            node: props,
                            action,
                            deps
                          });
                          actionHandler();
                        }}>
                        {action.icon}
                      </ActionIcon>
                    ))}
                </Group>
              )}
            </HoverCard.Dropdown>

            <h3 className={styles.label}>{restData.label}</h3>
          </div>
        </div>
      </HoverCard>

      {!hasOutgoingEdge && (
        <button
          className={styles.add}
          onClick={() => {
            onNodeAddClick({ node: props, deps });
          }}>
          <IconPlus size={200} />
        </button>
      )}

      <div className={styles['handle']}>
        <Handle
          type="source"
          position={Position.Right}
          style={{ backgroundColor: restData.color }}
        />
      </div>

      <div className={styles['handle']}>
        <Handle
          type="target"
          position={Position.Left}
          style={{ backgroundColor: restData.color }}
          id="a"
        />
      </div>
    </div>
  );
};

export default PyNode;
