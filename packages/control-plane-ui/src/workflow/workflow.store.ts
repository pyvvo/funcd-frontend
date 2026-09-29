import {
  OpenApiError,
  sdk,
  WithoutPrivate,
  WorkflowDef,
  WorkflowModel,
  WorkflowModels,
  WorkflowStep
} from '@funcd-dev/lib';
import {
  HmFlowJsonObject,
  IHmFlowData,
  IHmFlowMetadata,
  PyNodeDataWithActionType
} from '@funcd-dev/ui';
import { notifications } from '@mantine/notifications';
import { Edge, Node } from '@xyflow/react';
import { makeAutoObservable, toJS } from 'mobx';
import { NavigateFunction } from 'react-router-dom';
import nodeStore from './node.store';

export interface IUpdateWorkflowPlayload {
  id: string;
  name?: string;
  description?: string;
  version?: string;
  flowData?: HmFlowJsonObject | null;
}

const defaultFlowData: IHmFlowData = {
  nodes: [],
  edges: [],
  metadata: {
    name: '',
    description: '',
    version: ''
  },
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  }
};

const _store = {
  workflows: [] as WorkflowModels,
  workflow: {} as WorkflowModel,
  flowData: defaultFlowData,
  getMetadata: () => {
    if (Object.keys(_store.workflow).length === 0) {
      return {
        name: '',
        description: '',
        version: ''
      };
    }
    const _metadata = _store.workflow.workflow_def.metadata;
    const metadata: IHmFlowMetadata = {
      name: _metadata.name,
      description: _metadata.annotations?.description,
      version: _metadata.annotations?.version
    };
    return metadata;
  },
  setWorflows: (data: WorkflowModels) => {
    const unique = new Map();
    data.forEach((w) => unique.set(w.id, w));
    _store.workflows = Array.from(unique.values());
  },
  setWorflow: (data: WorkflowModel) => {
    _store.workflow = data;
  },
  loadWorflows: async () => {
    const { data, error } = await sdk.listWorkflows();

    if (error) {
      notifications.show({
        title: error.type,
        message: error.message,
        color: 'yellow'
      });
      return;
    }

    _store.setWorflows(data);
  },

  //** flow method */
  loadflowData: async (id: string) => {
    try {
      if (id === 'new') {
        _store.setFlowData({
          ...defaultFlowData,
          metadata: { name: 'New Workflow', description: '', version: '' }
        });
        return;
      }

      const workflow = await _store.getById(id);
      const flowData = await _store._convertWorkflowToFlow(workflow);
      _store.setFlowData(flowData);
    } catch (error) {
      _store._handleError(error, 'Workflow Error');
    }
  },
  setFlowData: (data: IHmFlowData) => {
    _store.flowData = data;
  },

  handleFlowSave: async (
    id: string,
    flowData: IHmFlowData,
    navigate: NavigateFunction
  ) => {
    try {
      if (id === 'new') {
        const wk = await _store.createWorkflow(flowData);
        _store.setWorflow(wk);
        await _store.loadflowData(wk.id);
        await _store.loadWorflows();
        navigate(`/workflows/${wk.id}`);
        return wk;
      }
      const wk = await _store.updateWorkflow(flowData, id);
      _store.setWorflow(wk);
      await _store.loadWorflows();
      return wk;
    } catch (error) {
      _store._handleError(error, 'Workflow Error');
    }
  },

  handleDeleteWorkflow: async (id: string, navigate: NavigateFunction) => {
    await _store.deleteWorkflow(id);
    _store.setWorflows([]);
    navigate(`/workflows`);
  },

  waitForDeployment: async (
    deploymentId: string,
    maxRetries = 5,
    delay = 2000
  ) => {
    for (let i = 0; i < maxRetries; i++) {
      const res = await sdk.getDeployment({ path: { id: deploymentId } });
      if (res.data?.status === 'Deployed') return true;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return false;
  },

  handleRunWorkflow: async (id: string) => {
    try {
      console.log('handleRunWorkflow', id);

      const workflow = await _store.getById(id);
      _store.setWorflow(workflow);

      let result = null;

      if (workflow?.deployment_id) {
        result = await _store.runWorkflow(id);
      } else {
        const deployment = await _store.deployWorkflow(id);
        if (!deployment?.success) return null;

        const updatedWorkflow = await _store.getById(id);
        if (!updatedWorkflow?.deployment_id) return null;

        const isDeployed = await _store.waitForDeployment(
          updatedWorkflow.deployment_id
        );
        if (!isDeployed) return null;

        result = await _store.runWorkflow(id);
      }

      if (result) {
        notifications.show({
          message: 'Workflow ran successfully',
          color: 'green'
        });
      }

      return result;
    } catch (error) {
      _store._handleError(error, 'Workflow Run Error');
      return null;
    }
  },

  //** api call */
  list: async () => {
    const { data, error } = await sdk.listWorkflows();
    if (error) {
      notifications.show({
        title: error.type,
        message: error.message,
        color: 'yellow'
      });
      return [];
    }
    return data;
  },
  getById: async (id: string) => {
    const { data } = await sdk.getWorkflowById({
      path: { id: id },
      throwOnError: true
    });
    return data;
  },
  createWorkflow: async (flowData: IHmFlowData) => {
    const workflowDef = _store._parseFlowToWorkflow(flowData);
    const { data } = await sdk.createWorkflow({
      body: { workflow_def: workflowDef },
      throwOnError: true
    });
    notifications.show({
      message: 'Workflow created successfully',
      color: 'green'
    });
    return data;
  },

  updateWorkflow: async (flowData: IHmFlowData, id: string) => {
    const workflowDef = _store._parseFlowToWorkflow(flowData);
    const { data } = await sdk.updateWorkflow({
      path: { id: id },
      body: { workflow_def: workflowDef },
      throwOnError: true
    });
    notifications.show({
      message: 'Workflow updated successfully',
      color: 'blue'
    });
    return data;
  },

  runWorkflow: async (id: string) => {
    const { data, error } = await sdk.runWorkflow({ path: { id } });
    if (error) {
      notifications.show({
        title: error.type,
        message: error.message,
        color: 'red'
      });
    }
    return data;
  },

  deployWorkflow: async (id: string) => {
    const { data, error } = await sdk.deployWorkflow({ path: { id } });
    if (error) {
      notifications.show({
        title: error.type,
        message: error.message,
        color: 'red'
      });
    }
    return data;
  },

  deleteWorkflow: async (id: string) => {
    const { data } = await sdk.deleteWorkflow({
      path: { id: id },
      throwOnError: true
    });

    notifications.show({
      message: 'Workflow deleted successfully',
      color: 'red'
    });
    return data;
  },

  //** utils */
  _convertWorkflowToFlow: (input: WorkflowModel) => {
    try {
      const flowData = _store._parseWorkflowToFlow(input);
      return flowData;
    } catch (error) {
      _store._handleError(error, 'Workflow Error');
      return _store.flowData;
    }
  },
  _parseWorkflowToFlow: (workflow: WorkflowModel) => {
    const steps = workflow.workflow_def.spec.steps;
    const drafts = workflow.workflow_def.spec.drafts;
    const edges: Edge[] = [];
    // Convert steps to nodes
    const nodes = _store._workflowStepsToNodes(steps);

    for (let i = 1; i < nodes.length; i++) {
      edges.push({
        id: `edge-${i - 1}-${i}`,
        source: nodes[i - 1].id,
        target: nodes[i].id
      });
    }
    // Convert drafts to nodes
    const draftNodes = _store._workflowStepsToNodes(drafts);
    nodes.push(...draftNodes);
    const flowData: IHmFlowData = {
      nodes,
      edges,
      metadata: {
        name: workflow.workflow_def.metadata.name,
        description: workflow.workflow_def.metadata.annotations?.description,
        version: workflow.workflow_def.metadata.annotations?.version
      },
      viewport: {
        x: 0,
        y: 0,
        zoom: 0
      }
    };

    return flowData;
  },
  _parseFlowToWorkflow: (input: IHmFlowData) => {
    const { drafts, steps } = _store._getOrderedStepsAndDrafts(input);
    const workflowDef: WorkflowDef = {
      api_version: 'core.oam.dev/v1beta1',
      metadata: {
        name: input.metadata.name,
        annotations: {
          description: input.metadata.description ?? '',
          version: input.metadata.version ?? ''
        }
      },
      spec: {
        drafts: _store._parseFlowNodeToWorkflowSteps(drafts),
        steps: _store._parseFlowNodeToWorkflowSteps(steps)
      }
    };

    return workflowDef;
  },
  _parseFlowNodeToWorkflowSteps: (flowNodes: IHmFlowData['nodes']) => {
    const steps: WorkflowStep[] = flowNodes.map((flowNode) => {
      const nodeParameters = toJS(flowNode.data.parameters);

      const parsedParameters = Object.keys(nodeParameters ?? {}).reduce(
        (acc, key) => {
          if (nodeParameters && typeof nodeParameters === 'object') {
            acc[key] =
              (nodeParameters as Record<string, any>)[key]?.value ?? '';
          }
          return acc;
        },
        {} as Record<string, any>
      );
      const step: WorkflowStep = {
        name: flowNode.data.label,
        type: 'component', // #TODO: rajouter le type dans la definition du Node.data
        properties: {
          image: flowNode.data.image,
          metadata: {
            position: { x: flowNode.position.x, y: flowNode.position.y }
          },
          parameters: parsedParameters
        }
      };

      return step;
    });
    return steps;
  },
  _handleError: (error: unknown, erroTitle: string) => {
    const isOpenApiError = (error as OpenApiError)?.type;
    if (isOpenApiError) {
      const _err = error as OpenApiError;
      notifications.show({
        title: _err.type,
        message: _err.message,
        color: 'red'
      });
      return;
    }
    const err = error as Error;
    notifications.show({
      title: erroTitle,
      message: err.message,
      color: 'red'
    });
  },
  _getOrderedStepsAndDrafts(flowData: IHmFlowData) {
    const { nodes, edges } = flowData;

    // 1) Build adjacency + in-degree structures.
    const adjacencyMap = new Map<string, string[]>(); // nodeId -> neighbors
    const inDegreeMap = new Map<string, number>(); // nodeId -> inDegree

    // Track which nodes ever appear in an edge (source or target)
    const edgeNodeIds = new Set<string>();

    // Initialize adjacency / inDegree for every node
    nodes.forEach((node) => {
      adjacencyMap.set(node.id, []);
      inDegreeMap.set(node.id, 0);
    });

    // Fill adjacency / inDegree from edges
    edges.forEach(({ source, target }) => {
      edgeNodeIds.add(source);
      edgeNodeIds.add(target);
      adjacencyMap.get(source)!.push(target);
      inDegreeMap.set(target, inDegreeMap.get(target)! + 1);
    });

    // 2) Collect all node IDs with in-degree = 0
    //    BUT only if they actually appear in edges.
    const queue: string[] = [];
    inDegreeMap.forEach((degree, nodeId) => {
      if (degree === 0 && edgeNodeIds.has(nodeId)) {
        queue.push(nodeId);
      }
    });

    const visited = new Set<string>(); // track visited IDs in the topological sort
    const orderedIds = new Array<string>();

    // 3) "Process" the queue with a for-loop (no while).
    for (let i = 0; i < queue.length; i++) {
      const current = queue[i];
      orderedIds.push(current);
      visited.add(current);

      // Decrease in-degree of all neighbors
      for (const neighbor of adjacencyMap.get(current)!) {
        const newDeg = inDegreeMap.get(neighbor)! - 1;
        inDegreeMap.set(neighbor, newDeg);
        // If a neighbor's in-degree hits 0, enqueue it (if it appears in edges).
        if (newDeg === 0 && edgeNodeIds.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    // 4) Convert sorted IDs to FlowNodes
    const steps = orderedIds.map((id) => nodes.find((n) => n.id === id)!);

    // 5) drafts = all nodes not in the visited set,
    //    plus any that never appeared in edges at all.
    const drafts = nodes.filter((n) => !visited.has(n.id));

    return { steps, drafts };
  },
  _workflowStepsToNodes: (steps: WorkflowStep[]) => {
    return steps.map((step) => {
      const image = step.properties.image;
      const matched = nodeStore.data.find((def) => def.image === image);
      if (!matched) {
        throw new Error(`No node definition found for image: ${image}`);
      }
      const baseNode = nodeStore.parseNode(matched);

      // Override label and position from the WorkflowStep
      baseNode.data.label = step.name;

      const xFlowNode: Node<PyNodeDataWithActionType> = {
        ...baseNode,
        id: step.name,
        position: {
          x: 0,
          y: 0
        }
      };

      if (step.type === 'component') {
        const rawParameters: Record<string, any> =
          step.properties.parameters ?? {};
        const validationSchema =
          matched.node_def.spec.properties.parameters.validation_schema;
        const formattedParameters: Record<
          string,
          { value: any; type: string }
        > = {};

        if (validationSchema?.properties) {
          Object.entries(validationSchema.properties).forEach(
            ([key, schema]) => {
              formattedParameters[key] = {
                value: rawParameters[key] ?? schema.default ?? '',
                type: schema.type
              };
            }
          );
        }

        xFlowNode.data.parameters = formattedParameters;
        xFlowNode.position = {
          x: step.properties.metadata.position.x,
          y: step.properties.metadata.position.y
        };
      }
      return xFlowNode;
    });
  },
  ensureWorkflowExistsBeforeRun: async (
    id: string,
    flowData: IHmFlowData
  ): Promise<string | null> => {
    if (id === 'new') {
      if (!_store.workflow.id || _store.workflow.id === 'new') {
        notifications.show({
          title: 'Save required',
          message: 'Save the workflow before running it.',
          color: 'orange'
        });
        return null;
      }

      return _store.workflow.id;
    }

    // Save the canvas first, so the run executes what it shows. Reloading the
    // saved version here discarded the unsaved edits.
    try {
      const wk = await _store.updateWorkflow(flowData, id);
      _store.setWorflow(wk);
      return id;
    } catch (error) {
      _store._handleError(error, 'Workflow Error');
      return null;
    }
  }
};

// Model the application state.
function workflowStoreFactory() {
  return makeAutoObservable(_store);
}

const workflowStore = workflowStoreFactory();
export type WorkflowStoreType = WithoutPrivate<
  ReturnType<typeof workflowStoreFactory>
>;

export default workflowStore;
