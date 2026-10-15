import {
  ECOption,
  HMChart,
  HMDataGrid,
  SplitLayout,
  StatusCell,
  TimeAgoCell,
  TitleCell
} from '@funcd-dev/ui';
import {
  Badge,
  Button,
  Group,
  NavLink,
  Paper,
  Progress,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text
} from '@mantine/core';
import { IconEdit, IconRefresh, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { AlertStatusType, SeverityType } from '../api/contract';
import {
  alertStatusColors,
  capitalize,
  deviceStatusColors,
  deviceTypeIcons,
  severityColors
} from '../common/display';
import Panel from '../common/panel';
import { DeviceStoreType } from './device.store';

interface IDevice {
  store: DeviceStoreType;
}

const Fact: FC<{ label: string; children: ReactNode }> = (props) => {
  const { label, children } = props;

  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
        {label}
      </Text>
      {children}
    </Stack>
  );
};

const Device: FC<IDevice> = observer((props) => {
  const { store } = props;
  const { device, readings, alerts, range, page } = store;
  const { id = '' } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    store.loadSites();
    if (!store.page) store.load();
  }, [store]);

  useEffect(() => {
    store.loadDevice(id);
  }, [store, id]);

  const handleDelete = async () => {
    await store.remove([id]);
    navigate('/devices');
  };

  const option: ECOption | undefined = readings && {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: readings.points.map((point) =>
        dayjs(point.timestamp).format(range === '24h' ? 'HH:mm' : 'DD/MM HH:mm')
      )
    },
    yAxis: { type: 'value', name: readings.unit, scale: true },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.15 },
        data: readings.points.map((point) => point.value)
      }
    ],
    grid: { left: 48, right: 16, top: 32, bottom: 32 }
  };

  const TypeIcon = device ? deviceTypeIcons[device.type] : undefined;

  return (
    <SplitLayout
      side={
        <Paper p="xs" radius="var(--mantine-card-border-radius)" withBorder>
          {page?.items.map((item) => (
            <NavLink
              key={item.id}
              label={item.name}
              description={store.siteName(item.siteId)}
              active={item.id === id}
              onClick={() => navigate(`/devices/${item.id}`)}
            />
          ))}
        </Paper>
      }>
      {device && TypeIcon && (
        <>
          <Paper p="lg" radius="var(--mantine-card-border-radius)" withBorder>
            <Group justify="space-between" wrap="wrap">
              <Group>
                <TitleCell
                  title={device.name}
                  subtitle={`${store.siteName(device.siteId)} · ${device.id}`}
                  leftIcon={<TypeIcon size={20} />}
                />
                <StatusCell
                  label={capitalize(device.status)}
                  color={deviceStatusColors[device.status]}
                />
              </Group>
              <Group gap="xs">
                <Button
                  variant="secondary"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => navigate('edit')}>
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  leftSection={<IconRefresh size={16} />}
                  onClick={async () => {
                    await store.restart([id]);
                    store.loadDevice(id);
                  }}>
                  Restart
                </Button>
                <Button
                  variant="subtle"
                  mod={{ color: 'alert' }}
                  leftSection={<IconTrash size={16} />}
                  onClick={handleDelete}>
                  Delete
                </Button>
              </Group>
            </Group>
            <SimpleGrid minColWidth={140} autoFlow="auto-fit" mt="lg">
              <Fact label="Battery">
                <Text size="sm" fw={600}>
                  {device.battery}%
                </Text>
                <Progress
                  value={device.battery}
                  color={device.battery < 20 ? 'orange' : 'green'}
                />
              </Fact>
              <Fact label="Firmware">
                <Text size="sm">{device.firmware}</Text>
              </Fact>
              <Fact label="Reports every">
                <Text size="sm">{device.reportingIntervalSec} s</Text>
              </Fact>
              <Fact label="Last seen">
                <TimeAgoCell date={device.lastSeenAt} />
              </Fact>
              <Fact label="Tags">
                <Group gap={4}>
                  {device.tags.map((tag) => (
                    <Badge key={tag} variant="light">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </Fact>
            </SimpleGrid>
          </Paper>
          <Panel
            title="Readings"
            action={
              <SegmentedControl
                size="xs"
                data={['24h', '7d']}
                value={range}
                onChange={(value) => store.setRange(value as '24h' | '7d')}
              />
            }>
            {option && <HMChart option={option} style={{ height: 260 }} />}
          </Panel>
          <HMDataGrid
            rowKeyGetter={(row) => row.id}
            maxRows={5}
            emptyText="No alert for this device"
            columns={[
              {
                key: 'severity',
                name: 'Severity',
                width: 130,
                render: ({ row }) => (
                  <StatusCell
                    label={capitalize(row.severity)}
                    color={severityColors[row.severity as SeverityType]}
                  />
                )
              },
              { key: 'message', name: 'Alert' },
              {
                key: 'status',
                name: 'Status',
                width: 150,
                render: ({ row }) => (
                  <StatusCell
                    label={capitalize(row.status)}
                    color={alertStatusColors[row.status as AlertStatusType]}
                  />
                )
              },
              {
                key: 'createdAt',
                name: 'Raised',
                width: 170,
                render: ({ row }) => <TimeAgoCell date={row.createdAt} />
              }
            ]}
            rows={alerts}
          />
        </>
      )}
      <Outlet />
    </SplitLayout>
  );
});

export default Device;
