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

### Promise（ES6）

##### 语法

``` javascript
new Promise( function(resolve, reject) {...} /* executor */  );
```
executor是带有 resolve 和 reject 两个参数的函数 。Promise构造函数执行时**立即**调用executor 函数， resolve 和 reject 两个函数作为参数传递给executor（executor 函数在Promise构造函数返回所建promise实例对象前被调用）。resolve 和 reject 函数被调用时，分别将promise的状态改为resolved（完成）或rejected（失败）。executor 内部通常会执行一些**异步**操作，一旦异步操作执行完毕(可能成功/失败)，要么调用resolve函数来将promise状态改成resolved，要么调用reject 函数将promise的状态改为rejected。如果在executor函数中抛出一个错误，那么该promise 状态为rejected。executor函数的返回值被忽略。

then() 方法返回一个 Promise。它最多需要有两个参数：Promise 的成功和失败情况的回调函数。
``` javascript
p.then(onResolved[, onRejected]);

p.then(value => {
  // resolved
}, reason => {
  // rejection
});
```
+ onResolved 可选
当 Promise 变成接受状态（resolved）时调用的函数。该函数有一个参数，即接受的最终结果（the resolved  value）。如果该参数不是函数，则会在内部被替换为 (x) => x，即原样返回 promise 最终结果的函数
+ onRejected 可选
当 Promise 变成拒绝状态（rejected）时调用的函数。该函数有一个参数，即拒绝的原因（rejection reason）。  如果该参数不是函数，则会在内部被替换为一个 "Thrower" 函数 (it throws an error it received as argument)。

##### then方法返回值

**如果 then 中的回调函数**：

+ 返回了一个值，那么 then 返回的 Promise 将会成为**接受**状态，并且将返回的值作为接受状态的回调函数的参数值。
+ 没有返回任何值，那么 then 返回的 Promise 将会成为接受状态，并且该接受状态的回调函数的参数值为 undefined。
+ 抛出一个错误，那么 then 返回的 Promise 将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
+ 返回一个已经是接受状态的 Promise，那么 then 返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
+ 返回一个已经是拒绝状态的 Promise，那么 then 返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。
+ 返回一个未定状态（pending）的 Promise，那么 then 返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。

##### 示例

``` javascript
Promise.resolve('foo')
  // 1. resovled状态Promise，直接传入下面then
  .then(function(string) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        string += 'bar';
        resolve(string);
      }, 1);
    });
  })
  // 2. 等待上一步回调函数返回的Promise resolved，传入值foobar到string，
  .then(function(string) {
    setTimeout(function() {
      string += 'baz';
      console.log(string);
    }, 1)
    return string;
  })
  // 3. 上一步then回调函数相当于直接返回一个值，故返回一个resolved的Promise
  .then(function(string) {
    console.log("Last Then:  oops... didn't bother to instantiate and return " +
                "a promise in the prior then so the sequence may be a bit " +
                "surprising");
    console.log(string);
  });

// 依次打印:
// Last Then: oops... didn't bother to instantiate and return a promise in the prior then so the sequence may be a bit surprising
// foobar
// foobarbaz
```


