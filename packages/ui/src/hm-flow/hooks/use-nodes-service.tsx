import { Node } from '@xyflow/react';

import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ActionHandlerDepsType,
  ActionHandlerType,
  IActionsHandlersParams,
  INodeAction,
  NodeActionType,
  PyNodeDataWithActionType
} from '../node';
import { generateUniqueNameWithCounter } from '../utils';

export interface IUseNodesServiceParams {
  defaultActions: INodeAction[];
}

export const useNodesService = (params: IUseNodesServiceParams) => {
  const { defaultActions } = params;
  const onSelectSearchItems = useCallback((params: IActionsHandlersParams) => {
    const { node, deps } = params;

    const {
      nodes,
      stateJoinsNode,
      nodeCounters,
      clickedPosition,
      setDrawerOpened,
      currentNode: sourceNode,
      setEdges,
      setNodeCounters,
      setNodes,
      setStateJoinsNode
    } = deps;
    if (!node) return;

    const { name: uniqueLabel, updatedCounters } =
      generateUniqueNameWithCounter(
        node.data.label,
        node.id,
        nodes,
        nodeCounters
      );

    if (sourceNode && stateJoinsNode) {
      if (!sourceNode || !sourceNode.position) {
        console.error('Source node is invalid or missing position.');
        return;
      }

      const newPosition = {
        x: sourceNode.position.x + 150,
        y: sourceNode.position.y
      };

      const newNode = {
        id: uuidv4(),
        type: node.type,
        position: newPosition,
        data: {
          name: node.data.name,
          label: uniqueLabel,
          icon: node.data.icon,
          color: node.data.color,
          image: node.data.image,
          parameters: node.data.parameters
        }
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
      setNodeCounters(updatedCounters);

      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: uuidv4(),
          source: sourceNode.id,
          target: newNode.id
        }
      ]);

      setDrawerOpened(false);
      setStateJoinsNode(false);
    } else if (clickedPosition) {
      const newNode = {
        id: uuidv4(),
        type: node.type,
        position: { x: clickedPosition.x, y: clickedPosition.y },
        data: {
          name: node.data.name,
          label: uniqueLabel,
          icon: node.data.icon,
          color: node.data.color,
          image: node.data.image,
          parameters: node.data.parameters
        }
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
      setNodeCounters(updatedCounters);
      setDrawerOpened(false);
    }
  }, []);

  const onDeleteNode = useCallback((params: IActionsHandlersParams) => {
    const { node, deps } = params;
    const { id: nodeId } = node;
    const { setEdges, setNodes } = deps;
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }, []);

  const onDuplicateNode = useCallback((params: IActionsHandlersParams) => {
    const { node, deps } = params;
    const { id: nodeId } = node;

    const { nodeCounters, setNodeCounters, setNodes } = deps;
    setNodes((prevNodes) => {
      const nodeToDuplicate = prevNodes.find((node) => node.id === nodeId);
      if (!nodeToDuplicate) return prevNodes;
      const currentLabel = nodeToDuplicate.data.label;
      const selectedKey = nodeToDuplicate.data.name;

      const { name: uniqueLabel, updatedCounters } =
        generateUniqueNameWithCounter(
          currentLabel as string,
          selectedKey as string,
          prevNodes,
          nodeCounters
        );
      const newPosition = {
        x: nodeToDuplicate.position.x + 70,
        y: nodeToDuplicate.position.y + 70
      };
      const newNodeId = uuidv4();

      const duplicatedNode = {
        ...nodeToDuplicate,
        id: newNodeId,
        position: newPosition,
        data: {
          ...nodeToDuplicate.data,
          name: nodeToDuplicate.data.name,
          label: uniqueLabel,
          image: nodeToDuplicate.data.image,
          parameters: nodeToDuplicate.data.parameters
        }
      };
      setNodeCounters(updatedCounters);
      return [...prevNodes, duplicatedNode];
    });
  }, []);

  const onNodeActionEdit = useCallback((params: IActionsHandlersParams) => {
    const { node, deps } = params;

    const { setCurrentModalTab, setCurrentNode, setModalOpened } = deps;
    if (node) {
      setCurrentNode((prev: any) => ({
        ...prev,
        ...node
      }));
      setModalOpened(true);
      setCurrentModalTab('nodeEditor');
    } else {
      console.error("Tentative d'éditer un nœud invalide.");
    }
  }, []);

  const onNodeDoubleClick = useCallback(
    (
      event: React.MouseEvent,
      node: Node<PyNodeDataWithActionType>,
      deps: ActionHandlerDepsType
    ) => {
      const { setCurrentModalTab, setCurrentNode, setModalOpened } = deps;
      event.stopPropagation();
      if (node) {
        setCurrentNode((prev: any) => ({
          ...prev,
          ...node
        }));
        setModalOpened(true);
        setCurrentModalTab('nodeEditor');
      } else {
        console.error("Tentative d'éditer un nœud invalide.");
      }
    },
    []
  );

  const onNodeAddClick = useCallback((params: IActionsHandlersParams) => {
    const { node, deps } = params;
    const { setDrawerOpened, setStateJoinsNode, setCurrentTab } = deps;
    if (node) {
      setDrawerOpened(true);
      setStateJoinsNode(true);
      setCurrentTab('nodesSearch');
    }
  }, []);

  const onUpdateNode = useCallback((params: IActionsHandlersParams) => {
    const { deps } = params;
    const { nodes, setNodes, setCurrentNode, currentNode } = deps;

    if (!currentNode) {
      console.error('Le nœud courant ou ses données sont indéfinis.');
      return;
    }
    const labelExists = nodes.some(
      (node) =>
        node.data.label === currentNode.data.label && node.id !== currentNode.id
    );

    const updatedLabel = labelExists
      ? `${String(currentNode.data.label)}-${Date.now()}`
      : currentNode.data.label;

    const updatedData = { ...currentNode.data, label: updatedLabel };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === currentNode.id ? { ...node, data: updatedData } : node
      )
    );

    setCurrentNode((prev: any) =>
      prev?.id === currentNode.id ? { ...prev, data: updatedData } : prev
    );
  }, []);

  const searchNode = useCallback((deps: ActionHandlerDepsType) => {
    const { setDrawerOpened, setCurrentTab } = deps;

    setDrawerOpened(true);
    setCurrentTab('nodesSearch');
  }, []);

  // Memoised so `actions` keeps a stable identity. Consumers feed it into
  // `nodeTypes`, which React Flow uses to decide when to remount nodes — an
  // array rebuilt each render would either remount constantly or (as before)
  // be captured once and go stale.
  const actions: INodeAction[] = useMemo(() => {
    const actionHandlers = {
      edit: onNodeActionEdit,
      delete: onDeleteNode,
      duplicate: onDuplicateNode,
      add: onNodeAddClick,
      selectSearchItem: onSelectSearchItems
    } satisfies Record<NodeActionType, ActionHandlerType>;

    return defaultActions.map((action) => {
      let handler = actionHandlers[action.type];
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
    });
  }, [
    defaultActions,
    onNodeActionEdit,
    onDeleteNode,
    onDuplicateNode,
    onNodeAddClick,
    onSelectSearchItems
  ]);

  return {
    actions,
    onNodeDoubleClick,
    onUpdateNode,
    searchNode
  };
};
