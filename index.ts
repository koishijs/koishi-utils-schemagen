import { ClassType, RegisterSchema } from 'schemastery-gen';
import Schema from 'schemastery';
export * from 'schemastery-gen';

export function schemaFromClass<T>(cl: ClassType<T>): Schema<T> {
  if ((cl as Schema<T>).type) {
    return cl as Schema<T>;
  }
  return RegisterSchema()(cl);
}

export function schemaTransform<T>(cl: ClassType<T>, obj: any): T {
  return new cl(obj);
}
