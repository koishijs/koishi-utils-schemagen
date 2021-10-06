import { Schema } from 'koishi';
import { ClassConstructor } from 'class-transformer';

export type SchemaType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'any'
  | 'never'
  | ClassConstructor<any>;

export interface SchemaOptions {
  schema?: Schema<any>;
  desc?: string;
  required?: boolean;
  hidden?: boolean;
  comment?: string;
  default?: any;
  dict?: boolean;
  array?: boolean;
  type?: SchemaType;
}

export type SchemaOptionsDict<T> = { [P in keyof T]?: SchemaOptions };
