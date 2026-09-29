import { Edge, Node, ReactFlowJsonObject, XYPosition } from '@xyflow/react';
import { SetViewport } from '@xyflow/system';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { PyNodeDataWithActionType } from './node';

export interface ICanvasDoubleClickParams {
  reactFlowWrapper: RefObject<HTMLDivElement>;
  screenToFlowPosition: (
    clientPosition: XYPosition,
    options?: {
      snapToGrid: boolean;
    }
  ) => XYPosition;
  setCurrentTab: Dispatch<SetStateAction<string | null>>;
  setClickedPosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  setDrawerOpened: Dispatch<SetStateAction<boolean>>;
}

export interface IOnNodeDoubleClick {
  setCurrentModalTab: Dispatch<SetStateAction<string | null>>;
  setModalOpened: Dispatch<SetStateAction<boolean>>;
  setCurrentNode: Dispatch<SetStateAction<any>>;
}

export interface ICanvasDeps {
  clickedPosition: {
    x: number;
    y: number;
  } | null;
  setClickedPosition: Dispatch<SetStateAction<{ x: number; y: number } | null>>;
  reactFlowWrapper: RefObject<HTMLDivElement>;
}

export interface IDrawerDeps {
  setDrawerOpened: Dispatch<SetStateAction<boolean>>;
  setCurrentTab: Dispatch<SetStateAction<string | null>>;
}

export interface IModalDeps {
  setCurrentModalTab: Dispatch<SetStateAction<string | null>>;
  setModalOpened: Dispatch<SetStateAction<boolean>>;
}

export interface INodeDeps {
  nodes: Node[];
  edges: Edge[];
  stateJoinsNode: boolean;
  setStateJoinsNode: Dispatch<SetStateAction<boolean>>;
  currentNode: Node | null;
  setCurrentNode: Dispatch<SetStateAction<any>>;
  nodeCounters: Record<string, number>;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setNodeCounters: Dispatch<SetStateAction<Record<string, number>>>;
}

export interface IReactFlowDeps {
  screenToFlowPosition: (
    clientPosition: XYPosition,
    options?: {
      snapToGrid: boolean;
    }
  ) => XYPosition;
  toObject: () => ReactFlowJsonObject<Node<PyNodeDataWithActionType>, Edge>;
  setViewport: SetViewport;
  onLayout: (direction: string) => void;
}

export type HmFlowChildrenDepsType = IDrawerDeps &
  IModalDeps &
  INodeDeps &
  ICanvasDeps &
  IReactFlowDeps;
