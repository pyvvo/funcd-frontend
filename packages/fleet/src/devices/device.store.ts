import { makeAutoObservable } from 'mobx';
import api from '../api/client';
import {
  AlertType,
  DeviceInputType,
  DevicePageType,
  DeviceStatusType,
  DeviceType,
  ReadingsType,
  SiteType
} from '../api/contract';
import { notifyDone, notifyError } from '../common/display';

type RangeType = '24h' | '7d';

const _store = {
  // The list: one page of devices, filtered.
  page: undefined as DevicePageType | undefined,
  sites: [] as SiteType[],
  search: '',
  siteId: null as string | null,
  status: null as DeviceStatusType | null,
  offset: 0,
  limit: 10,
  selectedIds: new Set<string>() as ReadonlySet<string>,
  isLoading: false,
  requestId: 0,
  // The open device.
  device: undefined as DeviceType | undefined,
  readings: undefined as ReadingsType | undefined,
  alerts: [] as AlertType[],
  range: '24h' as RangeType,

  setLoading: (isLoading: boolean) => {
    _store.isLoading = isLoading;
  },
  setPage: (page: DevicePageType | undefined) => {
    _store.page = page;
  },
  setSites: (sites: SiteType[]) => {
    _store.sites = sites;
  },
  setSelectedIds: (ids: ReadonlySet<string>) => {
    _store.selectedIds = ids;
  },
  setDevice: (device: DeviceType | undefined) => {
    _store.device = device;
  },
  setReadings: (readings: ReadingsType | undefined) => {
    _store.readings = readings;
  },
  setAlerts: (alerts: AlertType[]) => {
    _store.alerts = alerts;
  },
  siteName: (siteId: string) =>
    _store.sites.find((site) => site.id === siteId)?.name ?? siteId,

  loadSites: async () => {
    if (_store.sites.length) return;
    const { data, error } = await api.listSites();
    if (error) {
      notifyError('Could not load the sites', error);
    }
    _store.setSites(data ?? []);
  },
  load: async () => {
    // Only the latest request updates the list, as the search changes fast.
    const requestId = ++_store.requestId;
    _store.setLoading(true);
    const { data, error } = await api.listDevices({
      query: {
        search: _store.search,
        siteId: _store.siteId ?? undefined,
        status: _store.status ?? undefined,
        offset: _store.offset,
        limit: _store.limit
      }
    });
    if (requestId !== _store.requestId) return;
    if (error) {
      notifyError('Could not load the devices', error);
    }
    _store.setPage(data);
    _store.setLoading(false);
  },
  setFilters: (filters: {
    search?: string;
    siteId?: string | null;
    status?: DeviceStatusType | null;
  }) => {
    Object.assign(_store, filters, { offset: 0 });
    _store.load();
  },
  next: () => {
    _store.offset += _store.limit;
    _store.load();
  },
  previous: () => {
    _store.offset = Math.max(0, _store.offset - _store.limit);
    _store.load();
  },

  restart: async (ids: string[]) => {
    const results = await Promise.all(
      ids.map((id) => api.restartDevice({ id }))
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      notifyError('Could not restart', failed.error);
    } else {
      notifyDone('Restarted', `${ids.length} device(s) restarted`, 'blue');
    }
    _store.load();
  },
  remove: async (ids: string[]) => {
    const results = await Promise.all(
      ids.map((id) => api.deleteDevice({ id }))
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      notifyError('Could not delete', failed.error);
    } else {
      notifyDone('Deleted', `${ids.length} device(s) deleted`, 'red');
    }
    _store.setSelectedIds(new Set());
    _store.load();
  },

  loadDevice: async (id: string) => {
    _store.setDevice(undefined);
    const [device, alerts] = await Promise.all([
      api.getDevice({ id }),
      api.listAlerts({ query: { deviceId: id } })
    ]);
    if (device.error) {
      notifyError('Could not load the device', device.error);
    }
    _store.setDevice(device.data);
    _store.setAlerts(alerts.data ?? []);
    _store.loadReadings();
  },
  loadReadings: async () => {
    const { device, range } = _store;
    if (!device) return;
    const { data } = await api.getReadings({
      id: device.id,
      query: { range }
    });
    _store.setReadings(data);
  },
  setRange: (range: RangeType) => {
    _store.range = range;
    _store.loadReadings();
  },
  save: async (id: string | undefined, input: DeviceInputType) => {
    const { data, error } = id
      ? await api.updateDevice({ id, body: input })
      : await api.createDevice({ body: input });
    if (error) {
      notifyError('Could not save the device', error);
      return undefined;
    }
    notifyDone(
      id ? 'Device updated' : 'Device registered',
      data.name,
      id ? 'blue' : 'green'
    );
    _store.load();
    return data;
  }
};

function deviceStoreFactory() {
  return makeAutoObservable(_store);
}

const deviceStore = deviceStoreFactory();

export type DeviceStoreType = ReturnType<typeof deviceStoreFactory>;
export default deviceStore;
