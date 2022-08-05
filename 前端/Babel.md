# Babel基础

## Babel工作流

![img](/Users/hucheng/Library/Application%20Support/marktext/images/b889f6760a5dd2cba895bf7a60502c15563a3ed4.awebp)

1. 解析

 将代码解析成抽象语法树（AST），每个js引擎（比如Chrome浏览器中的V8引擎）都有自己的AST解析器，而Babel是通过[Babylon](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fbabel%2Fbabylon)实现的。在解析过程中有两个阶段：**词法分析**和**语法分析**，词法分析阶段把字符串形式的代码转换为**令牌**（tokens）流，令牌类似于AST中节点；而语法分析阶段则会把一个令牌流转换成 AST的形式，同时这个阶段会把令牌中的信息转换成AST的表述结构。

2. 转换

在这个阶段，Babel接受得到AST并通过babel-traverse对其进行深度优先遍历，在此过程中对节点进行添加、更新及移除操作。这部分也是Babel插件介入工作的部分。

3. 生成

将经过转换的AST通过babel-generator再转换成js代码，过程就是深度优先遍历整个AST，然后构建可以表示转换后代码的字符串。

> 注意：babel的插件有两种，一种是**语法插件**，这类插件是在**解析阶段**辅助解析器（Babylon）工作；另一类插件是**转译插件**，这类插件是在**转换阶段**参与进行代码的转译工作，这也是我们使用babel最常见也最本质的需求

## preset-env

`preset-env`可以转换新语法，甚至可以配置转换新的`API`，通过配置其可选项来实现功能支持。

`@babel/preset-env`有三个常用的关键可选项:

- targets
- useBuiltIns
- corejs

> @babel/preset-env is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s).

### targets

首先是`targets`，这个字段可以填写`browserslist`的查询字符串，官方推荐使用`.browserslistrc`文件去指明编译的`target`，这个配置文件还可以和`autoprefixer`、`stylelint`等工具一起共享配置。

所以某种程度上不推荐在`.babelrc`的`preset-env`配置中直接使用`targets`进行配置。

> 如果需要单独在这里配置`targets`的话，`preset-env`中指明`ignoreBrowserslistConfig`为`true`则忽略`.browserslistrc`的配置项。

（hc：按这个意思是会默认去读 browserslist 配置？）

### useBuiltIns

其次是用于指定`polyfill`方案的`useBuiltIns`，其默认值是`false`(不推荐使用)，在不主动`import`的情况下不使用`preset-env`来实现`polyfills`，只使用其默认的语法转换功能。

但是如果我们需要使用其`polyfill`功能，则可以选择两种方式：

**entry**

`entry`指的是将会根据浏览器目标环境(`targets`)的配置，引入全部浏览器暂**未支持**的`polyfill`模块，无论在项目中是否使用到。

先安装两个包：

> yarn add core-js@3 regenerator-runtime

我们需要做的就是在入口处引入`polyfill`（或者在 webpack 配置文件中新增这两个包作为额外的入口）:

```js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

这里需要介绍一下 `regenerator-runtime`，当代码中使用到 `async/await` 语法的时候，`@babel/preset-env` 会帮助代码转换为一个 `regeneratorRuntime` 的函数，但是转换后的代码仅仅存在这个函数的调用，而这个函数具体的实现，在没有声明 `useBuiltIns: 'usage'` 的情况下，是不会引入的!

> 很多时候，我们看到 regeneratorRuntime is undefined 的报错，也是因为这个 regeneratorRuntime 函数没有被引入而导致的。

**usage**

设置`useBuiltIns`的值为`usage`时，我们不需要手动在入口文件引入`polyfill`，`Babel`将会根据我们的代码使用情况自动注入`polyfill`，如此一来在打包的时候将会相对地减少打包体积。

### corejs

babel使用`corejs`来管理`polyfill`，推荐使用v3版本，v2版本已不再维护。

使用`entry`的`preset-env`的配置示例：

```js
// .babelrc
{
 "presets": [
  [
   "@babel/preset-env",
   {
    "targets": {
     "chrome": "80" // 推荐使用 .browserslistrc
    },
    "useBuiltIns": "entry",
    "corejs": {
     "version": 3, // 2 和 3 版本都需要手动安装库：yarn add core-js@3
     "proposals": false
    }
   }
  ]
 ],
 "plugins": []
}
```

之后再在入口文件手动引入`polyfill`:

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// other code
```

## plugin-transform-runtime

`preset-env`和`plugin-transform-runtime`都是用来做polyfill的，最好不要同时使用。

`preset-env`的`polyfill`会污染全局环境，作为项目开发无可厚非，但是如果我们在开发提供给其他开发者使用的`library`，我想我们不应该污染全局，并且应该提供更好的打包体积和效率。

`plugin-transform-runtime`可以主要做了三件事：

- 当开发者使用异步或生成器的时候，自动引入`@babel/runtime/regenerator`，开发者不必在入口文件做额外引入
- 提供沙盒环境，避免全局环境的污染 
- 移除`babel`内联的`helpers`，统一使用`@babel/runtime/helpers`代替，减小打包体积

当使用此方案时，不需要在入口文件处手动引入`core-js`和`regenerator-runtime`。

其中corejs选项需要安装开发依赖

| `corejs` option | Install command                             |
| --------------- | ------------------------------------------- |
| `false`         | `npm install --save @babel/runtime`         |
| `2`             | `npm install --save @babel/runtime-corejs2` |
| `3`             | `npm install --save @babel/runtime-corejs3` |

**作为业务开发者**：`@babel/plugin-transform-runtime` ，建议关闭 `corejs`，polyfill 的引入由 `@babel/preset-env` 完成，即开启 `useBuiltIns`（如需其他配置，自行根据诉求配置）。（hc：也就是只使用第3点？？）

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 58
        },
        "useBuiltIns": "entry",
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": false
      }
    ]
  ]
}
```

并在入口文件处 import 如下内容

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// 入口文件代码
```

**如果是 Library 开发者**，：`@babel/plugin-transform-runtime` ，建议开启 `corejs`，polyfill 由 `@babel/plugin-transform-runtime` 引入。 `@babel/preset-env` 关闭 `useBuiltIns`。

```json
{
  "presets": [
    [
      "@babel/preset-env",
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        }
      }
    ]
  ]
}
```
