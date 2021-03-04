# ThreadLocal

每个Thread维护着一个ThreadLocalMap的引用

ThreadLocalMap是ThreadLocal的内部类，用Entry来进行存储

调用ThreadLocal的set()方法时，实际上就是往ThreadLocalMap设置值，key是ThreadLocal对象，值是传递进来的对象

调用ThreadLocal的get()方法时，实际上就是往ThreadLocalMap获取值，key是ThreadLocal对象

**ThreadLocal本身并不存储值**，它只是**作为一个key来让线程从ThreadLocalMap获取value**。