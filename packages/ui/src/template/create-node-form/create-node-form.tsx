import {
  Box,
  Button,
  ColorInput,
  FileInput,
  Stack,
  TextInput
} from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import ParameterBlock from './parameter-block';
import { useCreateNodeForm } from './useCreateNodeForm';

interface ICreateNodeForm {
  submitButtonText: string;
  onSubmit: (
    formValues: ReturnType<typeof useCreateNodeForm>['formValues'],
    parameters: ReturnType<typeof useCreateNodeForm>['parameters'],
    wasmFile: File | null
  ) => void;
}

const CreateNodeForm: FC<ICreateNodeForm> = ({
  submitButtonText,
  onSubmit
}) => {
  const {
    wasmFile,
    parameters,
    formValues,
    updateFormValue,
    addParameter,
    updateParameter,
    deleteParameter,
    setWasmFile
  } = useCreateNodeForm();
  const [iconUrl, setIconUrl] = useState('');

  // One preview URL per file, released when the file changes or the form
  // unmounts; creating it in render leaked a new URL on every keystroke.
  useEffect(() => {
    if (!formValues.icon) return;
    const url = URL.createObjectURL(formValues.icon);
    setIconUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [formValues.icon]);

  const handleSubmit = () => {
    onSubmit(formValues, parameters, wasmFile);
  };

  return (
    <Box p={4}>
      <Stack gap={8}>
        <TextInput
          label="Name"
          required
          value={formValues.name}
          onChange={(e) => updateFormValue('name', e.currentTarget.value)}
        />
        <TextInput
          label="Label"
          required
          value={formValues.label}
          onChange={(e) => updateFormValue('label', e.currentTarget.value)}
        />
        <FileInput
          label="Icon"
          description="Icon for the node png or jpg"
          required
          accept="image/png,image/jpeg"
          value={formValues.icon as File | null}
          onChange={(file) => updateFormValue('icon', file)}
        />
        {formValues.icon && iconUrl && (
          <img
            src={iconUrl}
            alt="Preview icon"
            style={{
              width: 64,
              height: 64,
              marginTop: '8px',
              objectFit: 'contain'
            }}
          />
        )}
        <ColorInput
          label="Color"
          required
          value={formValues.color}
          onChange={(color) => updateFormValue('color', color)}
        />
        <FileInput
          label="Wasm File"
          required
          value={wasmFile}
          onChange={setWasmFile}
          accept=".wasm"
        />
        <TextInput
          label="Version"
          value={formValues.version}
          onChange={(e) => updateFormValue('version', e.currentTarget.value)}
        />
        <TextInput
          label="Description"
          value={formValues.description}
          onChange={(e) =>
            updateFormValue('description', e.currentTarget.value)
          }
        />
      </Stack>

      <Button variant="light" onClick={addParameter} mt="md">
        Add Parameter
      </Button>

      {parameters.map((param, index) => (
        <ParameterBlock
          key={index}
          index={index}
          param={param}
          onUpdate={updateParameter}
          onDelete={() => deleteParameter(index)}
        />
      ))}

      <Button fullWidth mt={50} onClick={handleSubmit}>
        {submitButtonText}
      </Button>
    </Box>
  );
};

export default CreateNodeForm;
