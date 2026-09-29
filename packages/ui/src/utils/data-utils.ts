import { Flatten } from '@/types';

export const getValuePath = (paths: string[], obj: Record<string, any>) => {
  const keys = Object.keys(obj);
  if (keys.length) {
    const key = paths[0];
    const newVal = obj[key];
    const newPaths = paths.slice(1, paths.length);
    let tempVal: Record<string, any> | undefined;
    if (!newPaths.length && typeof newVal === 'object') {
      return newVal;
    }
    if (
      typeof newVal === 'object' &&
      newPaths.length &&
      !Array.isArray(newVal)
    ) {
      tempVal = getValuePath(newPaths, newVal) as Record<string, any>;
    }
    return tempVal;
  }

  return undefined;
};

export const flattenObj = <T extends Record<string, any>>(
  obj: T,
  parent?: string,
  res = {} as any,
  index = 0
): Flatten<T> => {
  index += 1;
  if (index > 5) {
    throw new Error('object is too deep, maximum authorized level is 5');
  }

  for (const key of Object.keys(obj)) {
    const propName = parent ? `${parent}.${key}` : key;
    const value = obj[key];

    if (
      value !== null &&
      typeof obj[key] === 'object' &&
      !Array.isArray(obj[key])
    ) {
      flattenObj(obj[key], propName, res, index);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
