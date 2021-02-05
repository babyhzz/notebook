# 基础

## 接口

**可选属性**

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}
```

**只读属性**

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}
```

最简单判断该用`readonly`还是`const`的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 `const`，若做为属性则使用`readonly`。

**函数类型**

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

**可索引的类型**

```ts
interface StringArray {
  [index: number]: string;
}
```

