import { Schema } from 'koishi';
import {
  ClassConstructor,
  plainToClass,
  TransformOptions,
} from 'class-transformer';
import { SchemaClassOptions, SchemaOptions, SchemaOptionsDict } from './def';
import 'reflect-metadata';
import { SchemaClassKey, SchemaKeysMetaKey, SchemaMetaKey } from './constants';
import _ from 'lodash';

function getBasePropertySchemaFromOptions(options: SchemaOptions) {
  if (options.schema) {
    return options.schema;
  }
  if (typeof options.type !== 'string') {
    return schemaFromClass(options.type);
  }
  switch (options.type as string) {
    case 'any':
      return Schema.any();
    case 'never':
      return Schema.never();
    case 'string':
      return Schema.string();
    case 'number':
      return Schema.number();
    case 'boolean':
      return Schema.boolean();
    default:
      return Schema.any();
  }
}

function applyOptionsToSchema(schema: Schema, options: SchemaClassOptions) {
  if (options.required != undefined) {
    schema._required = options.required;
  }
  if (options.hidden != undefined) {
    schema._hidden = options.hidden;
  }
  if (options.default != undefined) {
    schema._default = options.default;
  }
  if (options.comment != undefined) {
    schema._comment = options.comment;
  }
  if (options.desc != undefined) {
    schema.desc = options.desc;
  }
}

function getPropertySchemaFromOptions<PT>(options: SchemaOptions): Schema<PT> {
  let schema = getBasePropertySchemaFromOptions(options);
  if (options.dict) {
    schema = Schema.dict(schema);
  }
  if (options.array) {
    schema = Schema.array(schema);
  }
  applyOptionsToSchema(schema, options);
  return schema;
}

function schemasFromDict<T>(dict: SchemaOptionsDict<T>): Schema<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Schema.object<T>(
    _.mapValues(dict, (opt) => getPropertySchemaFromOptions(opt)),
  );
}

function schemaOptionsFromClass<T>(
  cl: ClassConstructor<T>,
): SchemaOptionsDict<T> {
  const keys: (keyof T)[] = Reflect.getMetadata(SchemaKeysMetaKey, cl);
  if (!keys) {
    return null;
  }
  const result: SchemaOptionsDict<T> = {};
  for (const key of keys) {
    const option: SchemaOptions = Reflect.getMetadata(
      SchemaMetaKey,
      cl,
      key as string | symbol,
    );
    result[key] = option;
  }
  return result;
}

export function schemaFromClass<T>(cl: ClassConstructor<T>): Schema<T> {
  let schema: Schema;
  const optionsDict = schemaOptionsFromClass(cl);
  if (!optionsDict) {
    schema = Schema.any();
  } else {
    schema = schemasFromDict<T>(optionsDict);
  }
  const extraOptions: SchemaClassOptions =
    Reflect.getMetadata(SchemaClassKey, cl) || {};
  applyOptionsToSchema(schema, extraOptions);
  return schema;
}

export function schemaTransform<T>(cl: ClassConstructor<T>, data: any): T {
  const validatedObj = Schema.validate(data, schemaFromClass(cl));
  return plainToClass(cl, validatedObj);
}
