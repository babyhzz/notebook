# 如何学习

1. node in action看5遍，然后去写
2. 写一些小工具
3. 学习express
4. 学习koa



Node使用场景：

1. webpack
2. 服务器
   1. 作为Server
   2. 作为中间件，处理简单逻辑，或者仅实现跨域
   3. 服务端渲染

Node.js特点：

1. 单线程异步
2. 无阻塞I/O
3. 事件驱动



要点：

1. process
2. Buffer
3. setImmediate



xxx.js中的this指的是当前模块本身



### CommonJS模块管理机制

1. require导入是同步的
2. 每次导入模块require，相当于从上到下执行一遍。



node中相对路径是相对根目录，即node执行的目录，会比较混乱，不同的执行路径，导致代码获取的路径不一样。

__dirname 代表当前模块所在的绝对路径。

path.resolve() 返回node的根目录，可根据参数进行拼接。