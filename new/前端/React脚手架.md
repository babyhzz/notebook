策略：

优先使用umi，了解各个模块的概念。然后逐渐搭建自己的webpack5的脚手架。

参考这个

https://www.taniarascia.com/how-to-use-webpack/

https://github.com/taniarascia/webpack-boilerplate





# Webpack

webpack和webpack-cli的关系：

webpack-cli提供了一些操作webpack的命令行工具。

# 样式

## PostCSS

https://github.com/postcss/postcss

# babel

https://www.babeljs.cn/docs/usage



@babel/core：核心库

@babel/preset-env：必须，支持新的语法

@babel/preset-react： 必须，支持React JSX

@babel/plugin-transform-runtime：polyfill转换，需要配合@babel/runtime使用，参考：https://www.babeljs.cn/docs/babel-plugin-transform-runtime

> @babel/polyfill 不再使用，建议包含直接包含core-js/stable和regenerator-runtime/runtime

https://zhuanlan.zhihu.com/p/147083132

babel preset-env 转义代码：1. 全局污染， 2. 每个文件都需要引入辅助函数

这个插件是解决上述问题的：

1. 从统一的模块引入，不会污染全局
2. 从统一的地方引入helper函数

@babel-plugin-proposal-decoratorss使用注意事项，和plugin-proposal-class-properties一起使用的问题

https://babeljs.io/docs/en/babel-plugin-proposal-decorators

```
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}
```





jsx -> js , webpack + babel

https://blog.csdn.net/m0_37890289/article/details/105421173



这个更详细

https://juejin.cn/post/6884912991859867662



这个更好，webpack5的

https://www.jb51.net/article/202257.htm



# 初始化项目

```
npm init -y
```

# 安装webpack

```
yarn add webpack webpack-cli webpack-dev-server -D
```

webpack-cli是不是必须的？

添加webpack配置文件 webpack.config.js

# 安装React核心包

react react-dom

# 安装babel

```
yarn add @babel/core  @babel/plugin-transform-runtime @babel/runtime  -D
yarn add @babel/preset-env @babel/preset-react -D
yarn add babel-loader -D

//处理装饰器decorators 如果你使用redux connect这类高阶组件时喜欢注解方式，需要安装
yarn add @babel/plugin-proposal-decorators -D
```

babel preset是plugin的集合，plugin的粒度很小，便于扩展。

@babel/core的作用？把 js 代码分析成 ast ，方便各个插件分析语法进行相应的处理。

分析几个插件的作用

**@babel/preset-react**

此预设（preset）始终包含以下插件：

- [@babel/plugin-syntax-jsx](https://www.babeljs.cn/docs/babel-plugin-syntax-jsx)
- [@babel/plugin-transform-react-jsx](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx)
- [@babel/plugin-transform-react-display-name](https://www.babeljs.cn/docs/babel-plugin-transform-react-display-name)

如果开启了 `development` 参数，还将包含以下插件：

Classic runtime adds:

- [@babel/plugin-transform-react-jsx-self](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx-self)
- [@babel/plugin-transform-react-jsx-source](https://www.babeljs.cn/docs/babel-plugin-transform-react-jsx-source)

**@babel/preset-env**

一个智能的预设，允许使用最新的JavaScript语法，这个重点研究下，里面有很多配置项

并创建.babelrc文件

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime"
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ]
}
```

webpack配置babe-loader

```
rules: [
        // 使用 bable 处理jsx文件，webpack处理项目文件时，碰到jsx文件，就使用babel进行代码转化
            {
                test: /\.jsx?$/,
                exclude: /node_moudles/,
                use: [
                    { loader: 'babel-loader' }
                ]
            }
        ]
    },
```

启动dev服务器

webpack-dev-server

其他插件

```
// 处理html,将打包好的js路径引入到html中等等
yarn add html-webpack-plugin  -D
// 清空历史打包产物
yarn add clean-webpack-plugin -D
// 样式插件
yarn add style-loader css-loader less-loader less -D
```



friendly-errors-webpack-plugin

https://github.com/geowarin/friendly-errors-webpack-plugin#readme

# 问题

https://www.cnblogs.com/sk-3/p/14147612.html

webpack5.x中需要通过webpack serve启动项目

`Error: Cannot find module 'webpack-cli/bin/config-yargs'`



webpack5中移除了nodejs核心模块的polyfill自动引入

`webpack < 5 used to include polyfills for node.js core modules by default`









https://github.com/javaLuo/react-luo

https://github.com/mikechabot/react-boilerplate



参考这个

https://www.taniarascia.com/how-to-use-webpack/

https://github.com/taniarascia/webpack-boilerplate