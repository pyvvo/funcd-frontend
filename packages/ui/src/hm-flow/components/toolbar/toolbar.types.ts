import { ActionHandlerDepsType } from '@/hm-flow/node/types';
import { JSX } from 'react';

export type ToolbarActionType = 'save' | 'layout' | 'run' | 'deleteFlow';
export type ToolbarPosition = 'main' | 'left' | 'right';
export interface ToolbarActionsHandlersParams {
  deps: ActionHandlerDepsType;
}

export type ToolbarActionHandlerType = (
  params: ToolbarActionsHandlersParams
) => void;

export interface IToolbarAction {
  name: string;
  variant?: string;
  type: ToolbarActionType;
  icon: JSX.Element;
  position?: ToolbarPosition;
  color?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
  onClick: (params: ToolbarActionsHandlersParams) => void;
}
