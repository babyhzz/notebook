# Loader

由于 Webpack 是基于 Node，因此 Webpack 其实是只能识别 js 模块，比如 css / html / 图片等类型的文件并无法加载，因此就需要一个对 **不同格式文件转换器**。其实 Loader 做的事，也并不难理解: **对 Webpack 传入的字符串进行按需修改**。



**Loader 特性**:

- **链式传递**，按照配置时相反的顺序链式执行；
- 基于 Node 环境，拥有 **较高权限**，比如文件的增删查改；
- 可同步也可异步；





# 常用的Loader

#### babel-loader

加载 js / jsx 文件， 将 ES6 / ES7 代码转换成 ES5，抹平兼容性问题。 

步骤如下：

- babylon 将 ES6/ES7 代码解析成 AST
- babel-traverse 对 AST 进行遍历转译，得到新的 AST
- 新 AST 通过 babel-generator 转换成 ES5

#### file-loader

解析文件的 `import/require()` ，转换成一个url，并且输出到指定目录。CSS中的url会转换成require。outputPath指的是输出到打包的目录，若使用cdn，需要配置publicPath，公网地址。

#### url-loader

url-loader内部封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，不需要安装file-loader。url-loader工作分两种情况：1.文件大小小于limit参数，url-loader将会把文件转为DataURL；2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。因此我们只需要安装url-loader即可。

#### expose-loader

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

#### 其他

style-loader: 将 css 代码以`style`标签的形式插入到 html 中；

css-loader: 分析`@import`和`url()`，引用 css 文件与对应的资源；

postcss-loader: 用于 css 的兼容性处理，具有众多功能，例如 **添加前缀，单位转换** 等；

less-loader / sass-loader: css预处理器，在 css 中新增了许多语法，提高了开发效率