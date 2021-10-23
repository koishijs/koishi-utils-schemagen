import 'reflect-metadata';

function TheProperty(): PropertyDecorator {
  return (obj, key) => {
    Reflect.defineMetadata('test1', 'www', obj);
    Reflect.defineMetadata('test', 'www', obj, key);
  };
}

class A {
  @TheProperty()
  foo: string;
}

const a = new A();
console.log(Reflect.getMetadata('test', A, 'foo'));
console.log(Reflect.getMetadata('test', a, 'foo'));
console.log(Reflect.getMetadata('test', a.constructor, 'foo'));
console.log(Reflect.getMetadata('test1', A));
console.log(Reflect.getMetadata('test1', a));
console.log(Reflect.getMetadata('test1', a.constructor));
