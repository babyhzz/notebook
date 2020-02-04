# React面试知识点
- [你要的 React 面试知识点，都在这了](https://juejin.im/post/5cf0733de51d4510803ce34e)

#### 函数式编程核心概念：
1. 不可变性（Immutability）：参数不可变
2. 纯函数（Pure Function）：视参数为不可变数据，没有副作用
3. 数据转换：需不改变原数据
4. 高阶函数：函数作为参数或者返回函数，或者两者都有
5. 递归
6. 组合：较小的函数组合成更大的函数，js中较常用的就是链接。React中常见如下：
```js
const name = compose(
    splitmyName,
    countEachName,
    comvertUpperCase,
    returnName
)
```

#### 组件核心概念：
- 受控组件/非受控组件：受控组件是在 React 中处理输入表单的一种技术。自己维护表单状态称为受控组件，通过ref访问表单为非受控组件。
- 展示组件：无状态，纯函数，没有任何副作用。
- 容器组件：获取处理数据、订阅Redux存储的组件。可包含展示组件和其他容器组件。注意容器组件里可以再包含容器组件。
- 高阶组件：将组件作为参数生成另一个组件的组件。

# React生命周期
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

### 常见问题
#### 当外部的 props 改变时，如何再次执行请求数据、更改状态等操作
- componentDidUpdate 中发数据请求
- 组件绑定一个key属性，当key变化时，会创建一个新的组件重新走生命周期，而不是更新一个既有的组件。

#### 如果setState更新的值不变，还会触发生命周期钩子吗？
哪怕每次都设置同样的值，还是会触发更新

# React 高级指引
- [官网 Render Props](https://zh-hans.reactjs.org/docs/render-props.html)

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


## 虚拟DOM
### Virtual DOM

virtual dom 只是一个简单的 JS 对象，至少包含 tag（标签名），props（属性），children（子元素）三个属性。

```js
{
  tag: "div",
  props: { },
  children: [
    "Hello World",
    {
      tag: "ul",
      props: {},
      children: [{
        tag: "li",
        props: {
          id: 1,
          class: "li-1"
        },
        children: ["第", 1]
      }]
    }
  ]
}
```

对应如下：

```html
<div>
  Hello World
  <ul>
    <li id="1" class="li-1">
      第1
    </li>
  </ul>
</div>
```

### Virtual DOM 好处

1. 将页面状态抽象为 JS 对象，配合不同的渲染工具，使跨平台渲染成为可能，如浏览器渲染、服务端渲染、移动端渲染
2. 在页面更新的时候可以将多次比较的结果合并成一次进行页面更新，减少渲染次数，提高渲染效率。

### 页面呈现的三个阶段

- JS 计算 (Scripting)
- 生成渲染树 (Rendering)
- 绘制页面 (Painting)
  ![页面呈现三个阶段](img/页面呈现三个阶段.jpg)

### Virtual DOM 生成真实 DOM

借助 JSX 编译器，可以将文件中的 HTML 转化成函数的形式，然后再利用这个函数生成 Virtual DOM

```js
function render() {
  return (
    <div>
      Hello World
      <ul>
        <li id="1" class="li-1">
          第1
        </li>
      </ul>
    </div>
  );
}
```

这个函数经过 JSX 编译后，会输出下面的内容：

```js
function render() {
  return h(
    "div",
    null,
    "Hello World",
    h("ul", null, h("li", { id: "1", class: "li-1" }, "\u7B2C1"))
  );
}
```

这里的 h 是一个函数，可以起任意的名字。这个名字通过 babel 进行配置：

```js
// .babelrc文件
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "h"    // 这里可配置任意的名称
    }]
  ]
}
```

我们只需要定义 h 函数，就能构造出 Virtual DOM

```js
function flatten(arr) {
  return [].concat.apply([], arr);
}

function h(tag, props, ...children) {
  return {
    tag,
    props: props || {},
    children: flatten(children) || []
  };
}
```

执行 h 函数后，最终会得到如下的 Virtual DOM 对象：

```js
{
  tag: "div",
  props: { },
  children: [
    "Hello World",
    {
      tag: "ul",
      props: {},
      children: [{
        tag: "li",
        props: {
          id: 1,
          class: "li-1"
        },
        children: ["第", 1]
      }]
    }
  ]
}
```

下一步，通过遍历 vdom 对象，生成真实的 dom

```js
// 创建dom元素
function createElement(vdom) {
  // 如果vdom是字符串或者数字类型，则创建文本节点，比如“Hello World”
  if (typeof vdom === "string" || typeof vdom === "number") {
    return doc.createTextNode(vdom);
  }

  const { tag, props, children } = vdom;

  // 1. 创建元素
  const element = doc.createElement(tag);

  // 2. 属性赋值
  setProps(element, props);

  // 3. 创建子元素
  // appendChild在执行的时候，会检查当前的this是不是dom对象，因此要bind一下
  children.map(createElement).forEach(element.appendChild.bind(element));

  return element;
}

// 属性赋值
function setProps(element, props) {
  for (let key in props) {
    element.setAttribute(key, props[key]);
  }
}
```
## 项目ICON的引入

## 最佳实践

### 多用 Function Component

如果组件是纯展示型的，**不需要维护 state 和生命周期**，则优先使用 Function Component。它有如下好处：

- 代码更简洁，一看就知道是纯展示型的，没有复杂的业务逻辑
- 更好的复用性。只要传入相同结构的 props，就能展示相同的界面，不需要考虑副作用。
- 更小的打包体积，更高的执行效率

一个典型的 Function Component 是下面这个样子：

```js
function MenuItem({ menuId, menuText, onClick, activeId }) {
  return (
    <div
      menuId={menuId}
      className={`${style} ${activeId === menuId ? active : ""}`}
      onClick={onItemClick}
    >
      {menuText}
    </div>
  );
}
```

### 多用 PureComponent

如果组件需要维护 state 或使用生命周期方法，则优先使用 PureComponent，而不是 Component。Component 的默认行为是不论 state 和 props 是否有变化，都触发 render。而 PureComponent **会先对 state 和 props 进行浅比较**，不同的时候才会 render。请看下面的例子：

```js
class Child extends React.Component {
  render() {
    console.log("render Child");
    return <div>{this.props.obj.num}</div>;
  }
}

class App extends React.Component {
  state = {
    obj: { num: 1 }
  };

  onClick = () => {
    const { obj } = this.state;
    this.setState({ obj });
  };

  render() {
    console.log("render Parent");
    return (
      <div className="App">
        <button onClick={this.onClick}>点我</button>
        <Child obj={this.state.obj} />
      </div>
    );
  }
}
```

点击按钮后，Parent 和 Child 的 render 都会触发。如果将 Child 改为 PureComponent，则 Child 的 render 不会触发，因为 props 还是同一个对象。如果将 Parent 也改为 PureComponent，则 Parent 的 render 也不会触发了，因为 state 还是同一个对象。

### 遵循单一职责原则，使用 HOC / 装饰器 / Render Props 增加职责

比如一个公用的组件，数据来源可能是父组件传过来，又或者是自己主动通过网络请求获取数据。这时候可以先定义一个纯展示型的 Function Component，然后再定义一个高阶组件去获取数据：

```js
function Comp() {
  ...
}

class HOC extends PureComponent {

  async componentDidMount() {
    const data = await fetchData();
    this.setState({ data });
  }

  render() {
    return (<Comp data={this.state.data} />);
  }
}
```

### 组合优于继承

笔者在真实项目中就试过以继承的形式写组件，自己写得很爽，代码的复用性也很好，但最大的问题是别人看不懂。我将复用的业务逻辑和 UI 模版都在父类定义好，子类只需要传入一些参数，然后再覆盖父类的几个方法就好（render 的时候会用到）。简化的代码如下：

```js
class Parent extends PureComponent {
  componentDidMount() {
    this.fetchData(this.url);
  }

  fetchData(url) {
    ...
  }

  render() {
    const data = this.calcData();
    return (
      <div>{data}</div>
    );
  }
}

class Child extends Parent {
  constructor(props) {
    super(props);
    this.url = 'http://api';
  }

  calcData() {
  ...
  }
}
```

这样的写法从语言的特性和功能实现来说，没有任何问题，最大的问题是不符合 React 的组件编写习惯。父类或者子类肯定有一方是不需要实现 render 方法的，而一般我们看代码都会优先找 render 方法，找不到就慌了。另外就是搞不清楚哪些方法是父类实现的，哪些方法是子类实现的，如果让其他人来维护这份代码，会比较吃力。

继承会让代码难以溯源，定位问题也比较麻烦。所有通过继承实现的组件都可以改写为组合的形式。上面的代码就可以这样改写：

```js

class Parent extends PureComponent {
  componentDidMount() {
    this.fetchData(this.props.url);
  }

  fetchData(url) {
  ...
  }

  render() {
    const data = this.props.calcData(this.state);
    return (

      <div>{data}</data>
    );
  }
}

class Child extends PureComponent {
  calcData(state) {
  ...
  }

  render() {
    <Parent url="http://api" calcData={this.calcData} />
  }
}
```

这样的代码是不是看起来舒服多了？

如果 props 的数据不会改变，就不需要在 state 或者组件实例属性里拷贝一份
经常会看见这样的代码：

```js
componentWillReceiveProps(nextProps) {
  this.setState({ num: nextProps.num });
}

render() {
  return (
    <div>{this.state.num}</div>
  );
}
```

num 在组件中不会做任何的改变，这种情况下直接使用 this.props.num 就可以了。

### 避免在 render 里面动态创建对象 / 方法，否则会导致子组件每次都 render

```js
render() {
  const obj = { num: 1 }
  return (
    // onClick每次都是新对象？
    <Child obj={obj} onClick={() => {... }} />
  );
}
```

在上面代码中，**即使 Child 是 PureComponent**，由于 obj 和 onClick 每次 render 都是新的对象，Child 也会跟着 render。

### 避免在 JSX 中写复杂的三元表达式，应通过封装函数或组件实现

```js
render() {
  const a = 8;

  return (

    <div>
      {
        a > 0 ? a < 9 ? ... : ... : ...
      }
  </div>
  );
}
```

像上面这种嵌套的三元表达式可读性非常差，可以写成下面的形式：

```js
f() {
  ...
}

render() {
  const a = 8;

  return (

    <div>
      {
        this.f()
      }
    </div>
  );
}
```

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

### 定义组件时，定义 PropTypes 和 defaultProps

例子如下：

```js
class CategorySelector extends PureComponent {
  ...
}

CategorySelector.propTypes = {
  type: PropTypes.string,
  catList: PropTypes.array.isRequired,
  default: PropTypes.bool,
};

CategorySelector.defaultProps = {
  default: false,
  type: undefined,
};
```

### 避免使用无谓的标签和样式

下面这种情况一般外层的 div 是多余的，可以将样式直接定义在组件内，或者将定制的样式作为参数传入。例外：当 ServiceItem 需要在多个地方使用，而且要叠加很多不一样的样式，原写法会方便些。

```js
// bad
<div key={item.uuid} className={scss.serviceItemContainer}>
    <ServiceItem item={item} />
</div>

// good
<ServiceItem key={item.uuid} item={item} className={customStyle} />
```

## Ant Design最佳实践
### Modal处理
### Table的onChange事件处理
### 容器组件、展示组件分配