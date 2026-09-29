import axios from 'axios';
import * as fs from 'fs/promises';
import { OpenAPI3 } from 'openapi-typescript';
import ora from 'ora';
import * as p from 'path';

export const yellow = '\x1b[33m%s\x1b[0m';
export const blue = '\x1b[34m';
export const projectDir = process.cwd();
export const relativePath = (path: string) => p.join(projectDir, path);

type BaseError = {
  code: string;

  message: string;

  errno: number;

  syscall: string;
} & unknown;

type Data = Parameters<typeof fs.writeFile>[1];

type Options = Parameters<typeof fs.writeFile>[2];

export const response = <T>(data: T) => ({
  data,

  error: undefined
});

export const errorResponse = <T>(error: T) => ({
  data: undefined,

  error
});

const options: Options = {
  encoding: 'utf8',

  flag: 'w', // https://nodejs.org/api/fs.html#file-system-flags
  mode: 0o666 // File Accessibility => https://betterprogramming.pub/node-js-fs-module-check-file-accessibility-appending-data-and-changing-permissions-dbce0f2b373c
};

export const writeFile = async (pathWriteFile: string, data: Data) => {
  try {
    await fs.writeFile(pathWriteFile, data, options);

    console.log(blue, `${pathWriteFile} have been updated`);

    const Responsedata = { done: true };

    return response(Responsedata);
  } catch (err) {
    return errorResponse(<BaseError>err);
  }
};

export const createDir = async (pathWriteFile: string) => {
  try {
    await fs.mkdir(pathWriteFile, { recursive: true });

    const data = { done: true };

    console.log(blue, ` ${pathWriteFile} was created`);

    return response(data);
  } catch (err) {
    return errorResponse(<BaseError>err);

    // throw new Error(err);
  }
};

export const removeFileOrDir = async (pathWriteFile: string) => {
  try {
    await fs.rm(pathWriteFile, { recursive: true, force: true });

    const data = { done: true };

    // console.log("file or dir have been removed");
    return response(data);
  } catch (err) {
    return errorResponse(<BaseError>err);
  }
};

export const getSchema = async (url: string) => {
  try {
    const res = await axios.get(url);
    if (!(res.data && Boolean(res.data.openapi))) {
      throw Error('the returned payload is not a openapi schema');
    }
    return response(res.data as OpenAPI3);
  } catch (err) {
    return errorResponse(<BaseError>err);
  }
};

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

/*
export const jsonSchemaToZod = (schema: ObjectSubtype) => {
  const { required, type, properties } = schema;
  let zodSchemaParts: string[] = [];

  for (const key in properties) {
    const item = properties[key] as SchemaObject;

    if (!item.anyOf && !item.type) {
      continue;
    }

    if (item.anyOf) {
      const anyOf = item.anyOf as SchemaObject[];
      const isOptional = Boolean(anyOf.find((i) => i.type === "null"));
      const type = anyOf.filter((i) => i.type !== "null")[0].type;
      zodSchemaParts.push(
        ${key}: ${typeResolver[type as PrimitiveType]}${
          isOptional ? ".nullish()" : ""
        }
      );

      continue;
    }

    if ((item as ArraySubtype).items) {
      const { type, items } = item as ArraySubtype;
      const isArray = Array.isArray(items);
      if (isArray) {
        continue;
      }
      const { type: itemType } = items as SchemaObject;

      zodSchemaParts.push(
        ${key}: ${typeResolver[itemType as PrimitiveType]}${
          type === "array" ? ".array().default([])" : ""
        }
      );

      continue;
    }

    zodSchemaParts.push(${key}: ${typeResolver[item.type as PrimitiveType]});
  }
  return z.${type}({\n  ${zodSchemaParts.join(",\n  ")}\n});
};



type PrimitiveType =
  | "string"
  | "number"
  | "integer"
  | "array"
  | "boolean"
  | "null"
  | "object";
const typeResolver: Record<PrimitiveType, string> = {
  string: "z.string().default('')",
  boolean: "z.boolean().default(false)",
  array: "z.array()",
  number: "z.number()",
  object: "z.object()",
  null: "z.nullable()",
  integer: "z.number().int()",
};

*/

/**
 * Performs an asynchronous action with loading spinner feedback.
 *
 * @param action A function that returns a Promise, representing the asynchronous operation.
 * @param args Additional arguments passed to the action function.
 */
export const act = async (
  action: (...args: any[]) => Promise<void>,
  ...args: any[]
): Promise<void> => {
  const parentName = args[1].parent._name;
  const commandName = args[1]._name;
  const actionName = `${parentName} ${commandName}`;
  const spinner = ora({
    text: `Processing ${actionName} ...`,
    color: 'blue'
  }).start();

  try {
    await action(...args);
    spinner.succeed(`${actionName} successfully completed`);
  } catch (error: any) {
    spinner.fail(`Error performing ${actionName} - ${error.message}`);
    process.exit(1); // Exit with an error code
  }
};
