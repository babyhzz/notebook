#### 概念
React 的所有事件并没有绑定到具体的dom节点上而是绑定在了document 上，然后由统一的事件处理程序来处理，同时也是基于浏览器的事件机制（冒泡），所有节点的事件都会在 document 上触发

由于原生事件先于合成事件，所以原生事件阻止冒泡肯定会阻止合成事件的触发，但合成事件的阻止冒泡不会影响原生事件。

react合成事件做的事情：

1. 对原生事件的封装，e.nativeEvent表示原生事件
2. 对某些事件的升级和改造，如onChange事件，原生只会在失去焦点时触发，React会注册很多其他的事件上去
3. 不同浏览器事件兼容处理，如IE的AttachEvent

SyntheticEvent是react合成事件的基类，定义了合成事件的基础公共属性和方法。

react会根据当前的事件类型来使用不同的合成事件对象，比如鼠标单机事件 - SyntheticMouseEvent，焦点事件-SyntheticFocusEvent等，但是都是继承自SyntheticEvent。



事件注册到listenerBank中，这是一个二级map，第一级是事件名称，第二级是key



EventPluginHub



### 参考

 https://www.cnblogs.com/pingan8787/p/11838083.html 