import { NodeProps } from '@xyflow/react';
import { IPyNode, PyNodeType } from './types';

export const pyNodeToNodeProps = (node: IPyNode): NodeProps<PyNodeType> => {
  return {
    ...node,
    dragging: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    selectable: true,
    deletable: true,
    selected: false,
    draggable: true
  };
};
