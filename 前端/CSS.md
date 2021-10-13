# 属性

## display

`flex` 和 `inline-flex` 的区别，前者宽度默认100%，后者具有包裹性。

































## flex

**flex-basis**

flex-basis和width同时存在，**flex-basis优先级高于width**。需要注意的是，当flex-basis和width，其中一个属性值为auto时，非auto的优先级更高。虽然指定了flex-basis，但其实际的宽度会视情况而定：

**width为auto，flex-basis和实际宽度以尺寸大的为准**

- 实际内容宽度 > flex-basis，则宽度为实际内容宽度
- 实际内容宽度 < flex-basis，则宽度为flex-basis值

**width不为auto且不设置overflow: hidden**，视情况而定，规则较复杂。

**over-flow: hidden，无论任何情况，都以flex-basis为准**

最佳实践：左侧固定的话，左侧使用 flex-basis + overflow: hidden

# 概念

## BFC

参考：https://juejin.cn/post/6950082193632788493

Block Formatting Context (块级格式化上下文)，简单来说就是，`BFC`是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。

### 触发BFC

- overflow: hidden
- display: inline-block
- position: absolute
- position: fixed
- display: table-cell
- display: flex

### BFC规则

`BFC`就是一个块级元素，块级元素会在垂直方向一个接一个的排列

`BFC`就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签

垂直方向的距离由margin决定， 属于同一个`BFC`的两个相邻的标签外边距会发生重叠

计算`BFC`的高度时，浮动元素也参与计算

### BFC解决的问题

1. float高度塌陷问题
2. margin边距重叠
3. 两栏布局float覆盖问题