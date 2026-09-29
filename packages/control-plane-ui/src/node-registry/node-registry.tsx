import { CreateNodeForm, FlowCard } from '@funcd-dev/ui';
import { Box, Drawer, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCube, IconPencil } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { nodeRegistryStoreType } from './node-registry-store';

interface IWorfklowsProps {
  store: nodeRegistryStoreType;
}

const NodeRegistry: FC<IWorfklowsProps> = (props) => {
  const { store } = props;
  const [opened, { open, close }] = useDisclosure(false);

  const init = async () => {
    await store.loadNodes();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Box style={{ marginLeft: 20, paddingTop: 18, paddingBottom: 18 }}>
      <Group mb={18} justify="flex-start" align="center">
        <FlowCard
          flowName="New nodebase"
          subtitle="Create new nodebase"
          leftIcon={<IconPencil size={18} />}
          withRightSection={false}
          onClick={open}
        />
      </Group>
      <Stack
        p={10}
        gap={12}
        align="center"
        justify="center"
        className="tagWorkflow"
        mb={20}>
        All Node
      </Stack>
      <Stack gap={10}>
        {store.data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .map((node) => {
            return (
              <FlowCard
                key={node.id}
                flowName={node.node_def.metadata.name || 'Unnamed Workflow'}
                lastUpdated={node.updated_at}
                leftImage={node.node_def.metadata.annotations.icon}
                withRightSection={false}
              />
            );
          })}
      </Stack>

      <Drawer opened={opened} withCloseButton={false} onClose={close}>
        <CreateNodeForm
          submitButtonText={'Create Node'}
          onSubmit={store.handleCreateNodeFormSubmit}
        />
      </Drawer>
      <Outlet />
    </Box>
  );
};

export default observer(NodeRegistry);
