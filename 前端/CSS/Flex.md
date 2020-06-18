## Flex

### 1. [flex-basis 和 width关系](https://segmentfault.com/a/1190000011650962)

> 经常在项目中碰到左侧宽度固定，右侧自适应清空，使用flex-basis: 0 0 100px，想的是可以固定宽度，发现有时无法固定宽度，原因是：在width为auto的情况下，当实际宽度 > flex-basis的情况下，以实际宽度为准

#### 默认值

- flex-basis 默认值：auto，即flex-basis的属性值为项目的width属性值
- width 默认值：auto，即项目的width属性值为项目内容的宽度
- 项目的实际宽度是flex-basis与width比较求得



#### flex实际宽度

- width为auto
  - 实际内容宽度 > flex-basis，则宽度为实际内容宽度
  - 实际内容宽度 < flex-basis，则宽度为flex-basis值
  - 总结就是以尺寸大的为准
- width不为auto + 不设置overflow: hidden
  - 会按width、内容宽度、flex-basis计算得到，一般不会都指定
- over-flow: hidden
  - 无论任何情况，都以flex-basis为准（亲测是的，width不起作用）