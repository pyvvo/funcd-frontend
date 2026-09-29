import { CreateNodeInputSchema, NodeDef, NodeModels, sdk } from '@humaapi/lib';
import { IFormValues, IParameter } from '@humaapi/ui';
import { notifications } from '@mantine/notifications';
import { makeAutoObservable } from 'mobx';

const _store = {
  data: [] as NodeModels,
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
    _store.setData(data ?? []);
  },
  createNode: async (
    nodeDef: NodeDef,
    wasmFile: File | Blob,
    iconFile: File | Blob
  ) => {
    const { data, error } = await sdk.createNode({
      body: { node_def: nodeDef, wasm_file: wasmFile, icon: iconFile },
      // Send `node_def` as an `application/json` part, as the API has always
      // received it; the default serializer would send it as plain text.
      bodySerializer: (body: CreateNodeInputSchema) => {
        const formData = new FormData();
        formData.append(
          'node_def',
          new Blob([JSON.stringify(body.node_def)], {
            type: 'application/json'
          })
        );
        formData.append('wasm_file', body.wasm_file);
        formData.append('icon', body.icon);
        return formData;
      }
    });

    if (error) {
      console.error('Error creating node :', error);
      notifications.show({
        title: 'Creation error',
        message: error.message ?? 'Unknown error',
        color: 'red'
      });
      return;
    }

    await _store.loadNodes();
    console.log('Node created successfully:', data);

    notifications.show({
      title: 'Node created',
      message: `Node ${data.node_def.metadata.name} created successfully`,
      color: 'green'
    });

    return data;
  },

  //** utils */
  handleCreateNodeFormSubmit: async (
    formValues: IFormValues,
    parameters: IParameter[],
    wasmFile: File | null
  ) => {
    const { name, label, icon, color, version, description } = formValues;

    const properties: Record<string, any> = {};
    const requiredFields: string[] = [];

    parameters.forEach((param) => {
      if (!param.name) return;

      let parsedDefault: any = param.defaultValue;

      switch (param.type) {
        case 'number':
          parsedDefault = Number(param.defaultValue);
          break;
        case 'integer':
          parsedDefault = parseInt(param.defaultValue);
          break;
        case 'boolean':
          parsedDefault = param.defaultValue === 'true';
          break;
        case 'array':
        case 'object':
          try {
            parsedDefault = JSON.parse(param.defaultValue);
          } catch {
            parsedDefault = param.defaultValue;
          }
          break;
      }

      properties[param.name] = {
        default: parsedDefault,
        description: param.description,
        type: param.type
      };

      if (param.required) {
        requiredFields.push(param.name);
      }
    });

    const finalJson = {
      api_version: 'core.oam.dev/v1beta1',
      kind: 'ComponentDefinition',
      metadata: {
        name,
        annotations: {
          description,
          label,
          icon: '',
          color,
          ui: 'pyNode',
          version
        }
      },
      spec: {
        properties: {
          parameters: {
            validation_schema: {
              type: 'object',
              properties,
              required: requiredFields
            }
          }
        }
      }
    };
    if (!wasmFile) {
      throw new Error('WASM file is required to create a node.');
    }
    if (!icon) {
      throw new Error('Icon file is required to create a node.');
    }

    return await _store.createNode(finalJson, wasmFile, icon);
  }
};

function nodeRegistryStoreFactory() {
  return makeAutoObservable(_store);
}

const nodeRegistryStore = nodeRegistryStoreFactory();
export type nodeRegistryStoreType = ReturnType<typeof nodeRegistryStoreFactory>;

export default nodeRegistryStore;
