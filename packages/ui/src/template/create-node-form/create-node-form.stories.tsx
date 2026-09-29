import type { Meta, StoryObj } from '@storybook/react';
import CreateNodeForm from './create-node-form';
import { FormBuilder, ReactiveTextareaField } from '@/reactive-form';
import { IParameter } from './parameter-block';
import { IFormValues } from './useCreateNodeForm';

FormBuilder.defineWidget({
  name: 'textarea',
  component: ReactiveTextareaField
});
// ############################ Reactive form ######################

type Story = StoryObj<typeof CreateNodeForm>;

const meta: Meta<typeof CreateNodeForm> = {
  title: 'Template/CreateNodeForm',
  component: CreateNodeForm
};

export default meta;

const handleCreateNodeFormSubmit = (
  formValues: IFormValues,
  parameters: IParameter[],
  wasmFile: File | null
) => {
  // traitement des paramètres et formValues
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
        icon,
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

  console.log('✅ JSON prêt à être envoyé :', finalJson);
  console.log('📦 WASM prêt à être envoyé :', wasmFile);
};

export const _CreateNodeForm: Story = {
  args: {
    submitButtonText: 'Create Node',
    onSubmit: handleCreateNodeFormSubmit
  }
};
