import { makeAutoObservable } from 'mobx';
import api from '../api/client';
import {
  AlertRuleInputType,
  AlertRuleType,
  AlertStatusType,
  AlertType
} from '../api/contract';
import { notifyDone, notifyError } from '../common/display';

type FilterType = AlertStatusType | 'all';

const _store = {
  alerts: [] as AlertType[],
  rules: [] as AlertRuleType[],
  filter: 'open' as FilterType,
  selectedIds: new Set<string>() as ReadonlySet<string>,
  isLoading: false,
  setLoading: (isLoading: boolean) => {
    _store.isLoading = isLoading;
  },
  setAlerts: (alerts: AlertType[]) => {
    _store.alerts = alerts;
  },
  setRules: (rules: AlertRuleType[]) => {
    _store.rules = rules;
  },
  setSelectedIds: (ids: ReadonlySet<string>) => {
    _store.selectedIds = ids;
  },
  load: async () => {
    _store.setLoading(true);
    const { data, error } = await api.listAlerts({
      query: { status: _store.filter === 'all' ? undefined : _store.filter }
    });
    if (error) {
      notifyError('Could not load the alerts', error);
    }
    _store.setAlerts(data ?? []);
    _store.setLoading(false);
  },
  setFilter: (filter: FilterType) => {
    _store.filter = filter;
    _store.setSelectedIds(new Set());
    _store.load();
  },
  setStatus: async (ids: string[], status: 'acknowledged' | 'resolved') => {
    const call =
      status === 'acknowledged' ? api.acknowledgeAlert : api.resolveAlert;
    const results = await Promise.all(ids.map((id) => call({ id })));
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      notifyError('Could not update the alerts', failed.error);
    } else {
      notifyDone(`Alerts ${status}`, `${ids.length} alert(s)`, 'blue');
    }
    _store.setSelectedIds(new Set());
    _store.load();
  },
  loadRules: async () => {
    const { data, error } = await api.listAlertRules();
    if (error) {
      notifyError('Could not load the rules', error);
    }
    _store.setRules(data ?? []);
  },
  toggleRule: async (rule: AlertRuleType) => {
    const { id, ...input } = rule;
    const { error } = await api.updateAlertRule({
      id,
      body: { ...input, enabled: !rule.enabled }
    });
    if (error) {
      notifyError('Could not update the rule', error);
    }
    _store.loadRules();
  },
  createRule: async (input: AlertRuleInputType) => {
    const { data, error } = await api.createAlertRule({ body: input });
    if (error) {
      notifyError('Could not create the rule', error);
      return false;
    }
    notifyDone('Rule created', data.name, 'green');
    _store.loadRules();
    return true;
  }
};

function alertStoreFactory() {
  return makeAutoObservable(_store);
}

const alertStore = alertStoreFactory();

export type AlertStoreType = ReturnType<typeof alertStoreFactory>;
export default alertStore;
