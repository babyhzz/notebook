https://blog.csdn.net/u010632165/article/details/106696545/

modbus 串行通信协议，但是是一种开放协议。设备之间通过串行线进行数据传输。



![img](modbus.assets/20200611205554896.png)

主设备向从设备请求信息，最多大约可达到240个 . 每个从设备都有自己**唯一的从设备地址标识**（`Slave Address`）。
除了从从设备请求信息之外，主设备还可以写入从设备的**内部寄存器**。



![img](modbus.assets/20200611210231863.jpg)

我们可以看到最常用`Modbus`协议总共有以下四种：**Modbus ASCII**， **Modbus RTU**， **Modbus Plus**，**Modbus TCP**；



RTU帧

| 起始位      | 设备地址 | 功能代码 | 数据    | CRC校验 | 结束符      |
| ----------- | -------- | -------- | ------- | ------- | ----------- |
| T1-T2-T3-T4 | 8Bit     | 8Bit     | n个8Bit | 16Bit   | T1-T2-T3-T4 |



| 地址码 | 功能码 | 数据区  | 错误校验码 |
| ------ | ------ | ------- | ---------- |
| 8位    | 8位    | N × 8位 | 16位       |

**地址码**：地址码是信息帧的第一字节(8位)，从0到255。这个字节表明由用户设置地址的从机将接收由主机发送来的信息。每个从机都必须有唯一的地址码，并且只有符合地址码的从机才能响应回送。当从机回送信息时，相当的地址码表明该信息来自于何处。



 **功能码**：主机发送的功能码告诉从机执行什么任务。表1-1列出的功能码都有具体的含义及操作。

modbus完整支持很多功能码，但是实际在应用的时候常用的也就那么几个。

0x01: 读线圈寄存器
0x02: 读离散输入寄存器
0x03: 读保持寄存器
0x04: 读输入寄存器
0x05: 写单个线圈寄存器
0x06: 写单个保持寄存器
0x0f: 写多个线圈寄存器
0x10: 写多个保持寄存器

**线圈寄存器**，实际上就可以类比为开关量，每一个bit都对应一个信号的开关状态。所以一个byte就可以同时控制8路的信号。比如控制外部8路io的高低。 线圈寄存器支持读也支持写，写在功能码里面又分为写单个线圈寄存器和写多个线圈寄存器。对应上面的功能码也就是：0x01  0x05  0x0f

  **离散输入寄存器**，如果线圈寄存器理解了这个自然也明白了。离散输入寄存器就相当于线圈寄存器的只读模式，他也是每个bit表示一个开关量，而他的开关量只能读取输入的开关信号，是不能够写的。比如我读取外部按键的按下还是松开。所以功能码也简单就一个读的 0x02

  **保持寄存器**，这个寄存器的单位不再是bit而是两个byte，也就是可以存放具体的数据量的，并且是可读写的。比如我我设置时间年月日，不但可以写也可以读出来现在的时间。写也分为单个写和多个写，所以功能码有对应的三个：0x03 0x06 0x10

  **输入寄存器，**只剩下这最后一个了，这个和保持寄存器类似，但是也是只支持读而不能写。一个寄存器也是占据两个byte的空间。类比我我通过读取输入寄存器获取现在的AD采集值。对应的功能码也就一个 0x04  



1.概念
①Coil和Register
　　Modbus中定义的两种数据类型。**Coil是位（bit）变量**；**Register是整型（Word，即16-bit）变量**。
②Slave和Master与Server和Client
　　同一种设备在不同领域的不同叫法。
　　Slave： 工业自动化用语；响应请求；
　　Master：工业自动化用语；发送请求；
　　Server：IT用语；响应请求；
　　Client：IT用语；发送请求；
　　在Modbus中，Slave和Server意思相同，Master和Client意思相同。

2.Modbus数据模型
　　Modbus中，数据可以分为两大类，分别为Coil和Register，每一种数据，根据读写方式的不同，又可细分为两种（只读，读写）。
　　Modbus四种数据类型：
　　Discretes Input　　　　位变量　　　　只读
　　Coils　　　　　　　　　 位变量　　　　读写
　　Input Registers　　　　16-bit整型 　 只读
　　Holding Registers 　　  16-bit整型 　 读写
　　通常，在Slave端中，定义四张表来实现四种数据。

 

3.Modbus地址范围对应表

设备地址 　　　　Modbus地址　　   描述 　　         功能 　　R/W
1~10000 　　   address-1      Coils（Output）    0      R/W
10001~20000  address-10001   Discrete Inputs     01     R
30001~40000  address-30001   Input Registers     04     R
40001~50000  address-40001   Holding Registers   03     R/W

4.Modbus变量地址
映射地址       Function Code     地址类型      R/W      描述
0xxxx        01,05,15         Coil         R/W      -
1xxxx        02              离散输入      R        -
2xxxx        03,04,06,16       浮点寄存器    R/W      两个连续16-bit寄存器表示一个浮点数（IEEE754）
3xxxx        04              输入寄存器    R        每个寄存器表示一个16-bit无符号整数（0~65535）
4xxxx        03,06,16         保持寄存器     R/W      -
5xxxx        03,04,06,16      ASCII字符     R/W      每个寄存器表示两个ASCII字符





# PyModbus

Pymodbus is a full Modbus protocol implementation using twisted/torndo/asyncio for its asynchronous communications core. 

意思是支持twisted/torndo/asyncio这些异步的核心，但是我们应该不需要吧。

调通的第一个modbus程序，其中unit = 1为slave的id，要对应，这个很重要，否则发送不成功

```python
from pymodbus.client.sync import ModbusSerialClient

client = ModbusSerialClient(method='rtu', port='COM1', baudrate=9600)
client.connect()
result = client.read_holding_registers(0, 10, unit=1)
# print(result.bits[0])
print(result.registers)
client.close()
```

