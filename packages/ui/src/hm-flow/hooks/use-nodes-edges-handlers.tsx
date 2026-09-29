import dagre from '@dagrejs/dagre';
import {
  addEdge,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  useOnSelectionChange
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IInitialNodeData } from '../hm-flow.types';

interface IUseNodeAndEdgeHandlers {
  initialData?: IInitialNodeData;
}

const nodeWidth = 172;
const nodeHeight = 36;

export const useNodeAndEdgeHandlers = (params: IUseNodeAndEdgeHandlers) => {
  const { initialData } = params;

  // Stable identity so the effects/callbacks below can depend on it without
  // re-running every render. The dagre graph is now created per call instead
  // of per render, which also stops repeated calls accumulating stale nodes.
  const getLayoutedElements = useCallback(
    (nodes: Node[], edges: Edge[], direction = 'TB') => {
      const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(
        () => ({})
      );
      const isHorizontal = direction === 'LR';
      dagreGraph.setGraph({ rankdir: direction });

      nodes.forEach((node: { id: string }) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      const newNodes = nodes.map((node: any) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
          ...node,
          targetPosition: isHorizontal ? 'left' : 'top',
          sourcePosition: isHorizontal ? 'right' : 'bottom',
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2
          }
        };

        return newNode;
      });

      return { nodes: newNodes, edges };
    },
    []
  );

  // Memoised so it only changes when `initialData` does — otherwise the effect
  // below would re-run every render and continuously reset the canvas.
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    const initialNodes = initialData?.nodes || [];
    const initialEdges = initialData?.edges || [];
    // Keep the nodes' own positions, such as saved ones. Nodes that share a
    // position (for example the default 0,0) have none, so lay them out.
    const positions = new Set(
      initialNodes.map(({ position }) => `${position.x},${position.y}`)
    );
    if (positions.size === initialNodes.length) {
      return { nodes: initialNodes, edges: initialEdges };
    }
    return getLayoutedElements(initialNodes, initialEdges, 'LR');
  }, [initialData, getLayoutedElements]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);

  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [initialData, layoutedNodes, layoutedEdges, setNodes, setEdges]);

  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes.map((node) => node.id));
      setSelectedEdges(edges.map((edge) => edge.id));
    },
    []
  );

  useOnSelectionChange({
    onChange
  });

  /*
    We don't need it for the moment, as we don't have a custom behaviour to develop @see https://reactflow.dev/api-reference/utils/apply-node-changes#Notes

  const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((prevNodes: Node[]) => applyNodeChanges(changes, prevNodes)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((prevEdges: Edge[]) => applyEdgeChanges(changes, prevEdges)),
    [setEdges]
  );

  */

  const onConnect = useCallback(
    (params: any) => {
      if (!params.source || !params.target) {
        console.error('Connexion invalide :', params);
        return;
      }
      setEdges((prevEdges: any[]) => {
        const newEdge = addEdge({ ...params, id: uuidv4() }, prevEdges);
        return newEdge;
      });
    },
    [setEdges]
  );

  const onLayout = useCallback(
    (direction: string | undefined) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges, getLayoutedElements]
  );

  return {
    nodes,
    setNodes,
    selectedNodes,
    setSelectedNodes,
    currentNode,
    setCurrentNode,
    edges,
    setEdges,
    selectedEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onLayout
  };
};
