import { NodeModel, NodeModels, sdk } from '@funcd-dev/lib';
import { IPyNode } from '@funcd-dev/ui';
import { notifications } from '@mantine/notifications';
import { makeAutoObservable } from 'mobx';

const _store = {
  data: [] as NodeModels,
  searchItems: [] as IPyNode[],
  secondsPassed: 0,
  setData: (data: NodeModels) => {
    _store.data = data;
  },
  loadNodes: async () => {
    const { data, error } = await sdk.listNodes();
    if (error) {
      notifications.show({
        title: error.type,
        message: error.message,
        color: 'yellow'
      });
    }
    _store.setSearchItems(_store._parseNodes(data ?? []));
    _store.setData(data ?? []);
  },

  //** search items methods */
  setSearchItems: (items: IPyNode[]) => {
    _store.searchItems = items;
  },

  //** utils */
  parseNode: (node: NodeModel): IPyNode => {
    const metadata = node.node_def.metadata;
    const annotations = metadata.annotations;
    const parameters =
      node.node_def.spec.properties.parameters.validation_schema.properties;

    // const parsedParameters = Object.keys(parameters).reduce(
    //   (acc, key) => {
    //     acc[key] = parameters[key]?.default ?? '';
    //     return acc;
    //   },
    //   {} as Record<string, any>
    // );
    const parsedParameters = Object.keys(parameters).reduce(
      (acc, key) => {
        acc[key] = {
          value: parameters[key]?.default ?? '',
          type: parameters[key]?.type ?? ''
        };
        return acc;
      },
      {} as Record<string, any>
    );

    return {
      id: node.id,
      type: annotations.ui as 'pyNode',
      data: {
        name: metadata.name,
        label: annotations.label,
        icon: annotations.icon,
        color: annotations.color,
        image: node.image,
        parameters: parsedParameters,
        actions: []
      }
    };
  },

  _parseNodes: (data: NodeModel[]) => {
    return data.map((node) => _store.parseNode(node));
  }
};

function nodeStoreFactory() {
  return makeAutoObservable(_store);
}

const nodeStore = nodeStoreFactory();
export type nodeStoreType = ReturnType<typeof nodeStoreFactory>;

export default nodeStore;
