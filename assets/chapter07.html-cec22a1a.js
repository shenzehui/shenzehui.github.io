import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as c,c as l,a as s,b as a,d as p,e as n}from"./app-9a9d33f6.js";const i={},d=n('<h2 id="_7-1-编码和解码的基本介绍" tabindex="-1"><a class="header-anchor" href="#_7-1-编码和解码的基本介绍" aria-hidden="true">#</a> 7.1 编码和解码的基本介绍</h2><ol><li>编写网络应用程序时，因为数据在网络中传输的都是二进制字节码数据，在发送数据时就需要编码，接收数据时就需要解码[示意图]</li><li><code>codec</code>（编解码器）的组成部分有两个：<code>decoder</code>（解码器）和 <code>encoder</code>（编码器）。<code>encoder</code> 负责把业务数据转换成字节码数据，<code>decoder</code> 负责把字节码数据转换成业务数据</li></ol><figure><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter07_01.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_7-2-netty-本身的编码解码的机制和问题分析" tabindex="-1"><a class="header-anchor" href="#_7-2-netty-本身的编码解码的机制和问题分析" aria-hidden="true">#</a> 7.2 Netty 本身的编码解码的机制和问题分析</h2><ol><li><p><code>Netty</code> 自身提供了一些 <code>codec</code>(编解码器)</p></li><li><p><code>Netty</code> 提供的编码器 <code>StringEncoder</code>，对字符串数据进行编码 <code>ObjectEncoder</code>，对Java对象进行编码...</p></li><li><p><code>Netty</code> 提供的解码器 <code>StringDecoder</code>,对字符串数据进行解码 <code>ObjectDecoder</code>，对 <code>Java</code> 对象进行解码...</p></li><li><p><code>Netty</code> 本身自带的 <code>ObjectDecoder</code> 和 <code>ObjectEncoder</code> 可以用来实现 <code>POJO</code> 对象或各种业务对象的编码和解码，底层使用的仍是Java序列化技术,而Java序列化技术本身效率就不高，存在如下问题</p><ul><li>无法跨语言</li><li>序列化后的体积太大，是二进制编码的5倍多。</li><li>序列化性能太低</li></ul></li><li><p>=&gt;引出新的解决方案[<code>Google</code> 的 <code>Protobuf</code>]</p></li></ol><h2 id="_7-3-protobuf" tabindex="-1"><a class="header-anchor" href="#_7-3-protobuf" aria-hidden="true">#</a> 7.3 Protobuf</h2>',6),r=n("<li><code>Protobuf</code> 基本介绍和使用示意图</li><li><code>Protobuf</code> 是 <code>Google</code> 发布的开源项目，全称 <code>Google Protocol Buffers</code>，是一种轻便高效的结构化数据存储格式，可以用于结构化数据串行化，或者说序列化。它很适合做数据存储或 <code>RPC</code> [远程过程调用 <code>remote procedure call</code> ]数据交换格式。目前很多公司 <code>http + json tcp + protobuf</code></li>",2),u={href:"https://developers.google.com/protocol-buffers/docs/proto",target:"_blank",rel:"noopener noreferrer"},m=n("<li><code>Protobuf</code> 是以 <code>message</code> 的方式来管理数据的.</li><li>支持跨平台、跨语言，即[客户端和服务器端可以是不同的语言编写的]（支持目前绝大多数语言，例如 <code>C++</code>、<code>C#</code>、<code>Java</code>、<code>python</code> 等）</li><li>高性能，高可靠性</li><li>使用 <code>protobuf</code> 编译器能自动生成代码，<code>Protobuf</code> 是将类的定义使用 <code>.proto</code> 文件进行描述。说明，在 <code>idea</code> 中编写 <code>.proto</code> 文件时，会自动提示是否下载 <code>.ptoto</code> 编写插件.可以让语法高亮。</li><li>然后通过 <code>protoc.exe</code> 编译器根据 <code>.proto</code> 自动生成 <code>.java</code> 文件</li><li><code>protobuf</code> 使用示意图</li>",6),v=n(`<figure><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/chapter07_02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_7-4-protobuf-快速入门实例" tabindex="-1"><a class="header-anchor" href="#_7-4-protobuf-快速入门实例" aria-hidden="true">#</a> 7.4 Protobuf 快速入门实例</h2><p>编写程序，使用 <code>Protobuf</code> 完成如下功能</p><ol><li>客户端可以发送一个 <code>StudentPoJo</code> 对象到服务器(通过 <code>Protobuf</code> 编码)</li><li>服务端能接收 <code>StudentPoJo</code> 对象，并显示信息(通过 <code>Protobuf</code> 解码)</li><li>具体看老师演示步骤</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Student</span><span class="token punctuation">.</span>proto

syntax <span class="token operator">=</span> <span class="token string">&quot;proto3&quot;</span><span class="token punctuation">;</span> <span class="token comment">//版本</span>
option java_outer_classname <span class="token operator">=</span> <span class="token string">&quot;StudentPOJO&quot;</span><span class="token punctuation">;</span><span class="token comment">//生成的外部类名，同时也是文件名</span>
<span class="token comment">//protobuf 使用message 管理数据</span>
message <span class="token class-name">Student</span> <span class="token punctuation">{</span> <span class="token comment">//会在 StudentPOJO 外部类生成一个内部类 Student， 他是真正发送的POJO对象</span>
    int32 id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">// Student 类中有 一个属性 名字为 id 类型为int32(protobuf类型) 1表示属性序号，不是值</span>
    string name <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

编译
protoc<span class="token punctuation">.</span>exe<span class="token operator">--</span>java_out<span class="token operator">=</span><span class="token punctuation">.</span>Student<span class="token punctuation">.</span>proto
将生成的 <span class="token class-name">StudentPOJO</span> 放入到项目使用
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-5-protobuf-快速入门实例-2" tabindex="-1"><a class="header-anchor" href="#_7-5-protobuf-快速入门实例-2" aria-hidden="true">#</a> 7.5 Protobuf 快速入门实例 2</h2><ol><li>编写程序，使用 <code>Protobuf</code> 完成如下功能</li><li>客户端可以随机发送 <code>StudentPoJo</code> / <code>WorkerPoJo</code> 对象到服务器(通过 <code>Protobuf</code> 编码)</li><li>服务端能接收 <code>StudentPoJo</code> / <code>WorkerPoJo</code> 对象(需要判断是哪种类型)，并显示信息(通过 <code>Protobuf</code> 解码)</li><li>具体看老师演示步骤</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Student</span><span class="token punctuation">.</span>proto

syntax <span class="token operator">=</span> <span class="token string">&quot;proto3&quot;</span><span class="token punctuation">;</span>
option optimize_for <span class="token operator">=</span> <span class="token constant">SPEED</span><span class="token punctuation">;</span> <span class="token comment">// 加快解析</span>
option java_package<span class="token operator">=</span><span class="token string">&quot;com.atguigu.netty.codec2&quot;</span><span class="token punctuation">;</span>   <span class="token comment">//指定生成到哪个包下</span>
option java_outer_classname<span class="token operator">=</span><span class="token string">&quot;MyDataInfo&quot;</span><span class="token punctuation">;</span> <span class="token comment">// 外部类名, 文件名</span>

<span class="token comment">//protobuf 可以使用message 管理其他的message</span>
message <span class="token class-name">MyMessage</span> <span class="token punctuation">{</span>

    <span class="token comment">//定义一个枚举类型</span>
    <span class="token keyword">enum</span> <span class="token class-name">DataType</span> <span class="token punctuation">{</span>
        <span class="token class-name">StudentType</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">//在proto3 要求enum的编号从0开始</span>
        <span class="token class-name">WorkerType</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//用data_type 来标识传的是哪一个枚举类型</span>
    <span class="token class-name">DataType</span> data_type <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>

    <span class="token comment">//表示每次枚举类型最多只能出现其中的一个, 节省空间</span>
    oneof dataBody <span class="token punctuation">{</span>
        <span class="token class-name">Student</span> student <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
        <span class="token class-name">Worker</span> worker <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>


message <span class="token class-name">Student</span> <span class="token punctuation">{</span>
    int32 id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span><span class="token comment">//Student类的属性</span>
    string name <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span> <span class="token comment">//</span>
<span class="token punctuation">}</span>
message <span class="token class-name">Worker</span> <span class="token punctuation">{</span>
    string name<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span>
    int32 age<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8);function k(b,g){const e=t("ExternalLinkIcon");return c(),l("div",null,[d,s("ol",null,[r,s("li",null,[a("参考文档："),s("a",u,[a("https://developers.google.com/protocol-buffers/docs/proto"),p(e)]),a(" 语言指南")]),m]),v])}const _=o(i,[["render",k],["__file","chapter07.html.vue"]]);export{_ as default};