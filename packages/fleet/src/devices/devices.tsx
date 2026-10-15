import {
  ContentLayout,
  HMDataGrid,
  IColumn,
  IconLabelCell,
  StatusCell,
  TimeAgoCell,
  TitleCell
} from '@funcd-dev/ui';
import {
  ActionIcon,
  Button,
  Group,
  Select,
  Text,
  TextInput
} from '@mantine/core';
import {
  IconBattery2,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash
} from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeviceStatusType, DeviceType } from '../api/contract';
import {
  capitalize,
  deviceStatusColors,
  deviceTypeIcons
} from '../common/display';
import { DeviceStoreType } from './device.store';

interface IDevices {
  store: DeviceStoreType;
}

const Devices: FC<IDevices> = observer((props) => {
  const { store } = props;
  const { page, sites, search, siteId, status, selectedIds, isLoading } = store;
  const navigate = useNavigate();

  useEffect(() => {
    store.loadSites();
    store.load();
  }, [store]);

  const columns: IColumn<DeviceType>[] = [
    {
      key: 'name',
      name: 'Device',
      render: ({ row }) => {
        const TypeIcon = deviceTypeIcons[row.type as DeviceType['type']];
        return (
          <TitleCell
            title={row.name}
            subtitle={`${store.siteName(row.siteId)} · ${row.id}`}
            leftIcon={<TypeIcon size={20} />}
          />
        );
      }
    },
    {
      key: 'status',
      name: 'Status',
      width: 140,
      render: ({ row }) => (
        <StatusCell
          label={capitalize(row.status)}
          color={deviceStatusColors[row.status as DeviceStatusType]}
        />
      )
    },
    {
      key: 'battery',
      name: 'Battery',
      width: 120,
      render: ({ row }) => (
        <IconLabelCell
          icon={
            <IconBattery2
              size={18}
              color={
                row.battery < 20
                  ? 'var(--mantine-color-orange-6)'
                  : 'var(--mantine-color-dimmed)'
              }
            />
          }
          label={`${row.battery}%`}
        />
      )
    },
    { key: 'firmware', name: 'Firmware', width: 120 },
    {
      key: 'lastSeenAt',
      name: 'Last seen',
      width: 170,
      render: ({ row }) => <TimeAgoCell date={row.lastSeenAt} />
    },
    {
      key: 'id',
      name: '',
      width: 56,
      sortable: false,
      render: () => (
        <IconChevronRight size={18} color="var(--mantine-color-dimmed)" />
      )
    }
  ];

  const start = page ? page.offset + 1 : 0;
  const end = page ? page.offset + page.items.length : 0;

  return (
    <ContentLayout>
      <Group>
        <TextInput
          placeholder="Search devices"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) =>
            store.setFilters({ search: event.currentTarget.value })
          }
          style={{ flex: 1, minWidth: 200 }}
        />
        <Select
          placeholder="All sites"
          data={sites.map((site) => ({ value: site.id, label: site.name }))}
          value={siteId}
          onChange={(value) => store.setFilters({ siteId: value })}
          clearable
        />
        <Select
          placeholder="All statuses"
          data={Object.keys(deviceStatusColors).map((value) => ({
            value,
            label: capitalize(value)
          }))}
          value={status}
          onChange={(value) =>
            store.setFilters({ status: value as DeviceStatusType | null })
          }
          clearable
        />
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate('new')}>
          Register a device
        </Button>
      </Group>
      <HMDataGrid
        withRowSelection
        withSorting
        rowKeyGetter={(row) => row.id}
        columns={columns}
        rows={page?.items ?? []}
        rowHeight={60}
        headerRowHeight={44}
        selectedRows={selectedIds}
        onSelectedRowsChange={store.setSelectedIds}
        onRowClick={(row) => navigate(row.id)}
        emptyText={isLoading ? 'Loading devices…' : 'No device matches'}
        selectionActions={
          <>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={() => store.restart([...selectedIds])}>
              Restart
            </Button>
            <Button
              variant="subtle"
              size="xs"
              mod={{ color: 'alert' }}
              leftSection={<IconTrash size={14} />}
              onClick={() => store.remove([...selectedIds])}>
              Delete
            </Button>
          </>
        }
        footer={
          <Group justify="space-between" w="100%">
            <Text size="sm" c="dimmed">
              {page?.total
                ? `Showing ${start}–${end} of ${page.total} devices`
                : 'No device'}
            </Text>
            <Group gap="xs">
              <ActionIcon
                variant="default"
                radius="md"
                aria-label="Previous devices"
                disabled={!page || page.offset === 0}
                onClick={store.previous}>
                <IconChevronLeft size={16} />
              </ActionIcon>
              <ActionIcon
                variant="default"
                radius="md"
                aria-label="Next devices"
                disabled={!page || end >= page.total}
                onClick={store.next}>
                <IconChevronRight size={16} />
              </ActionIcon>
            </Group>
          </Group>
        }
      />
    </ContentLayout>
  );
});

export default Devices;
