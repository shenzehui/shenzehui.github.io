import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as t,e as s}from"./app-24cf6c9f.js";const p={},i=s('<blockquote><p>实现订单到期关闭的十一种正确姿势！</p></blockquote><p>在电商、支付等系统中，一般都是先创建订单（支付单），再给用户一定的时间进行支付，如果没有按时支付的话，就需要把之前的订单（支付单）取消掉。</p><p>这种类似的场景有很多，还有比如到期自动收货、超时自动退款、下单后自动发送短信等等都是类似的业务问题。</p><p>本文就从这样的业务问题出发，探讨一下都有哪些技术方案，这些方案的实现细节，以及相关的优缺点都有什么？</p><p>因为本文要讲的内容比较多，涉及到11种具体方案，受篇幅限制，<strong>这篇文章主要是讲方案，不会涉及到具体的代码实现。</strong> 因为只要方案搞清楚了，代码实现不是难事儿。</p><h3 id="一、被动关闭" tabindex="-1"><a class="header-anchor" href="#一、被动关闭" aria-hidden="true">#</a> 一、被动关闭</h3><p>在解决这类问题的时候，有一种比较简单的方式，那就是通过业务上的被动方式来进行关单操作。</p><p>简单点说，就是订单创建好了之后。我们系统上不做主动关单，什么时候用户来访问这个订单了，再去判断时间是不是超过了过期时间，如果过了时间那就进行关单操作，然后再提示用户。</p><p><img src="https://s1.vika.cn/space/2022/11/29/5c9c1d8e9fa84005bc80ef961ae1b21d" alt="img" loading="lazy"></p><p>这种做法是最简单的，基本不需要开发定时关闭的功能，但是他的缺点也很明显，那就是如果用户一直不来查看这个订单，那么就会有很多脏数据冗余在数据库中一直无法被关单。</p><p>还有一个缺点，那就是需要在用户的查询过程中进行写的操作，一般写操作都会比读操作耗时更长，而且有失败的可能，一旦关单失败了，就会导致系统处理起来比较复杂。</p><p>所以，<strong>这种方案只适合于自己学习的时候用，任何商业网站中都不建议使用这种方案来实现订单关闭的功能。</strong></p><h3 id="二、定时任务" tabindex="-1"><a class="header-anchor" href="#二、定时任务" aria-hidden="true">#</a> 二、定时任务</h3><p>定时任务关闭订单，这是很容易想到的一种方案。</p><p>具体实现细节就是我们通过一些调度平台来实现定时执行任务，任务就是去扫描所有到期的订单，然后执行关单动作。</p><p><img src="https://s1.vika.cn/space/2022/11/29/3a3ce2a0029144acb1abdcb55e61f7ae" alt="img" loading="lazy"></p><p>这个方案的优点也是比较简单，实现起来很容易，基于Timer、ScheduledThreadPoolExecutor、或者像xxl-job这类调度框架都能实现，但是有以下几个问题：</p><p><strong>1、时间不精准。</strong> 一般定时任务基于固定的频率、按照时间定时执行的，那么就可能会发生很多订单已经到了超时时间，但是定时任务的调度时间还没到，那么就会导致这些订单的实际关闭时间要比应该关闭的时间晚一些。</p><p><strong>2、无法处理大订单量。</strong> 定时任务的方式是会把本来比较分散的关闭时间集中到任务调度的那一段时间，如果订单量比较大的话，那么就可能导致任务执行时间很长，整个任务的时间越长，订单被扫描到时间可能就很晚，那么就会导致关闭时间更晚。</p><p><strong>3、对数据库造成压力。</strong> 定时任务集中扫表，这会使得数据库IO在短时间内被大量占用和消耗，如果没有做好隔离，并且业务量比较大的话，就可能会影响到线上的正常业务。</p><p><strong>4、分库分表问题。</strong> 订单系统，一旦订单量大就可能会考虑分库分表，在分库分表中进行全表扫描，这是一个极不推荐的方案。</p><p>所以，<strong>定时任务的方案，适合于对时间精确度要求不高、并且业务量不是很大的场景中。如果对时间精度要求比较高，并且业务量很大的话，这种方案不适用。</strong></p><h3 id="三、jdk自带的延迟队列" tabindex="-1"><a class="header-anchor" href="#三、jdk自带的延迟队列" aria-hidden="true">#</a> 三、JDK自带的延迟队列</h3><p>有这样一种方案，他不需要借助任何外部的资源，直接基于应用自身就能实现，那就是基于JDK自带的DelayQueue来实现</p><blockquote><p>DelayQueue是一个无界的BlockingQueue，用于放置实现了Delayed接口的对象，其中的对象只能在其到期时才能从队列中取走。</p></blockquote><p>基于延迟队列，是可以实现订单的延迟关闭的，首先，在用户创建订单的时候，把订单加入到DelayQueue中，然后，还需要一个常驻任务不断的从队列中取出那些到了超时时间的订单，然后在把他们进行关单，之后再从队列中删除掉。</p><p>这个方案需要有一个线程，不断的从队列中取出需要关单的订单。一般在这个线程中需要加一个while(true)循环，这样才能确保任务不断的执行并且能够及时的取出超时订单。</p><p>使用DelayQueue实现超时关单的方案，实现起来简单，不须要依赖第三方的框架和类库，JDK原生就支持了。</p><p>当然这个方案也不是没有缺点的，首先，基于DelayQueue的话，需要把订单放进去，那如果订单量太大的话，可能会导致OOM的问题；另外，DelayQueue是基于JVM内存的，一旦机器重启了，里面的数据就都没有了。虽然我们可以配合数据库的持久化一起使用。而且现在很多应用都是集群部署的，那么集群中多个实例上的多个DelayQueue如何配合是一个很大的问题。</p><p>所以，<strong>基于JDK的DelayQueue方案只适合在单机场景、并且数据量不大的场景中使用，如果涉及到分布式场景，那还是不建议使用。</strong></p><h3 id="四、netty的时间轮" tabindex="-1"><a class="header-anchor" href="#四、netty的时间轮" aria-hidden="true">#</a> 四、Netty的时间轮</h3><p>还有一种方式，和上面我们提到的JDK自带的DelayQueue类似的方式，那就是基于时间轮实现。</p><p>为什么要有时间轮呢？主要是因为DelayQueue插入和删除操作的平均时间复杂度——O(nlog(n))，虽然已经挺好的了，但是时间轮的方案可以将插入和删除操作的时间复杂度都降为O(1)。</p><blockquote><p>时间轮可以理解为一种环形结构，像钟表一样被分为多个 slot。每个 slot 代表一个时间段，每个 slot 中可以存放多个任务，使用的是链表结构保存该时间段到期的所有任务。时间轮通过一个时针随着时间一个个 slot 转动，并执行 slot 中的所有到期任务。</p></blockquote><p><img src="https://s1.vika.cn/space/2022/11/29/ae6d3611ae01404fb7aed03323dfc375" alt="img" loading="lazy"></p><p>基于Netty的HashedWheelTimer可以帮助我们快速的实现一个时间轮，这种方式和DelayQueue类似，缺点都是基于内存、集群扩展麻烦、内存有限制等等。</p><p>但是他相比DelayQueue的话，效率更高一些，任务触发的延迟更低。代码实现上面也更加精简。</p><p>所以，<strong>基于Netty的时间轮方案比基于JDK的DelayQueue效率更高，实现起来更简单，但是同样的，只适合在单机场景、并且数据量不大的场景中使用，如果涉及到分布式场景，那还是不建议使用。</strong></p><h3 id="五、kafka的时间轮" tabindex="-1"><a class="header-anchor" href="#五、kafka的时间轮" aria-hidden="true">#</a> 五、Kafka的时间轮</h3><p>既然基于Netty的时间轮存在一些问题，那么有没有其他的时间轮的实现呢？</p><p>还真有的，那就是Kafka的时间轮，Kafka内部有很多延时性的操作，如延时生产，延时拉取，延时数据删除等，这些延时功能由内部的延时操作管理器来做专门的处理，其底层是采用时间轮实现的。</p><p><img src="https://s1.vika.cn/space/2022/11/29/2ef96cf9dc094d6aa745ef7faccbb882" alt="img" loading="lazy"></p><p>而且，为了解决有一些时间跨度大的延时任务，Kafka 还引入了层级时间轮，能更好控制时间粒度，可以应对更加复杂的定时任务处理场景；</p><p>Kafka 中的时间轮的实现是 TimingWheel 类，位于 kafka.utils.timer 包中。基于Kafka的时间轮同样可以得到O(1)时间复杂度，性能上还是不错的。</p><p><strong>基于Kafka的时间轮的实现方式，在实现方式上有点复杂，需要依赖kafka，但是他的稳定性和性能都要更高一些，而且适合用在分布式场景</strong>中。</p><h3 id="六、rocketmq延迟消息" tabindex="-1"><a class="header-anchor" href="#六、rocketmq延迟消息" aria-hidden="true">#</a> 六、RocketMQ延迟消息</h3><p>相比于Kafka来说，RocketMQ中有一个强大的功能，那就是支持延迟消息。</p><p><img src="https://s1.vika.cn/space/2022/11/29/499d6b9b435f416883ece2b5007b6928" alt="img" loading="lazy"></p><blockquote><p>延迟消息，当消息写入到Broker后，不会立刻被消费者消费，需要等待指定的时长后才可被消费处理的消息，称为延时消息。</p></blockquote><p>有了延迟消息，我们就可以在订单创建好之后，发送一个延迟消息，比如20分钟取消订单，那就发一个延迟20分钟的延迟消息，然后在20分钟之后，消息就会被消费者消费，消费者在接收到消息之后，去关单就行了。</p><p>但是，RocketMQ的延迟消息并不是支持任意时长的延迟的，它只支持：1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h这几个时长。（商业版支持任意时长）</p><p>可以看到，有了RocketMQ延迟消息之后，我们处理上就简单很多，只需要发消息，和接收消息就行了，系统之间完全解耦了。但是因为延迟消息的时长受到了限制，所以并不是很灵活。</p><p><strong>如果我们的业务上，关单时长刚好和RocketMQ延迟消息支持的时长匹配的话，那么是可以基于RocketMQ延迟消息来实现的。否则，这种方式并不是最佳的。</strong></p><h3 id="七、rabbitmq死信队列" tabindex="-1"><a class="header-anchor" href="#七、rabbitmq死信队列" aria-hidden="true">#</a> 七、RabbitMQ死信队列</h3><p>延迟消息不仅在RocketMQ中支持，其实在RabbitMQ中也是可以实现的，只不过其底层是基于死信队列实现的。</p><p>当RabbitMQ中的一条正常的消息，因为过了存活时间（TTL过期）、队列长度超限、被消费者拒绝等原因无法被消费时，就会变成Dead Message，即死信。</p><p><img src="https://s1.vika.cn/space/2022/11/29/f8cd9da5ccac41c0abecdd9d5149febf" alt="img" loading="lazy"></p><p>当一个消息变成死信之后，他就能被重新发送到死信队列中（其实是交换机-exchange）。</p><p>那么基于这样的机制，就可以实现延迟消息了。那就是我们给一个消息设定TTL，然但是并不消费这个消息，等他过期，过期后就会进入到死信队列，然后我们再监听死信队列的消息消费就行了。</p><p>而且，RabbitMQ中的这个TTL是可以设置任意时长的，这就解决了RocketMQ的不灵活的问题。</p><p>但是，死信队列的实现方式存在一个问题，那就是可能造成队头阻塞，因为队列是先进先出的，而且每次只会判断队头的消息是否过期，那么，如果队头的消息时间很长，一直都不过期，那么就会阻塞整个队列，这时候即使排在他后面的消息过期了，那么也会被一直阻塞。</p><p><strong>基于RabbitMQ的死信队列，可以实现延迟消息，非常灵活的实现定时关单，并且借助RabbitMQ的集群扩展性，可以实现高可用，以及处理大并发量。他的缺点第一是可能存在消息阻塞的问题，还有就是方案比较复杂，不仅要依赖RabbitMQ，而且还需要声明很多队列(exchange)出来，增加系统的复杂度</strong></p><h3 id="八、rabbitmq插件" tabindex="-1"><a class="header-anchor" href="#八、rabbitmq插件" aria-hidden="true">#</a> 八、RabbitMQ插件</h3><p>其实，基于RabbitMQ的话，可以不用死信队列也能实现延迟消息，那就是基于rabbitmq_delayed_message_exchange插件，这种方案能够解决通过死信队列实现延迟消息出现的消息阻塞问题。但是该插件从RabbitMQ的3.6.12开始支持的，所以对版本有要求。</p><p><img src="https://s1.vika.cn/space/2022/11/29/b80ece1c64b14b2e88de9aac29f3f90a" alt="img" loading="lazy"></p><p>这个插件是官方出的，可以放心使用，安装并启用这个插件之后，就可以创建x-delayed-message类型的队列了。</p><p>前面我们提到的基于私信队列的方式，是消息先会投递到一个正常队列，在TTL过期后进入死信队列。但是基于插件的这种方式，消息并不会立即进入队列，而是先把他们保存在一个基于Erlang开发的Mnesia数据库中，然后通过一个定时器去查询需要被投递的消息，再把他们投递到x-delayed-message队列中。</p><p><strong>基于RabbitMQ插件的方式可以实现延迟消息，并且不存在消息阻塞的问题，但是因为是基于插件的，而这个插件支持的最大延长时间是(2^32)-1 毫秒，大约49天，超过这个时间就会被立即消费。但是他基于RabbitMQ实现，所以在可用性、性能方便都很不错</strong></p><h3 id="九、redis过期监听" tabindex="-1"><a class="header-anchor" href="#九、redis过期监听" aria-hidden="true">#</a> 九、Redis过期监听</h3><p>很多用过Redis的人都知道，Redis有一个过期监听的功能，</p><p>在 redis.conf 中，加入一条配置notify-keyspace-events Ex开启过期监听，然后再代码中实现一个KeyExpirationEventMessageListener，就可以监听key的过期消息了。</p><p>这样就可以在接收到过期消息的时候，进行订单的关单操作。</p><p><strong>这个方案不建议大家使用，是因为Redis官网上明确的说过，Redis并不保证Key在过期的时候就能被立即删除，更不保证这个消息能被立即发出。所以，消息延迟是必然存在的，随着数据量越大延迟越长，延迟个几分钟都是常事儿。</strong></p><p>而且，在Redis 5.0之前，<strong>这个消息是通过PUB/SUB模式发出的，他不会做持久化，至于你有没有接到，有没有消费成功，他不管。也就是说，如果发消息的时候，你的客户端挂了，之后再恢复的话，这个消息你就彻底丢失了。</strong>（在Redis 5.0之后，因为引入了Stream，是可以用来做延迟消息队列的。）</p><h3 id="十、redis的zset" tabindex="-1"><a class="header-anchor" href="#十、redis的zset" aria-hidden="true">#</a> 十、Redis的zset</h3><p>虽然基于 Redis 过期监听的方案并不完美，但是并不是Redis实现关单功能就不完美了，还有其他的方案。</p><p><img src="https://s1.vika.cn/space/2022/11/29/70902d098dd04722b05d9246d140ce7c" alt="img" loading="lazy"></p><p>我们可以借助Redis中的有序集合——zset来实现这个功能。</p><p>zset是一个有序集合，每一个元素(member)都关联了一个 score，可以通过 score 排序来取集合中的值。</p><p>我们将订单超时时间的时间戳（下单时间+超时时长）与订单号分别设置为 score 和 member。这样redis会对zset按照score延时时间进行排序。然后我们再开启redis扫描任务，获取”当前时间 &gt; score”的延时任务，扫描到之后取出订单号，然后查询到订单进行关单操作即可。</p><p><strong>使用redis zset来实现订单关闭的功能的优点是可以借助redis的持久化、高可用机制。避免数据丢失。但是这个方案也有缺点，那就是在高并发场景中，有可能有多个消费者同时获取到同一个订单号，一般采用加分布式锁解决，但是这样做也会降低吞吐型。</strong></p><p>但是，在大多数业务场景下，如果幂等性做得好的，多个消费者取到同一个订单号也无妨。</p><h3 id="十一、redisson" tabindex="-1"><a class="header-anchor" href="#十一、redisson" aria-hidden="true">#</a> 十一、Redisson</h3><p>上面这种方案看上去还不错，但是需要我们自己基于zset这种数据结构编写代码，那么有没有什么更加友好的方式？</p><p>有的，那就是基于Redisson。</p><p>Redisson是一个在Redis的基础上实现的框架，它不仅提供了一系列的分布式的Java常用对象，还提供了许多分布式服务。</p><p><img src="https://s1.vika.cn/space/2022/11/29/a059b2acd4754e7a8c7963de61adc448" alt="img" loading="lazy"></p><p>Redission中定义了分布式延迟队列RDelayedQueue，这是一种基于我们前面介绍过的zset结构实现的延时队列，它允许以指定的延迟时长将元素放到目标队列中。</p><p>其实就是在zset的基础上增加了一个基于内存的延迟队列。当我们要添加一个数据到延迟队列的时候，redission会把数据+超时时间放到zset中，并且起一个延时任务，当任务到期的时候，再去zset中把数据取出来，返回给客户端使用。</p><p>大致思路就是这样的，感兴趣的大家可以看一看RDelayedQueue的具体实现。</p><p><strong>基于Redisson的实现方式，是可以解决基于zset方案中的并发重复问题的，而且还能实现方式也比较简单，稳定性、性能都比较高</strong>。</p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>我们介绍了11种实现订单定时关闭的方案，其中不同的方案各自都有优缺点，也各自适用于不同的场景中。那我们尝试着总结一下：</p><p><strong>实现的复杂度上（包含用到的****框架的依赖及部署）：</strong></p><p>Redission &gt; RabbitMQ插件 &gt; RabbitMQ死信队列 &gt; RocketMQ延迟消息 ≈ Redis的zset &gt; Redis过期监听 ≈ kafka时间轮 &gt; 定时任务 &gt; Netty的时间轮 &gt; JDK自带的DelayQueue &gt; 被动关闭</p><p><strong>方案的完整性：</strong></p><p>Redission ≈ RabbitMQ插件 &gt; kafka时间轮 &gt; Redis的zset ≈ RocketMQ延迟消息 ≈ RabbitMQ死信队列 &gt; Redis过期监听 &gt; 定时任务 &gt; Netty的时间轮 &gt; JDK自带的DelayQueue &gt; 被动关闭</p><p><strong>不同的场景中也适合不同的方案：</strong></p><ul><li>自己玩玩：被动关闭</li><li>单体应用，业务量不大：Netty的时间轮、JDK自带的DelayQueue、定时任务</li><li>分布式应用，业务量不大：Redis过期监听、RabbitMQ死信队列、Redis的zset、定时任务</li><li>分布式应用，业务量大、并发高：Redission、RabbitMQ插件、kafka时间轮、RocketMQ延迟消息</li></ul><p>总体考虑的话，考虑到成本，方案完整性、以及方案的复杂度，还有用到的第三方框架的流行度来说，<strong>个人比较建议优先考虑Redission+Redis、RabbitMQ插件、Redis的zset、RocketMQ延迟消息等方案。</strong></p><h2 id="公众号" tabindex="-1"><a class="header-anchor" href="#公众号" aria-hidden="true">#</a> 公众号</h2><p><img src="https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff" alt="" loading="lazy"></p>',102),r=[i];function d(o,n){return a(),t("div",null,r)}const h=e(p,[["render",d],["__file","art03.html.vue"]]);export{h as default};