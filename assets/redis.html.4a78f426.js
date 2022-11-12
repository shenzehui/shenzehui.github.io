import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as l,e as a}from"./app.9c3fe336.js";const r={},s=a('<h2 id="rbd-和-aof-机制" tabindex="-1"><a class="header-anchor" href="#rbd-和-aof-机制" aria-hidden="true">#</a> RBD 和 AOF 机制</h2><h3 id="rdb-redis-database" tabindex="-1"><a class="header-anchor" href="#rdb-redis-database" aria-hidden="true">#</a> RDB：Redis DataBase</h3><blockquote><p>在指定的时间间隔内将内存中的数据集快照写入磁盘，实际操作过程是 fork 一个子进程，先将数据写入临时文件，写入成功后，再替换之前的文件，用二进制压缩存储。</p></blockquote><ul><li>优点：</li></ul><ol><li><p>整个 Redis 数据库将只包含一个文件 dump.rdb，方便持久化。</p></li><li><p>容灾性好，方便备份。</p></li><li><p>性能最大化，fork 子进程来完成写操作，让主操作继续处理命令，所以是 IO 最大化。使用单独子进程来进行持久化，主进程不会进行任何 IO 操作，保证了 redis 的高性能</p></li><li><p>相对于数据集大时，比 AOF 的启动效率更高。</p></li></ol><ul><li>缺点：</li></ul><ol><li>数据安全性低。RDB 是间隔一段时间进行持久化，如果持久化之间 redis 发生故障，会发生数据丢失。所以这种方式更适合数据要求不严谨的时候</li><li>由于 RDB 是通过 fork 子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫米，甚至是 1 秒中。</li></ol><h3 id="aof-append-only-file" tabindex="-1"><a class="header-anchor" href="#aof-append-only-file" aria-hidden="true">#</a> AOF：Append Only File</h3><blockquote><p>以日志的形式记录服务器所处理的每一个写、删除操作，查询记录不会记录，以文本的方式记录，可以打开文件看到详细的操作记录</p></blockquote><ul><li>优点：</li></ul><ol><li>数据安全，Redis 中提供了3种同步策略，即每秒同步、每修改同步和不同步。事实上，每秒同步也是一步完成的，其效率也是非常高的，所差的是一旦系统出现宕机现象，那么这一秒钟内修改的数据将会丢失。而每修改同步，我们可以将其视为同步持久化，即每次发生的数据变化都会被立即记录到磁盘中。</li><li>通过 append 模式写文件，即使中途服务器宕机也不会破坏已经存在的内容，可以通过 redis-check-aof 工具解决数据一致性问题</li><li>AOF 机制的 rewrite 模式。定期对 AOF 文件进行重写，以达到压缩的目的。</li></ol><ul><li>缺点：</li></ul><ol><li>AOF 文件比 RDB 文件大，且恢复速度慢。</li><li>数据集大的时候，比 rdb 启动效率低。</li><li>运行效率没有 RBD 高</li></ol><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结：</h3><ol><li><p>AOF 文件比 RDB 更新频率高，优先使用 AOF 还原数据。</p></li><li><p>AOF 比 RDB 更安全也更大</p></li><li><p>RBD 性能比 AOF好</p></li><li><p>如果两个都配置了，优先加载 AOF 文件</p></li></ol><h2 id="redis-单线程为什么这么快" tabindex="-1"><a class="header-anchor" href="#redis-单线程为什么这么快" aria-hidden="true">#</a> Redis 单线程为什么这么快</h2><p>Redis 基于 Reactor 模式开发了网络事件处理器、文件事件处理器 file event handler。它是单线程的，所以 Redis 才叫做单线程模型，它采用 IO 多路复用机制来监听多个 Socket，根据 Socket 上的事件类型来选择对应的事件处理器来处理这个事件。可以实现高性能的网络通信模型，又可以跟内部其他单线程的模块进行对接，保证了 Redis 内部的线程模型的简单性。</p><p><strong>文件事件处理器</strong>的结构包含4个部分：<code>多个 Socket、IO多路复用程序、文件事件分派器以及事件处理器</code>（命令请求处理器、命令回复处理器、连接应答处理器等）。</p><p>多个 Socket 可能并发的产生不同的事件，IO多路复用程序会监听多个 Socket，会将 <code>Socket</code> 放入一个队列排队，每次，每次从队列中有序、同步取出一个 Socket 给<code>事件分派器</code>，事件分派器把 Socket 给对应的<code>事件处理器</code>。然后一个 Socket 的事件处理完成之后，IO 多路复用程序才会将队列中的下一个 Socket 给事件分派器。文件事件分派器会根据每个 Socket 当期产生的事件，来选择对应的时间处理器来处理。</p><ol><li>Redis 启动初始化时，将连接应答处理器跟 AE_READABLE 事件关联。</li><li>若一个客户端发起连接，会产生一个 AE_READABLE 事件，然后由连接应答处理器负责和客户端建立连接，创建客户端对应的 socket，同时将这个 socket 的 AE_READABLE 事件和命令请求处理器关联，使得客户端可以向主服务器发送命令请求。</li><li>当客户端向 Redis 发请求时（不管读还是写请求），客户端 socket 都会产生一个 AE_READABLE 事件，触发命令请求处理器，处理器读取客户端的命令内容，然后传给相关程序执行。</li><li>当 Redis 服务器准备好给客户端的响应数据后，会将 socket 的 AE_WRITABLE 事件和命令回复处理器关联，当客户端准备好读取响应数据时，会在 socket 产生一个 AE_WRITABLE 事件，由对应命令回复处理器处理，即将准备好的数据写入 socket，供客户端读取。</li><li>命令回复处理器全部写完到 socket 后，就会删除该 socket 的 AE_WRITABLE 事件和命令回复处理器的映射。</li></ol><p><strong>单线程快的原因：</strong></p><ol><li>纯内存操作（不需要进行 CPU 的切换）</li><li>核心是基于非阻塞 IO 和多路复用机制</li><li>单线程反而避免了多线程的的频繁切换上下文带来的性能问题</li></ol><h2 id="redis-的持久化的机制" tabindex="-1"><a class="header-anchor" href="#redis-的持久化的机制" aria-hidden="true">#</a> Redis 的持久化的机制</h2><h3 id="rdb-redis-database-1" tabindex="-1"><a class="header-anchor" href="#rdb-redis-database-1" aria-hidden="true">#</a> RDB：Redis DataBase</h3><blockquote><p>将某一个时刻的内存快照（Snapshot），以二进制的方式写入磁盘。</p></blockquote><p><strong>手动触发：</strong></p><ul><li>save 命令，使 Redis 处于阻塞状态，直到 RDB 持久化完成，才会响应其他客户端发来的命令，所以在生产环境一定要慎用</li><li>bgsave 命令，fork 出一个子进程执行持久化，主进程只在 fork 过程中有短暂的阻塞，主进程就可以响应客户端请求了</li></ul><p><strong>自动触发：</strong></p><ul><li>save m n：在 m 秒内，如果有 n 个键发生改变，则自动触发持久化，通过 bgsave 执行，如果设置多个、只要满足其一就会触发，配置文件有默认配置（可以注释调掉）</li><li>flushall：用于清空 redis 所有的数据库，flushdb 清空当期 redis 所在库数据（默认是 0 号数据库），会清空 RDB 文件，同时也会生成 dump.rdb，内容为空</li><li>主从同步：全量同步时会自动触发 bgsave 命令，生成 rdb 发送给从节点</li></ul><p><strong>优点：</strong></p><ol><li><p>整个 Redis 数据库将只包含一个文件 dump.rdb，方便持久化。</p></li><li><p>容灾性好，方便备份。</p></li><li><p>性能最大化，fork 子进程来完成写操作，让主操作继续处理命令，所以是 IO 最大化。使用单独子进程来进行持久化，主进程不会进行任何 IO 操作，保证了 redis 的高性能</p></li><li><p>相对于数据集大时，比 AOF 的启动效率更高。</p></li></ol><p><strong>缺点：</strong></p><ol><li>数据安全性低。RDB 是间隔一段时间进行持久化，如果持久化之间 redis 发生故障，会发生数据丢失。所以这种方式更适合数据要求不严谨的时候</li><li>由于 RDB 是通过 fork 子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫米，甚至是 1 秒中，会占用 cpu。</li></ol><h3 id="aof-append-only-file-1" tabindex="-1"><a class="header-anchor" href="#aof-append-only-file-1" aria-hidden="true">#</a> AOF：Append Only File</h3><blockquote><p>以日志的形式记录服务器所处理的每一个写、删除操作，查询记录不会记录，以文本的方式记录，可以打开文件看到详细的操作记录，调操作系统命令进程刷盘</p></blockquote><ol><li>所有的写命令会追加到 AOF 缓冲中。</li><li>AOF 缓冲区根据对应的策略向硬盘进行同步操作</li><li>随着 AOF 文件越来越大，需要定期对 AOF 文件进行重写，达到压缩的目的。</li><li>当 Redis 重启时，可以加载 AOF 文件进行数据恢复</li></ol><p><strong>同步策略：</strong></p><ul><li>每秒同步：异步完成，效率非常高，一旦系统出现宕机现象，那么这一秒钟之内修改的数据将会丢失。</li><li>每修改同步：同步持久化，每次发生的数据变化都会被立即记录到磁盘中，最多丢一条</li><li>不同步：由操作系统控制，可能丢失较多数据</li></ul><p><strong>优点：</strong></p><ol><li>数据安全</li><li>通过 append 模式写文件，即使中途服务器宕机也不会破坏已经存在的内容，可以通过 redis-check-aof 工具解决一致性问题。</li><li>AOF 机制的 rewrite 模式。定期对 AOF 文件进行重写，已达到压缩的目的</li></ol><p><strong>缺点：</strong></p><ol><li>AOF 文件比 RDB 文件大，且恢复速度慢。</li><li>数据集大的时候，比 rdb 启动效率低。</li><li>运行效率没有 RBD 高</li></ol><p>AOF 文件比 RDB 更新频率高，优先使用 AOF 还原数据。</p><p>AOF 比 RDB 更安全也更大</p><p>RBD 性能比 AOF好</p><p>如果两个都配置了，优先加载 AOF 文件</p><h2 id="redis-的过期键的删除策略" tabindex="-1"><a class="header-anchor" href="#redis-的过期键的删除策略" aria-hidden="true">#</a> Redis 的过期键的删除策略</h2><p>Redis 是 key-value 数据库，我们可以设置 Redis 中缓存的 key 的过期时间。Redis 的过期策略就是指定当 Redis 中缓存的 key 过期了，Redis 如何处理。</p><ul><li>惰性过期：只有当访问一个 key 时，才会判断 key 是否已过期，过期则删除。该策略可以最大化地节省 CPU 资源，却对内存非常不友好。极端情况可能出现大量的 key 没有再次被访问，从而不会被清除，占用大量内存。</li><li>定期过期：每隔一定的时间，会扫描一定数量的数据库的 expires 字典中一定数量的 key，并清除其中已过期的 key。该策略是前两者的一个折中方案。通过调整定时扫描的时间间隔和每次扫描的限定耗时，可以在不同情况下使得 CPU 和 内存资源达到最优的平衡效果。</li></ul><p>(expries 字典会保存所有设置了过期时间的 key 的过期时间数据，其中，key 是指向键空间中的某个键的指针，value 是该键的毫秒精度的 UNIX 时间戳表示的过期时间。键空间是指该 Redis 集群中保存的所有键。)</p><p>Redis 中同时使用了惰性过期和定期过期两种过期策略。</p><h2 id="redis-分布式锁底层是如何实现的" tabindex="-1"><a class="header-anchor" href="#redis-分布式锁底层是如何实现的" aria-hidden="true">#</a> Redis 分布式锁底层是如何实现的？</h2><ol><li>首先利用 setnx 来保证：如果 key 不存在才能获取到锁，如果 key 存在，则获取不到锁</li><li>然后还要利用 lua 脚本来保证多个 redis 操作的原子性</li><li>同时还要考虑到锁过期，所以需要额外的一个看门狗定时任务来监听锁是否需要续约</li><li>同时还要考虑到 redis 节点挂掉之后的情况，所以需要采用红锁的方式来同时向 N/2 +1 个节点申请锁，都申请到了才证明获取锁成功，这样就算其中某个 redis 节点挂掉了，锁也不会被其他客户端获取到。</li></ol><h2 id="redis-有哪些数据结构-分别有哪些典型的应用场景" tabindex="-1"><a class="header-anchor" href="#redis-有哪些数据结构-分别有哪些典型的应用场景" aria-hidden="true">#</a> Redis 有哪些数据结构？分别有哪些典型的应用场景？</h2><p>Redis 的数据结构有：</p><ol><li>字符串：可以用来做简单的数据，可以缓存某个简单的字符串，也可以缓存某个 json 格式的字符串，Redis 分布式锁的实现就利用了这种数据结构，还包括可以实现计数器、Session 共享、分布式 ID</li><li>哈希表：可以用来存储一些 key-value 对，更适合用来存储对象</li><li>列表：Redis 的列表通过命令的组合，既可以当做栈，也可以当做队列来使用，可以用来缓存类似微信公众号、微博等消息流数据</li><li>集合：和列表相似，也可以存储多个元素，但是不能重复，集合可以进行交集、并集、差集等操作，从而可以实现类似我和某人共同关注的人、朋友圈点赞等功能</li><li>有序集合：集合是无序的，有序集合可以设置顺序，可以用来实现排行榜功能</li></ol><h2 id="redis-主从复制的核心原理" tabindex="-1"><a class="header-anchor" href="#redis-主从复制的核心原理" aria-hidden="true">#</a> Redis 主从复制的核心原理</h2><p>通过执行 salveof 命令设置 slaveof 选项，让一个服务器去复制另一个服务器的数据。主数据库可以进行读写操作，当写操作导致数据变化时会自动将数据同步给从数据库。而从数据库一般是只读的，并接受主数据库同步过来的数据。一个主数据库可以拥有多个从数据库，而一个从数据库只能拥有一个主数据库。</p><p><strong>全量复制：</strong></p><p>（1）主节点通过 bgsave 命令 fork 子进程进行 RDB 持久化（生成全量数据快照），该过程非常消耗 CPU、内存（页表复制）、硬盘 IO等</p><p>（2）主节点通过网络将 RDB 文件发送给从节点，对主从节点的贷款都会带来很大的消耗</p><p>（3）从节点清空老数据、载入新 RDB 文件的过程是阻塞的，无法响应客户端；如果从节点执行 bgrewriteof，也会带来额外的消耗</p><p><strong>部分复制：</strong></p><ul><li>复制偏移量：执行复制的双方，主从节点，分别会维护一个复制偏移量 offset</li><li>复制积压缓冲区：<strong>主节点内部维护了一个固定长度的、先进先出（FIFO）队列</strong>作为复制积压缓冲区，当主从节点 offset 的差距过大超过缓冲区的长度时，将无法执行部分复制，只能执行全量复制。</li><li>服务器运行 ID（runid）：每个 Redis 节点，都有其运行 ID，运行 ID 由节点在启动时自动生成，主节点会将自己的运行 ID 发送给从节点，从节点会将主节点的运行 ID 存起来。从节点 Redis 断开重连的时候，就是根据运行 ID 来判断同步的进度： <ul><li>如果从节点保存的 runid 与 主节点现在的 runid 相同，说明主从节点之前同步过，主节点会继续尝试使用使用部分复制（到底能不能部分复制还要看 offset 和复制积压缓冲区的情况）；</li><li>如果从节点保存的 runid 与主节点现在的 runid 不同，说明从节点在断线前同步的 Redis 节点并不是当前的主节点，只能进行全量复制。</li></ul></li></ul><p>过程原理：</p><p><img src="https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/image-20221112190247115.png" alt="image-20221112190247115" loading="lazy"></p><h2 id="布隆过滤器原理-优缺点" tabindex="-1"><a class="header-anchor" href="#布隆过滤器原理-优缺点" aria-hidden="true">#</a> 布隆过滤器原理，优缺点</h2><p>位图：int[10]，每个 int 类型的整数是 4*8 = 32 个 bit，则 int[10] 一共有 320 bit，每个 bit 非0 即 1，初始化时都是 0。添加数据时，将数据进行 hash 得到 hash 值，对应到 bit 为，将 bit 改为 1，hash 函数可以定义多个，则一个数据添加将多个（hash 函数个数）bit 改为 1，多个 hash 函数的目的是减少 hash 碰撞的概率</p><p><img src="https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/20210225103955320.png" alt="" loading="lazy"></p><p>查询数据：hash 函数计算得到 hash 值，对应到 bit 中，如果有一个为 0，则说明数据不在 bit 中，如果都为 1，则该数据可能在 bit 中</p><p><img src="https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/20210225105747809.png" alt="img" loading="lazy"></p><p><strong>优点：</strong></p><ul><li>占用内存小</li><li>增加和查询元素的时间复杂度为：O(K)，（K为哈希函数的个数，一般比较小），与数据量大小无关</li><li>哈希函数互相之间没有关系，方便硬件并行计算</li><li>布隆过滤器不需要存储元素本身，在某些对保密要求比较严格的场合有很大优势</li><li>数据量大时，布隆过滤器可以表示全集</li><li>使用同一组散列函数的布隆过滤器可以进行交、并、差运算</li></ul><p><strong>缺点：</strong></p><ul><li>误判率，即存在假阳性（False Position），不能准确判断元素是否在集合中</li><li>不能获取元素本身</li><li>一般情况下不能从布隆过滤器中删除元素</li></ul>',75),d=[s];function o(t,p){return e(),l("div",null,d)}const c=i(r,[["render",o],["__file","redis.html.vue"]]);export{c as default};
