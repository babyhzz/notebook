**控制台中的 $0-4/$_**

**$0-4** 最近选择过的5个DOM节点，如$0会返回当前选择的DOM节点

**$1** 获取控制台上一次输出的结果

**页面元素可编辑**

```js
document.body.contentEditable = true
```

**代码覆盖率**

ctrl  + shift + p ，show coverage，点击菜单reload即可显示代码覆盖率

**DOM元素的调试**

- 善用Elements中指定DOM右键break on，可以断点DOM元素的改变。
- DOM元素的Event Listener可以查看该DOM元素的事件，以及会触发祖先节点的事件。

**Chrome快捷键**

| 快捷键      | 作用    |
| -------- | ----- |
| Ctrl + L | 清空控制台 |
|          |       |
|          |       |

**有用的控制台命令**

| 命令                           | 用途                                         |
| ---------------------------- | ------------------------------------------ |
| console.table                | 以table的形式展示对象                              |
| console.count                | 计算方法执行的次数（**居然还有这个，从未使用过**）                |
| copy                         | 将内容复制到剪切板                                  |
| keys/values                  | 同Object.keys/Object.values，返回对象的key和values |
| console.time/console.timeEnd | 配合一起记录时间                                   |

```js
// console.count
function func(){console.count("这个方法执行的次数");}
// func()
// VM905:1 这个方法执行的次数: 1
```