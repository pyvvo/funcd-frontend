import type { IHmFlowData } from '@funcd-dev/ui';
import { makeAutoObservable } from 'mobx';
import api from '../api/client';
import { AutomationType } from '../api/contract';
import { notifyDone, notifyError } from '../common/display';

const _store = {
  automations: [] as AutomationType[],
  automation: undefined as AutomationType | undefined,
  setAutomations: (automations: AutomationType[]) => {
    _store.automations = automations;
  },
  setAutomation: (automation: AutomationType | undefined) => {
    _store.automation = automation;
  },
  load: async () => {
    const { data, error } = await api.listAutomations();
    if (error) {
      notifyError('Could not load the automations', error);
    }
    _store.setAutomations(data ?? []);
  },
  loadOne: async (id: string) => {
    _store.setAutomation(undefined);
    const { data, error } = await api.getAutomation({ id });
    if (error) {
      notifyError('Could not load the automation', error);
    }
    _store.setAutomation(data);
  },
  // The editor's nodes carry their actions (functions and icons): only the
  // data that describes the flow is saved.
  save: async (flow: IHmFlowData) => {
    const { automation } = _store;
    if (!automation) return;
    const { data, error } = await api.updateAutomation({
      id: automation.id,
      body: {
        name: flow.metadata.name,
        description: flow.metadata.description ?? '',
        enabled: automation.enabled,
        flow: {
          nodes: flow.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: { ...node.data, actions: [] }
          })),
          edges: flow.edges.map(({ id, source, target, animated }) => ({
            id,
            source,
            target,
            animated
          }))
        }
      }
    });
    if (error) {
      notifyError('Could not save the automation', error);
      return;
    }
    notifyDone('Automation saved', data.name, 'blue');
    _store.setAutomation(data);
  },
  run: async () => {
    const { automation } = _store;
    if (!automation) return;
    const { error } = await api.runAutomation({ id: automation.id });
    if (error) {
      notifyError('Could not run the automation', error);
      return;
    }
    notifyDone('Automation triggered', automation.name, 'green');
  },
  remove: async (id: string) => {
    const { error } = await api.deleteAutomation({ id });
    if (error) {
      notifyError('Could not delete the automation', error);
      return;
    }
    notifyDone('Automation deleted', id, 'red');
    _store.load();
  }
};

function automationStoreFactory() {
  return makeAutoObservable(_store);
}

const automationStore = automationStoreFactory();

export type AutomationStoreType = ReturnType<typeof automationStoreFactory>;
export default automationStore;
