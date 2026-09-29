import { HmFlow, IHmFlow, IHmFlowData, IPyNode } from '@funcd-dev/ui';
import { FC } from 'react';
import { nodeModels, parseFlowToWorkflow, parseNodes } from './utils';

const initialNodes = [
  {
    id: 'interaction-1',
    type: 'pyNode',
    data: {
      label: 'VS code',
      name: 'VS code',
      icon: 'https://cdn.freebiesupply.com/logos/large/2x/visual-studio-code-logo-svg-vector.svg',
      image: '',
      color: '#0095FF',
      actions: []
    },
    position: { x: 222, y: 0 }
  },
  {
    id: 'interaction-2',
    type: 'pyNode',
    data: {
      label: 'Wait',
      name: 'Wait',
      icon: 'https://cdn-icons-png.flaticon.com/512/4181/4181163.png',
      image: '',
      color: '#f43378',
      actions: []
    },
    position: { x: 444, y: 0 }
  },
  {
    id: 'interaction-3',
    type: 'pyNode',
    data: {
      label: 'Edit Fields',
      name: 'Edit Fields',
      icon: 'https://cdn-icons-png.flaticon.com/512/2344/2344200.png',
      image: '',
      color: '#b163ff',
      actions: []
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
  metadata: { name: 'Workflow integration' },
  nodes: initialNodes,
  edges: initialEdges,
  viewport: { x: 0, y: 0, zoom: 1 }
};

const Workflow: FC = () => {
  const searchItems: IPyNode[] = parseNodes(nodeModels);
  const handleHmflowSave = (flow: IHmFlowData) => {
    console.log(flow);
    const workflowDef = parseFlowToWorkflow(flow);
    console.log(workflowDef);
  };

  const hmProps: IHmFlow = {
    defaultHmFlowData,
    searchItems,
    canvasConfig: {
      background: true,
      controls: true,
      miniMap: true,
      bgAttr: {
        color: '#3F4F44',
        gap: 15,
        bgColor: '#F5F5F7',
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
    },
    onHmflowSave: handleHmflowSave,
    textStatus: 'Running'
  };
  return (
    <div className="w-full h-[calc(100vh-70px)]">
      <HmFlow {...hmProps} />
    </div>
  );
};

export default Workflow;
