import { HmFlow, IHmFlow, IHmFlowData } from '@humaapi/ui';
import { observer } from 'mobx-react-lite';
import { FC, use, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nodeStoreType } from './node.store';
import { WorkflowStoreType } from './workflow.store';

export interface IFlowPlayload {
  name: string;
  version?: string;
  description?: string;
}

interface IWorfklowCanvas {
  store: WorkflowStoreType;
  nodeStore: nodeStoreType;
}

const WorkflowCanvas: FC<IWorfklowCanvas> = (props) => {
  const { store, nodeStore } = props;

  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    throw new Error('Workflow ID is required');
  }

  const init = async () => {
    await nodeStore.loadNodes();
    await store.loadflowData(id);
  };

  useEffect(() => {
    init();
  }, [id]);

  const handleFlowSave = async (flowData: IHmFlowData) => {
    const result = await store.handleFlowSave(id, flowData, navigate);
    return result;
  };

  const handleFlowDelete = async () => {
    await store.handleDeleteWorkflow(id, navigate);
  };

  const hmProps: IHmFlow = {
    textStatus: 'running',
    defaultHmFlowData: store.flowData,
    searchItems: nodeStore.searchItems,
    canvasConfig: {
      background: true,
      controls: true,
      miniMap: false,
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
        position: 'bottom-right',
        showFitView: true,
        showInteractive: false
      }
    },
    onHmflowRun: async (flowData: IHmFlowData) => {
      const effectiveId = await store.ensureWorkflowExistsBeforeRun(
        id,
        flowData
      );
      if (!effectiveId) return;
      await store.handleRunWorkflow(effectiveId);
    },
    onHmflowDelete: handleFlowDelete,
    onHmflowSave: handleFlowSave
  };
  return (
    <div style={{ height: 'calc(100vh - 70px)' }}>
      <HmFlow {...hmProps} />
    </div>
  );
};

export default observer(WorkflowCanvas);
