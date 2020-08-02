# 微任务宏任务

**宏任务**：可以认为每次执行栈（call stack）中执行的代码是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中），宏任务和渲染是交叉进行，**渲染线程会将宏任务对DOM的修改做优化**。
注意setTimeout的回调属于下一次宏任务。  包括script代码、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel等

**微任务**：宏任务之后，渲染之前，会将期间产生的所有微任务都执行。Promise中的then触发时（即Resolve时），将会插入微任务队列。如Promise.then、MutationObserver、process.nextTick（Node.js环境）

所以执行流程是：宏任务 -> 微任务 -> 渲染 -> 宏任务 -> 微任务 -> 渲染 -> ...

> js是单线程的，若是多线程不加锁，会导致渲染结果不可预期
>
> GUI渲染线程与JS引擎互斥（若一边修改一边渲染会导致渲染结果不一致），渲染线程会在JS引擎空闲时执行



# EventLoop概念

1. JS 分为同步任务和异步任务，同步任务都在JS线程上执行，形成一个执行栈，JS线程只执行执行栈中的任务。

2. **事件触发线程管理一个事件队列**，异步任务触发条件达成，会将回调事件放到事件队列中

3. 执行栈中的代码执行完毕，就会读取事件队列中的事件，添加到执行栈中，开始执行
4.  Event Table 可以理解成一张事件->回调函数 对应表，Event Queue 简单理解就是回调函数队列，所以它也叫Callback Queue 

![eventloop](img/eventloop2.png)





# EventLoop原理

![EventLoop](img/eventloop.jpg)

在前端开发中我们会通过`setTimeout/setInterval`来指定定时任务，会通过`XHR/fetch`发送网络请求， 接下来简述一下`setTimeout/setInterval`和`XHR/fetch`到底做了什么事

我们知道，不管是`setTimeout/setInterval`和`XHR/fetch`代码，在这些代码执行时， 本身是同步任务，而其中的回调函数才是异步任务。

当代码执行到`setTimeout/setInterval`时，实际上是`JS引擎线程`通知`定时触发器线程`，间隔一个时间后，会触发一个回调事件， 而`定时触发器线程`在接收到这个消息后，会在等待的时间后，将回调事件放入到由`事件触发线程`所管理的`事件队列`中。

当代码执行到`XHR/fetch`时，实际上是`JS引擎线程`通知`异步http请求线程`，发送一个网络请求，并指定请求完成后的回调事件， 而`异步http请求线程`在接收到这个消息后，会在请求成功后，将回调事件放入到由`事件触发线程`所管理的`事件队列`中。

当我们的同步任务执行完，`JS引擎线程`会询问`事件触发线程`，在`事件队列`中是否有待执行的回调函数，如果有就会加入到执行栈中交给`JS引擎线程`执行