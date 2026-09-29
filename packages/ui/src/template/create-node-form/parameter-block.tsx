import {
  Box,
  Button,
  Fieldset,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
  NumberInput
} from '@mantine/core';
import { FC } from 'react';
import styles from './create-node-form.module.css';

export interface IParameter {
  name: string;
  defaultValue: string;
  type: string;
  description: string;
  required: boolean;
}

interface IParameterBlock {
  index: number;
  param: IParameter;
  onUpdate: <K extends keyof IParameter>(
    index: number,
    field: K,
    value: IParameter[K]
  ) => void;
  onDelete: () => void;
}

const typeParameterData = [
  { value: 'string', label: 'string' },
  { value: 'number', label: 'number' },
  { value: 'boolean', label: 'boolean' },
  { value: 'integer', label: 'integer' },
  { value: 'array', label: 'array' },
  { value: 'object', label: 'object' }
];

const ParameterBlock: FC<IParameterBlock> = ({
  index,
  param,
  onUpdate,
  onDelete
}) => {
  const renderDefaultInput = () => {
    switch (param.type) {
      case 'boolean':
        return (
          <Switch
            label="Default value"
            checked={param.defaultValue === 'true'}
            onChange={(e) =>
              onUpdate(
                index,
                'defaultValue',
                e.currentTarget.checked.toString()
              )
            }
          />
        );
      case 'number':
      case 'integer':
        return (
          <NumberInput
            label="Default value"
            value={param.defaultValue ? Number(param.defaultValue) : undefined}
            onChange={(value) =>
              onUpdate(index, 'defaultValue', value?.toString() || '')
            }
          />
        );
      case 'array':
      case 'object':
        return (
          <Textarea
            label="Default value (JSON)"
            placeholder='Ex: {"key": "value"}'
            value={param.defaultValue}
            onChange={(e) =>
              onUpdate(index, 'defaultValue', e.currentTarget.value)
            }
          />
        );
      default: // string
        return (
          <TextInput
            label="Default value"
            placeholder="Enter default value"
            value={param.defaultValue}
            onChange={(e) =>
              onUpdate(index, 'defaultValue', e.currentTarget.value)
            }
          />
        );
    }
  };

  return (
    <Box className={styles.parameterRoot} mt="md">
      <Fieldset legend={`Parameter ${index + 1}`} className={styles.fieldset}>
        <Stack gap={6}>
          <TextInput
            label="Name parameter"
            placeholder="Enter name"
            radius="md"
            required={param.required}
            value={param.name}
            onChange={(e) => onUpdate(index, 'name', e.currentTarget.value)}
          />
          <Switch
            label="Required"
            checked={param.required}
            onChange={(e) =>
              onUpdate(index, 'required', e.currentTarget.checked)
            }
          />
        </Stack>

        <Select
          label="Type parameter"
          placeholder="Select type"
          radius="md"
          data={typeParameterData}
          value={param.type}
          onChange={(value) => onUpdate(index, 'type', value || '')}
        />

        {renderDefaultInput()}

        <TextInput
          label="Description"
          placeholder="Insert description"
          radius="md"
          value={param.description}
          onChange={(e) =>
            onUpdate(index, 'description', e.currentTarget.value)
          }
        />

        <Button color="red" variant="light" onClick={onDelete} mt="sm">
          Delete
        </Button>
      </Fieldset>
    </Box>
  );
};

export default ParameterBlock;
