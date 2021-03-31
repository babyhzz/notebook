# 属性

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

Block Formatting Context (块级格式化上下文)

