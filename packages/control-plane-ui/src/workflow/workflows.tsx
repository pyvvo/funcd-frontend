import { FlowCard } from '@funcd-dev/ui';
import { Box, Group, Stack } from '@mantine/core';
import { IconJumpRope, IconPencil } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { WorkflowStoreType } from './workflow.store';

interface IWorfklowsProps {
  store: WorkflowStoreType;
}

const Workflows: FC<IWorfklowsProps> = (props) => {
  const { store } = props;

  const init = async () => {
    await store.loadWorflows();
  };

  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  return (
    <Box style={{ marginLeft: 20, paddingTop: 18, paddingBottom: 18 }}>
      <Group mb={18} justify="flex-start" align="center">
        <FlowCard
          flowName="New workflow"
          subtitle="Create new workflow"
          leftIcon={<IconPencil size={18} />}
          withRightSection={false}
          onClick={() => navigate('/workflows/new')}
        />
      </Group>
      <Stack
        p={10}
        gap={12}
        align="center"
        justify="center"
        className="tagWorkflow"
        mb={20}>
        All Workflows
      </Stack>
      <Stack gap={10}>
        {store.workflows
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .map((workflow) => {
            return (
              <FlowCard
                key={workflow.id}
                flowName={
                  workflow.workflow_def.metadata.name || 'Unnamed Workflow'
                }
                lastUpdated={workflow.updated_at}
                leftIcon={<IconJumpRope size={18} />}
                onClick={() => navigate(`./${workflow.id}`)}
                onDelete={async () =>
                  await store.handleDeleteWorkflow(workflow.id, navigate)
                }
              />
            );
          })}
      </Stack>
      <Outlet />
    </Box>
  );
};

export default observer(Workflows);
