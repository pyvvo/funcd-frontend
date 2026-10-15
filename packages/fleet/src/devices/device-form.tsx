import { ContentLayout, IReactiveFieldMeta, ReactiveForm } from '@funcd-dev/ui';
import { Button, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { DeviceInputType } from '../api/contract';
import { deviceTypeLabels } from '../common/display';
import Panel from '../common/panel';
import { DeviceStoreType } from './device.store';

interface IDeviceForm {
  store: DeviceStoreType;
}

const emptyDevice: DeviceInputType = {
  name: '',
  type: 'temperature',
  siteId: 'lyon-warehouse',
  reportingIntervalSec: 60,
  tags: []
};

// Registers a device, or edits the one in the URL.
const DeviceForm: FC<IDeviceForm> = observer((props) => {
  const { store } = props;
  const { device, sites } = store;
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useForm<DeviceInputType>({ defaultValues: emptyDevice });

  useEffect(() => {
    store.loadSites();
    if (id) store.loadDevice(id);
  }, [store, id]);

  useEffect(() => {
    if (id && device?.id === id) {
      const { name, type, siteId, reportingIntervalSec, tags } = device;
      form.reset({ name, type, siteId, reportingIntervalSec, tags });
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [device, id]);

  const meta: IReactiveFieldMeta<DeviceInputType>[] = [
    {
      name: 'device',
      fields: [
        {
          fieldKey: 'name',
          label: 'Name',
          type: 'text',
          options: { required: 'A name is required' }
        },
        {
          fieldKey: 'type',
          label: 'Type',
          type: 'select',
          customProps: {
            data: Object.entries(deviceTypeLabels).map(([value, label]) => ({
              value,
              label
            }))
          }
        },
        {
          fieldKey: 'siteId',
          label: 'Site',
          type: 'select',
          customProps: {
            data: sites.map((site) => ({ value: site.id, label: site.name }))
          }
        },
        {
          fieldKey: 'reportingIntervalSec',
          label: 'Reporting interval (seconds)',
          type: 'number',
          options: { required: true, min: 10 }
        },
        {
          fieldKey: 'tags',
          label: 'Tags',
          type: 'multi-select',
          customProps: {
            data: ['critical', 'outdoor', 'battery', 'legacy']
          }
        }
      ]
    }
  ];

  const handleSubmit = async (values: DeviceInputType) => {
    const saved = await store.save(id, {
      ...values,
      reportingIntervalSec: Number(values.reportingIntervalSec)
    });
    if (saved) navigate(`/devices/${saved.id}`);
  };

  return (
    <ContentLayout>
      <Panel
        title={id ? `Edit ${device?.name ?? ''}` : 'Register a device'}
        maw={640}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ReactiveForm meta={meta} form={form} />
          <Group justify="flex-end" mt="lg">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">{id ? 'Save' : 'Register'}</Button>
          </Group>
        </form>
      </Panel>
    </ContentLayout>
  );
});

export default DeviceForm;
