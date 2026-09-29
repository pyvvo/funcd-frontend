import { NodeTypes } from '@xyflow/react';
import { createContext } from 'react';

export interface HmFlowContextType {
  nodeTypes: NodeTypes;
}

export const HmFlowContext = createContext<HmFlowContextType>(
  {} as HmFlowContextType
);
