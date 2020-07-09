#### 数字转字符串

加上一个空字符即可

```js
const a = 1;
const b = 1 + "";
```

#### 字符串转数字

使用加法运算发

```js
const a = "15";
const b = +a; // 15
const c = true;
const d = +c; // 1
```

#### 过滤重复值

使用Set + Array

```js
let arr = [1, 3, 4, 5, 1, 4];
const uniArr = [...new Set(arr)];
```

#### 幂运算操作符

替代`Math.pow(m, n)`

```js
const b = m ** n;
```

#### 数字取整

可以直接 `| 0`进行操作，因为位运算会先转换成整型

```js
const num = "13.3333";
const n = num | 0;
```

其他常见取整方法

```js
Math.trunc(122.222) // 12
Math.round() // 四舍五入
Math.ceil() // 向上取整
Math.floor() // 向下取整
```



#### nullish运算符 ？？

当前面为null或者undefined时，则返回后面的值，注意这个与 || 或运算符的区别（falsy）

```js
let a = null;
const b = a ?? "default";
```

#### 可选链 optional-chaining

前面为null或者undefined，返回undefined，否则调用表达式。属性或者函数都可以使用。

```js
const obj = {
  foo: {
    bar: {
    	bat: 36, 
      baz() {
        return 42;
      },
    },
  },
};

const bat = obj?.foo?.bar?.bat; // 36
const baz = obj?.foo?.bar?.baz(); // 42
```

#### JS基本类型与其包装类型

值类型有：number, string, boolean, undefined, null, symbol 6个

包装类型是特殊的引用类型。每当读取一个基本类型值的时候，**后台就会创建一个对应的基本包装类型**的对象，从而可能调用一些方法来操作这些数据。 

基本包装类型：Boolean,Number,String

#### 对象属性遍历

**for...in**: 遍历对象自身和继承的可枚举属性（不含Symbol属性）

**Object.keys(obj)**：返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含Symbol），同类型还有**Object.entries**、**Object.values**

**Object.getOwnPropertyNames(obj)**： 返回一个由指定对象的所有**自身**属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组 

**Object.getOwnPropertySymbols(obj)**：返回一个数组，包含对象自身的所有Symbol属性

>  在JavaScript中，对象的属性分为可枚举和不可枚举之分，它们是由属性的enumerable值决定的。 
>
> ```
> Object.defineProperty(kxy, "sex", {
>     value: "female",
>     enumerable: false
> });
> ```

#### Object.is 和===

都是比较两个值是否严格相等，只有个别有区别

```js
+0===-0 //true
NaN===NaN //false
Object.is(+0,-0); //false
Object.is(NaN,NaN); //true
```

#### 柯里化

curry 的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```js
var add = function(x) {
  return function(y) {
   return x + y;
  };
};
var increment = add(1);
var addTen = add(10);

increment(2);
// 3
addTen(2);
// 12
```

这里我们定义了一个 add 函数，它接受一个参数并返回一个新的函数。调用add 之后，返回的函数就通过闭包的方式记住了 add 的第一个参数。