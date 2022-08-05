# 前言

实现路由的两种方法：hash和H5 History API，ReactRouter对应就是下面两种路由方式：

- BrowserRouter：基于history的pushState和popState

- HashRouter：基于location.hash和hashchange事件

其使用了history这个库来监听路由变化

> 需要注意的是调用`history.pushState()`或`history.replaceState()`不会触发`popstate`事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用`history.back()`或者`history.forward()`方法）

# History

在 H5 之前，即使采用的是脚本语言的方式，只要浏览器地址栏中的 URL 地址被切换，都会触发一个页面刷新的过程，这个过程将耗费一些时间与资源。在很多时候，尤其是两个大部分内容相同的页面之间进行切换时，这个过程往往被视为一种浪费。

H5 的 History API 允许在不刷新页面的前提下，通过脚本语言的方式来进行页面上某块局部内容的更新。

**例如**，当页面 A 与页面 B 只有局部区域中显示的界面不同，而大部分区域中显示的界面相同时，在 H5 之前，在浏览器中，从页面 A 切换到页面 B 时，需要在浏览器中从页面 A 切换到页面 B，而在 H5 中，可以通过 History API 执行如下处理：

1. 通过 AJAX 请求向服务器端请求页面 B 中与页面 A 中不同的局部区域及该区域中的信息。

2. 在页面 A 中通过脚本语言装载该区域及其中的信息。

3. 通过 History API 在不刷新页面的前提下在浏览器的地址栏中从页面 A 的 URL 地址切换到页面 B 的 URL 地址。

作为这个处理的结果，我们将看见浏览器的地址栏中从页面 A 的 URL 地址切换到页面 B 的 URL 地址，并且显示的页面也完全为页面 B 的页面，从而实现在**不刷新页面**的前提下将浏览器中的页面切换到另一个页面的功能。

```ts
interface History {
    readonly length: number;
    scrollRestoration: ScrollRestoration;
    readonly state: any;
    back(): void;
    forward(): void;
    go(delta?: number): void;
    pushState(data: any, unused: string, url?: string | URL | null): void;
    replaceState(data: any, unused: string, url?: string | URL | null): void;
}
```

`back`、`forward`、`go` 和用户点击浏览器的前进后退按钮，会触发 `popstate` 事件，`pushState` 和 `replaceState` 则不会出发 `popstate` 事件

`history`是由Facebook维护的，`react-router`依赖于`history`，区别于浏览器的`window.history`，`history`是包含`window.history`的，让开发者可以在任何环境都能使用`history`的api（例如`Node`、`React Native`等）。

history有三种方法创建history对象

- createBrowserHistory：支持h5 history api的现代浏览器
- createHashHistory：传统浏览器
- createMemoryHistory ：Node, React Native

# React Router

```tsx
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

```tsx
class Router extends React.Component {

    // ...

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}
```

```tsx
class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          // 拿到上级的数据
          const props = { ...context, location, match };

          // 构造子Route的上下文数据，也就是每个Route都是新的上下文
          return (
            <RouterContext.Provider value={props}>
              // ...
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```
