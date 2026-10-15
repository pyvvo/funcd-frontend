import { makeAutoObservable } from 'mobx';
import api from '../api/client';
import { SiteType } from '../api/contract';
import { notifyError } from '../common/display';

const _store = {
  sites: [] as SiteType[],
  setSites: (sites: SiteType[]) => {
    _store.sites = sites;
  },
  load: async () => {
    const { data, error } = await api.listSites();
    if (error) {
      notifyError('Could not load the sites', error);
    }
    _store.setSites(data ?? []);
  }
};

function siteStoreFactory() {
  return makeAutoObservable(_store);
}

const siteStore = siteStoreFactory();

export type SiteStoreType = ReturnType<typeof siteStoreFactory>;
export default siteStore;
