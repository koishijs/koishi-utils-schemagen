import 'reflect-metadata';

function TheProperty(): PropertyDecorator {
  return (obj, key) => {
    Reflect.defineMetadata('test', 'www', obj.constructor, key);
  };
}

class A {
  @TheProperty()
  foo: string;
}

console.log(Reflect.getMetadata('test', A, 'foo'));
const a = new A();
console.log(Reflect.getMetadata('test', a.constructor, 'foo'));
