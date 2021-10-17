import 'reflect-metadata';

function LogType(): PropertyDecorator {
  return (target, key) => {
    const t = Reflect.getMetadata('design:type', target, key);
    console.log(key, t, typeof t, t.toString());
  };
}

class B<T> {
  foo: T;
}

class A {
  @LogType()
  foo: string;
  @LogType()
  bar: number;
  @LogType()
  a: Date;
  @LogType()
  m: Map<string, any>;
  @LogType()
  s: Set<any>;
  @LogType()
  b: B<string>;
  @LogType()
  c: boolean;
  @LogType()
  d: B<any>[];
  @LogType()
  aaa: any;
}
