import { makeAutoObservable, toJS } from 'mobx';
import { sdk, WorkflowModels } from '@humaapi/lib';

const _store = {
  data: [] as WorkflowModels,
  secondsPassed: 0,
  setData: (data: any) => {
    _store.data = data;
  },
  load: async () => {
    const { data, error } = await sdk.listWorkflows();
    if (error) {
      console.error(error);
    }
    _store.setData(data ?? []);
  },
  getRows: () => {
    return toJS(_store.data);
  },
  list: async () => {
    const data = await sdk.listWorkflows();
    return data;
  }
};

// Model the application state.
function workflowStoreFactory() {
  return makeAutoObservable(_store);
}

const workflowStore = workflowStoreFactory();
export type WorkflowStoreType = ReturnType<typeof workflowStoreFactory>;

export default workflowStore;
