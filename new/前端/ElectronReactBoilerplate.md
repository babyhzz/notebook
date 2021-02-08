# 基础

## electron-builder

## Jest & Enzyme



# 脚手架

## 编译

```bash
# 生产级的编译
$ yarn build
# 查看编译的分析
$ yarn cross-env OPEN_ANALYZER=true yarn build
```

相关的编译脚本如下，可以看到当运行build的时候，其实是同步运行`build:main`和`build:renderer` ，分别代表编译主进程和渲染进程代码。

```json
"scripts": {
    "build": "concurrently \"yarn build:main\" \"yarn build:renderer\"",
    "build:main": "cross-env NODE_ENV=production webpack --config ./.erb/configs/webpack.config.main.prod.babel.js",
    "build:renderer": "cross-env NODE_ENV=production webpack --config ./.erb/configs/webpack.config.renderer.prod.babel.js"
  },
```

编译主进程的webpack配置文件为 `webpack.config.main.prod.babel.js`，这里注意两个地方，entry和output属性。入口文件为  `main.dev.ts`，编译输出文件为 同级目录下的`main.prod.js`

```js

export default merge(baseConfig, {
  // .... 省略

  mode: 'production',

  target: 'electron-main',
  // 入口文件
  entry: './src/main.dev.ts',
  // 输出文件
  output: {
    path: path.join(__dirname, '../../'),
    filename: './src/main.prod.js',
  },
    
  // .... 省略
});

```

编译渲染进程的webpack配置文件为 `webpack.config.renderer.prod.babel.js`，这里注意两个地方，entry和output属性。入口文件为三个，其中一个为  `src/index.tsx`，编译输出文件为 `src/dist/renderer.prod.js`

```json
export default merge(baseConfig, {
  ...devtoolsConfig,

  mode: 'production',

  target: 'electron-renderer',

  entry: [
    'core-js',
    'regenerator-runtime/runtime',
    path.join(__dirname, '../../src/index.tsx'),
  ],

  output: {
    path: path.join(__dirname, '../../src/dist'),
    publicPath: './dist/',
    filename: 'renderer.prod.js',
  },

  // ...省略
});
```



## 打包

相关脚本，由于脚本使用了rm，在git bash上使用

```bash
# 本地平台的包
$ yarn package
# 指定平台的包，如 win,linux
$ yarn package --win
```

通过其打包脚本，可以看到是先 `yarn build` ，然后再调用 `electron-builder` 进行打包

```
"package": "rm -rf src/dist && yarn build && electron-builder build --publish never",
```

如果想调试 Prod 版本，可以使用如下命令

```bash
$ yarn cross-env DEBUG_PROD=true yarn build
$ yarn cross-env DEBUG_PROD=true yarn start
```



## 样式

本脚手架已经配置了开箱即用的 `css-modules` 。所有的 `.css` 后缀的文件都将使用 `css-modules`，除了类似 `*.global.css` 的文件。如果你想放一些全局样式，可以放在 `app.global.css` 文件中。

如果想引入全局的css样式，那么必须将其放在 `*.global.css` 文件中。

如果想引入 `node_modules` 中的css文件，可以使用如下语法：

```js
// 比如放一个 "~" 在模块名前
@import "~font-awesome/css/font-awesome.css";
```

## 资源

### 编译时资源（Build-time Assets）

通过webpack来管理的资源。脚手架支持图片和字体类型的资源。

```jsx
import catImage from './cat.jpg';

function CatComponent() {
  return (
    <img src={catImage} />
  );
}
```

### 运行时资源（Run-time Assets）

应用里独立的文件，通过文件路径来进行访问。必须在配置 `package.json['build']['files']` 中配置文件的目录，让 electron-builder 在打包时将他们包含进来。注意这里的 `files` 路径都是以`src` 的相对路径。

```json
"build": {
  "productName": "ElectronReact",
  "appId": "org.erb.ElectronReact",
  "files": [
    "dist/",
    "node_modules/",
    "index.html",
    "main.prod.js",
    "main.prod.js.map",
    "package.json"
  ],
}
```

一个Python脚本的例子

```json
"build": {
    ...
    "files": [
      "assets/"
      ...
    ],
}
```

```js
const pythonBinary = path.join(__dirname, 'assets', 'python');
const pythonScript = 'print("Hello World from Python")';
exec(`echo '${pythonScript}' | ${pythonBinary}`, (error, stdout) => {
  console.log(`stdout: ${stdout}`);
});
```

## 依赖

脚手架时双package.json结构，根目录下的package.json和src目录下的package.json。如果模块是和Native相关的模块，则放在src下的package.json。其余放在根目录下的package.json



## 测试

暂省略。。。



# 常见问题

## 将sass改造为less

