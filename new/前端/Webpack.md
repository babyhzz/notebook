# 模块化

## CommonJS

同步加载方案，一个单独的文件就是一个模块，每一个模块有单独的作用域，只能通过 `module.exports` 导出。加载使用 `require` 。

服务器端加载本地文件很快，但是对于浏览器，需要采用异步模块加载模式。所以就有AMD和CMD。

commonjs 中有几个特别的变量，`module`、`exports`、`require`、`global`、`__filename`、`__dirname`。

## AMD & CMD

AMD：Asynchromous Module Definition，即异步模块定义。不是JS原生支持，使用AMD规范需要用到 `RequireJS` 。

RequireJS定义了一个函数 define，它是全局变量，用来定义模块。

```js
// 定义模块，id-可选参数，dependencies-当前模块依赖名称数组，factory-模块初始化要执行的函数或对象。若为函数，只被执行一次；若是对象，此对象应该为模块的输出值
define(id?, dependencies?, factory);
// 使用require加载模块，第一个参数：依赖模块，第二个参数：回调函数
require([dependencies], function(){});
```

CMD：Common Module Definition，国内发展出来，类似AMD的requireJS，CMD也有类似的叫SeaJS。

也遵循统一写法：

```js
define(id?, deps?, factory);
// factory有三个参数
// function(require, exports, module)
       
// 定义模块 myModule.js
define(function(require, exports, module) {
  var $ = require('jquery.js')
  $('div').addClass('active');
});

// 加载模块
seajs.use(['myModule.js'], function(my){

});
```

1. 一个文件一个模块，所以经常就用文件名作为模块id
2. CMD推崇依赖就近，所以一般不在define的参数中写依赖，在factory中写



AMD 与 CMD 都是异步加载，主要区别：

1. 针对define，AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块；CMD推崇就近依赖，只有在用到某个模块的时候再去require。
2. 都是异步加载，执行时机不一样。AMD在加载模块完成后就会执行该模块，模块执行顺序不确定，RequireJS2.0可以延迟执行；CMD加载完某个依赖模块后并不执行，require时才执行，保证按书写顺序执行



## ESM

ESM，ECMA Script Modules，就是我们常使用的 import、export。

同步还是异步？？？



# 常见问题

## module，chunk，bundle的区别

![module_chunk_bundle](Webpack.assets/module_chunk_bundle.jpg)

看这个图就很明白了：

1. 对于一份同逻辑的代码，当我们手写了一个个的文件，它们无论是 ESM 还是 CommonJS 或是 AMD，他们都是 **module**；
2. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 **chunk** 文件，webpack 会对这个 chunk 文件进行一些操作；
3. webpack 处理好 chunk 文件后，最后会输出 **bundle** 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一般来说一个 chunk 对应一个 bundle，比如上图中的 utils.js -> chunks 1 -> utils.bundle.js；但也有例外，比如说上图中，我就用 MiniCssExtractPlugin 从 chunks 0 中抽离出了 index.bundle.css 文件。

**一句话总结：**

module，chunk 和 bundle 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

## filename 和 chunkFilename 的区别

**filename**

filename 是一个很常见的 `output` 配置，指经过webpack 打包后输出文件的文件名。

```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  }
};
```

**chunkFilename**

chunkFilename 指未被列在 entry 中，却又需要被打包出来的 chunk 文件的名称。一般来说，这个 chunk 文件指的就是要**懒加载**的代码。

**一句话总结：**

filename 指列在 entry 中，打包后输出的文件的名称。

chunkFilename 指未列在 entry 中，却又需要被打包出来的文件的名称。

## webpackPrefetch、webpackPreload 和 webpackChunkName 到底是干什么的？

**webpackChunkName**

前面举了个异步加载 lodash 的例子，我们最后把 output.chunkFilename 写死成 bundle.js。在我们的业务代码中，不可能只异步加载一个文件，所以写死肯定是不行的，但是写成 [name].bundle.js 时，打包的文件又是意义不明、辨识度不高的 chunk id。

这时候 webpackChunkName 就可以派上用场了。我们可以在 import 文件时，在 import 里以<font color='red'>注释</font>的形式为 chunk 文件取别名： 

```js
async function getAsyncComponent() {
	var element = document.createElement('div');
 
 	// 在 import 的括号里 加注释 /* webpackChunkName: "lodash" */ ，为引入的文件取别名
 	const { default: _ } = await import(/* webpackChunkName: "lodash" */ 'lodash');
 	element.innerHTML = _.join(['Hello!', 'dynamic', 'imports', 'async'], ' ');
 	return element;
}
```

但生成的打包文件名是 vendors~lodash.bundle.js，前面多出来一个 `vendors~`。其实 webpack 懒加载是用内置的一个插件 SplitChunksPlugin 实现的，这个插件里面有些默认配置项，比如说 automaticNameDelimiter，默认的分割符就是 ~，所以最后的文件名才会出现这个符号，这块儿内容我就不引申了，感兴趣的同学可以自己研究一下。 

**webpackPrefetch 和 webpackPreload** 

这两个配置一个叫预拉取（Prefetch），一个叫预加载（Preload），两者有些细微的不同，我们先说说 webpackPrefetch。 

 在上面的懒加载代码里，我们是点击按钮时，才会触发异步加载 lodash 的动作，这时候会动态的生成一个 script 标签，加载到 head 头里： 

![image-20200707211906669](file://D:\源码\notebook\前端\webpack\img\lazyload.png?lastModify=1614570990)

 如果我们 import 的时候添加 webpackPrefetch： 

```js
const { default: _ } = await import(/* webpackChunkName: "lodash" */ /* webpackPrefetch: true */ 'lodash');
```

就会以 `<link rel="prefetch" as="script">` 的形式预拉取 lodash 代码： 

![image-20200707211948354](file://D:\源码\notebook\前端\webpack\img\prefetch.png?lastModify=1614571006)

这个异步加载的代码不需要手动点击 button 触发，webpack 会在父 chunk 完成加载后，**闲时**加载 lodash 文件。 

webpackPreload 是预加载当前导航下可能需要资源，他和 webpackPrefetch 的主要区别是：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻

**一句话总结：**

webpackChunkName 是为预加载的文件取别名，webpackPrefetch 会在浏览器闲置下载文件，webpackPreload 会在父 chunk 加载时并行下载文件。

### 4.hash、chunkhash、contenthash 有什么不同？

首先来个背景介绍，哈希一般是结合 CDN 缓存来使用的。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。 

**hash**

hash 计算是跟整个项目的构建相关

![image-20200707212401011](file://D:\源码\notebook\前端\webpack\img\hash.png?lastModify=1614571023)

我们可以发现，生成文件的 hash 和项目的构建 hash 都是一模一样的。 

**chunkhash** 

它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。 

![image-20200707212807435](file://D:\源码\notebook\前端\webpack\img\chunkhash.png?lastModify=1614571028)

我们可以看出，chunk 0 的 hash 都是一样的，chunk 1 的 hash 和上面的不一样。 

 **contenthash** 

 我们更近一步，index.js 和 index.css 同为一个 chunk，如果 index.js 内容发生变化，但是 index.css 没有变化，打包后他们的 hash 都发生变化，这对 css 文件来说是一种浪费。 

 contenthash 将根据资源内容创建出唯一 hash，也就是说文件内容不变，hash 就不变。 

![image-20200707212914078](file://D:\源码\notebook\前端\webpack\img\contenthash.png?lastModify=1614571034)

可以看出，当仅js文件改变时，css文件的hash值没有变化。



# Webpack工作流程

1、读取配置文件，按命令 **初始化** 配置参数，创建 Compiler 对象；

2、调用插件的 apply 方法 **挂载插件** 监听，然后从入口文件开始执行编译；

3、按文件类型，调用相应的 Loader 对模块进行 **编译**，并在合适的时机点触发对应的事件，调用 Plugin 执行，最后再根据模块 **依赖查找** 到所依赖的模块，递归执行第三步；

4、将编译后的所有代码包装成一个个代码块 (Chuck)， 并按依赖和配置确定 **输出内容**。这个步骤，仍然可以通过 Plugin 进行文件的修改;

5、最后，根据 Output 把文件内容一一写入到指定的文件夹中，完成整个过程；