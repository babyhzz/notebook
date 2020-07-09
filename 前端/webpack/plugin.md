# 如何编写一个插件

`webpack` 插件由以下组成：

- 一个 JavaScript 命名函数。
- 在插件函数的 prototype 上定义一个 `apply` 方法。
- 指定一个绑定到 webpack 自身的[事件钩子](https://www.webpackjs.com/api/compiler-hooks/)。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。



```javascript
// 一个 JavaScript 命名函数。
function MyExampleWebpackPlugin() {

};

// 在插件函数的 prototype 上定义一个 `apply` 方法。
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
  // 指定一个挂载到 webpack 自身的事件钩子。
  // compilation: 处理 webpack 内部实例的特定数据
  // TODO: 有空可以打印出compilation看看
  compiler.plugin('webpacksEventHook', function(compilation, callback) {
    console.log("This is an example plugin!!!");
    // 功能完成后调用 webpack 提供的回调。
    callback();
  });
};
```

## Compiler 和 Compilation

在插件开发中最重要的两个资源就是 `compiler` 和 `compilation` 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

- `compiler` 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
- `compilation` 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

# 常用的plugin

何为插件(Plugin)？专注处理 webpack 在编译过程中的某个特定的任务的功能模块，可以称为插件。

Plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务。

#### HotModuleReplacementPlugin

模块热更新插件。`Hot-Module-Replacement` 的热更新是依赖于 `webpack-dev-server`，后者是在打包文件改变时更新打包文件或者 reload 刷新整个页面，`HRM` 是只更新修改的部分。

`HotModuleReplacementPlugin`是`webpack`模块自带的，所以引入`webpack`后，在`plugins`配置项中直接使用即可。

#### html-webpack-plugin

生成 html 文件。将 webpack 中`entry`配置的相关入口 `chunk` 和 `extract-text-webpack-plugin`抽取的 css 样式 插入到该插件提供的`template`或者`templateContent`配置项指定的内容基础上生成一个 html 文件，具体插入方式是将样式`link`插入到`head`元素中，`script`插入到`head`或者`body`中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(__dirname, '/index.html'),
    minify: {
      removeComments: true, // 移除HTML中的注释
      collapseWhitespace: true, // 删除空白符与换行符
      minifyCSS: true, // 压缩内联css
    },
    inject: true,
  }),
]
```

多页应用打包，指定多个HtmlWebpackPlugin，然后指定其依赖的chunks

```js
module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
      chunks: ['login'],
    }),
  ],
}
```

#### clean-webpack-plugin

`clean-webpack-plugin` 用于在打包前清理上一次项目生成的 bundle 文件，它会根据 `output.path` 自动清理文件夹；这个插件在生产环境用的频率非常高，因为生产环境经常会通过 hash 生成很多 bundle 文件，如果不进行清理的话每次都会生成新的，导致文件夹非常庞大。

#### extract-text-webpack-plugin

将 css 成生文件，而非内联 。该插件的主要是为了抽离 css 样式，防止将样式打包在 js 中引起页面样式加载错乱的现象。

> 这个还在使用么？所有的样式都抽离到一个文件？

```
const ExtractTextPlugin = require('extract-text-webpack-plugin')

plugins: [
  // 将css分离到/dist文件夹下的css文件夹中的index.css
  new ExtractTextPlugin('css/index.css'),
]
```

#### mini-css-extract-plugin

将 CSS 提取为独立的文件的插件，对每个包含 css 的 js 文件都会创建一个 CSS 文件，支持按需加载 css 和 `sourceMap`。只能用在 webpack4 中，对比另一个插件 extract-text-webpack-plugin 有以下特点:

- 异步加载
- 不重复编译，性能更好
- 更容易使用
- 只针对 CSS

这个插件应该只用在生产环境配置，并且在 `loaders` 链中不使用 `style-loader`, 而且这个插件暂时不支持 HMR

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
  ],
}
```

####  optimize-css-assets-webpack-plugin 

我们希望减小 css 打包后的体积，可以用到 `optimize-css-assets-webpack-plugin`。

```js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") 

optimization: {
  minimizer: [
    // 压缩css
    new OptimizeCSSAssetsPlugin({})
  ]
}
```

#### UglifyJsPlugin

`uglifyJsPlugin` 是 `vue-cli` 默认使用的压缩代码方式，用来对 js 文件进行压缩，从而减小 js 文件的大小，加速 load 速度。它使用的是单线程压缩代码，打包时间较慢，所以可以在开发环境将其关闭，生产环境部署时再把它打开。

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

plugins: [
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false
      }
    },
    sourceMap: true,  //是否启用文件缓存
    parallel: true   //使用多进程并行运行来提高构建速度
 })
]
```

#### terser-webpack-plugin(重点)

Webpack4.0 默认是使用 `terser-webpack-plugin` 这个压缩插件，在此之前是使用 `uglifyjs-webpack-plugin`，两者的区别是后者对 ES6 的压缩不是很好，同时我们可以开启 `parallel` 参数，使用多进程压缩，加快压缩。

```js
const TerserPlugin = require('terser-webpack-plugin') // 压缩js代码

optimization: {
  minimizer: [
    new TerserPlugin({
      parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
      cache: true, // 是否缓存
      sourceMap: false,
    }),
  ]
}
```

#### compression-webpack-plugin

所有现代浏览器都支持 `gzip` 压缩，启用 `gzip` 压缩可大幅缩减传输资源大小，从而缩短资源下载时间，减少首次白屏时间，提升用户体验。

gzip 对基于文本格式文件的压缩效果最好（如：CSS、JavaScript 和 HTML），在压缩较大文件时往往可实现高达 70-90% 的压缩率，对已经压缩过的资源（如：图片）进行 gzip 压缩处理，效果很不好。

```js
const CompressionPlugin = require('compression-webpack-plugin')

plugins: [
  new CompressionPlugin({
    // gzip压缩配置
    test: /\.js$|\.html$|\.css/, // 匹配文件名
    threshold: 10240, // 对超过10kb的数据进行压缩
    deleteOriginalAssets: false, // 是否删除原文件
  }),
]
```

当然，这个方法还需要后端配置支持。

#### DefinePlugin

我们可以通过 `DefinePlugin` 可以定义一些**全局的变量**，我们可以在模块当中直接使用这些变量，无需作任何声明，`DefinePlugin` 是 `webpack` 自带的插件。

```js
plugins: [
  new webpack.DefinePlugin({
    DESCRIPTION: 'This Is The Test Text.',
  }),
]

// 直接引用
console.log(DESCRIPTION)
```

#### ProvidePlugin

自动加载模块。 任何时候，当 `identifier` 被当作未赋值的变量时， module 就会自动被加载，并且 `identifier` 会被这个 module 输出的内容所赋值。这是 webpack 自带的插件。

```js
module.exports = {
  resolve: {
    alias: {
      jquery: './lib/jquery',
    },
  },
  plugins: [
    //提供全局的变量，在模块中使用无需用require引入
    new webpack.ProvidePlugin({
      $: 'jquery',
      React: 'react',
    }),
  ],
}
```

#### DllPlugin（没懂，有时间试下）

这是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 `bundle(dll-only-bundle)`。 这个插件会生成一个名为 `manifest.json` 的文件，这个文件是用来让 `DLLReferencePlugin` 映射到相关的依赖上去的。

**使用步骤如下**

1、在 build 下创建 `webpack.dll.config.js`

```js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vendor: [
      'vue-router',
      'vuex',
      'vue/dist/vue.common.js',
      'vue/dist/vue.js',
      'vue-loader/lib/component-normalizer.js',
      'vue',
      'axios',
      'echarts',
    ],
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].dll.js',
    library: '[name]_library',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('./dist', '[name]-manifest.json'),
      name: '[name]_library',
    }),
    // 建议加上代码压缩插件，否则dll包会比较大。
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
}
```

2、在 `webpack.prod.conf.js` 的 plugin 后面加入配置

```js
new webpack.DllReferencePlugin({
  manifest: require('../dist/vendor-manifest.json'),
})
```

3、`package.json`文件中添加快捷命令`(build:dll)`

```json
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "lint": "eslint --ext .js,.vue src",
    "build": "node build/build.js",
    "build:dll": "webpack --config build/webpack.dll.conf.js"
  }
复制代码
```

生产环境打包的时候先`npm run build:dll`命令会在打包目录下生成 `vendor-manifest.json` 文件与 vendor.dll.js 文件。然后`npm run build`生产其他文件。

4、根目录下的入口 `index.html` 加入引用

```
<script type="text/javascript" src="./vendor.dll.js"></script>
```

#### copy-webpack-plugin

我们在 `public/index.html` 中引入了静态资源，但是打包的时候 webpack 并不会帮我们拷贝到 dist 目录，因此 `copy-webpack-plugin` 就可以很好地帮我做拷贝的工作了。

> 我们的public资源是不是这个copy过去的？

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/js/*.js',
          to: path.resolve(__dirname, 'dist', 'js'),
          flatten: true,
        },
      ],
    }),
  ],
}
```

#### IgnorePlugin

这是 webpack 内置插件，它的作用是：忽略第三方包指定目录，让这些指定目录不要被打包进去。

比如我们要使用 `moment` 这个第三方依赖库，该库主要是对时间进行格式化，并且支持多个国家语言。虽然我设置了语言为中文，但是在打包的时候，是会将所有语言都打包进去的。这样就导致包很大，打包速度又慢。对此，我们可以用 `IgnorePlugin` 使得指定目录被忽略，从而使得打包变快，文件变小。

```js
const Webpack = require('webpack')
plugins: [
  // moment这个库中，如果引用了./locale/目录的内容，就忽略掉，不会打包进去
  new Webpack.IgnorePlugin(/\.\/locale/, /moment/),
]
```

我们虽然按照上面的方法忽略了包含`’./locale/'`该字段路径的文件目录，但是也使得我们使用的时候不能显示中文语言了，所以这个时候可以手动引入中文语言的目录。

```js
import moment from 'moment'

//手动引入所需要的语言包
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

let r = moment().endOf('day').fromNow()
console.log(r)
```