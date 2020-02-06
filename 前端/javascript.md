# Object常用方法

#### Object.is 浅比较
比较两个值是否严格相等，相等判断还有 ==、===，== 会存在类型转换的问题，=== 严格的相等判断。Object.is与===类似，只有个别区别：
```js
+0===-0 //true
NaN===NaN //false
Object.is(+0,-0); //false
Object.is(NaN,NaN); //true
```

# Blob及相关文件操作对象
- [细说Web API中的Blob](https://juejin.im/post/59e35d0e6fb9a045030f1f35)
- [[HTML5] FileReader对象](https://www.cnblogs.com/hhhyaaon/p/5929492.html)
- [为什么视频网站的视频链接地址是blob？](https://juejin.im/post/5d1ea7a8e51d454fd8057bea)

#### Blob
Blob是binary large object的缩写，存储二进制数据，表示不可变的类文件对象。File对象继承Blob。  
构造函数为`Blob(array[, options])` ，注意第一个参数为数组，每项可以是ArrayBuffer、Blob、string等，options记住type属性指定其MIME类型即可。
Blob使用场景：1. 分片上传（slice是方法）；2. Blob URL。

#### FileReader
FileReader主要用于将文件内容读入内存，通过一系列**异步接口**，可以在主线程中访问本地文件。
```js
var reader = new FileReader();
// 通过四种方式读取文件
//reader.readAsXXX(file);   
reader.onload = function(){
    //查看文件输出内容
    console.log(this.result);
    //查看文件内容字节大小
    console.log(new Blob([this.result]))
}
```
了解如下方法即可：
- **readAsArrayBuffer**：返回二进制缓冲区
- readAsBinaryString：已废弃
- **readAsDataURL**：返回base64 Data URL
- readAsText：按指定的编码进行解析

#### Blob URL
Blob协议的URL，由 `URL.createObjectURL(blob)` 生成，格式类似：`blob:null/[uuid]`，当不再需要该URL时，调用 `URL.revokeObjectURL(url)` 使该链接失效

#### ArrayBuffer
用来表示通用的、固定长度的原始二进制数据缓冲区。我们可以通过new ArrayBuffer(length)来获得一片连续的内存空间，它不能直接读写，
但可根据需要将其传递到TypedArray视图（非真实类型，一类的统称，常见的如Int8Array、Uint8Array、Int16Array等等）或 DataView 对象来进行读写。

ArrayBuffer可以和Blob相互转换
- Blob => ArrayBuffer
```js
let blob = new Blob([1,2,3,4])
let reader = new FileReader();
reader.onload = function(result) {
    console.log(result);
}
reader.readAsArrayBuffer(blob);
```

- ArrayBuffer => Blob
```js
let blob = new Blob([buffer])
```

#### File
File接口基于Blob，继承了Blob的功能，并且扩展支持了用户计算机上的本地文件，因此我们可以像使用Blob一样使用File对象。


# 原型链
- [js中__proto__和prototype的区别和关系？](https://www.zhihu.com/question/34183746/answer/58068402)
- [JavaScript实现继承的三种方式](https://segmentfault.com/a/1190000016525951)

![原型](img/原型.jpg)

明确如下几点：  
1. 每个对象都有一个[[prototype]]属性，这个属性是隐藏属性，不能直接访问，所以有的浏览器提供了一个__proto__属性来访问，然而这不是一个标准的访问方法，所以ES5中用Object.getPrototypeOf函数获得一个对象的[[prototype]]。ES6中，使用Object.setPrototypeOf可以直接修改一个对象的[[prototype]]。
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

- Child.prototype = Parent.prototype，修改Child.prototype就等于修改Parent.prototype，会干扰所有Parent实例。

- Child.prototype = new Parent()，Parent构造函数重复调用了两次（另一处调用是Child构造函数中的Parent.call(this)），浪费效率，且如果Parent构造函数有副作用，重复调用可能造成不良后果

# 异步

#### Promise、async/await
- [深入理解async/await](https://www.cnblogs.com/youma/p/10475214.html)

> 个人理解，Promise只是一种异步处理方案，支持链式调用，解决回调地狱问题。而async/await则是Promise的语法糖

- async修饰的函数返回一个Promise对象，表示其中可能含有异步操作。await后面一般接一个Promise对象，会等着它resolve。
- 如果等到的是reject的promise呢，如何捕捉，用try catch

