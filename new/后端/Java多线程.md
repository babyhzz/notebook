# ThreadLocal

**作用**：一句话，就是在线程周期内无论何地都能很容易的访问到变量。

没有ThreadLocal的时候，一个线程在其声明周期内，可能穿过多个层级，多个方法，如果有个对象需要在此线程周期内多次调用，且是跨层级的（线程内共享），通常的做法是**通过参数进行传递**；而ThreadLocal将变量绑定在线程上，在一个线程周期内，无论“你身处何地”，只需通过其提供的get方法就可轻松获取到对象。极大地提高了对于“线程级变量”的访问便利性。

**ThreadLocal本身并不存储值**，它只是**作为一个key来让线程从ThreadLocalMap获取value**。



每个Thread维护着一个ThreadLocalMap的引用

ThreadLocalMap是ThreadLocal的内部类，用Entry来进行存储

调用ThreadLocal的set()方法时，实际上就是往ThreadLocalMap设置值，key是ThreadLocal对象，值是传递进来的对象

调用ThreadLocal的get()方法时，实际上就是往ThreadLocalMap获取值，key是ThreadLocal对象

