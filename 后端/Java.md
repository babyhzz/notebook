#### ThreadLocal
每个线程维护一个ThreadLocalMap（ThreadLocal的内部类），键为ThreadLocal，值为Object。当new ThreadLocal()之后，就声明了一个线程本地变量。
当调用ThreadLocal的set方法时，会在当前调用线程Thread维护的ThreadLocalMap中以自己为key，值为value添加到其中，形成一份线程的拷贝。
个人感觉ThreadLocal的作用时，创建一个线程隔离的变量，并且在线程的整个生命周期中生效。

#### 线程的机种状态
```java
public enum State {	
	NEW, // 刚创建，还没有执行start方法
	RUNNABLE, // 线程执行时
	BLOCKED, // 阻塞，如等待一个锁
	WAITING, // 不确定事件等待
	TIMED_WAITING, // 确定事件等待
	TERMINATED;	// 执行完毕
}
```