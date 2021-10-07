import {
  DefineSchema,
  SchemaConf,
  schemaFromClass,
  schemaTransform,
} from '../src';
import { Schema } from 'koishi';

@SchemaConf({
  desc: 'my desc',
})
class B {
  @DefineSchema({ type: 'number', default: 2, desc: 'aaaaa' })
  aa: number;

  @DefineSchema({ type: 'boolean', default: true })
  bb: boolean;
}

@SchemaConf({
  desc: 'my base desc',
})
class A {
  @DefineSchema({ type: 'number', required: true })
  a: number;

  @DefineSchema({ type: 'string', default: 'shigma' })
  b: string;

  @DefineSchema({ type: 'string', array: true, default: ['foo', 'bar'] })
  c: string[];

  @DefineSchema({ type: B })
  bi: B;

  @DefineSchema({ type: B, array: true })
  biArr: B[];

  @DefineSchema({ type: B, dict: true, array: true })
  biDict: Record<string, B>[];
}

const schema = schemaFromClass(A);
console.log(JSON.stringify(schema, null, 2));

const testObject = {
  a: 4,
  bi: { aa: 3 },
  biArr: [{ aa: 4 }, { bb: false }],
  biDict: [{ cccc: { aa: 5 } }],
};

// const testValidate = Schema.validate(testObject, schema);

// console.log(JSON.stringify(testValidate, null, 2));
const testTransform = schemaTransform(A, testObject);
//console.log(JSON.stringify(testTransform, null, 2));
console.log(testTransform.bi instanceof B);
console.log(testTransform.biArr[0] instanceof B);
console.log(testTransform.biDict[0].cccc instanceof B);
