import {
  IHmFlowData,
  IInitialNodeData,
  PyNodeDataWithActionType
} from '@/hm-flow';
import { wait } from '@/utils';
import { Edge, Node } from '@xyflow/react';
import { makeAutoObservable, toJS } from 'mobx';
import { IWorkflowModel, nodeModels } from './payload/workflow.payload';

const workflowData = {
  id: '3494fd11-e9a5-489a-acd8-198e2389b578',
  workflow_def: {
    api_version: 'version/beta1',
    kind: 'WorkflowDefinition',
    metadata: {
      name: 'My first workflow',
      annotations: {
        description: 'Test wf',
        version: '1.0.0'
      }
    },
    spec: {
      steps: [
        {
          name: 'Gitlab-0',
          type: 'component',
          properties: {
            image: 'pyvvo/gitlab:latest',
            metadata: {
              position: {
                x: 5,
                y: 5
              }
            },
            parameters: {
              branch: 'main',
              action: 'commit',
              repo: 'test'
            }
          }
        },
        {
          name: 'Wait-0',
          type: 'component',
          properties: {
            image: 'pyvvo/wait:latest',
            parameters: {
              duration: 8
            },
            metadata: {
              position: {
                x: 10,
                y: 10
              }
            }
          }
        }
      ]
    }
  }
} satisfies IWorkflowModel;

const defaultFlowData: IHmFlowData = {
  nodes: [],
  edges: [],
  metadata: {
    name: 'workflow',
    description: 'Workflow description',
    version: '1.0.0'
  },
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  }
};

const _store = {
  flowData: defaultFlowData,
  name: 'workflow',
  flowDataToJS: () => toJS(_store.flowData),
  //** flow method */
  loadFlowData: async () => {
    await wait(1000);
    const flow = _store.parseWorkflow(workflowData);
    _store.setFlowData({
      ...flow,
      metadata: {
        name: 'New workflow',
        description: 'Workflow description',
        version: '0.0.1'
      }
    });
  },
  setFlowData: (data: IHmFlowData) => {
    _store.flowData = data;
  },
  parseWorkflow: (workflow: IWorkflowModel) => {
    const steps = workflow.workflow_def.spec.steps;
    const nodes: Node<PyNodeDataWithActionType>[] = [];
    const edges: Edge[] = [];

    steps.forEach((step, index) => {
      const image = step.properties.image;
      const { type } = step;

      const additionalInfo = nodeModels.find((el) => el.image === image);
      if (!additionalInfo) {
        throw new Error(`Additional info not found for image: ${image}`);
      }

      let rawParameters: Record<string, any> = {};
      if (type === 'component') {
        rawParameters = step.properties.parameters ?? {};
      }
      const validationSchema =
        additionalInfo.node_def.spec.properties.parameters.validation_schema;
      const formattedParameters: Record<string, { value: any; type: string }> =
        {};
      if (validationSchema && validationSchema.properties) {
        Object.entries(validationSchema.properties).forEach(([key, schema]) => {
          formattedParameters[key] = {
            value: rawParameters?.[key] ?? schema.default ?? '',
            type: schema.type
          };
        });
      }

      console.log('formattedParameters =>', formattedParameters);

      const node: Node<PyNodeDataWithActionType> = {
        id: `node-${index}`,
        type: additionalInfo.node_def.metadata.annotations.ui,
        data: {
          name: additionalInfo.node_def.metadata.annotations.label,
          label: step.name,
          icon: additionalInfo.node_def.metadata.annotations.icon,
          color: additionalInfo.node_def.metadata.annotations.color,
          image: '',
          parameters: formattedParameters,
          actions: []
        },

        position: {
          x: index * 200,
          y: 0
        }
      };

      nodes.push(node);
      if (index > 0) {
        const edge = {
          id: `edge-${index - 1}-${index}`,
          source: `node-${index - 1}`,
          target: `node-${index}`
        };
        edges.push(edge);
      }
    });

    const flow: IHmFlowData = {
      nodes,
      edges,
      metadata: {
        name: workflow.workflow_def.metadata.name,
        description: workflow.workflow_def.metadata.annotations!.description,
        version: workflow.workflow_def.metadata.annotations!.version
      },
      viewport: {
        x: 0,
        y: 0,
        zoom: 0
      }
    };

    return flow;
  }
};

// Model the application state.
function workflowStoreFactory() {
  return makeAutoObservable(_store, {}, { name: 'workflowStore', deep: true });
}

const workflowStore = workflowStoreFactory();
export type WorkflowStoreType = ReturnType<typeof workflowStoreFactory>;

export default workflowStore;
