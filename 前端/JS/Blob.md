# Blob及相关文件操作对象
- [细说Web API中的Blob](https://juejin.im/post/59e35d0e6fb9a045030f1f35)
- [[HTML5] FileReader对象](https://www.cnblogs.com/hhhyaaon/p/5929492.html)
- [为什么视频网站的视频链接地址是blob？](https://juejin.im/post/5d1ea7a8e51d454fd8057bea)

#### Blob

Blob是binary large object的缩写，存储二进制数据，表示不可变的类文件对象。File对象继承Blob。  
构造函数为`Blob(array[, options])` ，注意第一个参数为数组，每项可以是ArrayBuffer、Blob、string等，options记住type属性指定其MIME类型即可。
Blob使用场景：1. 分片上传（slice方法）；2. Blob URL。

```js
var data1 = 1;	
var data2 = "b";
var data3 = "<div style='color:red;'>This is a blob</div>";
var data4 = { "name": "abc" };

var blob1 = new Blob([data1]); // 会转换成字符串存储
var blob2 = new Blob([data1, data2]); // 都会转换成字符串
var blob3 = new Blob([data3]);
var blob5 = new Blob([data4]); // 会调用toString方法转换成字符串存储，"[object Object]"
```



#### FileReader
FileReader主要用于将文件内容读入内存，通过一系列**异步接口**，可以在主线程中访问本地文件。
```js
var reader = new FileReader();
// 通过四种方式读取文件
//reader.readAsXXX(file);   
reader.onload = function(){
    //查看文件输出内容
    console.log(this.result);
    //查看文件内容字节大小
    console.log(new Blob([this.result]))
}
```
了解如下方法即可：
- **readAsArrayBuffer**：返回二进制缓冲区
- readAsBinaryString：已废弃
- **readAsDataURL**：返回base64 Data URL
- readAsText：按指定的编码进行解析

#### Blob URL
Blob协议的URL，由 `URL.createObjectURL(blob)` 生成，格式类似：`blob:域名/[uuid]`，当不再需要该URL时，调用 `URL.revokeObjectURL(url)` 使该链接失效。

> 个人理解blob url相当于内存中一个资源的引用，类似于指针

#### ArrayBuffer
用来表示通用的、固定长度的原始二进制数据缓冲区。我们可以通过new ArrayBuffer(length)来获得一片连续的内存空间，它不能直接读写，
但可根据需要将其传递到TypedArray视图（非真实类型，一类的统称，常见的如Int8Array、Uint8Array、Int16Array等等）或 DataView 对象来进行读写。

ArrayBuffer可以和Blob相互转换
- Blob => ArrayBuffer
```js
let blob = new Blob([1,2,3,4])
let reader = new FileReader();
reader.onload = function(result) {
    console.log(result);
}
reader.readAsArrayBuffer(blob);
```

- ArrayBuffer => Blob
```js
let blob = new Blob([buffer])
```

#### File
File接口基于Blob，继承了Blob的功能，并且扩展支持了用户计算机上的本地文件，因此我们可以像使用Blob一样使用File对象。



# 视频网站的视频链接地址是blob？

```html
<video preload="auto" src="blob:https://www.bilibili.com/522d9f38-5c6f-4575-ae1f-5a87f3df59f1"></video>
```

- [为什么视频网站的视频链接地址是blob？](https://juejin.im/post/5d1ea7a8e51d454fd8057bea)

核心是运用 `URL.createObjectURL` 生成blob协议的链接。要使用BlobURL，则需要先获取原始的blob对象，但是视频很大这种方法肯定不行，
所以出现了流媒体，常用有以下两种形式：HLS和MPEG DASH。

#### HLS（HTTP Live Streaming）
Apple 公司实现的基于 HTTP 的媒体流传输协议。HLS以ts为传输格式，m3u8为索引文件（文件中包含了所要用到的ts文件名称，时长等信息，可以用播放器播放）。
优酷使用的是这种格式。

#### DASH（Dynamic Adaptive Streaming over HTTP）
DASH会通过media presentation description (MPD)将视频内容切片成一个很短的文件片段，每个切片都有多个不同的码率，DASH Client可以根据网络的情况选择一个码率进行播放，支持在不同码率之间无缝切换。
索引文件通常是mpd，文件扩展名通常是 `.m4s`。Youtube，B站使用这种方案。

#### MediaSource
如何无缝切换视频地址，可以Blob URL指向一个视频二进制数据，然后不断将下一段视频的二进制数据添加拼接进去。
要实现这个功能我们要通过MediaSource来实现，MediaSource接口功能也很纯粹，作为一个媒体数据容器可以和HTMLMediaElement进行绑定。
基本流程就是通过URL.createObjectURL创建容器的BLob URL，设置到video标签的src上，
在播放过程中，我们仍然可以通过MediaSource.appendBuffer方法往容器里添加数据，达到更新视频内容的目的。

#### 参考

 https://juejin.im/post/5d1ea7a8e51d454fd8057bea 