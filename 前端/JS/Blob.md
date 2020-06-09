# Blob及相关文件操作对象
- [细说Web API中的Blob](https://juejin.im/post/59e35d0e6fb9a045030f1f35)
- [[HTML5] FileReader对象](https://www.cnblogs.com/hhhyaaon/p/5929492.html)
- [为什么视频网站的视频链接地址是blob？](https://juejin.im/post/5d1ea7a8e51d454fd8057bea)

#### Blob
Blob是binary large object的缩写，存储二进制数据，表示不可变的类文件对象。File对象继承Blob。  
构造函数为`Blob(array[, options])` ，注意第一个参数为数组，每项可以是ArrayBuffer、Blob、string等，options记住type属性指定其MIME类型即可。
Blob使用场景：1. 分片上传（slice是方法）；2. Blob URL。

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
Blob协议的URL，由 `URL.createObjectURL(blob)` 生成，格式类似：`blob:null/[uuid]`，当不再需要该URL时，调用 `URL.revokeObjectURL(url)` 使该链接失效

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