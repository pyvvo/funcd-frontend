/* oxlint-disable import/prefer-default-export */
import { ReactiveFieldErrorType } from '@/reactive-form/reactive-fields/types';
import { getValuePath } from '@/utils';

export const getError = (fieldKey: string, errors: ReactiveFieldErrorType) => {
  let paths = fieldKey ? fieldKey.split('.') : [];
  if (!Number.isNaN(Number(paths[1]))) {
    paths = [fieldKey];
  }

  const hasErrors = errors ? getValuePath(paths, errors) : undefined;

  return hasErrors;
};

export const errorsArrayToObject = (
  errorsArray: ReactiveFieldErrorType[],
  listKey: string
) => {
  const transformedObject: Record<string, ReactiveFieldErrorType> = {};

  errorsArray.forEach((error, index) => {
    Object.keys(error).forEach((fieldKey) => {
      // Construct the key with the index as part of the path
      const newKey = `${listKey}.${index}.${fieldKey}`;

      // Assign the error object to the new key in the transformed object
      transformedObject[newKey] = error[fieldKey as never];
    });
  });

  return transformedObject;
};

export const getMantineError = (error: ReactiveFieldErrorType | undefined) => {
  const err =
    error && error.message ? (error.message as string) : Boolean(error);
  return err;
};
