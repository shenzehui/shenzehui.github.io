import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as s,e}from"./app-f37b2341.js";const t={},o=e(`<h2 id="_8-1-基本说明" tabindex="-1"><a class="header-anchor" href="#_8-1-基本说明" aria-hidden="true">#</a> 8.1 基本说明</h2><ol><li><code>Netty</code> 的组件设计：<code>Netty</code> 的主要组件有 <code>Channel</code>、<code>EventLoop</code>、<code>ChannelFuture</code>、<code>ChannelHandler</code>、<code>ChannelPipe</code> 等</li><li><code>ChannelHandler</code> 充当了处理入站和出站数据的应用程序逻辑的容器。例如，实现 <code>ChannelInboundHandler</code> 接口（或 <code>ChannelInboundHandlerAdapter</code>），你就可以接收入站事件和数据，这些数据会被业务逻辑处理。当要给客户端发送响应时，也可以从 <code>ChannelInboundHandler</code> 冲刷数据。业务逻辑通常写在一个或者多个 <code>ChannelInboundHandler</code> 中。<code>ChannelOutboundHandler</code> 原理一样，只不过它是用来处理出站数据的</li><li><code>ChannelPipeline</code> 提供了 <code>ChannelHandler</code> 链的容器。以客户端应用程序为例，如果事件的运动方向是从客户端到服务端的，那么我们称这些事件为出站的，即客户端发送给服务端的数据会通过 <code>pipeline</code> 中的一系列 <code>ChannelOutboundHandler</code>，并被这些 <code>Handler</code> 处理，反之则称为入站的</li></ol><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_01.png" alt="" loading="lazy"></p><h2 id="_8-2编码解码器" tabindex="-1"><a class="header-anchor" href="#_8-2编码解码器" aria-hidden="true">#</a> 8.2编码解码器</h2><ol><li>当 <code>Netty</code> 发送或者接受一个消息的时候，就将会发生一次数据转换。入站消息会被解码：从字节转换为另一种格式（比如 <code>java</code> 对象）；如果是出站消息，它会被编码成字节。</li><li><code>Netty</code> 提供一系列实用的编解码器，他们都实现了 <code>ChannelInboundHadnler</code> 或者 <code>ChannelOutboundHandler</code> 接口。在这些类中，<code>channelRead</code> 方法已经被重写了。以入站为例，对于每个从入站 <code>Channel</code> 读取的消息，这个方法会被调用。随后，它将调用由解码器所提供的 <code>decode()</code> 方法进行解码，并将已经解码的字节转发给 <code>ChannelPipeline</code> 中的下一个 <code>ChannelInboundHandler</code>。</li></ol><h2 id="_8-3-解码器-bytetomessagedecoder" tabindex="-1"><a class="header-anchor" href="#_8-3-解码器-bytetomessagedecoder" aria-hidden="true">#</a> 8.3 解码器 - ByteToMessageDecoder</h2><ol><li>关系继承图</li></ol><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_02.png" alt="" loading="lazy"></p><ol start="2"><li>由于不可能知道远程节点是否会一次性发送一个完整的信息，<code>tcp</code> 有可能出现粘包拆包的问题，这个类会对入站数据进行缓冲，直到它准备好被处理.</li><li>一个关于 <code>ByteToMessageDecoder</code> 实例分析</li></ol><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_03.png" alt="" loading="lazy"></p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_04.png" alt="" loading="lazy"></p><h2 id="_8-4-netty-的-handler-链的调用机制" tabindex="-1"><a class="header-anchor" href="#_8-4-netty-的-handler-链的调用机制" aria-hidden="true">#</a> 8.4 Netty 的 handler 链的调用机制</h2><p>实例要求:</p><ol><li>使用自定义的编码器和解码器来说明 <code>Netty</code> 的 <code>handler</code> 调用机制 客户端发送 <code>long</code> -&gt; 服务器 服务端发送 <code>long</code> -&gt; 客户端</li><li>案例演示</li></ol><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_05.png" alt="" loading="lazy"></p><ol start="3"><li>结论 <ul><li>不论解码器 <code>handler</code> 还是编码器 <code>handler</code> 即接收的消息类型必须与待处理的消息类型一致，否则该 <code>handler</code> 不会被执行</li><li>在解码器进行数据解码时，需要判断缓存区（<code>ByteBuf</code>）的数据是否足够，否则接收到的结果会期望结果可能不一致</li></ul></li></ol><h2 id="_8-5-解码器-replayingdecoder" tabindex="-1"><a class="header-anchor" href="#_8-5-解码器-replayingdecoder" aria-hidden="true">#</a> 8.5 解码器 - ReplayingDecoder</h2><ol><li><code>public abstract class ReplayingDecoder&lt;S&gt; extends ByteToMessageDecoder</code></li><li><code>ReplayingDecoder</code> 扩展了 <code>ByteToMessageDecoder</code> 类，使用这个类，我们不必调用 <code>readableBytes()</code> 方法。参数 <code>S</code> 指定了用户状态管理的类型，其中 <code>Void</code> 代表不需要状态管理</li><li>应用实例：使用 <code>ReplayingDecoder</code> 编写解码器，对前面的案例进行简化[案例演示]</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>atguigu<span class="token punctuation">.</span>netty<span class="token punctuation">.</span>inboundhandlerandoutboundhandler</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">io<span class="token punctuation">.</span>netty<span class="token punctuation">.</span>buffer<span class="token punctuation">.</span></span><span class="token class-name">ByteBuf</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">io<span class="token punctuation">.</span>netty<span class="token punctuation">.</span>channel<span class="token punctuation">.</span></span><span class="token class-name">ChannelHandlerContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">io<span class="token punctuation">.</span>netty<span class="token punctuation">.</span>handler<span class="token punctuation">.</span>codec<span class="token punctuation">.</span></span><span class="token class-name">ReplayingDecoder</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyByteToLongDecoder2</span> <span class="token keyword">extends</span> <span class="token class-name">ReplayingDecoder</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">decode</span><span class="token punctuation">(</span><span class="token class-name">ChannelHandlerContext</span> ctx<span class="token punctuation">,</span> <span class="token class-name">ByteBuf</span> in<span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> out<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;MyByteToLongDecoder2 被调用&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//在 ReplayingDecoder 不需要判断数据是否足够读取，内部会进行处理判断</span>
        out<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>in<span class="token punctuation">.</span><span class="token function">readLong</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li><code>ReplayingDecoder</code> 使用方便，但它也有一些局限性： <ul><li>并不是所有的 <code>ByteBuf</code> 操作都被支持，如果调用了一个不被支持的方法，将会抛出一个 <code>UnsupportedOperationException</code>。</li><li><code>ReplayingDecoder</code> 在某些情况下可能稍慢于 <code>ByteToMessageDecoder</code>，例如网络缓慢并且消息格式复杂时，消息会被拆成了多个碎片，速度变慢</li></ul></li></ol><h2 id="_8-6-其它编解码器" tabindex="-1"><a class="header-anchor" href="#_8-6-其它编解码器" aria-hidden="true">#</a> 8.6 其它编解码器</h2><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_06.png" alt="" loading="lazy"></p><h3 id="_8-6-1-其它解码器" tabindex="-1"><a class="header-anchor" href="#_8-6-1-其它解码器" aria-hidden="true">#</a> 8.6.1 其它解码器</h3><ol><li><code>LineBasedFrameDecoder</code>：这个类在 <code>Netty</code> 内部也有使用，它使用行尾控制字符（\\n或者\\r\\n）作为分隔符来解析数据。</li><li><code>DelimiterBasedFrameDecoder</code>：使用自定义的特殊字符作为消息的分隔符。</li><li><code>HttpObjectDecoder</code>：一个 <code>HTTP</code> 数据的解码器</li><li><code>LengthFieldBasedFrameDecoder</code>：通过指定长度来标识整包消息，这样就可以自动的处理黏包和半包消息。</li></ol><h3 id="_8-6-2-其它编码器" tabindex="-1"><a class="header-anchor" href="#_8-6-2-其它编码器" aria-hidden="true">#</a> 8.6.2 其它编码器</h3><h2 id="_8-7-log4j-整合到-netty" tabindex="-1"><a class="header-anchor" href="#_8-7-log4j-整合到-netty" aria-hidden="true">#</a> 8.7 Log4j 整合到 Netty</h2><ol><li>在 <code>Maven</code> 中添加对 <code>Log4j</code> 的依赖在 <code>pom.xml</code></li></ol><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>log4j<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>log4j<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.2.17<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.slf4j<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>slf4j-api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.7.25<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.slf4j<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>slf4j-log4j12<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.7.25<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">&gt;</span></span>test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scope</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.slf4j<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>slf4j-simple<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.7.25<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">&gt;</span></span>test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scope</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>配置 <code>Log4j</code>，在 <code>resources/log4j.properties</code></li></ol><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code>log4j.rootLogger=DEBUG,stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=[%p]%C{1}-%m%n
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>演示整合</li></ol><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter08_07.png" alt="" loading="lazy"></p>`,32),p=[o];function c(l,i){return a(),s("div",null,p)}const r=n(t,[["render",c],["__file","chapter08.html.vue"]]);export{r as default};
