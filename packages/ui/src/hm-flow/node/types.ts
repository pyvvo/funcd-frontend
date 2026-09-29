import { Node, NodeProps } from '@xyflow/react';
import { HmFlowChildrenDepsType } from '../hm-flow-base.types';
import { MantineSize } from '@mantine/core';
import { JSX } from 'react';

export type ActionHandlerDepsType = HmFlowChildrenDepsType;

export interface IActionsHandlersParams {
  node: NodeProps<PyNodeType>;
  deps: ActionHandlerDepsType;
}

export type ActionHandlerType = (params: IActionsHandlersParams) => void;

export interface INodeAction {
  label: string;
  type: NodeActionType;
  icon: JSX.Element;
  onClick: (params: IActionsHandlersParams) => void;
  variant?: string;
  color?: string;
}

export type NodeActionType =
  | 'edit'
  | 'delete'
  | 'duplicate'
  | 'add'
  | 'selectSearchItem';

export interface IPyNode {
  id: string;
  type: 'pyNode';
  data: PyNodeDataWithActionType;
}

export type PyNodeDataWithActionType = {
  label: string;
  icon: string;
  name: string;
  color: string;
  image: string;
  parameters?: {} | null;
  actionSize?: MantineSize;
  actions: INodeAction[];
};

export type PyNodeType = Node<PyNodeDataWithActionType, 'pyNode'>;
