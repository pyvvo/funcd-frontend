import { Node } from '@xyflow/react';
import { ComponentType, Dispatch, SetStateAction } from 'react';

export interface IHmFlowModalItemProps {
  nodes: Node[];
  currentNode: any;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setCurrentNode: Dispatch<SetStateAction<any>>;
  onUpdateNode: (node: Node) => void;
}

export interface IHmFlowModalItem {
  name: string;
  component: ComponentType<any>;
}
