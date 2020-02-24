## 使用

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