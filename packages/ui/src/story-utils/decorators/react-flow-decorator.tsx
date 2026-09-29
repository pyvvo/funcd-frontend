/* oxlint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* oxlint-disable import/prefer-default-export */
/* eslint-disable react/require-default-props */
import {
  addEdge,
  Controls,
  Edge,
  Node,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import { FC, useCallback } from 'react';
import { IDecoratorParams } from './common';

const NotFound: FC = () => (
  <div>
    <h1>404 Not Found</h1>
    <p>Sorry, the page you requested could not be found.</p>
  </div>
);

export interface IReactFlowDecorator {
  nodes: Node[];
  edges: Edge[];
}

export const ReactFlowDecorator =
  (decoratorValue: IReactFlowDecorator) =>
  (Story: IDecoratorParams['Story'], props: IDecoratorParams['props']) => {
    const { args } = props;

    const { edges: initialEdges, nodes: initialNodes } = decoratorValue;
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes ?? []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? []);

    const onConnect = useCallback(
      (params: any) => setEdges((eds) => addEdge(params, eds)),
      [setEdges]
    );

    const nodeTypes: NodeTypes = {
      defaultNode: () => <Story {...args} />
    };

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}>
          <Controls />
        </ReactFlow>
      </div>
    );
  };
