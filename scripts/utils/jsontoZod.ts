import {
  ArraySubtype,
  ObjectSubtype,
  OpenAPI3,
  ReferenceObject,
  SchemaObject,
  StringSubtype
} from 'openapi-typescript';
import { getValuePath } from './utils';

type PrimitiveType =
  | 'string'
  | 'number'
  | 'integer'
  | 'array'
  | 'boolean'
  | 'null'
  | 'object'
  | 'enum';

const typeResolver: Record<PrimitiveType, string> = {
  string: 'z.string()',
  boolean: 'z.boolean()',
  array: 'z.array()',
  number: 'z.number()',
  object: 'z.object()',
  null: 'z.nullable()',
  integer: 'z.number().int()',
  enum: 'z.enum()'
};

const defaultResolver: Record<PrimitiveType, any> = {
  string: '',
  boolean: false,
  array: [],
  number: 0,
  object: '{}',
  null: 'null',
  integer: '0',
  enum: ''
};

const generateEnumField = (
  resolvedSchema: StringSubtype & { title: string },
  key: string,
  defaultValue: string
) => {
  const { enum: enumValues } = resolvedSchema;
  const enumValuesString = JSON.stringify(enumValues);
  const defaultEnum = !defaultValue
    ? ''
    : `.default(${JSON.stringify(defaultValue)})`;

  return `${key}: ${typeResolver['enum' as PrimitiveType].replace(')', `(${enumValuesString})`)}${defaultEnum}`;
};

// Updated handleAllOfCase function to handle enums and default values
const handleAllOfCase = (
  key: string,
  allOf: SchemaObject[],
  schema: OpenAPI3,
  defaultVal: any
): string | null => {
  // Handle reference case (e.g., $ref)

  const refSchema = allOf.find(
    (i) => (i as any).$ref
  ) as unknown as ReferenceObject;
  const resolvedSchema = resolveRef(refSchema.$ref, schema);

  if (!resolvedSchema) {
    throw new Error('Resolved schema is empty');
  }

  const isEnum = Object.prototype.hasOwnProperty.call(resolvedSchema, 'enum');
  //const isEnum = Object.hasOwn(resolvedSchema, "enum");

  if (isEnum) {
    return generateEnumField(resolvedSchema, key, defaultVal);
  }

  return '';
};

// Helper function to handle 'anyOf' case
const handleAnyOfCase = (
  key: string,
  anyOf: SchemaObject[],
  schema: OpenAPI3
): string | null => {
  // const isOptional = Boolean(anyOf.find((i) => i.type === "null"));
  const validType = anyOf.find((i) => i.type !== 'null' || i['$ref']);

  if (validType && validType.type) {
    // If 'items' exists within 'anyOf', handle as ArraySubtype
    if ((validType as ArraySubtype).items) {
      return handleArraySubtype(key, validType as ArraySubtype, schema);
    }

    // Check for default value in validType
    const defaultValue =
      validType.default !== undefined
        ? validType.default
        : defaultResolver[validType.type as PrimitiveType];

    return `${key}: ${typeResolver[validType.type as PrimitiveType]}.default(${JSON.stringify(defaultValue)})`;

    // return ${key}: ${typeResolver[validType.type as PrimitiveType]}.default(${JSON.stringify(defaultValue)})${
    //   isOptional ? ".nullish()" : ""
    // };
  } else if (validType && (validType as any).$ref) {
    const ref = (validType as any).$ref;
    const resolvedSchema = resolveRef(ref, schema);
    const isEnum = Object.prototype.hasOwnProperty.call(resolvedSchema, 'enum');
    //const isEnum = Object.hasOwn(resolvedSchema, "enum");

    if (isEnum) {
      return generateEnumField(resolvedSchema, key, defaultResolver['enum']);
    }

    return '';
  }

  return '';
};

// Helper function to handle 'items' for ArraySubtype
const handleArraySubtype = (
  key: string,
  arraySubtype: ArraySubtype & { default?: any },
  schema: OpenAPI3
): string => {
  const { type, items, default: defaultValue } = arraySubtype;
  const isArray = Array.isArray(items);

  if (!isArray && type === 'array') {
    const { type: itemType, $ref } = items as SchemaObject & { $ref?: string };

    const finalDefault =
      defaultValue !== undefined ? defaultValue : defaultResolver['array'];
    if ($ref) {
      const resolvedSchema = resolveRef($ref, schema);
      const result = jsonSchemaToZod(resolvedSchema, schema); // Recursively resolve the referenced schema

      const zodType = `${result}.array().default(${JSON.stringify(finalDefault)})`;
      return `${key}: ${zodType}`;
    }

    const zodType = ` ${typeResolver[itemType as PrimitiveType]}.array().default(${JSON.stringify(finalDefault)})`;
    return `${key}: ${zodType}`;

    // return ${key}: ${zodType}${isOptional ? ".nullish()" : ""};
  }

  return '';
};

const resolveRef = (ref: string, schema: any) => {
  const parts = ref.substring(2).split('/'); // Split by '/' and ignore '#/'
  return getValuePath(parts, schema);
};

export const jsonSchemaToZod = (
  schema: ObjectSubtype,
  openAPischema: OpenAPI3
) => {
  const { type, properties } = schema;
  if (!properties) {
    throw new Error('No properties found in the schema');
  }

  const zodSchemaParts = Object.entries(properties).reduce(
    (acc, [key, item]) => {
      const schemaItem = item as SchemaObject;
      const isUnknowType =
        !schemaItem.allOf && !schemaItem.anyOf && !schemaItem.type;

      if (isUnknowType) {
        return acc;
      }

      // Use the helper function for 'anyOf' case
      if (schemaItem.anyOf) {
        const result = handleAnyOfCase(
          key,
          schemaItem.anyOf as SchemaObject[],
          openAPischema
        );
        if (result) {
          acc.push(result);
        }
        return acc;
      }

      // Use the helper function for 'anyOf' case
      if (schemaItem.allOf) {
        const result = handleAllOfCase(
          key,
          schemaItem.allOf as SchemaObject[],
          openAPischema,
          schemaItem.default
        );
        if (result) {
          acc.push(result);
        }
        return acc;
      }

      // Use the helper function for 'items' case
      if ((schemaItem as ArraySubtype).items) {
        const result = handleArraySubtype(
          key,
          schemaItem as ArraySubtype,
          openAPischema
        );
        if (result) {
          acc.push(result);
        }
        return acc;
      }

      // Check for default value in schemaItem
      const defaultValue =
        schemaItem.default !== undefined
          ? schemaItem.default
          : defaultResolver[schemaItem.type as PrimitiveType];

      // Default case: directly resolve the type
      acc.push(
        ` ${key}: ${typeResolver[schemaItem.type as PrimitiveType]}.default(${JSON.stringify(defaultValue)})`
      );
      return acc;
    },
    [] as string[]
  );

  return `z.${type}({\n  ${zodSchemaParts.join(',\n  ')}\n})`;
};
