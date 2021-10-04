# 使用

### Redux

有Redux源码可知，其核心在于createStore函数，并返回一个api对象

```js
export default function createStore(reducer, preloadedState, enhancer) {
  
  // ...
  
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

使用方式如下：

```js
// store.js
import { createStore } from 'redux'

// 3. 下面store每dispatch一次reducer就会重新执行并计算一次state
function reducer(state = {a: 1}, action) {
  const { type, payload } = action
  return payload
}

// 0. 创建一个store
const store = createStore(reducer)

// 1. 监听store中state的变更
store.subscribe((state) => {
  console.log(state)
})

// 2. 发送一个action来通知reducer修改state
// {type: 'type1', payload: 1} 就是一个ation
store.dispatch({
  type: 'type1',
  payload: {a: 2}
})
```

### React Redux

```jsx
import { Provider } from 'react-redux'
// redux方式创建一个store
import store from './store'
import App from './App.js'

// 通过Provider组件注入到Context中，然后各组件通过connect高阶组件连接
ReactDOM.render(<Provider store={store}><App /></Provider>)
```



### connect

#### mapStateToProps

两个参数，第二个参数意义？

mapStateToProps(state, ownProps)

- ownProps:  如果你的组件需要用自身的`props`数据以从store中检索出数据，你可以传入第二个参数，`ownProps`。这个参数将包含所有传递给由`connect`生成的包装组件的`props`。 

#### mapDispatchToProps

actionCreators









