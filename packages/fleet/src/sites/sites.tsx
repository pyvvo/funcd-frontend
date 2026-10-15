import { CardGridLayout } from '@funcd-dev/ui';
import {
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton
} from '@mantine/core';
import {
  IconBuildingWarehouse,
  IconMapPin,
  IconSearch
} from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deviceStore from '../devices/device.store';
import { SiteStoreType } from './site.store';

interface ISites {
  store: SiteStoreType;
}

const Sites: FC<ISites> = observer((props) => {
  const { store } = props;
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    store.load();
  }, [store]);

  const sites = store.sites.filter((site) =>
    `${site.name} ${site.city}`.toLowerCase().includes(search.toLowerCase())
  );

  // A site opens the device list, filtered on it.
  const handleOpen = (siteId: string) => {
    deviceStore.setFilters({ search: '', siteId, status: null });
    navigate('/devices');
  };

  return (
    <CardGridLayout
      header={
        <TextInput
          placeholder="Search sites"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
      }>
      {sites.map((site) => (
        <UnstyledButton key={site.id} onClick={() => handleOpen(site.id)}>
          <Paper p="lg" radius="var(--mantine-card-border-radius)" withBorder>
            <Group wrap="nowrap" align="flex-start">
              <ThemeIcon variant="light" size={44} radius="md">
                <IconBuildingWarehouse size={24} />
              </ThemeIcon>
              <Stack gap={4}>
                <Text fw={600}>{site.name}</Text>
                <Group gap={4}>
                  <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="sm" c="dimmed">
                    {site.city}
                  </Text>
                </Group>
                <Text size="sm">{site.deviceCount} devices</Text>
              </Stack>
            </Group>
          </Paper>
        </UnstyledButton>
      ))}
    </CardGridLayout>
  );
});

export default Sites;
