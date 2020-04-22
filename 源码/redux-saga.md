### 参考

[redux-saga源码解析](https://lfesc.github.io/redux-saga)

## 使用





## 问题

每次put都会触发render吗？

## 要点

### scheduler

调度任务的处理函数，这个信号量锁不是很好理解，考虑多线程情况吗？

```js
// 调度任务的队列
const queue = []

// 计数的信号量，1被锁，0表释放
let semaphore = 0

// 挂起当前正在执行的调度任务，执行当前任务，当任务执行完毕，释放锁，继续执行调度任务
function exec(task) {
  try {
    suspend()
    task()
  } finally {
    release()
  }
}

// 基于调度器的状态来执行任务或者入队任务
export function asap(task) {
  queue.push(task)

  // 如果处于release状态，挂起调度器，立即强制执行队列中的所有任务
  if (!semaphore) {
    suspend()
    flush()
  }
}

/**
 * Puts the scheduler in a `suspended` state and executes a task immediately.
 */
export function immediately(task) {
  try {
    suspend()
    return task()
  } finally {
    flush()
  }
}

/**
  Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
  scheduler is released.
**/
function suspend() {
  semaphore++
}

/**
  Puts the scheduler in a `released` state.
**/
function release() {
  semaphore--
}

/**
  Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
**/
function flush() {
  release()

  let task
  while (!semaphore && (task = queue.shift()) !== undefined) {
    exec(task)
  }
}

```

