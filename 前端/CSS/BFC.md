#### 概念

Block Formatting Context (块级格式化上下文)，具有 BFC 特性的元素可以看作是隔离了的独立容器，<font color='red'>容器里面的元素</font>不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。 

通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。 


#### 如何触发BFC

只要元素满足下面任一条件即可触发 BFC 特性：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)



#### 特性及应用

##### 1. 同一BFC下margin会发生折叠

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      div {
        width: 100px;
        height: 100px;
        background: lightblue;
        margin: 100px;
      }
    </style>
  </head>

  <body>
    <div></div>
    <div></div>
  </body>
</html>
```

<img src="img/bfc1.png" alt="image-20200706222810794" style="zoom: 80%;" />

 **如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。** 

<img src="img/bfc2.png" alt="image-20200706223110986" style="zoom:80%;" />

#####  2. BFC 可以包含浮动的元素（清除浮动）

```html
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

由于容器内元素浮动，脱离了文档流，所以容器只剩下 2px 的边距高度。如果触发容器的 BFC，那么容器将会包裹着浮动元素。 

```html
<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

![image-20200706223745890](img/bfc3.png)

#####  3. BFC 可以阻止元素被浮动元素覆盖 

```html
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
```

![image-20200706224147932](img/bfc4.png)

这时候第二个元素有部分被浮动元素所覆盖（但是文本信息不会被浮动元素所覆盖），如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 **overflow: hidden**，就会变成：

![image-20200706224541567](img/bfc5.png)

这个方法**可以用来实现两列自适应布局**，效果不错，这时候左边的宽度固定，右边的内容自适应宽度(去掉上面右边内容的宽度)。