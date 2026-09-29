import { IActionsHandlersParams, useHmFlowChildrenDeps } from '@/hm-flow';
import {
  Box,
  Group,
  Image,
  Input,
  NumberInput,
  Stack,
  TextInput
} from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import styles from './node-editor.module.css';

interface IPreviewToEditNodeProps {
  onUpdateNode: (params: IActionsHandlersParams) => void;
}

interface IParameter {
  type: 'string' | 'number' | 'boolean' | 'integer' | 'array' | 'object';
  value: any;
}

const NodeEditor: FC<IPreviewToEditNodeProps> = (props) => {
  const { onUpdateNode } = props;
  const { deps } = useHmFlowChildrenDeps();
  const { setCurrentNode, currentNode } = deps;
  const [localData, setLocalData] = useState<any>(currentNode?.data || {});

  useEffect(() => {
    setLocalData(currentNode?.data || {});
  }, [currentNode?.data]);

  if (!currentNode || !currentNode.data) {
    console.warn('currentNode ou ses données ne sont pas disponibles.');
    return null;
  }

  const handleLabelChange = (value: string) => {
    const newData = { ...localData, label: value };
    setLocalData(newData);
    setCurrentNode((prev: any) => ({
      ...prev,
      data: newData
    }));
  };

  const handleParamChange = (name: string, value: any) => {
    const newParams = {
      ...localData.parameters,
      [name]: {
        ...localData.parameters[name],
        value: parseValueByType(localData.parameters[name].type, value)
      }
    };

    const newData = { ...localData, parameters: newParams };
    setLocalData(newData);
    setCurrentNode((prev: any) => ({
      ...prev,
      data: newData
    }));
  };

  const handleBlur = () => {
    try {
      onUpdateNode({ node: currentNode as any, deps });
    } catch (error) {
      console.error("Erreur lors de l'appel à updateNode :", error);
    }
  };

  return (
    <Box className={styles.nodeEditor}>
      <Group gap={8} className={styles.label}>
        <Input
          leftSection={
            <Image
              src={localData.icon}
              alt={localData.label}
              className={styles.icon}
            />
          }
          value={localData.label}
          classNames={{ input: styles.input }}
          onChange={(event) => handleLabelChange(event.currentTarget.value)}
          onBlur={handleBlur}
          placeholder="Enter node label"
          radius="md"
        />
      </Group>

      {localData.parameters && Object.keys(localData.parameters).length > 0 && (
        <Stack mt={8} gap={4}>
          {Object.entries(localData.parameters as IParameter).map(
            ([name, param]) => {
              const isNumber =
                param.type === 'number' || param.type === 'integer';
              return isNumber ? (
                <NumberInput
                  key={name}
                  label={name}
                  value={param.value}
                  onChange={(val) => handleParamChange(name, val)}
                  onBlur={handleBlur}
                  radius="md"
                />
              ) : (
                <TextInput
                  key={name}
                  label={name}
                  value={String(param.value)}
                  onChange={(event) =>
                    handleParamChange(name, event.currentTarget.value)
                  }
                  onBlur={handleBlur}
                  radius="md"
                />
              );
            }
          )}
        </Stack>
      )}
    </Box>
  );
};

export default NodeEditor;

const parseValueByType = (type: string, value: any) => {
  switch (type) {
    case 'number':
      return Number(value);
    case 'string':
      return String(value);
    case 'boolean':
      return value === 'true' || value === true;
    case 'integer':
      return value ? parseInt(value, 10) : 0;
    case 'array':
      try {
        return JSON.parse(value);
      } catch {
        console.error('Invalid array format');
        return [];
      }
    case 'object':
      try {
        return JSON.parse(value);
      } catch {
        console.error('Invalid object format');
        return {};
      }
    default:
      return value;
  }
};
