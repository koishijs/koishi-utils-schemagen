import { Schema } from 'koishi';
import { ClassConstructor } from 'class-transformer';

export type SchemaType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'any'
  | 'never'
  | ClassConstructor<any>;

export interface SchemaClassOptions {
  desc?: string;
  required?: boolean;
  hidden?: boolean;
  comment?: string;
  default?: any;
}

export interface SchemaOptions extends SchemaClassOptions {
  schema?: Schema<any>;
  dict?: boolean;
  array?: boolean;
  type?: SchemaType;
}

export type SchemaOptionsDict<T> = { [P in keyof T]?: SchemaOptions };
