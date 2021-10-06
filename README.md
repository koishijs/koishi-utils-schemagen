# Koishi Utils Schemagen

在 Koishi.js 中，使用类装饰器定义 Schema。

## 安装

```
npm install koishi-utils-schemagen
```

## 使用

### 类 Schema 定义

```ts
// 使用装饰器定义 Schema。
export class Config {
  // 基本的数据类型
  @DefineSchema({ type: 'number', required: true })
  foo: number;

  @DefineSchema({ type: 'string', default: 'shigma' })
  bar: string;

  @DefineSchema({ type: 'boolean', default: true, hidden: true })
  baz: boolean;

  // 数组
  @DefineSchema({ type: 'string', array: true, default: ['foo', 'bar'] })
  ant: string[];

  // 也可以用定义好的 Schema
  @DefineSchema({ schema: Schema.string() })
  dream: string;

  // 上例的另一种快捷写法
  @UseSchema(Schema.string())
  sapnap: string;

  // 对象，这里引用另一个具有 Schema 定义类。
  @DefineSchema({ type: B })
  bi: B;

  // 上面的另一种写法
  @ObjectSchema(B)
  anotherB: B;

  // Dict
  @DefineSchema({ type: B, dict: true })
  biDict: Record<string, B>;

  // Dict 和字典组合会让字典在内而数组在外。此外 ObjectSchema 后面也可以指定属性。
  @ObjectSchema(B, { dict: true, array: true })
  biDictArr: Record<string, B>[];
}
```

### 使用

```ts
// 获取 Schema 定义
const schema = schemaFromClass(B);
// 直接获取 Config 对象并实例化，可以代替 Schema.validate 使用。对于嵌套类会进行循环实例化。
const config = schemaTransform(B, someObject);
```