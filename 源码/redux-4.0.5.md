本文是基于redux 4.0.5的源码做的解析，源码不多，目录结构如下所示：

![redux目录 ](img/redux-4.0.5-src.png)



## utils

### actionTypes.js

```js
const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.')

const ActionTypes = {
  INIT: `@@redux/INIT${randomString()}`,
  REPLACE: `@@redux/REPLACE${randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

export default ActionTypes
```

该文件首先定义了一个产生随机数的函数，然后定义了三个内部使用的ActionType。

### isPlainObject.js

```js
export default function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
```

判断是否是一个简单对象，什么是简单对象呢？就是由Object构造函数或者字面量方式创建的对象，即`obj.__proto__ === Object.protype` 。

> 我的解读：上面的意思是一个对象的原型链深度只有一层，一般情况下只有Object才能满足，但可以人为创建一个原型为null的构造函数来终止原型链。
>
> 我们可以先看下 lodash 中 [isPlainObject](https://lodash.com/docs/4.17.15#isPlainObject) 的解释：
>
> `_.isPlainObject(value)`
>
>  Checks if `value` is a plain object, that is, an object created by the `Object` constructor or one with a `[[Prototype]]` of `null`. 
>
> 也就是说由Object创建的对象或者字面量对象，以及由没有原型的构造函数所创建
>
> ```js
> _.isPlainObject([1, 2, 3]);
> // => false
>  
> _.isPlainObject({ 'x': 0, 'y': 0 });
> // => true
>  
> _.isPlainObject(Object.create(null));
> // => true
> 
> // 补充：Object.create对应的原理如下，即创建一个对象以参数为原型
> Object.create =  function (o) {
>     var F = function () {};
>     F.prototype = o;
>     return new F();
> };
> ```

只不过这里有点疑问，为什么不能这么写呢？

```js
const proto = Object.getPrototypeOf(obj);
return proto === Object.prototype || proto === null
```

### warning.js

打印错误信息，适配了console在ie低版本中的兼容性问题



## index.js

```js
import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'
import warning from './utils/warning'
import __DO_NOT_USE__ActionTypes from './utils/actionTypes'

// 省去非重要的代码

export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
}

```

该文件是整个redux的入口文件，暴露了很多方法，每个方法都在对应的文件中，我们一个个的看。

### createStore.js

```js
export default function createStore(reducer, preloadedState, enhancer) {
  
  // ... 省略部分代码
    
  let currentReducer = reducer			// 当前的reducer
  let currentState = preloadedState		// store的当前状态
  let currentListeners = []             // 当前订阅列表
  let nextListeners = currentListeners  // 新的订阅列表
  let isDispatching = false             // 作为锁来用
  
  // ... 省略了需要到处的函数定义
  
  dispatch({ type: ActionTypes.INIT })
  
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

由此可见，createStore创建了一个闭包环境，暴露了一些操作内部遍历的函数。createStore的前两个参数很好理解，第三个参数enhancer意思为增强器，来增强redux的，下面将会介绍。

createStore也适配了两个参数的情形，第二个参数可以忽略，代码如下：

```js
if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
  enhancer = preloadedState
  preloadedState = undefined
}
```

#### getState

```js
function getState() {
  if (isDispatching) {
    throw new Error(
      'You may not call store.getState() while the reducer is executing. ' +
      'The reducer has already received the state as an argument. ' +
      'Pass it down from the top reducer instead of reading it from the store.'
    )
  }
  // 由此可看出，此处直接返回了内部对象，非副本，理论上可修改内部state，但是不会进行事件通知
  return currentState
}
```

可以看到，当在进行reducer操作时获取state，则会报错。该函数直接返回内部状态currentState，并没有做拷贝动作，因此这里得到的state是可以被更改的，但是redux不允许这么做。

#### dispatch

```js
function dispatch(action) {
  // 省略代码：判断是否是plainObject，判断action是否有type属性

  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.')
  }

  try {
    isDispatching = true
    currentState = currentReducer(currentState, action)
  } finally {
    isDispatching = false
  }

  // 通知每一个listener
  // 注意currentListeners = nextListeners这一步操作，后面会提到
  const listeners = (currentListeners = nextListeners)
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }

  return action
}
```

可以看到dispatch实际上就是就是调用reducer，然后通知所有订阅的监听者，listener是没有回调参数的。同样isDispatch起到锁的作用，当执行reducer时为true。

#### subscribe

```js
function subscribe(listener) {
  if (typeof listener !== 'function') {
    throw new Error('Expected the listener to be a function.')
  }

  if (isDispatching) {
    throw new Error('xxx')
  }

  // listener的订阅状态
  let isSubscribed = true

  ensureCanMutateNextListeners()
  nextListeners.push(listener)

  return function unsubscribe() {
    if (!isSubscribed) {
      return
    }

    if (isDispatching) {
      throw new Error('xxx')
    }

    isSubscribed = false

    ensureCanMutateNextListeners()
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
    currentListeners = null
  }
}
```

可以看出，如果正在执行reducer的时候是不允许进行订阅的。注意该函数的返回值取消该订阅的函数，通过闭包实现。这里需要看下ensureCanMutateNextListeners的实现：

```js
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {
    nextListeners = currentListeners.slice()
  }
}
```

当nextListeners 和 currentListeners为同一引用的时候，则对currentListeners进行一次浅拷贝，保证nextListeners是可以更改的。因为在dispatch的最后，会将currentListeners指向nextListeners，调用所有的监听函数，此时为了保证currentListeners不被修改，乱序导致发生错误，故每当需要对listeners进行修改的时候，均进行一次浅拷贝操作，起到一个缓存的作用，也就是所有的操作针对缓存的，当需要遍历执行的时候，则取最新数据。

#### replaceReducer

更改reducer，这个方法我们一般很少用到。

```js
function replaceReducer(nextReducer) {
  if (typeof nextReducer !== 'function') {
    throw new Error('Expected the nextReducer to be a function.')
  }

  currentReducer = nextReducer

  // This action has a similiar effect to ActionTypes.INIT.
  // Any reducers that existed in both the new and old rootReducer
  // will receive the previous state. This effectively populates
  // the new state tree with any relevant data from the old one.
  dispatch({ type: ActionTypes.REPLACE })
}
```

#### ActionTypes.INIT

在createStore函数的末尾我们可以看到，dispatch了这样的一个action

```js
dispatch({ type: ActionTypes.INIT })
```

是因为我们的初始状态currentState为undefined，发了这样一个action是为了拿到state的初始状态对象。

### applyMiddleware & enhancer

> 这部分是Redux的精华，也是十分难以理解的地方。重点理解。

通过enhancer的调用方式`enhancer(createStore)(reducer, preloadedState)`，我们可以看出，enhancer是返回一个以createStore为参数的加强版本的createStore函数。而applyMiddleware就是用来适配middleware返回enhancer函数的。

最难理解的一个函数，	

```js
export default function applyMiddleware(...middlewares) {

  // 返回一个高阶函数
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }

    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    // applyMiddleware主要是对dispatch的装饰
    return {
      ...store,
      dispatch
    }
  }
}
```

温习一下compose函数：

```js
compose(f, g) = (...args) => f(g(..args));
// 这里我们把参数换成next，next可以认为是增强版本的dispatch函数
compose(f, g) = next => f(g(next));
```

现在看如下两行关键代码：

```js
// 一个中间件最简单的形式：store => next => action => next(action)
// 通过如下一层计算，每个函数变成：next => action => next(action)
// 即传入一个dispatch函数，返回一个dispatch函数
const chain = middlewares.map(middleware => middleware(middlewareAPI))
// 如下这句代码可以看作通过中间件对dispatch函数做了层层增强后的dispatch函数
// next可看作是上一个中间件修饰生成的dispatch函数，初始的next函数就是store.dispatch
// dispatch修饰是从右到左，dispatch的执行是从左到右
dispatch = compose(...chain)(store.dispatch)
```



### combineReducers.js

参数reducers是一个对象，类似如下形式，返回一个新的代理所有reducers的函数。

```json
{
	key1: reducer1(),
  key2: reducer2()
}
```

代码如下，只保留关键代码：

```js
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}

  // 找出所有是函数的reducer
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  let shapeAssertionError
  try {
    // 保证每个reducer有初始值，对于任意类型action都有返回值
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  // 返回一个代理所有的reducer的函数
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    let hasChanged = false  
    const nextState = {}
    // 遍历，执行每一个reducer
    for (let i = 0; i < finalReducerKeys.length; i++) {
      // 根据它们的 key 来筛选出 state 中的一部分数据并处理
      const key = finalReducerKeys[i]
      // 找到对应的reducer
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
      // 只要有任何一个子state变化，hasChanged为true
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}

```

### compose.js

组合函数

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

### bindActionCreators.js

这是一个辅助函数，可以将一个actionCreators映射成一个个自动dispatch的函数

```js
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments))
  }
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  const boundActionCreators = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```



## redux-thunk 源码

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
		// next可看作是上一个中间件修饰生成的dispatch函数
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

