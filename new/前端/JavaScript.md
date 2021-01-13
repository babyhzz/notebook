# 字符编码

## encodeURI

对应解码函数：decodeURI

假定 URI 中的任何保留字符都有特殊意义，所有不会编码它们

```js
/* 编码 */
encodeURI('http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor❤')
// "http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor%E2%9D%A4"

/* 解码 */
decodeURI("http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor%E2%9D%A4")
// "http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor❤"
```

## encodeURIComponent

对应解码函数：decodeURIComponent

假定任何保留字符都代表普通文本，所以必须编码它们。

故当给后端传递URL地址时，需用该函数进行编码。

```js
/* 编码 */
encodeURIComponent('http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor')
// "http%3A%2F%2Fusername%3Apassword%40www.example.com%3A80%2Fpath%2Fto%2Ffile.php%3Ffoo%3D316%26bar%3Dthis%2Bhas%2Bspaces%23anchor"

/* 解码 */
decodeURIComponent('http%3A%2F%2Fusername%3Apassword%40www.example.com%3A80%2Fpath%2Fto%2Ffile.php%3Ffoo%3D316%26bar%3Dthis%2Bhas%2Bspaces%23anchor')
// "http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor"
```

## Base64

Base64是一种用64个字符来表示任意二进制数据的方法。对二进制数据进行处理，每3个字节一组，一共是24bit，划为4组，每组正好6个bit（2^6 = 64）

Base64编码会把3字节的二进制数据编码为4字节的文本数据，长度增加33%

如果要编码的二进制数据不是3的倍数，最后会剩下1个或2个字节，Base64用`\x00`字节在末尾补足后，再在编码的末尾加上1个或2个`=`号，表示补了多少字节，解码的时候，会自动去掉。

可使用 window下的两个函数，btoa，atob



# 二进制

## Blob

```js
var aBlob = new Blob( array, options );
```

返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。

> - *array* 是一个由[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob), [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 等对象构成的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array) ，或者其他类似对象的混合体，它将会被放进 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)。DOMStrings会被编码为UTF-8。
> - options 可能会指定如下两个属性：
>   - `type`，默认值为 `""`，它代表了将会被放入到blob中的数组内容的MIME类型。
>   - `endings`，默认值为`"transparent"`，用于指定包含行结束符`\n`的字符串如何被写入。 它是以下两个值中的一个： `"native"`，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 `"transparent"`，代表会保持blob中保存的结束符不变 

常用方法：

| 方法               | 描述                                                        |
| ------------------ | ----------------------------------------------------------- |
| Blob.arrayBuffer() | 返回一个promise且包含blob所有内容的二进制格式的 ArrayBuffer |
| Blob.text()        | 返回一个promise且包含blob所有内容的UTF-8格式的 USVString。  |
|                    |                                                             |

## ArrayBuffer

**`ArrayBuffer`** 对象用来表示通用的、固定长度的原始二进制数据缓冲区。

它是一个字节数组，通常在其他语言中称为“byte array”。

你不能直接操作 `ArrayBuffer` 的内容，而是要通过[类型数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)或 [`DataView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView) 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

## TypedArray

一个**类型化数组**（**TypedArray）**对象描述了一个底层的[二进制数据缓冲区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)（binary data buffer）的一个类数组视图（view）。

> ```js
> // TypedArray 指的是以下的其中之一：
> Int8Array();
> Uint8Array();
> Uint8ClampedArray();
> Int16Array();
> Uint16Array();
> Int32Array();
> Uint32Array();
> Float32Array();
> Float64Array();
> ```

## Buffer(Node)

`Buffer` 类是 JavaScript 的 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm) 类的子类，且继承时带上了涵盖额外用例的方法。 只要支持 `Buffer` 的地方，Node.js API 都可以接受普通的 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)。

可利用`Buffer.from()`和`Buffer.toString()`方法进行字符转换。



## 转换

**ArrayBuffer to Blob**

```
new Blob([buffer])
```

**Blob to ArrayBuffer**

直接调用 `Blob.arrayBuffer()`方法

**ArrayBuffer to Buffer**

Buffer.from(arraybuffer)