import {
  BackgroundVariant,
  ColorMode,
  Edge,
  Node,
  NodeTypes,
  PanelPosition,
  ReactFlowJsonObject,
  Viewport
} from '@xyflow/react';
import { CSSProperties } from 'react';
import { ActionHandlerDepsType, PyNodeDataWithActionType } from './node';

export type IInitialNodeData = {
  nodes?: Node[];
  edges?: Edge[];
};

export type HmFlowSpacingType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
export interface IHmFlowActionsHandlersParams {
  deps: ActionHandlerDepsType;
}

export type HmFlowNodeTypes = NodeTypes;
export const HmFlowBackgroundVariant = {
  dots: BackgroundVariant.Dots,
  cross: BackgroundVariant.Cross,
  lines: BackgroundVariant.Lines
} as const;
export type HmFlowBackgroundVariantType = keyof typeof HmFlowBackgroundVariant;
export interface ICanvasConfigs {
  miniMap?: boolean;
  mapAttr?: {
    nodeColor?: string;
    nodeStrokeColor?: string;
    nodeBorderRadius?: number;
    nodeStrokeWidth?: number;
    position?: PanelPosition;
    zoomable?: boolean;
    pannable?: boolean;
  };
  controls?: boolean;
  ctlAttr?: {
    showZoom?: boolean;
    showFitView?: boolean;
    showInteractive?: boolean;
    position?: PanelPosition;
    orientation?: 'horizontal' | 'vertical';
  };
  background?: boolean;
  bgAttr?: {
    bgColor?: string;
    color?: string;
    style?: CSSProperties;
    gap?: number | [number, number];
    size?: number;
    offset?: number;
    variant?: HmFlowBackgroundVariantType;
  };
  colorMode?: ColorMode;
}

export interface IHmFlowMetadata {
  name: string;
  description?: string;
  version?: string;
}

export interface IHmFlowData {
  metadata: IHmFlowMetadata;
  nodes: Node<PyNodeDataWithActionType>[];
  edges: Edge[];
  viewport: Viewport;
}
