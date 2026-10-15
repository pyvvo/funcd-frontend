import { makeAutoObservable } from 'mobx';
import api from '../api/client';
import { AlertType, DeviceType, StatsType } from '../api/contract';
import { notifyError } from '../common/display';

const _store = {
  stats: undefined as StatsType | undefined,
  openAlerts: [] as AlertType[],
  attention: [] as DeviceType[],
  isLoading: false,
  setLoading: (isLoading: boolean) => {
    _store.isLoading = isLoading;
  },
  setData: (
    stats: StatsType | undefined,
    openAlerts: AlertType[],
    attention: DeviceType[]
  ) => {
    _store.stats = stats;
    _store.openAlerts = openAlerts;
    _store.attention = attention;
  },
  load: async () => {
    _store.setLoading(true);
    const [stats, alerts, devices] = await Promise.all([
      api.getStats(),
      api.listAlerts({ query: { status: 'open' } }),
      api.listDevices({ query: { status: 'warning', limit: 5 } })
    ]);
    const error = stats.error ?? alerts.error ?? devices.error;
    if (error) {
      notifyError('Could not load the overview', error);
    }
    _store.setData(
      stats.data,
      alerts.data?.slice(0, 5) ?? [],
      devices.data?.items ?? []
    );
    _store.setLoading(false);
  }
};

function overviewStoreFactory() {
  return makeAutoObservable(_store);
}

const overviewStore = overviewStoreFactory();

export type OverviewStoreType = ReturnType<typeof overviewStoreFactory>;
export default overviewStore;
