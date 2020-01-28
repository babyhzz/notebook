## 基础

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

### 核心概念

+ 入口 (entry)
+ 输出 (output)
+ Loader
+ 插件 (plugins)

#### 入口

入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的**开始**。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
``` js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

#### 出口

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。
```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```
> 注：Node.js 中，__dirname 总是指向被执行 js 文件的绝对路径

#### Loader

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。
在 webpack 的配置中 loader 有两个目标：

+ test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
+ use 属性，表示进行转换时，应该使用哪个 loader。
``` js
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```

#### 插件

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。
``` js
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

### 入口(Entry Point)

#### 单个入口（简写）语法

用法：

> entry: string | sArray\<string\>
``` js
const config = {
  entry: './path/to/my/entry/file.js'
};

module.exports = config;
```
上面写法属于如下语法的缩写：
``` js
const config = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```
> 当你向 entry 传入一个数组时会发生什么？向 entry 属性传入「文件路径(file path)数组」将创建“多个主入口(multi-main entry)”。在你想要多个依赖文件一起注入，并且将它们的依赖导向(graph)到**一个chunk**时，传入数组的方式就很有用。

#### 对象语法

> entry: {[entryChunkName: string]: string | Array\<string\>}

``` js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

> 遗留问题：
> 提到的 CommonsChunkPlugin 以及 DllPlugin分别什么用途，__webpack _require()是什么意思 

### 输出 (output)

配置 output 选项可以控制 webpack 如何向硬盘写入编译文件。注意，即使可以存在多个入口起点，但只指定一个输出配置。

在 webpack 中配置 output 属性的最低要求是，将它的值设置为一个对象，包括以下两点：
+ filename 用于输出文件的文件名。
+ 目标输出目录 path 的绝对路径。

``` js
const config = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};

module.exports = config;
```
此配置将一个单独的 bundle.js 文件输出到 /home/proj/public/assets 目录中。

**多个入口起点**

如果配置创建了多个单独的 "chunk"（例如，使用多个入口起点或使用像 CommonsChunkPlugin 这样的插件），则应该使用**占位符(substitutions)**来确保每个文件具有唯一的名称。

``` js
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}
```

| 模板        | 描述                                      |
| :---------- | :---------------------------------------- |
| [hash]      | 模块标识符(module identifier)的 hash      |
| [chunkhash] | chunk 内容的 hash                         |
| [name]      | 模块名称                                  |
| [id]        | 模块标识符(module identifier)             |
| [query]     | 模块的 query，例如，文件名 ? 后面的字符串 |

> [hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为20）来指定。或者，通过指定output.hashDigestLength 在全局配置长度。

**高阶进阶**

使用 CDN 和资源 hash 的复杂示例：
``` js
output: {
  path: "/home/proj/cdn/assets/[hash]",
  publicPath: "http://cdn.example.com/assets/[hash]/"
}
```

在**编译时**不知道最终输出文件的 publicPath 的情况下，publicPath 可以留空，并且在入口起点文件运行时**动态设置**。如果你在编译时不知道 publicPath，你可以先忽略它，并且在入口起点设置__webpack_public_path__。(TODO：这个怎么理解？？？)
``` js
__webpack_public_path__ = myRuntimePublicPath
```

### 模式 (mode)

提供 mode 配置选项，告知 webpack **使用相应模式的内置优化**。
```js
module.exports = {
  mode: 'production'
};
```
或者从CLI参数中传递
``` js 
webpack --mode=production
```
|选项	|描述|
|:--|:--|
|development| 会将process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。|
|production | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.|

>在node中，有**全局变量**process表示的是当前的node进程。process.env包含着关于系统环境的信息。但是process.env中并不存在NODE_ENV这个东西。NODE_ENV是用户一个自定义的变量，在webpack中它的用途是判断生产环境或开发环境的依据。

### Loader

loader 用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时**预处理文件**。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！

在应用程序中，有三种使用 loader 的方式：

+ 配置（推荐）：在 webpack.config.js 文件中指定 loader。
+ 内联：在每个 import 语句中显式指定 loader。
+ CLI：在 shell 命令中指定它们。

#### 配置

module.rules 允许你在 webpack 配置中指定多个 loader。 这是展示 loader 的一种简明方式，并且有助于使代码变得简洁。同时让你对各个 loader 有个全局概览：

``` js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]
    }
  ]
}
```

#### 内联

可以在 import 语句或任何等效于 "import" 的方式中指定 loader。使用 ! 将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。

``` js 
import Styles from 'style-loader!css-loader?modules!./styles.css';
```
选项可以传递查询参数，例如 ?key=value&foo=bar，或者一个 JSON 对象，例如 ?{"key":"value","foo":"bar"}。

CLI
也可以通过 CLI 使用 loader：
``` js
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```
这会对 .jade 文件使用 jade-loader，对 .css 文件使用 style-loader 和 css-loader。

#### Loader 特性

+ loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照**相反**的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。
+ loader 可以是同步的，也可以是异步的。
+ loader 运行在 Node.js 中，并且能够执行任何可能的操作。
+ loader 接收查询参数。用于对 loader 传递配置。
+ loader 也能够使用 options 对象进行配置。
+ 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。
+ 插件(plugin)可以为 loader 带来更多特性。
+ loader 能够产生额外的任意文件。

### 插件 (Plugins)

插件是 webpack 的支柱功能。webpack 自身也是构建于你在 webpack 配置中用到的相同的插件系统之上！

插件**目的在于解决 loader 无法实现的其他事**。

**剖析**

webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

``` js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, compilation => {
            console.log("webpack 构建过程开始！");
        });
    }
}
```
compiler hook 的 tap 方法的第一个参数，应该是驼峰式命名的插件名称。建议为此使用一个常量，以便它可以在所有 hook 中复用。

由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入 new 实例。

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack'); //访问内置的插件
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

## 配置详解(configuration)

 webpack 的配置文件，是**导出一个对象的 JavaScript 文件**。此对象，由 webpack 根据对象定义的属性进行解析。webpack 配置是标准的 Node.js CommonJS 模块。

 ```js
var path = require('path');

module.exports = {
  mode: 'development',
  entry: './foo.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};
 ```

在模块化编程中，开发者将程序分解成离散功能块(discrete chunks of functionality)，并称之为模块。

每个模块具有比完整程序更小的接触面，使得校验、调试、测试轻而易举。 精心编写的模块提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

Node.js 从最一开始就支持模块化编程。然而，在 web，模块化的支持正缓慢到来。在 web 存在多种支持 JavaScript 模块化的工具，这些工具各有优势和限制。webpack 基于从这些系统获得的经验教训，并将模块的概念应用于项目中的任何文件。

对比 Node.js 模块，webpack 模块能够以各种方式表达它们的依赖关系，几个例子如下：

+ ES2015 import 语句
+ CommonJS require() 语句
+ AMD define 和 require 语句
+ css/sass/less 文件中的 @import 语句。
+ 样式(url(...))或 HTML 文件(\<img src=...\>)中的图片链接(image url)

### target

告知 webpack 为目标(target)指定一个环境。常见如node、web。

### externals

打包文件排除某些依赖，而依赖用户的环境。
index.html中来自cdn的jquery
```html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```
webpack中的配置
```js
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
};
```

### devtool
source map的配置...

### watch & watchOptions
webpack 可以监听文件变化，当它们修改后会重新编译。

### resolve

设置模块如何被解析。
#### resolve.alias

创建 import 或 require 的别名，来确保模块引入变得更简单。
```js
// Node.js中提供了两个与文件操作相关全局可用变量__dirname和__filename，__dirname表示当前文件所在的目录，__filename表示正在执行脚本的文件名。
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  //...
  resolve: {
    alias: {
      '@': resolve('src'),
    }
  }
};
```
#### resolve.extensions
自动解析确定的扩展，能够使用户在引入模块时不带扩展。默认为['.wasm', '.mjs', '.js', '.json']。

#### resolve.mainFields
 当从 npm 包中导入模块时（例如，`import * as D3 from "d3"`） ，决定在 package.json 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同。
target为web默认值为 ['browser', 'module', 'main']

#### resolve.mainFiles
解析目录时要使用的文件名，默认`mainFiles: ["index"]`

这也是在React开发者，我们创建一个目录，在目录中创建index.js，我们只需要import这个目录即可

#### resolve.modules

告诉 webpack 解析模块时应该搜索的目录。默认是node_modules。

### devServer

来自webpack-dev-server的选项

#### devServer.before
在服务内部的所有其他中间件之前， 提供执行自定义中间件的功能。
```js
module.exports = {
  //...
  devServer: {
    before: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```
#### devServer.proxy
``` js
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
};
```
请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users。
如果你不想始终传递 /api ，则需要重写路径：

```js
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
```
### module

如何处理项目中的不同类型模块。
#### module.noParse
防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。
```js
module.exports = {
  //...
  module: {
    noParse: /jquery|lodash/,
  }
};
```
#### module.rules
创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式。这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。

## 常用Loader
### file-loader
解析文件的 `import/require()` ，转换成一个url，并且输出到指定目录。CSS中的url会转换成require。outputPath指的是输出到打包的目录，若使用cdn，需要配置publicPath，公网地址。

### url-loader
类似于 file-loader，但如果文件大小小于某个值，它可以返回一个base64的URI。Options中的fallback指定超过阈值，使用的loader，默认是file-loader。

### expose-loader
暴露模块变量导出到全局，如下配置，则 `window.$` 可以使用
``` js
require("expose-loader?$!jquery");
```
或者
``` js
module: {
  rules: [{
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

## 常用plugin
### ProvidePlugin
自动加载模块，而不必到处 import 或 require 。

``` js
new webpack.ProvidePlugin({
  identifier: 'module1',
  // ...
});

new webpack.ProvidePlugin({
  identifier: ['module1', 'property1'],
  // ...
});
```

示例
``` js
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
});
new webpack.ProvidePlugin({
  _map: ['lodash', 'map']
});
``` 

### @babel/plugin-proposal-class-properties

若要使用提案的类属性语法，需要该插件支持
``` js
class Bork {
    //Property initializer syntax
    instanceProperty = "bork";
    boundFunction = () => {
      return this.instanceProperty;
    };

    //Static class properties
    static staticProperty = "babelIsCool";
    static staticFunction = function() {
      return Bork.staticProperty;
    };
  }
```

### CleanWebpackPlugin
每次构建前，清理/dist文件夹

### CopyWebpackPlugin
拷贝文件或者文件夹到build目录

### BannerPlugin
webpack内部插件，为每个编译生成的chunk文件头部添加banner（头部声明）

### DefinePlugin
webpack内部插件，DefinePlugin 允许创建一个在编译时可以配置的**全局常量**。（一个是环境变量，一个是常量）

在生产/开发构建中使用不同的服务 URL(Service URL)：
```js
new webpack.DefinePlugin({
  'SERVICE_URL': JSON.stringify('http://dev.example.com')
});
```
### IgnorePlugin
import 或 require 调用时，忽略哪些文件。如moment忽略语言包的导入，防止导入过多无用的语言包。

### DllPlugin & DllReferencePlugin

DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。

##### DllPlugin
这个插件是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 DLLReferencePlugin 映射到相关的依赖上去的。

##### DllReferencePlugin
这个插件是在 webpack 主配置文件中设置的， 这个插件把只有 dll 的 bundle(们)(dll-only-bundle(s)) 引用到需要的预编译的依赖。

> 将不会变的三方dll库，如 vue, React 打包到dll文件中，然后通过manifest文件关联，只需打包我们自己的代码。