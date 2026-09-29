import { useState } from 'react';

export interface IFormValues {
  name: string;
  label: string;
  icon: File | Blob | null;
  color: string;
  version: string;
  description: string;
}

export interface IParameter {
  name: string;
  defaultValue: string;
  type: string;
  description: string;
  required: boolean;
}

export const initialFormValues: IFormValues = {
  name: '',
  label: '',
  icon: null,
  color: '',
  version: '',
  description: ''
};

export const useCreateNodeForm = () => {
  const [formValues, setFormValues] = useState<IFormValues>(initialFormValues);
  const [parameters, setParameters] = useState<IParameter[]>([]);
  const [wasmFile, setWasmFile] = useState<File | null>(null);

  const updateFormValue = <K extends keyof IFormValues>(
    field: K,
    value: IFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const addParameter = () => {
    setParameters((prev) => [
      ...prev,
      {
        name: '',
        defaultValue: '',
        type: '',
        description: '',
        required: false
      }
    ]);
  };

  const updateParameter = <K extends keyof IParameter>(
    index: number,
    field: K,
    value: IParameter[K]
  ) => {
    setParameters((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const deleteParameter = (index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormValues(initialFormValues);
    setParameters([]);
    setWasmFile(null);
  };

  return {
    formValues,
    updateFormValue,
    parameters,
    addParameter,
    updateParameter,
    deleteParameter,
    wasmFile,
    setWasmFile,
    resetForm
  };
};
