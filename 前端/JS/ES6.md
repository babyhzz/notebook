## class

**class不存在变量提升**，所以需要先定义再使用 ，基本形式：

```js
class Person {
  
  constructor() {
    // 均为实例属性
    this.name = 'xxx';
    this.hi = function () {
      console.log("hi");
    }
  }
  
  age = 80;	// 同constructor，实例属性

	// 原型属性
	hello() {
    console.log("hello");
  }
  
}

// Person {age: 80, name: "xxx", hi: ƒ}
```

> 判断是否存在属性的两种方式：hasOwnProperty 和 in
>
> hasOwnProperty：是否存在实例属性
>
> in：对象能否访问指定属性，故会遍历原型链

**继承**

```js
class SuperMan extends Person {
  
  constructor() {
    super();
    this.job = 'job';
  }
  
  work() {
    console.log("work");
  }
}

var p = new SuperMan();
```
可以看到如下结果：
> SuperMan {age: 80, name: "xxx", job: "job", hi: ƒ}
> age: 80
> name: "xxx"
> hi: ƒ ()
> job: "job"
> __proto__: Person
> 	constructor: class SuperMan
> 	work: ƒ work()
> 	__proto__:
> 		constructor: class Person
> 		hello: ƒ hello()
> 		__proto__: Object

我们可以看到：子类继承父类的实例属性。子类的proto为Person对象，并把子类的函数放入其中。

## Array

ES5的Array常用有如下方法：

- concat()
- join() 所有元素放入一个字符串，并以指定连接符连接
- pop()
- push()
- shift()
- unshift()
- slice()
- splice()
- sort()
- reverse()

ES6的Array新增常用方法如下：

- Array.of, Array.from 类数组对象
- find, findIndex
- includes，indexOf
- flat 扁平化数组, flatMap 先映射再扁平化数组

技巧：

```js
// 去除重复元素
Array.from(new Set([1,2,4,5,6,5,5,5]))
// 字符字典
Array.from(new Set("d3243dadsad22142121fdfs"))
// ["d", "3", "2", "4", "a", "s", "1", "f"]
```

