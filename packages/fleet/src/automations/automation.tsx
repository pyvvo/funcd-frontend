import { HmFlow, IHmFlowData } from '@funcd-dev/ui';
import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { searchItems } from './automation-nodes';
import { AutomationStoreType } from './automation.store';

interface IAutomation {
  store: AutomationStoreType;
}

// The flow editor, on the page's whole height.
const Automation: FC<IAutomation> = observer((props) => {
  const { store } = props;
  const { automation } = store;
  const { id = '' } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    store.loadOne(id);
  }, [store, id]);

  if (!automation || automation.id !== id) return null;

  const flowData = {
    nodes: automation.flow.nodes,
    edges: automation.flow.edges,
    metadata: {
      name: automation.name,
      description: automation.description,
      version: ''
    },
    viewport: { x: 40, y: 120, zoom: 1 }
  } as unknown as IHmFlowData;

  return (
    <Box h="calc(100vh - 110px)" py="md">
      <HmFlow
        key={automation.id}
        defaultHmFlowData={flowData}
        searchItems={searchItems}
        textStatus={automation.enabled ? 'Enabled' : 'Disabled'}
        color={automation.enabled ? 'green' : 'yellow'}
        canvasConfig={{ background: true, controls: true, miniMap: true }}
        onHmflowSave={store.save}
        onHmflowRun={store.run}
        onHmflowDelete={async () => {
          await store.remove(automation.id);
          navigate('/automations');
        }}
      />
    </Box>
  );
});

export default Automation;
