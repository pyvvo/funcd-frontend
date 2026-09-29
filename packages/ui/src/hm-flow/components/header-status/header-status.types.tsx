import { ActionHandlerDepsType } from '@/hm-flow/node';
import { JSX } from 'react';

export interface IHeaderActionsHandlersParams {
  deps: ActionHandlerDepsType;
}

export type HeaderActionHandlerType = (
  params: IHeaderActionsHandlersParams
) => void;

export type HeaderActionType = 'edit';

export interface IHeaderAction {
  name: string;
  type: HeaderActionType;
  icon: JSX.Element;
  onClick: (params: IHeaderActionsHandlersParams) => void;
}
