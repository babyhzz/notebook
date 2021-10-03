# React要点

**key属性**

对于列表元素，需要分配一个key值，否则会出现一个警告。

如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。如果你选择不指定显式的 key 值，那么 React 将默认使用索引用作为列表项目的 key 值。

> hc：使用索引作为key，对于动态添加元素或者排序，会根据key复用结点，导致状态错误



# React Hooks

下面的三篇文章，作者用动画的形式完全的诠释了React Hooks的原理，受益匪浅。

> [用动画和实战打开 React Hooks（一）：useState 和 useEffect](https://juejin.cn/post/6844904127110053895)
>
> [用动画和实战打开 React Hooks（二）：自定义 Hook 和 useCallback](https://juejin.cn/post/6844904132164190221)
>
> [用动画和实战打开 React Hooks（三）：useReducer 和 useContext](https://juejin.cn/post/6844904149746728973)

函数式组件思想：**每一次渲染都是完全独立的**，这一点很重要。



**useEffect**

- 每个 Effect 必然在渲染之后执行，因此不会阻塞渲染，提高了性能。如果要在渲染之前执行某些逻辑，可以使用[`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
- 在运行每个 Effect 之前，运行前一次渲染的 Effect Cleanup 函数（如果有的话）
- 当组件销毁时，运行最后一次 Effect 的 Cleanup 函数
- `useEffect` 约定 Effect 函数要么没有返回值，要么返回一个 Cleanup 函数。而 async 函数会隐式地返回一个 Promise，直接违反了这一约定，会造成不可预测的结果。



**Hook的本质是通过一个链表记录所有Hook**

1. `useState` 和 `useEffect` 在每次调用时都被添加到 Hook 链表中；
2. `useEffect` 还会额外地在一个队列中添加一个等待执行的 Effect 函数；
3. 在渲染完成后，依次调用 Effect 队列中的每一个 Effect 函数。

![img](React.assets/aHR0cHM6Ly91c2VyLWdvbGQtY2RuLnhpdHUuaW8vMjAyMC80LzE0LzE3MTc4NjYwNjg5YzczMDE)

**自定义 Hook 本质上只是把调用内置 Hook 的过程封装成一个个可以复用的函数，并不影响 Hook 链表的生成和读取**



**useEffect** 的无限循环

依赖数组在判断元素是否发生改变时使用了 `Object.is` 进行比较，因此当 `deps` 中某一元素为非原始类型时（例如函数、对象等），**每次渲染都会发生改变**，从而每次都会触发 Effect，失去了 `deps` 本身的意义。

```js
// 原始类型
true === true // true
1 === 1 // true
'a' === 'a' // true

// 非原始类型
{} === {} // false
[] === [] // false
() => {} === () => {} // false
```



**useCallback**：为了解决**函数**在多次渲染中的**引用相等**。在大多数情况下，我们都是传入空数组 `[]` 作为 `deps` 参数，这样 `useCallback` 返回的就**始终是同一个函数，永远不会更新**。

**useMemo**：`useCallback` 只能缓存函数相比，`useMemo` 可以缓存任何类型的值（当然也包括函数）

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

```jsx
// 下面两个钩子等价
useCallback(fn, deps);
useMemo(() => fn, deps);
```



useState有一个**函数式更新(<span style="color: red">没使用过，可以尝试下</span>)**，参数为上一次state值。其实现用了 userReducer

```js
// 当通过 setCount(prevCount => prevCount + 1) 改变状态时，action是一个reducer函数
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
```



**userReducer & useContext**

等用过了再来看第三篇文章。



# React事件机制

React 的所有事件并没有绑定到具体的dom节点上而是绑定在了**document** 上，然后由统一的事件处理程序来处理，同时也是基于浏览器的事件机制（冒泡），所有节点的事件都会在 document 上触发

由于原生事件先于合成事件，所以原生事件阻止冒泡肯定会阻止合成事件的触发，但合成事件的阻止冒泡不会影响原生事件。

SyntheticEvent是react合成事件的基类，定义了合成事件的基础公共属性和方法。React会根据当前的事件类型来使用不同的合成事件对象，比如鼠标单机事件 - SyntheticMouseEvent，焦点事件-SyntheticFocusEvent等，但是都是继承自SyntheticEvent。



# React Fiber

React 框架内部的运作可以分为 3 层：

- Virtual DOM 层，描述页面长什么样。
- Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
- Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。



Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示（16.10.0）：

```js
// Fiber对应一个组件需要被处理或者已经处理了，一个组件可以有一个或者多个Fiber
type Fiber = {|
  // 标记不同的组件类型
  tag: WorkTag,

  // ReactElement里面的key
  key: null | string,

  // ReactElement.type，也就是我们调用`createElement`的第一个参数
  elementType: any,

  // The resolved function/class/ associated with this fiber.
  // 异步组件resolved之后返回的内容，一般是`function`或者`class`
  type: any,

  // The local state associated with this fiber.
  // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,

  // 单链表树结构
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构
  // 兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  index: number,

  // ref属性
  ref: null | (((handle: mixed) => void) & {_stringRef: ?string}) | RefObject,

  // 新的变动带来的新的props
  pendingProps: any, 
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 上一次渲染的时候的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency: ContextDependency<mixed> | null,

  // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // Fiber被创建的时候他会继承父Fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode: TypeOfMode,

  // Effect
  // 用来记录Side Effect
  effectTag: SideEffectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成
  // 不包括他的子树产生的任务
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,

  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  alternate: Fiber | null,

  // 下面是调试相关的，收集每个Fiber和子树渲染时间的
  actualDuration?: number,
  actualStartTime?: number,
  selfBaseDuration?: number,
  treeBaseDuration?: number,
|};
```



Reconcilation 协调，CPU密集型操作

之前：递归找出变动节点，同步更新它们

通过Fiber，让Reconciliation变得可被中断

协程和线程并不一样，协程并没有并发或并行的能力，只是一种控制流程让出机制



Fiber的思想：React的渲染过程可被中断，将控制权交给浏览器

Fiber是我们所说的工作单元，performUnitOfWork负责对Fiber进行操作

由于使用了链表结果，即使处理流程终端，也随时可以从上次未处理完的Fiber继续遍历





- 协调阶段，可认为是diff阶段，可被中断
- 提交阶段，必须同步执行，不能被打断



Fiber包含5个部分

- 结构信息
- 节点类型信息
- 节点状态
- 副作用
- 替身 workInProgress tree，alternate指向旧树的同等节点







































# React优化

## 代码分割

### React.lazy

官网([这里](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy))推荐是用 `React.lazy`

```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

`React.lazy` 接受一个函数，这个函数需要动态调用 `import()`。它必须返回一个 `Promise`，该 Promise 需要 resolve 一个 `default` export 的 React 组件。 

 然后应在 `Suspense` 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

`React.lazy` 和 Suspense 技术还不支持服务端渲染。

该特性需要依赖如下babel插件，该插件已经包含在@babel/preset-env里

```json
"plugins": ["@babel/plugin-syntax-dynamic-import"]
```

### 路由中使用代码分割

**React.lazy版本**

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

**loadable 版本**

```jsx
import loadable from "@loadable/component";
import Loading from "./Loading.js";

const LoadableComponent = loadable(() => import("./Dashboard.js"), {
  fallback: <Loading />
});

export default class LoadableDashboard extends React.Component {
  render() {
    return <LoadableComponent />;
  }
}
```