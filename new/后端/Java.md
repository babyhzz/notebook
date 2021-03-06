# IO

## 概念

https://www.cnblogs.com/bodhitree/p/10997839.html

解决了utf-16的疑问

https://www.zhihu.com/question/27562173

提出了内码和外码的概念



## utf-16

**char**: The `char` data type is a single 16-bit Unicode character. It has a minimum value of `'\u0000'` (or 0) and a maximum value of `'\uffff'` (or 65,535 inclusive).

**内码**：是程序内部使用的字符编码，特别是某种语言实现其char或String类型在内存里用的内部编码。

**外码**：是程序与外部交互时外部使用的字符编码。“外部”相对“内部”而言；不是char或String在内存里用的内部编码的地方都可以认为是“外部”。

随机访问某个下标的code unit（String.charAt()）应该是O(1)操作，这只有使用UTF-16或者别的“定长”编码才可以做到。注意我这里说的“定长”特指code unit定长，而不是说code point定长。

String.getBytes()是一个用于将String的内码转换为指定的外码的方法。无参数版使用平台的默认编码作为外码，有参数版使用参数指定的编码作为外码；将String的内容用外码编码好，结果放在一个新byte[]返回。

由于UTF-16是编程编码，故Java引进了CodePointAPI



Java的标准库新加了一套用于访问code point的API，而这套API就表现出了UTF-16的变长特性。



**Code Point**: 代码点，一个字符的数字表示。一个字符集一般可以用一张或多张由多个行和多个列所构成的二维表来表示。二维表中行与列交叉的点称之为代码点，每个码点分配一个唯一的编号数字，称之为码点值或码点编号，除开某些特殊区域(比如代理区、专用区)的非字符代码点和保留代码点，每个代码点唯一对应于一个字符。 从`U+0000` 到 `U+10FFFF`。

**Code Unit**：代码单元，是指一个已编码的文本中具有最短的比特组合的单元。对于 UTF-8 来说，代码单元是 8 比特长；对于 UTF-16 来说，代码单元是 16 比特长。换一种说法就是 UTF-8 的是以一个字节为最小单位的，UTF-16 是以两个字节为最小单位的。



## String

`String.getBytes()` 是一个用于将String的内码转换为指定的外码的方法。

```java
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;

public class Base64Util {

    public static void main(String[] args) {
        Base64.Encoder encoder = Base64.getEncoder();
        Base64.Decoder decoder = Base64.getDecoder();

        // 7个汉字
        String text = "这是一个字符串";
        // 使用不同的编码方式，数组长度不同。
        // UTF-8: 21 一个汉字三个字节
        // UTF-16: 16(with BOM) UTF-16BE/LE: 14
        byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
        System.out.println(bytes.length);
        System.out.println(Arrays.toString(bytes));
        String encodedText = encoder.encodeToString(bytes);
        System.out.println(encodedText);

        byte[] decodedBytes = decoder.decode(encodedText);
        System.out.println(new String(decodedBytes, StandardCharsets.UTF_8));

    }

}
```



## 流的概念和作用

流：代表任何有能力产出数据的数据源对象或者是有能力接受数据的接收端对象。

流的本质: 数据传输，根据数据传输特性将流抽象为各种类，方便更直观的进行数据操作。

Java的IO模型设计非常优秀，它使用Decorator(装饰者)模式，按功能划分Stream，您可以动态装配这些Stream，以便获得您需要的功能。



字节流  InputStream/OutputStream

字符流  Reader/Writer



# 多线程

## ThreadLocal

**作用**：一句话，就是在线程周期内无论何地都能很容易的访问到变量。

没有ThreadLocal的时候，一个线程在其声明周期内，可能穿过多个层级，多个方法，如果有个对象需要在此线程周期内多次调用，且是跨层级的（线程内共享），通常的做法是**通过参数进行传递**；而ThreadLocal将变量绑定在线程上，在一个线程周期内，无论“你身处何地”，只需通过其提供的get方法就可轻松获取到对象。极大地提高了对于“线程级变量”的访问便利性。

**ThreadLocal本身并不存储值**，它只是**作为一个key来让线程从ThreadLocalMap获取value**。



每个Thread维护着一个ThreadLocalMap的引用

ThreadLocalMap是ThreadLocal的内部类，用Entry来进行存储

调用ThreadLocal的set()方法时，实际上就是往ThreadLocalMap设置值，key是ThreadLocal对象，值是传递进来的对象

调用ThreadLocal的get()方法时，实际上就是往ThreadLocalMap获取值，key是ThreadLocal对象