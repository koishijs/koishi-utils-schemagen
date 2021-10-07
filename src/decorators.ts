import { SchemaClassOptions, SchemaOptions } from './def';
import 'reflect-metadata';
import { SchemaClassKey, SchemaKeysMetaKey, SchemaMetaKey } from './constants';
import { Schema } from 'koishi';
import {
  ClassConstructor,
  Type,
  Transform,
  plainToClass,
} from 'class-transformer';
import _ from 'lodash';

function transformDict<T>(cl: ClassConstructor<T>, val: any, array: boolean) {
  if (array) {
    return (val as Record<string, any>[]).map((v) =>
      _.mapValues(v, (_v) => plainToClass(cl, _v)),
    );
  } else {
    return _.mapValues(val, (_v) => plainToClass(cl, _v));
  }
}

export function DefineSchema(options: SchemaOptions): PropertyDecorator {
  return (obj, key) => {
    const objClass = obj.constructor;
    const keys: string[] =
      Reflect.getMetadata(SchemaKeysMetaKey, objClass) || [];
    keys.push(key.toString());
    Reflect.defineMetadata(SchemaKeysMetaKey, keys, objClass);
    Reflect.defineMetadata(SchemaMetaKey, options, objClass, key);
    if (options.type && typeof options.type !== 'string') {
      const cl = options.type as ClassConstructor<any>;
      if (options.dict) {
        const transformDecorator = Transform(({ value }) =>
          transformDict(cl, value, options.array),
        );
        transformDecorator(obj, key);
      } else {
        const typeDecorator = Type(() => cl);
        typeDecorator(obj, key);
      }
    }
  };
}

export function SchemaConf(options: SchemaClassOptions): ClassDecorator {
  return (obj) => {
    const objClass = obj;
    Reflect.defineMetadata(SchemaClassKey, options, objClass);
  };
}

export function UseSchema(schema: Schema) {
  return DefineSchema({ schema });
}

export function ObjectSchema(
  cl: ClassConstructor<any>,
  options: SchemaOptions = {},
) {
  return DefineSchema({ type: cl, ...options });
}
