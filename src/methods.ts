import { Schema } from 'koishi';
import {
  ClassConstructor,
  plainToClass,
  TransformOptions,
} from 'class-transformer';
import { SchemaOptions, SchemaOptionsDict } from './def';
import 'reflect-metadata';
import { SchemaKeysMetaKey, SchemaMetaKey } from './constants';
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

function getPropertySchemaFromOptions<PT>(options: SchemaOptions): Schema<PT> {
  let schema = getBasePropertySchemaFromOptions(options);
  if (options.dict) {
    schema = Schema.dict(schema);
  }
  if (options.array) {
    schema = Schema.array(schema);
  }
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
  const optionsDict = schemaOptionsFromClass(cl);
  if (!optionsDict) {
    return Schema.any();
  }
  return schemasFromDict<T>(optionsDict);
}

export function schemaTransform<T>(cl: ClassConstructor<T>, data: any): T {
  const validatedObj = Schema.validate(data, schemaFromClass(cl));
  return plainToClass(cl, validatedObj);
}
