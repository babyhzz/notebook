# 原型链
- [js中__proto__和prototype的区别和关系？](https://www.zhihu.com/question/34183746/answer/58068402)
- [JavaScript实现继承的三种方式](https://segmentfault.com/a/1190000016525951)

![原型](img/原型.jpg)

明确如下几点：  
1. 每个对象都有一个[[prototype]]属性，这个属性是隐藏属性，不能直接访问，所以有的浏览器提供了一个__proto__属性来访问，然而这不是一个标准的访问方法，所以ES5中用 `Object.getPrototypeOf` 函数获得一个对象的[[prototype]]。ES6中，使用Object.setPrototypeOf可以直接修改一个对象的[[prototype]]。
2. 在JS中万物皆对象，方法是对象，方法的原型也是对象。对象具有__proto__属性，可称为隐式原型，一个对象的隐式原型指向构造函数的原型。
3. 方法这个特殊的对象，除了__proto__属性，还有自己**特有**的属性——原型属性（prototype），这个属性指向一个对象，包含所有实例共享的属性和方法。这个对象我们也叫原型对象，原型对象有一个属性constructor，指向原构造函数。

上图解读：  
1. f1, f2对象通过new Foo()创建，所以它们的__proto__属性都指向Foo的原型对象，即Foo.prototype。Foo.prototype有一个constructor属性，指向Foo构造函数。
2. Foo.prototype也是一个对象，也有__proto__属性，其__proto__指向Object的原型对象，即Object.prototype。Object.prototype有一个constructor属性，指向Object构造函数。
3. Object.prototype也是一个对象，也有__proto__属性，但规定其__proto__属性为null。s
4. o1, o2对象，由构造函数Object创建，所以它们的__proto__属性都指向Object的原型对象，即Object.prototype。Object.prototype有一个constructor属性，指向Object构造函数。
5. Foo函数也是一个对象，也有__proto__属性，它由构造函数Function创建，故其__proto__指向Function的原型对象，即Function.prototype。
6. Object函数也是一个对象，也有__proto__属性，它由构造函数Function创建，故其__proto__指向Function的原型对象，即Function.prototype。 
7. Function本身也是一个对象，也有__proto__属性，指向Function.prototype。

### 对象的创建方式
字面量方式、new的方式、Object.create

#### new
```js
var obj = {};
obj.__proto__ = Car.prototype
Car.call(obj)
```
1. 创建了一个空对象obj
2. 将空对象的__proto__属性指向了Car函数的原型对象，obj的原型属性将拥有了Car.prototype中的属性和方法。
3. 将Car函数中的this指针指向obj，obj有了Car构造函数中的属性和方法

#### Object.create

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
```js
Object.create =  function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
};
```
### 类型判断
#### instanceof
instanceof 操作符的内部实现机制和隐式原型、显式原型有直接的关系。instanceof的左值一般是一个对象，右值一般是一个构造函数，用来判断左值是否是右值的实例。它的内部实现原理是这样的
```js
// 设 L instanceof R 
// 通过判断
L.__proto__.__proto__ ..... === R.prototype ？
// 最终返回true or false
```
也就是沿着L的__proto__一直寻找到原型链末端，直到等于R.prototype为止。知道了这个也就知道为什么以下这些奇怪的表达式为什么会得到相应的值了
```js
Function instanceof Object // true 
Object instanceof Function // true 
Function instanceof Function //true
Object instanceof Object // true
Number instanceof Number //false
```

### 继承
JavaScript中主要有三种实现继承的方式，分别是
- 构造函数继承
- 原型继承
- 组合继承

#### 构造函数继承
构造函数继承的关键： 在Child构造函数中执行Parent.call(this)。
```js
function Parent(name) {
  this.name = name;
  this.hobby = [];
  // 缺点1：new多个Child时，Parent构造函数中的方法会在每个Child中拷贝一份，浪费内存
  this.speak = function() {
    console.log("Parent speak");
  } 
}
// 缺点2：Parent原型对象上的方法不会被Child继承
Parent.prototype.say = function() {
  console.log("Parent say");
} 

function Child(name, type) {
  Parent.call(this, name); // 构造函数继承的关键
  this.type = type;
}
```
#### 原型继承
原型继承的关键： 设置Child原型指向Parent， `Child.prototype = new Parent()`。
```js
function Parent(name) {
  this.name = name;
  this.hobby = []; 
}
Parent.prototype.say = function() {
  console.log("Parent say");
}
function Child(type) {
  this.type = type;
}
// 缺点：Parent的引用属性会被所有Child实例共享，互相干扰
Child.prototype = new Parent(); // 原型继承的关键
```

#### 组合继承（最佳实践）
组合继承的关键：

- 属性使用构造函数继承 —— 避免了原型继承中Parent引用属性被所有Child实例共享的缺陷。
- 方法使用原型继承 —— 避免了构造函数继承中方法重复拷贝、浪费内存的缺陷。

```js
// 属性放在构造函数中
function Parent(name) {
  this.name = name; 
  this.hobby = []; 
}
// 方法放在原型中
Parent.prototype.say = function() { 
  console.log("Parent say");
}
function Child(name, type) {
  Parent.call(this, name);  // Child继承Parent属性（构造函数继承）
  this.type = type;  // Child扩展属性
}
// Child继承Parent方法（原型继承）
// 注意此处可以进行原型扩展
Child.prototype = Object.create(Parent.prototype);  
// Child扩展方法
Child.prototype.speak = function() { 
  console.log("Child speak");
}
// 修复Child的constructor指向，否则Child的constructor会指向Parent
Child.prototype.constructor = Child; 
```

#### 补充：
对于组合继承代码中的Child.prototype = Object.create(Parent.prototype)，还有两种常见的类似写法是Child.prototype = Parent.prototype和Child.prototype = new Parent()，但这两种写法都是有缺陷的，需要避免：

- Child.prototype = Parent.prototype，<font color="red"> 修改Child.prototype就等于修改Parent.prototype</font>，会干扰所有Parent实例。

- Child.prototype = new Parent()，Parent构造函数重复调用了两次（另一处调用是Child构造函数中的Parent.call(this)），浪费效率，且如果Parent构造函数有副作用，重复调用可能造成不良后果

