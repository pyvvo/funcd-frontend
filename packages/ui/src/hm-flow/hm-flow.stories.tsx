import {
  FormBuilder,
  ReactiveTextareaField,
  ReactiveTextField
} from '@/reactive-form';
import {
  IWorkflowModel,
  nodeModels,
  parseNodes
} from '@/story-utils/payload/workflow.payload';
import workflowStore from '@/story-utils/workflow.store';
import type { Meta, StoryObj } from '@storybook/react';
import { Node } from '@xyflow/react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import HmFlow, { IHmFlow } from './hm-flow';
import { ICanvasConfigs, IHmFlowData } from './hm-flow.types';
import { HmFlowJsonObject } from './hooks/use-hm-flow-service';
import {
  ActionHandlerDepsType,
  IPyNode,
  PyNodeDataWithActionType
} from './node';

FormBuilder.defineWidget({ name: 'text', component: ReactiveTextField });
FormBuilder.defineWidget({
  name: 'textarea',
  component: ReactiveTextareaField
});
// ############################ Reactive form ######################

type Story = StoryObj<typeof HmFlow>;

const meta: Meta<typeof HmFlow> = {
  title: 'HmFlow/Canvas',
  component: HmFlow,
  parameters: {
    deepControls: { enabled: true }
  },
  argTypes: {
    color: {
      control: {
        type: 'select'
      },
      options: ['green', 'red', 'yellow', 'purple', 'orange']
    }
  }
};

export default meta;

const initialNodes: Node<PyNodeDataWithActionType>[] = [
  {
    id: 'interaction-1',
    type: 'pyNode',
    data: {
      label: 'VS code',
      icon: 'https://cdn.freebiesupply.com/logos/large/2x/visual-studio-code-logo-svg-vector.svg',
      color: '#0095FF',
      actions: [],
      name: 'interaction-1',
      image: '',
      parameters: {}
    },
    position: { x: 222, y: 0 }
  },
  {
    id: 'interaction-2',
    type: 'pyNode',
    data: {
      label: 'Wait',
      icon: 'https://cdn-icons-png.flaticon.com/512/4181/4181163.png',
      color: '#f43378',
      actions: [],
      name: 'interaction-2',
      image: '',
      parameters: {}
    },
    position: { x: 444, y: 0 }
  },
  {
    id: 'interaction-3',
    type: 'pyNode',
    data: {
      label: 'Edit Fields',
      icon: 'https://cdn-icons-png.flaticon.com/512/2344/2344200.png',
      color: '#b163ff',
      actions: [],
      name: 'interaction-3',
      image: '',
      parameters: {}
    },
    position: { x: 0, y: 0 }
  }
];
const initialEdges = [
  {
    id: 'interaction-e1-2',
    source: 'interaction-1',
    target: 'interaction-2',
    animated: true
  },
  { id: 'interaction-e1-3', source: 'interaction-3', target: 'interaction-1' }
];

const defaultHmFlowData: IHmFlowData = {
  nodes: initialNodes,
  edges: initialEdges,
  metadata: { name: 'My first workflow 😎', description: '', version: '' },
  viewport: {
    x: 0,
    y: 0,
    zoom: 0
  }
};

export const _HmFlow: Story = {
  render: (args) => {
    const searchItems: IPyNode[] = parseNodes(nodeModels);
    const canvasConfig: ICanvasConfigs = {
      miniMap: true,
      background: true,
      controls: true,
      bgAttr: {
        bgColor: '#F6F6F6'
      },
      mapAttr: {
        nodeBorderRadius: 22
      }
    };
    const handleCanvasDoubleClicked = (deps: ActionHandlerDepsType) => {
      console.log('Canvas clicked:', deps.currentNode, deps.nodes);
    };
    const handleHmflowSave = (flow: HmFlowJsonObject | null) => {
      const workflowDef = parseFlowToWorkflow(flow);
      console.log(workflowDef);
    };

    const handleHmFlowDelete = async () => {
      console.log('delete flow');
    };
    const hmProps: IHmFlow = {
      textStatus: 'Running',
      color: 'green',
      defaultHmFlowData,
      searchItems,
      canvasConfig,
      onCanvasDoubleClicked: handleCanvasDoubleClicked,
      onHmflowSave: handleHmflowSave,
      onHmflowDelete: handleHmFlowDelete
    };

    return (
      <div style={{ height: 'calc(100vh - 40px)' }}>
        <HmFlow {...hmProps} {...args} />
      </div>
    );
  },
  args: {}
};

export const Default: Story = {
  render: (args) => {
    const searchItems: IPyNode[] = parseNodes(nodeModels);

    const handleCanvasDoubleClicked = (deps: ActionHandlerDepsType) => {
      console.log('Canvas clicked:', deps.currentNode, deps.nodes);
    };
    const handleCanvasSaved = (flow: HmFlowJsonObject | null) => {
      const workflowDef = parseFlowToWorkflow(flow);
      console.log(workflowDef);
    };

    const handleHmflowDelete = async () => {
      console.log('delete flow');
    };

    const hmProps: IHmFlow = {
      textStatus: 'Running',
      color: 'green',
      defaultHmFlowData,
      searchItems,
      onCanvasDoubleClicked: handleCanvasDoubleClicked,
      onHmflowSave: handleCanvasSaved,
      onHmflowDelete: handleHmflowDelete
    };

    return (
      <div style={{ height: 'calc(100vh - 40px)' }}>
        <HmFlow {...hmProps} {...args} />
      </div>
    );
  },

  args: {
    canvasConfig: {
      background: false,
      controls: false,
      miniMap: false,
      bgAttr: {
        color: '#3F4F44',
        gap: 15,
        bgColor: '#F6F6F6',
        offset: 4,
        size: 1.2,
        variant: 'dots'
      },
      ctlAttr: {
        orientation: 'vertical',
        position: 'bottom-left',
        showFitView: true,
        showInteractive: false
      },
      mapAttr: {
        nodeColor: '#CDC1FF',
        nodeBorderRadius: 22,
        nodeStrokeColor: '#A294F9',
        nodeStrokeWidth: 12,
        pannable: true,
        zoomable: true
      }
    }
  }
};

const ReactiveHmFlow = observer((args: IHmFlow) => {
  const searchItems: IPyNode[] = parseNodes(nodeModels);

  const handleCanvasDoubleClicked = (deps: ActionHandlerDepsType) => {
    console.log('Canvas clicked:', deps.currentNode, deps.nodes);
  };

  const handleHmflowSave = (flow: IHmFlowData) => {
    console.log(flow);

    const workflowDef = parseFlowToWorkflow(flow);
    console.log(workflowDef);
  };

  const handleHmFlowDelete = async () => {
    console.log('delete flow');
  };

  useEffect(() => {
    void workflowStore.loadFlowData();
    // `workflowStore` is a module-scope singleton, not reactive state.
  }, []);

  const hmProps: IHmFlow = {
    textStatus: 'Running',
    color: 'green',
    searchItems,
    onCanvasDoubleClicked: handleCanvasDoubleClicked,
    onHmflowSave: handleHmflowSave,
    onHmflowDelete: handleHmFlowDelete,
    defaultHmFlowData: workflowStore.flowData
  };

  return (
    <div style={{ height: 'calc(100vh - 40px)' }}>
      <HmFlow {...hmProps} {...args} />
    </div>
  );
});

export const WithMobx: Story = {
  render: (args) => <ReactiveHmFlow {...args} />,

  args: {
    canvasConfig: {
      background: false,
      controls: false,
      miniMap: false,
      bgAttr: {
        color: '#3F4F44',
        gap: 15,
        bgColor: '#F6F6F6',
        offset: 4,
        size: 1.2,
        variant: 'dots'
      },
      ctlAttr: {
        orientation: 'vertical',
        position: 'bottom-left',
        showFitView: true,
        showInteractive: false
      },
      mapAttr: {
        nodeColor: '#CDC1FF',
        nodeBorderRadius: 22,
        nodeStrokeColor: '#A294F9',
        nodeStrokeWidth: 12,
        pannable: true,
        zoomable: true
      }
    }
  }
};

const parseFlowToWorkflow = (flowData: HmFlowJsonObject | null) => {
  if (!flowData || !flowData.nodes) {
    return null;
  }

  const worflowModel: IWorkflowModel = {
    id: '1',
    workflow_def: {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'WorkflowDefinition',
      metadata: {
        name: 'example-workflow',
        annotations: {
          description: 'This is an example workflow',
          version: '1.0.0'
        }
      },
      spec: {
        steps: flowData.nodes.map((node) => {
          const { data } = node;

          const parsedParameters = Object.keys(data.parameters ?? {}).reduce(
            (acc, key) => {
              if (data.parameters && typeof data.parameters === 'object') {
                acc[key] =
                  (data.parameters as Record<string, any>)[key]?.value ?? '';
              }
              return acc;
            },
            {} as Record<string, any>
          );

          return {
            name: data.label,
            type: 'component',
            properties: {
              image: '',
              metadata: {
                position: {
                  x: node.position.x,
                  y: node.position.y
                }
              },
              parameters: parsedParameters
            }
          };
        })
      }
    }
  };
  return worflowModel;
};
