# 前言

实现路由的两种方法：hash和H5 History API，ReactRouter对应就是下面两种路由方式：

- BrowserRouter：基于history的pushState和popState

- HashRouter：基于location.hash和hashchange事件

其使用了history这个库来监听路由变化

> 需要注意的是调用`history.pushState()`或`history.replaceState()`不会触发`popstate`事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用`history.back()`或者`history.forward()`方法）



# History

`history`是由Facebook维护的，`react-router`依赖于`history`，区别于浏览器的`window.history`，`history`是包含`window.history`的，让开发者可以在任何环境都能使用`history`的api（例如`Node`、`React Native`等）。

history有三种方法创建history对象

- createBrowserHistory：支持h5 history api的现代浏览器
- createHashHistory：传统浏览器
- createMemoryHistory ：Node, React Native

