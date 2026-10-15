import {
  ContentLayout,
  IReactiveChartMeta,
  ReactiveDashboard,
  StatsRing,
  StatusCell,
  TimeAgoCell
} from '@funcd-dev/ui';
import { Anchor, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deviceTypeLabels, severityColors } from '../common/display';
import Panel from '../common/panel';
import { OverviewStoreType } from './overview.store';

interface IOverview {
  store: OverviewStoreType;
}

interface IChartData {
  activity: { hour: string; readings: number }[];
  byType: { type: string; count: number }[];
}

const chartMeta: IReactiveChartMeta<IChartData>[] = [
  {
    groupKey: 'fleet',
    charts: [
      {
        chartKey: 'activity',
        type: 'line',
        dataKey: 'activity',
        title: 'Readings over the last 24 hours',
        layout: { x: 0, y: 0, w: 8, minRows: 2, maxRows: 3 },
        customProps: {
          xKey: 'hour',
          series: [{ key: 'readings', name: 'Readings' }],
          smooth: true,
          area: true
        }
      },
      {
        chartKey: 'by-type',
        type: 'pie',
        dataKey: 'byType',
        title: 'Devices by type',
        layout: { x: 8, y: 0, w: 4, minRows: 2, maxRows: 3 },
        customProps: { nameKey: 'type', valueKey: 'count', donut: true }
      }
    ]
  }
];

const Overview: FC<IOverview> = observer((props) => {
  const { store } = props;
  const { stats, openAlerts, attention, isLoading } = store;

  useEffect(() => {
    store.load();
  }, [store]);

  const total = stats ? stats.online + stats.warning + stats.offline : 0;
  const share = (count: number) => (total ? (count / total) * 100 : 0);

  return (
    <ContentLayout
      pos="relative"
      header={
        stats && [
          <StatsRing
            key="online"
            label="Online"
            stats={`${stats.online} / ${total} devices`}
            progress={share(stats.online)}
            color="green"
            icon="up"
          />,
          <StatsRing
            key="warning"
            label="Needs attention"
            stats={`${stats.warning} devices`}
            progress={share(stats.warning)}
            color="orange"
            icon="down"
          />,
          <StatsRing
            key="offline"
            label="Offline"
            stats={`${stats.offline} devices`}
            progress={share(stats.offline)}
            color="red"
            icon="down"
          />,
          <StatsRing
            key="readings"
            label="Readings"
            stats={`${stats.readingsPerHour.toLocaleString()} / hour`}
            progress={100}
            color="blue"
            icon="up"
          />
        ]
      }
      aside={
        <>
          <Panel
            title="Open alerts"
            action={
              <Anchor component={Link} to="/alerts" size="sm">
                View all
              </Anchor>
            }>
            <Stack gap="sm">
              {openAlerts.map((alert) => (
                <Group key={alert.id} justify="space-between" wrap="nowrap">
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {alert.deviceName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {alert.message}
                    </Text>
                  </Stack>
                  <Stack gap={0} align="flex-end">
                    <StatusCell
                      label={alert.severity}
                      color={severityColors[alert.severity]}
                    />
                    <TimeAgoCell date={alert.createdAt} />
                  </Stack>
                </Group>
              ))}
            </Stack>
          </Panel>
          <Panel title="Low battery">
            <Stack gap="sm">
              {attention.map((device) => (
                <Group key={device.id} justify="space-between" wrap="nowrap">
                  <Anchor
                    component={Link}
                    to={`/devices/${device.id}`}
                    size="sm">
                    {device.name}
                  </Anchor>
                  <Text size="sm" c="orange" fw={600}>
                    {device.battery}%
                  </Text>
                </Group>
              ))}
            </Stack>
          </Panel>
        </>
      }>
      <LoadingOverlay visible={isLoading && !stats} />
      {stats && (
        <ReactiveDashboard
          data={{
            activity: stats.activity,
            byType: stats.byType.map((item) => ({
              type: deviceTypeLabels[item.type],
              count: item.count
            }))
          }}
          meta={chartMeta}
        />
      )}
    </ContentLayout>
  );
});

export default Overview;
