---
title: Redis 精选面试题🔥
tag: Redis
category:
  - 面试题
  - 数据库
article: false
---

## RBD 和 AOF 机制

### RDB：Redis DataBase

> 在指定的时间间隔内将内存中的数据集快照写入磁盘，实际操作过程是 fork 一个子进程，先将数据写入临时文件，写入成功后，再替换之前的文件，用二进制压缩存储。

- 优点：

1. 整个 Redis 数据库将只包含一个文件 dump.rdb，方便持久化。
2. 容灾性好，方便备份。
3. 性能最大化，fork 子进程来完成写操作，让主操作继续处理命令，所以是 IO 最大化。使用单独子进程来进行持久化，主进程不会进行任何 IO 操作，保证了 redis 的高性能

4. 相对于数据集大时，比 AOF 的启动效率更高。

- 缺点：

1. 数据安全性低。RDB 是间隔一段时间进行持久化，如果持久化之间 redis 发生故障，会发生数据丢失。所以这种方式更适合数据要求不严谨的时候
2. 由于 RDB 是通过 fork 子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫米，甚至是 1 秒中。

### AOF：Append Only File

> 以日志的形式记录服务器所处理的每一个写、删除操作，查询记录不会记录，以文本的方式记录，可以打开文件看到详细的操作记录

- 优点：

1. 数据安全，Redis 中提供了3种同步策略，即每秒同步、每修改同步和不同步。事实上，每秒同步也是一步完成的，其效率也是非常高的，所差的是一旦系统出现宕机现象，那么这一秒钟内修改的数据将会丢失。而每修改同步，我们可以将其视为同步持久化，即每次发生的数据变化都会被立即记录到磁盘中。
2. 通过 append 模式写文件，即使中途服务器宕机也不会破坏已经存在的内容，可以通过 redis-check-aof 工具解决数据一致性问题
3. AOF 机制的 rewrite 模式。定期对 AOF 文件进行重写，以达到压缩的目的。

- 缺点：

1. AOF 文件比 RDB 文件大，且恢复速度慢。
2. 数据集大的时候，比 rdb 启动效率低。
3. 运行效率没有 RBD 高

### 总结：

1. AOF 文件比 RDB 更新频率高，优先使用 AOF 还原数据。

2. AOF 比 RDB 更安全也更大

3. RBD 性能比 AOF好
4. 如果两个都配置了，优先加载 AOF 文件

## Redis 单线程为什么这么快

Redis 基于 Reactor 模式开发了网络事件处理器、文件事件处理器 file event handler。它是单线程的，所以 Redis 才叫做单线程模型，它采用 IO 多路复用机制来监听多个 Socket，根据 Socket 上的事件类型来选择对应的事件处理器来处理这个事件。可以实现高性能的网络通信模型，又可以跟内部其他单线程的模块进行对接，保证了 Redis 内部的线程模型的简单性。

**文件事件处理器**的结构包含4个部分：`多个 Socket、IO多路复用程序、文件事件分派器以及事件处理器`（命令请求处理器、命令回复处理器、连接应答处理器等）。

多个 Socket 可能并发的产生不同的事件，IO多路复用程序会监听多个 Socket，会将 `Socket` 放入一个队列排队，每次，每次从队列中有序、同步取出一个 Socket 给`事件分派器`，事件分派器把 Socket 给对应的`事件处理器`。然后一个 Socket 的事件处理完成之后，IO 多路复用程序才会将队列中的下一个 Socket 给事件分派器。文件事件分派器会根据每个 Socket 当期产生的事件，来选择对应的时间处理器来处理。

1. Redis 启动初始化时，将连接应答处理器跟 AE_READABLE 事件关联。
2. 若一个客户端发起连接，会产生一个 AE_READABLE 事件，然后由连接应答处理器负责和客户端建立连接，创建客户端对应的 socket，同时将这个 socket 的 AE_READABLE  事件和命令请求处理器关联，使得客户端可以向主服务器发送命令请求。
3. 当客户端向 Redis 发请求时（不管读还是写请求），客户端 socket 都会产生一个 AE_READABLE 事件，触发命令请求处理器，处理器读取客户端的命令内容，然后传给相关程序执行。
4. 当 Redis  服务器准备好给客户端的响应数据后，会将 socket 的 AE_WRITABLE 事件和命令回复处理器关联，当客户端准备好读取响应数据时，会在 socket 产生一个 AE_WRITABLE 事件，由对应命令回复处理器处理，即将准备好的数据写入 socket，供客户端读取。
5. 命令回复处理器全部写完到 socket 后，就会删除该 socket 的 AE_WRITABLE 事件和命令回复处理器的映射。

**单线程快的原因：**

1. 纯内存操作（不需要进行 CPU 的切换）
2. 核心是基于非阻塞 IO 和多路复用机制
3. 单线程反而避免了多线程的的频繁切换上下文带来的性能问题

## Redis 的持久化的机制

### RDB：Redis DataBase

> 将某一个时刻的内存快照（Snapshot），以二进制的方式写入磁盘。

**手动触发：**

- save 命令，使 Redis 处于阻塞状态，直到 RDB 持久化完成，才会响应其他客户端发来的命令，所以在生产环境一定要慎用
- bgsave 命令，fork 出一个子进程执行持久化，主进程只在 fork 过程中有短暂的阻塞，主进程就可以响应客户端请求了

**自动触发：**

- save m n：在 m 秒内，如果有 n 个键发生改变，则自动触发持久化，通过 bgsave 执行，如果设置多个、只要满足其一就会触发，配置文件有默认配置（可以注释调掉）
- flushall：用于清空 redis 所有的数据库，flushdb 清空当期 redis 所在库数据（默认是 0 号数据库），会清空 RDB 文件，同时也会生成 dump.rdb，内容为空
- 主从同步：全量同步时会自动触发 bgsave 命令，生成 rdb 发送给从节点

**优点：**

1. 整个 Redis 数据库将只包含一个文件 dump.rdb，方便持久化。
2. 容灾性好，方便备份。
3. 性能最大化，fork 子进程来完成写操作，让主操作继续处理命令，所以是 IO 最大化。使用单独子进程来进行持久化，主进程不会进行任何 IO 操作，保证了 redis 的高性能

4. 相对于数据集大时，比 AOF 的启动效率更高。

**缺点：**

1. 数据安全性低。RDB 是间隔一段时间进行持久化，如果持久化之间 redis 发生故障，会发生数据丢失。所以这种方式更适合数据要求不严谨的时候
2. 由于 RDB 是通过 fork 子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫米，甚至是 1 秒中，会占用 cpu。

### AOF：Append Only File

> 以日志的形式记录服务器所处理的每一个写、删除操作，查询记录不会记录，以文本的方式记录，可以打开文件看到详细的操作记录，调操作系统命令进程刷盘

1. 所有的写命令会追加到 AOF 缓冲中。
2. AOF 缓冲区根据对应的策略向硬盘进行同步操作
3. 随着 AOF 文件越来越大，需要定期对 AOF 文件进行重写，达到压缩的目的。
4. 当 Redis 重启时，可以加载 AOF 文件进行数据恢复

**同步策略：**

- 每秒同步：异步完成，效率非常高，一旦系统出现宕机现象，那么这一秒钟之内修改的数据将会丢失。
- 每修改同步：同步持久化，每次发生的数据变化都会被立即记录到磁盘中，最多丢一条
- 不同步：由操作系统控制，可能丢失较多数据

**优点：**

1. 数据安全
2. 通过 append 模式写文件，即使中途服务器宕机也不会破坏已经存在的内容，可以通过 redis-check-aof 工具解决一致性问题。
3. AOF 机制的 rewrite 模式。定期对 AOF 文件进行重写，已达到压缩的目的

**缺点：**

1. AOF 文件比 RDB 文件大，且恢复速度慢。
2. 数据集大的时候，比 rdb 启动效率低。
3. 运行效率没有 RBD 高

AOF 文件比 RDB 更新频率高，优先使用 AOF 还原数据。

AOF 比 RDB 更安全也更大

RBD 性能比 AOF好

如果两个都配置了，优先加载 AOF 文件

## Redis 的过期键的删除策略

Redis 是 key-value 数据库，我们可以设置 Redis 中缓存的 key 的过期时间。Redis 的过期策略就是指定当 Redis 中缓存的 key 过期了，Redis 如何处理。

- 惰性过期：只有当访问一个 key 时，才会判断 key 是否已过期，过期则删除。该策略可以最大化地节省 CPU 资源，却对内存非常不友好。极端情况可能出现大量的 key 没有再次被访问，从而不会被清除，占用大量内存。
- 定期过期：每隔一定的时间，会扫描一定数量的数据库的 expires 字典中一定数量的 key，并清除其中已过期的 key。该策略是前两者的一个折中方案。通过调整定时扫描的时间间隔和每次扫描的限定耗时，可以在不同情况下使得 CPU 和 内存资源达到最优的平衡效果。

(expries 字典会保存所有设置了过期时间的 key 的过期时间数据，其中，key 是指向键空间中的某个键的指针，value 是该键的毫秒精度的 UNIX 时间戳表示的过期时间。键空间是指该 Redis 集群中保存的所有键。)

Redis 中同时使用了惰性过期和定期过期两种过期策略。

## Redis 分布式锁底层是如何实现的？

1. 首先利用 setnx 来保证：如果 key 不存在才能获取到锁，如果 key 存在，则获取不到锁
2. 然后还要利用 lua 脚本来保证多个 redis 操作的原子性
3. 同时还要考虑到锁过期，所以需要额外的一个看门狗定时任务来监听锁是否需要续约
4. 同时还要考虑到 redis 节点挂掉之后的情况，所以需要采用红锁的方式来同时向 N/2 +1 个节点申请锁，都申请到了才证明获取锁成功，这样就算其中某个 redis 节点挂掉了，锁也不会被其他客户端获取到。

## Redis 有哪些数据结构？分别有哪些典型的应用场景？

Redis 的数据结构有：

1. 字符串：可以用来做简单的数据，可以缓存某个简单的字符串，也可以缓存某个 json 格式的字符串，Redis 分布式锁的实现就利用了这种数据结构，还包括可以实现计数器、Session 共享、分布式 ID
2. 哈希表：可以用来存储一些 key-value 对，更适合用来存储对象
3. 列表：Redis 的列表通过命令的组合，既可以当做栈，也可以当做队列来使用，可以用来缓存类似微信公众号、微博等消息流数据
4. 集合：和列表相似，也可以存储多个元素，但是不能重复，集合可以进行交集、并集、差集等操作，从而可以实现类似我和某人共同关注的人、朋友圈点赞等功能
5. 有序集合：集合是无序的，有序集合可以设置顺序，可以用来实现排行榜功能

## Redis 主从复制的核心原理

通过执行 salveof 命令设置 slaveof 选项，让一个服务器去复制另一个服务器的数据。主数据库可以进行读写操作，当写操作导致数据变化时会自动将数据同步给从数据库。而从数据库一般是只读的，并接受主数据库同步过来的数据。一个主数据库可以拥有多个从数据库，而一个从数据库只能拥有一个主数据库。

**全量复制：**

（1）主节点通过 bgsave 命令 fork 子进程进行 RDB 持久化（生成全量数据快照），该过程非常消耗 CPU、内存（页表复制）、硬盘 IO等

（2）主节点通过网络将 RDB 文件发送给从节点，对主从节点的贷款都会带来很大的消耗

（3）从节点清空老数据、载入新 RDB 文件的过程是阻塞的，无法响应客户端；如果从节点执行 bgrewriteof，也会带来额外的消耗

**部分复制：**

- 复制偏移量：执行复制的双方，主从节点，分别会维护一个复制偏移量 offset
- 复制积压缓冲区：**主节点内部维护了一个固定长度的、先进先出（FIFO）队列**作为复制积压缓冲区，当主从节点 offset 的差距过大超过缓冲区的长度时，将无法执行部分复制，只能执行全量复制。
- 服务器运行 ID（runid）：每个 Redis 节点，都有其运行 ID，运行 ID 由节点在启动时自动生成，主节点会将自己的运行 ID 发送给从节点，从节点会将主节点的运行 ID 存起来。从节点 Redis 断开重连的时候，就是根据运行 ID 来判断同步的进度：
  - 如果从节点保存的 runid 与 主节点现在的 runid 相同，说明主从节点之前同步过，主节点会继续尝试使用使用部分复制（到底能不能部分复制还要看 offset 和复制积压缓冲区的情况）；
  - 如果从节点保存的 runid 与主节点现在的 runid 不同，说明从节点在断线前同步的 Redis 节点并不是当前的主节点，只能进行全量复制。

过程原理：

![image-20221112190247115](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/image-20221112190247115.png)

## 布隆过滤器原理，优缺点

位图：int[10]，每个 int 类型的整数是 4*8 = 32 个 bit，则 int[10] 一共有 320 bit，每个 bit 非0 即 1，初始化时都是 0。添加数据时，将数据进行 hash 得到 hash 值，对应到 bit 为，将 bit 改为 1，hash 函数可以定义多个，则一个数据添加将多个（hash 函数个数）bit 改为 1，多个 hash 函数的目的是减少 hash 碰撞的概率

![](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/20210225103955320.png)

查询数据：hash 函数计算得到 hash 值，对应到 bit 中，如果有一个为 0，则说明数据不在 bit 中，如果都为 1，则该数据可能在 bit 中

![img](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/20210225105747809.png)

**优点：**

- 占用内存小
- 增加和查询元素的时间复杂度为：O(K)，（K为哈希函数的个数，一般比较小），与数据量大小无关
- 哈希函数互相之间没有关系，方便硬件并行计算
- 布隆过滤器不需要存储元素本身，在某些对保密要求比较严格的场合有很大优势
- 数据量大时，布隆过滤器可以表示全集
- 使用同一组散列函数的布隆过滤器可以进行交、并、差运算

**缺点：**

- 误判率，即存在假阳性（False Position），不能准确判断元素是否在集合中
- 不能获取元素本身
- 一般情况下不能从布隆过滤器中删除元素