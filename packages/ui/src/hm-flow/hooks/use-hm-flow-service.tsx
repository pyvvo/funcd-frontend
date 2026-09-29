import { Edge, Node, ReactFlowJsonObject } from '@xyflow/react';
import { useCallback, useEffect, useRef } from 'react';
import {
  HeaderActionHandlerType,
  HeaderActionType,
  IHeaderAction
} from '../components/header-status/header-status.types';
import {
  IToolbarAction,
  ToolbarActionHandlerType,
  ToolbarActionType
} from '../components/toolbar/toolbar.types';
import {
  IHmFlowActionsHandlersParams,
  IHmFlowData,
  IHmFlowMetadata
} from '../hm-flow.types';
import { PyNodeDataWithActionType } from '../node';

export type HmFlowJsonObject = ReactFlowJsonObject<
  Node<PyNodeDataWithActionType>,
  Edge
>;

export interface IUseHmFlowService {
  bottomActions?: IToolbarAction[];
  headerActions?: IHeaderAction[];
  onHmflowSave?: (flow: IHmFlowData) => void;
  onHmflowRun?: (flow: IHmFlowData) => void;
  onHmflowDelete?: () => void;
  defaultHmFlowMetadata?: IHmFlowMetadata;
}

export const useHmFlowService = (params: IUseHmFlowService) => {
  const {
    onHmflowSave,
    onHmflowRun,
    onHmflowDelete,
    headerActions,
    bottomActions,
    defaultHmFlowMetadata = {
      name: 'default',
      description: '',
      version: '0.0.1'
    }
  } = params;

  const hmflowData = useRef<IHmFlowData>({
    nodes: [],
    edges: [],
    viewport: {
      x: 0,
      y: 0,
      zoom: 0
    },
    metadata: defaultHmFlowMetadata
  });

  useEffect(() => {
    hmflowData.current.metadata = defaultHmFlowMetadata;
  }, [defaultHmFlowMetadata]);

  const onCanvasSave = useCallback(
    (params: IHmFlowActionsHandlersParams) => {
      const { deps } = params;
      const flow = deps.toObject();
      if (!onHmflowSave) return;

      hmflowData.current = {
        ...hmflowData.current,
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport
      };

      onHmflowSave(hmflowData.current);
    },
    [onHmflowSave]
  );

  const onCanvasRun = useCallback(
    (params: IHmFlowActionsHandlersParams) => {
      const { deps } = params;
      if (!onHmflowRun) return;
      const flow = deps.toObject();

      hmflowData.current = {
        ...hmflowData.current,
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport
      };

      onHmflowRun(hmflowData.current);
    },
    [onHmflowRun]
  );

  const onCanvasLayout = useCallback((params: IHmFlowActionsHandlersParams) => {
    const { deps } = params;
    const { onLayout } = deps;
    onLayout('LR');
  }, []);

  const onCanvasEditConfig = useCallback(
    (params: IHmFlowActionsHandlersParams) => {
      const { deps } = params;
      const { setDrawerOpened, setCurrentTab } = deps;

      if (deps) {
        setDrawerOpened(true);
        setCurrentTab('flowFormMetadata');
      }
    },
    []
  );

  const onFlowDelete = useCallback(
    (params: IHmFlowActionsHandlersParams) => {
      if (onHmflowDelete) {
        onHmflowDelete();
      }
    },
    [onHmflowDelete]
  );

  const bottomActionHandlers: Record<
    ToolbarActionType,
    ToolbarActionHandlerType
  > = {
    save: onCanvasSave,
    run: onCanvasRun,
    layout: onCanvasLayout,
    deleteFlow: onFlowDelete
  };

  const bottomAction: IToolbarAction[] = bottomActions
    ? bottomActions.map((action) => {
        let handler = bottomActionHandlers[action.type];
        if (!handler) {
          handler = () => {
            console.warn(
              `Action handler not found for action type ${action.type}`
            );
          };
        }
        return {
          ...action,
          onClick: handler
        };
      })
    : [];

  const hearderActionHandlers: Record<
    HeaderActionType,
    HeaderActionHandlerType
  > = {
    edit: onCanvasEditConfig
  };
  const headerAction: IHeaderAction[] = headerActions
    ? headerActions.map((action) => {
        let handler = hearderActionHandlers[action.type];
        if (!handler) {
          handler = () => {
            console.warn(
              `Action handler not found for action type ${action.type}`
            );
          };
        }
        return {
          ...action,
          onClick: handler
        };
      })
    : [];

  return {
    hmflowData,
    bottomAction,
    headerAction
  };
};
