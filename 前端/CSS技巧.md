#### Flex布局下的间隔gutter实现

ant design grid组件的实现方式是，每个元素加一个padding-left和padding-right，外层的margin-left，margin-right为负数。如下为gutter 16px的例子。

```html
<div class="ant-row" style="margin-left: -8px; margin-right: -8px;">
  <div class="ant-col ant-col-6 gutter-row" style="padding-left: 8px; padding-right: 8px;">
    <div class="gutter-box">col-6</div>
  </div>
  <div class="ant-col ant-col-6 gutter-row" style="padding-left: 8px; padding-right: 8px;">
    <div class="gutter-box">col-6</div>
  </div>
  <div class="ant-col ant-col-6 gutter-row" style="padding-left: 8px; padding-right: 8px;">
    <div class="gutter-box">col-6</div>
  </div>
  <div class="ant-col ant-col-6 gutter-row" style="padding-left: 8px; padding-right: 8px;">
    <div class="gutter-box">col-6</div>
  </div>
</div>
```

