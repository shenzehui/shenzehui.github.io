---
article: false
title: 数据链路层
tag:
  - 计算机基础
category:
  - 计算机网络
---

## 数据链路层概述

### 概述

**链路**是从一个结点到相邻结点的一段物理线路，**数据链路**则是在链路的基础上增加了一些必要的硬件（如网络适配器）和软件（如协议的实现）

**网络中的主机、路由器等都必须实现数据链路层**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-72eec9c2f5da1885.png)

**局域网中的主机、交换机等都必须实现数据链路层**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-4f088da1859e7e90.png)

**从层次上来看数据的流动**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-11c77ea98c206763.png)

**仅从数据链路层观察帧的流动**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-6a1acd1ad2a6c1eb.png)

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-1dacf9fe20464222.png)

> 主机 H1 到主机 H2 所经过的网络可以是多种不同类型的
>
> **注意：不同的链路层可能采用不同的数据链路层协议**

**数据链路层使用的信道**

数据链路层属于计算机网路的低层。**数据链路层使用的信道主要有以下两种类型：**

- 点对点信道
- 广播信道

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-0f0962eb5fccf66f.png)

> **局域网属于数据链路层**
>
> 局域网虽然是个网络。但我们并不把局域网放在网络层中讨论。这是因为在网络层要讨论的是多个网络互连的问题，是讨论分组怎么从一个网络，通过路由器，转发到另一个网络。
>
> 而在同一个局域网中，分组怎么从一台主机传送到另一台主机，但并不经过路由器转发。从整个互联网来看，**局域网仍属于数据链路层**的范围。

## 三个重要问题

数据链路层传送的协议数据单元是**帧**

**封装成帧**

- **封装成帧** (framing) 就是在一段数据的前后分别添加首部和尾部，然后就构成了一个帧。
- 首部和尾部的一个重要作用就是进行**帧定界**。

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-1ad51faea9b7b205.png)

**差错控制**

在传输过程中可能会产生**比特差错**：1 可能会变成 0， 而 0 也可能变成 1。

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-82811736b014aa98.png)

**可靠传输**

接收方主机收到有误码的帧后，是不会接受该帧的，会将它丢弃

如果数据链路层向其上层提供的是不可靠服务，那么丢弃就丢弃了，不会再有更多措施

**如果数据链路层向其上层提供的是可靠服务，那就还需要其他措施，来确保接收方主机还可以重新收到被丢弃的这个帧的正确副本**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-0d2fd9bb2602bf28.png)

> 以上三个问题都是使用**点对点信道的数据链路层**来举例的

**如果使用广播信道的数据链路层除了包含上面三个问题外，还有一些问题要解决**

如图所示，主机A，B，C，D，E通过一根总线进行互连，主机A要给主机C发送数据，代表帧的信号会通过总线传输到总线上的其他各主机，那么主机B，D，E如何知道所收到的帧不是发送给她们的，主机C如何知道发送的帧是发送给自己的

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-34c5f707bef17f14.png)

可以用编址（地址）的来解决

将帧的目的地址添加在帧中一起传输

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-abbf8309faf2ebf1.png)

还有数据碰撞问题

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-92422213075fe0e3.png)

> 随着技术的发展，交换技术的成熟，
>
> 在 有线（局域网）领域 使用**点对点链路**和**链路层交换机**的**交换式局域网**取代了~~共享式局域网~~
>
> 在无线局域网中仍然使用的是共享信道技术

## 封装成帧

### 介绍

封装成帧是指数据链路层给上层交付的协议数据单元添加帧头和帧尾使之成为帧

- **帧头和帧尾中包含有重要的控制信息**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-bf6fe42eeea3f376.png)

发送方的数据链路层将上层交付下来的协议数据单元封装成帧后，还要通过物理层，将构成帧的各比特，转换成电信号交给传输媒体，那么接收方的数据链路层如何从物理层交付的比特流中提取出一个个的帧？

答：需要帧头和帧尾来做**帧定界**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-3a36c2a60343962c.png)

但并不是每一种数据链路层协议的帧都包含有帧定界标志，例如下面例子

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-f1441c531b4d740e.png)

> 前导码
>
> - 前同步码：作用是使接收方的时钟同步
>
> - 帧开始定界符：表明其后面紧跟着的就是MAC帧

另外以太网还规定了帧间间隔为96比特时间，因此，MAC帧不需要帧结束定界符

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-eee524ce4e17f0e8.png)

## 透明传输

> **透明**
>
> 指某一个实际存在的事物看起来却好像不存在一样。

透明传输是指**数据链路层对上层交付的传输数据没有任何限制**，好像数据链路层不存在一样

帧界定标志也就是个特定数据值，如果在上层交付的协议数据单元中， 恰好也包含这个特定数值，接收方就不能正确接收

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-12fe81306aedad15.png)

> 所以数据链路层应该对上层交付的数据有限制，其内容不能包含帧定界符的值

**解决透明传输问题**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-645dde5eed8eceb2.png)

- **解决方法**：面向字节的物理链路使用**字节填充** (byte stuffing) 或**字符填充** (character stuffing)，面向比特的物理链路使用比特填充的方法实现透明传输

- 发送端的数据链路层在数据中出现控制字符“SOH”或“EOT”的前面**插入一个转义字符“ESC”**(其十六进制编码是1B)。

- 接收端的数据链路层在将数据送往网络层之前删除插入的转义字符。

- 如果转义字符也出现在数据当中，那么应在转义字符前面插入一个转义字符 ESC。当接收端收到连续的两个转义字符时，就删除其中前面的一个。

**帧的数据部分长度**

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-9d3f61fdd96b7dee.png)

## 总结

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-6d39c2f162ddcae5.png)

## 差错检测

### 介绍

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/24878825-fa8e42040c9adf41.png)
