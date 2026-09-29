import openapiTS, { astToString, OpenAPI3 } from 'openapi-typescript';
// import ts from "typescript";
import * as changeCase from 'change-case';
import { readFile } from 'fs/promises';
import {
  getSchema,
  getValuePath,
  jsonSchemaToZod,
  relativePath,
  writeFile
} from '../utils';
import { Conf, validConf } from './config';
import * as prettier from 'prettier';

const openapiGeneratedFileWarning = `
/* 
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------
*/
`;
interface ITsSchema {
  url: string;
  outPath: string;
}

export const tsSchema = async (options: ITsSchema) => {
  const { url, outPath } = options;
  const { data: schemaJson, error } = await getSchema(url);
  if (error) throw error.message;

  const ast = await openapiTS(schemaJson);
  const contents = astToString(ast);

  writeFile(
    relativePath(outPath),
    openapiGeneratedFileWarning.concat(...['\n', contents])
  );
  writeFile(relativePath('openapi.json'), JSON.stringify(schemaJson));
};

interface ITsSchema {
  confPath: string;
}

export const sdkGenByDomain = async (options: ITsSchema) => {
  const { confPath } = options;

  const confStr = await readFile(relativePath(confPath), {
    encoding: 'utf8'
  });
  const schemaStr = await readFile(relativePath('openapi.json'), {
    encoding: 'utf8'
  });

  const conf: Conf = JSON.parse(confStr);
  const schema: OpenAPI3 = JSON.parse(schemaStr);

  const { data, error } = validConf(conf);

  if (error) {
    console.error(error.issues);
    throw new Error('invalid features.json');
  }

  // return;
  const features = Object.keys(conf);

  for await (const feat of features) {
    const sdkContents = generateSDK(schema, feat);
    const path = conf[feat].path.front;
    const formattedContent = await prettier.format(sdkContents, {
      parser: 'typescript'
    });
    writeFile(relativePath(`${path}/__${feat}.g.__.ts`), formattedContent);
  }
};

const generateSDK = (schema: OpenAPI3, domain: string) => {
  const importLib = `

    'import { client, operations } from "@/core";\nimport { MaybeOptionalInit } from "openapi-fetch";\n import * as z from "zod";\n';`;
  let sdkContents = `${openapiGeneratedFileWarning}\n` + importLib;

  if (!schema.paths)
    throw new Error('there is no paths on the open api schema');

  Object.entries(schema.paths).forEach(([path, methods]) => {
    if (path.startsWith(`/api/${domain}`)) {
      Object.entries(methods).forEach(([method, details]) => {
        const { operationId } = details;
        const hasParameters =
          details.parameters && details.parameters.length > 0;
        const hasRequestBody = Boolean(details.requestBody);
        const args = hasParameters || hasRequestBody ? 'args' : 'args?';
        const functionName = changeCase.camelCase(
          operationId.replace(/_api.*$/, '')
        );
        if (hasRequestBody) {
          const pathToDTO = details.requestBody.content['application/json']
            .schema.$ref as string;
          const parts = pathToDTO.substring(1).split('/').slice(1);

          const jsonSchema = getValuePath(parts, schema);

          if (!jsonSchema) return;

          const zodSchema = jsonSchemaToZod(jsonSchema, schema);
          sdkContents += `
export const ${functionName}DTO = ${zodSchema}
                ;`;
        }

        sdkContents += `
export const ${functionName} = async (${args}:MaybeOptionalInit<operations, '${operationId}'> ) => { 
  return await client.${method.toUpperCase()}('${path}',{...args})
};`;
      });
    }
  });

  return sdkContents;
};
