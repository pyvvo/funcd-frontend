import {
  ContentLayout,
  HMDataGrid,
  IColumn,
  IReactiveFieldMeta,
  ReactiveForm,
  StatusCell,
  TimeAgoCell,
  TitleCell
} from '@funcd-dev/ui';
import {
  Button,
  Group,
  SegmentedControl,
  Stack,
  Switch,
  Text
} from '@mantine/core';
import { IconCheck, IconChecks } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  AlertRuleInputType,
  AlertStatusType,
  AlertType,
  SeverityType
} from '../api/contract';
import {
  alertStatusColors,
  capitalize,
  deviceTypeLabels,
  severityColors
} from '../common/display';
import Panel from '../common/panel';
import { AlertStoreType } from './alert.store';

interface IAlerts {
  store: AlertStoreType;
}

const emptyRule: AlertRuleInputType = {
  name: '',
  metric: 'temperature',
  operator: '>',
  threshold: 30,
  severity: 'warning',
  enabled: true
};

const ruleMeta: IReactiveFieldMeta<AlertRuleInputType>[] = [
  {
    name: 'rule',
    fields: [
      {
        fieldKey: 'name',
        label: 'Name',
        type: 'text',
        options: { required: 'A name is required' }
      },
      {
        fieldKey: 'metric',
        label: 'Metric',
        type: 'select',
        customProps: {
          data: Object.entries(deviceTypeLabels).map(([value, label]) => ({
            value,
            label
          }))
        }
      },
      {
        fieldKey: 'operator',
        label: 'When the value is',
        type: 'radio',
        customProps: {
          data: [
            { value: '>', label: 'Above' },
            { value: '<', label: 'Below' }
          ]
        }
      },
      {
        fieldKey: 'threshold',
        label: 'Threshold',
        type: 'number',
        options: { required: true }
      },
      {
        fieldKey: 'severity',
        label: 'Severity',
        type: 'select',
        customProps: {
          data: Object.keys(severityColors).map((value) => ({
            value,
            label: capitalize(value)
          }))
        }
      }
    ]
  }
];

const columns: IColumn<AlertType>[] = [
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
  {
    key: 'deviceName',
    name: 'Alert',
    render: ({ row }) => (
      <TitleCell title={row.message} subtitle={row.deviceName} />
    )
  },
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
];

const Alerts: FC<IAlerts> = observer((props) => {
  const { store } = props;
  const { alerts, rules, filter, selectedIds, isLoading } = store;
  const form = useForm<AlertRuleInputType>({ defaultValues: emptyRule });

  useEffect(() => {
    store.load();
    store.loadRules();
  }, [store]);

  const handleCreateRule = async (values: AlertRuleInputType) => {
    const created = await store.createRule({
      ...values,
      threshold: Number(values.threshold)
    });
    if (created) form.reset(emptyRule);
  };

  return (
    <ContentLayout
      aside={
        <>
          <Panel title="Alert rules">
            <Stack gap="md">
              {rules.map((rule) => (
                <Group key={rule.id} justify="space-between" wrap="nowrap">
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>
                      {rule.name}
                    </Text>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">
                        {deviceTypeLabels[rule.metric]} {rule.operator}{' '}
                        {rule.threshold}
                      </Text>
                      <StatusCell
                        label={capitalize(rule.severity)}
                        color={severityColors[rule.severity]}
                      />
                    </Group>
                  </Stack>
                  <Switch
                    checked={rule.enabled}
                    onChange={() => store.toggleRule(rule)}
                    aria-label={`Enable ${rule.name}`}
                  />
                </Group>
              ))}
            </Stack>
          </Panel>
          <Panel title="New rule">
            <form onSubmit={form.handleSubmit(handleCreateRule)}>
              <ReactiveForm meta={ruleMeta} form={form} />
              <Group justify="flex-end" mt="md">
                <Button type="submit">Create rule</Button>
              </Group>
            </form>
          </Panel>
        </>
      }>
      <SegmentedControl
        data={[
          { value: 'open', label: 'Open' },
          { value: 'acknowledged', label: 'Acknowledged' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'all', label: 'All' }
        ]}
        value={filter}
        onChange={(value) => store.setFilter(value as AlertStatusType | 'all')}
        style={{ alignSelf: 'flex-start' }}
      />
      <HMDataGrid
        withRowSelection
        withSorting
        rowKeyGetter={(row) => row.id}
        columns={columns}
        rows={alerts}
        rowHeight={60}
        headerRowHeight={44}
        maxRows={10}
        selectedRows={selectedIds}
        onSelectedRowsChange={store.setSelectedIds}
        emptyText={isLoading ? 'Loading alerts…' : 'No alert here'}
        selectionActions={
          <>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconCheck size={14} />}
              onClick={() => store.setStatus([...selectedIds], 'acknowledged')}>
              Acknowledge
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconChecks size={14} />}
              onClick={() => store.setStatus([...selectedIds], 'resolved')}>
              Resolve
            </Button>
          </>
        }
      />
    </ContentLayout>
  );
});

export default Alerts;
