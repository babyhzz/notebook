# React Hooks

下面的三篇文章，作者用动画的形式完全的诠释了React Hooks的原理，受益匪浅。

> [用动画和实战打开 React Hooks（一）：useState 和 useEffect](https://juejin.cn/post/6844904127110053895)
>
> [用动画和实战打开 React Hooks（二）：自定义 Hook 和 useCallback](https://juejin.cn/post/6844904132164190221)
>
> [用动画和实战打开 React Hooks（三）：useReducer 和 useContext](https://juejin.cn/post/6844904149746728973)



函数式组件思想：**每一次渲染都是完全独立的**，这一点很重要。



**useEffect** 注意点：

- 每个 Effect 必然在渲染之后执行，因此不会阻塞渲染，提高了性能。如果要在渲染之前执行某些逻辑，可以使用[`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
- 在运行每个 Effect 之前，运行前一次渲染的 Effect Cleanup 函数（如果有的话）
- 当组件销毁时，运行最后一次 Effect 的 Cleanup 函数
- `useEffect` 约定 Effect 函数要么没有返回值，要么返回一个 Cleanup 函数。而这里 async 函数会隐式地返回一个 Promise，直接违反了这一约定，会造成不可预测的结果。



**Hook的本质是通过一个链表记录所有Hook**

1. `useState` 和 `useEffect` 在每次调用时都被添加到 Hook 链表中；
2. `useEffect` 还会额外地在一个队列中添加一个等待执行的 Effect 函数；
3. 在渲染完成后，依次调用 Effect 队列中的每一个 Effect 函数。



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



useState有一个**函数式更新**，参数为上一次state值。其实现用了 userReducer

```js
// 当通过 setCount(prevCount => prevCount + 1) 改变状态时，action是一个reducer函数
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
```



**userReducer & useContext**

等用过了再来看第三篇文章。