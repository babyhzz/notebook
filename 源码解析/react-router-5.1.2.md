## 使用方式

实现路由的两种方法：hash和H5 History API

BrowserRouter基于history的pushState和popState

HashRouter基于location.hash和hashchange事件



使用了history这个库来监听路由变化



## history库

 [history源码解析-管理会话历史记录](https://juejin.im/post/5c049f23e51d455b5a4368bd)

[手把手带你上react-router的history车](https://juejin.im/post/5c0640f9f265da6135725930)

**HTML5 history && location对象字段**

```json
// https://www.baidu.com/dd?page=2#1321321 
{
  origin: "https://www.baidu.com"
  protocol: "https:"
  host: "www.baidu.com"
  hostname: "www.baidu.com"
  port: ""
  pathname: "/dd"
  search: "?page=2"
  hash: "#1321321"
  href: "https://www.baidu.com/dd?page=2#1321321"
}
```

```js
const history = {
    length,         // 属性，history历史栈中的数量
    state,          // 属性，pushState和replaceState时传入的对象
    back,           // 方法，后退
    forward,        // 方法，前进
    go,             // 方法，前进或后退n个记录
    pushState,      // 方法，导航到新的路由，并记录在history中
    replaceState    // 方法，替换掉当前记录在history中的路由信息
}

// 调用history.pushState()或者history.replaceState()不会触发popstate事件.
// popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮，
// 或者在JavaScript中调用history.back()、history.forward()、history.go()方法.
window.onpopstate = function (event) {}

// window.onhashchange：当前 URL 的锚部分(以 '#' 号为开始) 发生改变时触发
// a、通过设置Location 对象 的 location.hash 或 location.href 属性修改锚部分;
// b、使用不同history操作方法到带hash的页面;
// c、点击链接跳转到锚点。

window.onpopstate = function (event) {}
```

**history库中的history和location对象**

```js
const history = {
  length,       	// 属性，history中记录的state的数量
  action,        	// 属性，当前导航的action类型
  location,      	// 属性，location对象，封装了pathname、search和hash等属性
  createHref,			//
  push,          	// 方法，导航到新的路由，并记录在history中
  replace,       	// 方法，替换掉当前记录在history中的路由信息
  go,            	// 方法，前进或后退n个记录
  goBack,        	// 方法，后退
  goForward,     	// 方法，前进
  canGo,         	// 方法，是否能前进或后退n个记录
  block,         	// 方法，跳转前让用户确定是否要跳转
  listen         	// 方法，订阅history变更事件
};
```



### createBrowserHistory.js

返回history对象

```js
function createBrowserHistory(props = {}) {
	...
	const history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref,
    push,
    replace,
    go,
    goBack,
    goForward,
    block,
    listen
  };

  return history;
}
```

location对象



## React-Router-Dom

[React Router源码浅析](https://zhuanlan.zhihu.com/p/106042913)





## React-Router-Config

