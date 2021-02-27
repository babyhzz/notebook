## 使用

### 主流程

```js
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
```



### router

```js
import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Products from './routes/Products';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/products" exact component={Products} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
```

### model

```js
export default {

  namespace: 'example',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
  
	subscriptions: {
    init({ dispatch, history }) {
      // history库中回调listener，出入location和action两个参数
      // 一旦注册，每次路由变化都会回调
      // location: {pathname, search, hash, query, state, key}
      history.listen((location, action) => {
        console.log(location);
        console.log(action);
      })
    }
  }
};

```



















### 在Umi中的使用

[model注册](https://umijs.org/zh/guide/with-dva.html#model-%E6%B3%A8%E5%86%8C)

dva model如何重置数据

dispatch回调，在action中加入一个参数作为回调，如：

```json
{
  type: "add",
  payload: 1,
  onComplete: ....
}
```

### dva-loading的使用

我看到由global，models，effects，可以看到由三个级别



有个缺陷，就是effect中无法很优雅的调用其他effect，作者给的解决方案。

> 两个方案：
>
> 1. 通过 put `action` 去调? `yield put({ type: 'auth' });`，缺点是不会等待完成
> 2. `auth` 抽到 model 外，然后在 effect 里用 `yiled *` 去调他