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