# React基础

- React的条件渲染可用三元表达式或者if/else
- PureComponent实现了shouldComponentUpdate，对于props和state的浅比较，对于函数式组件的React.memo
- JSX语法是通过React.createElement转义，React.cloneElement复制组件，给组件传值或者添加属性
- Router的传值：通过match，location中获取，params（this.props.match.params）和location（query对象，search：?a=1 后面这一串）



## Context的使用

[官网Context介绍](https://zh-hans.reactjs.org/docs/context.html#contextprovider)







## React面试知识点

- [你要的 React 面试知识点，都在这了](https://juejin.im/post/5cf0733de51d4510803ce34e)

### 函数式编程核心概念：

1. 不可变性（Immutability）：参数不可变
2. 纯函数（Pure Function）：视参数为不可变数据，没有副作用
3. 数据转换：需不改变原数据
4. 高阶函数：函数作为参数或者返回函数，或者两者都有
5. 递归
6. 组合：较小的函数组合成更大的函数。React中常见如下：
```js
const name = compose(
    splitmyName,
    countEachName,
    comvertUpperCase,
    returnName
)
// compose简单的实现方式：
const compose = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
```

#### 组件核心概念：
- 受控组件/非受控组件：受控组件是在 React 中处理输入表单的一种技术。自己维护表单状态称为受控组件，通过ref访问表单为非受控组件。
- 展示组件：无状态，纯函数，没有任何副作用。
- 容器组件：获取处理数据、订阅Redux存储的组件。可包含展示组件和其他容器组件。注意容器组件里可以再包含容器组件。
- 高阶组件：将组件作为参数生成另一个组件的组件。

## React生命周期

- [你真的了解 React 生命周期吗](https://juejin.im/post/5df648836fb9a016526eba01)

![React生命周期](img/reactlifecycle.png)

#### static getDerivedStateFromProps(nextProps,prevState)

返回一个对象来更新state，null则表示不更新。静态函数，无法访问组件内部方法。  
作用：将父组件的props映射到子组件的state上，这样子组件更新state时，不会影响父组件的props。   
触发时机：组件实例化、update时（props、state、forceUpdate）

#### getSnapshotBeforeUpdate(prevProps, prevState)
接收父组件传递过来的 props 和组件之前的状态，此生命周期钩子必须有返回值，返回值将作为第三个参数传递给 componentDidUpdate。必须和 componentDidUpdate 一起使用，否则会报错。   
作用：能让你在组件更新DOM和refs之前，从DOM中捕获一些信息（如滚动位置）
触发时机：组件Update时，在render之后，更新DOM和refs之前。

### 父子组件在生命周期中的加载顺序
#### mount阶段
```
Parent getDerivedStateFromProps
Parent render
Child getDerivedStateFromProps
Child render
Child componentDidMount
Parent componentDidMount
```

可见在render时，先render父组件，然后在render子组件。didmount回调，则先触发子组件mount，再触发父组件mount。

#### update阶段（parent组件state变化）
```
Parent getDerivedStateFromProps
Parent render
Child getDerivedStateFromProps
Child shouldComponentUpdate
Child render
Child componentDidUpdate
Parent componentDidUpdate
```

可见父组件update时，先出发父组件的render，然后是子组件的render，didupdate回调，子组件先出发，父组件后触发

#### unmount阶段
先出发父组件unmount，然后触发子组件unmount


### 常见问题
#### 当外部的 props 改变时，如何再次执行请求数据、更改状态等操作
- componentDidUpdate 中发数据请求
- 组件绑定一个key属性，当key变化时，会创建一个新的组件重新走生命周期，而不是更新一个既有的组件。

#### 如果setState更新的值不变，还会触发生命周期钩子吗？
哪怕每次都设置同样的值，还是会触发更新

# React 高级及深入
- [官网 Render Props](https://zh-hans.reactjs.org/docs/render-props.html)
- [【React深入】从Mixin到HOC再到Hook(很好的文章)](https://juejin.im/post/5cad39b3f265da03502b1c0a)

#### Render Props
- 具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。
- render prop 是一个用于告知组件需要渲染什么内容的函数 prop。
- 任何被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```
> 自己理解：DataProvider是一个有状态组件，自己去获取数据，有自己的state数据，但是需要复用，复用时显示内容不一样，所以需要提供一个函数，
> 参数为暴露出来的数据，返回值则为根据数据render的内容。类似Vue的作用域插槽。

也可以使用children prop，但children prop不需要直接放在属性位置，我们也可以直接放在元素内部。此时的children是一个函数。
> 注意 `this.props.children` 可以任何数据（组件、字符串、函数等等）

```js
<Mouse children={mouse => (
  <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>

<Mouse>
  {mouse => (
    <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
  )}
</Mouse>
```

注意render函数每次都是一个新的对象，即使子组件是PureComponent，也达不到优化效果，所以可以将render func提取为一个实例方法。

#### 从Mixin模式到HOC
Mixin模式同Vue的Mixin，即代码的混入。React目前不推荐用Mixin方式，会带来如下问题：
- Mixin可能会项目依赖，互相耦合，代码维护性较差
- 不同的Mixin可能会冲突
- Mixin很多时，组件是可以感知的，增加组件的复杂性

##### HOC实现方式
HOC可以看作是装饰者模式在React中的一种实现。HOC的两种实现方式：属性代理、反向继承

```js
/* 
* 属性代理，感觉这种用的比较多
* 对比原生组件增强的项：
* 1. 可操作所有传入的props
* 2. 可操作组件的生命周期
* 3. 可操作组件的static方法
* 4. 获取refs
*/
function proxyHOC(WrappedComponent) {
  return class extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}

/* 
* 反向继承，这种目前还没有看到有使用
* 对比原生组件增强的项：
* 1. 可操作所有传入的props
* 2. 可操作组件的生命周期
* 3. 可操作组件的static方法
* 4. 获取refs
* 5. 可操作state
* 6. 可以渲染劫持
*/
function inheritHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  }
}
```

#### HOC可以干什么
- 组合渲染
- 条件渲染
- 操作props
- 获取ref
- 状态管理，如可以把Input的value放在HOC中
- 操作State，只能在反向继承中实现
- 渲染劫持，只要改变了原组件的渲染，我们都将它称之为一种渲染劫持

#### compose 和 Decorators
假设现在我们有logger，visible，style等多个HOC，现在要同时增强一个Input组件。
```js
// 第一种，难以阅读
logger(visible(style(Input)))
// 第二种，提供一个compose函数，与第一种类似
const compose = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
compose(logger,visible,style)(Input);
// 第三种
@logger
@visible
@style
class Input extends Component {
  // ...
}
```

# React Hooks
- [30分钟精通React Hooks](https://juejin.im/post/5be3ea136fb9a049f9121014)
- [【React深入】从Mixin到HOC再到Hook](https://juejin.im/post/5cad39b3f265da03502b1c0a)
- [React Hooks 详解 【近 1W 字】+ 项目实战](https://juejin.im/post/5dbbdbd5f265da4d4b5fe57d)
- [官网：使用 Effect Hook（很详细）](https://react.docschina.org/docs/hooks-effect.html)
- [HOOK FAQ 可以多领会](https://react.docschina.org/docs/hooks-faq.html)

#### 为什么要搞一个Hooks
1. 复用一个有状态的组件太麻烦，官方解决方案：Render Props 和 HOC（提供获取信息功能）。
2. 生命周期钩子函数逻辑乱，比如异步数据请求，有时我们需要在componentDidMount和componentDidUpdate中做同样的事情。
3. class this指向问题

#### State Hook
```js
const [count, setCount] = useState(0);
```
多个state，写多个useState。
setXXX更改state状态，也可以使用函数式方式，参数为上一状态的state。

#### Effect Hook
之前class组件，对于一些副作用，我们会写在 componentDidMount/componentDidUpdate/componentWillUnmount 中，但是现在使用一个
useEffect 即可，三合一！

要点：
1. React首次渲染和以后的每次渲染都会调用传给useEffect的函数，而之前需要在componentDidMount和componentDidUpdate中分别实现。
2. useEffect中的函数是异步执行的，不会阻塞浏览器更新视图。而之前的componentDidMount和componentDidUpdate都是同步的（当然是可以加async/await处理异步任务的）。
3. useEffect清除副作用，返回一个函数即可。它会在调用一个新的 effect 之前对前一个 effect 进行清理。注意前一个effect的清理函数保持着之前的状态。
4. useEffect的第二个参数，可以条件执行effect，只要值没有发送变化则不用执行effect，注意hook是利用Object.is进行浅比较。若传一个空数组，
则表示只运行一次的 effect（仅在组件挂载和卸载时执行）
5. 每次渲染都有自己独立的props和state
6. 可以使用多个Effect关注分离点，也就是说可以写多个useEffect，功能不一样的可以分离
7. useEffect 在全部渲染完毕后才会执行，而useLayoutEffect 会在 浏览器 layout 之后，painting 之前执行

执行时机：useEffect 会在第一次渲染之后和每次更新之后都会执行
```js
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // 运行第一个 effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // 运行下一个 effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 清除上一个 effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // 运行下一个 effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 清除最后一个 effect
```

#### 其他Hooks
##### useLayoutEffect
##### useCallback
依赖项变化时会回调, 类似vue的watch

#### 自定义Hook
把相同的Hook逻辑提取到一个自定义Hook中
```js
import React, { useState, useEffect } from 'react';

// 参数为某个好友的ID，如果friendID变化，则会触发Hook中的副作用。
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
	// 注意这个函数写在了内部
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

要点：
1. 自定义Hook以use开头.
2. 使用相同Hook中的state不会被共享
3. 必须把hooks写在函数最外面，不允许在if/else等条件语句中，保证hooks的执行顺序一致.

#### HOOK FAQ
TODO 仔细看下官方的FAQ!
##### 该如何测量 DOM 节点？
使用callback ref方式, 使用useCallback, 依赖项为[]

# React虚拟DOM

#### 页面呈现的三个阶段

- JS 计算 (Scripting)
- 生成渲染树 (Rendering)
- 绘制页面 (Painting)
  ![页面呈现三个阶段](img/页面呈现三个阶段.jpg)

## 项目ICON的引入

# React最佳实践
##### 多用 Function Component
如果组件是纯展示型的，**不需要维护 state 和生命周期**，则优先使用 Function Component。代码更简洁，更好的复用性，更小的打包体积，更高的执行效率。
> 疑问：什么时候使用Hook呢?

##### 多用 PureComponent
如果组件需要维护 state 或使用生命周期方法，则优先使用 PureComponent，而不是 Component。
Component 的默认行为是**不论 state 和 props 是否有变化**，都触发 render。
而 PureComponent **会先对 state 和 props 进行浅比较**，不同的时候才会 render。

##### 遵循单一职责原则，使用 HOC / 装饰器 / Render Props 增加职责
比如一个公用的组件，数据来源可能是父组件传过来，又或者是自己主动通过网络请求获取数据。这时候可以先定义一个纯展示型的 Function Component，然后再定义一个高阶组件去获取数据

##### 组合优于继承
组合的方式比较符合React的组件编写习惯，优先使用组合方式，如展示组件 + 容器组件。

### 避免在 render 里面动态创建对象 / 方法，否则会导致子组件每次都 render
如下例子，即使Child是PureComponent，不会有任何优化效果，因为obj每次都是新的。
```js
render() {
  const obj = { num: 1 }
  return (
    // onClick每次都是新对象？
    <Child obj={obj} onClick={() => {... }} />
  );
}
```

### 避免在 JSX 中写复杂的三元表达式，应通过封装函数或组件实现

### 多使用解构，如 Function Component 的 props

```js
const MenuItem = ({
  menuId, menuText, onClick, activeId,
}) => {
  return (
    ...
  );
};
```

##### 定义组件时，定义 PropTypes 和 defaultProps

##### 避免使用无谓的标签和样式

# Ant Design最佳实践
#### Modal处理
#### Table的onChange事件处理
#### 容器组件、展示组件分配

# React SSR
- [React SSR 详解【近 1W 字】+ 2个项目实战](https://juejin.im/post/5def0816f265da33aa6aa7fe#heading-1)
