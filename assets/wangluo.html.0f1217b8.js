import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as d,a as e,b as a,e as i,d as l,r as p}from"./app.8db94880.js";const r={},o=l('<h2 id="💪-基础" tabindex="-1"><a class="header-anchor" href="#💪-基础" aria-hidden="true">#</a> 💪 基础</h2><h3 id="说下计算机网络体系结构" tabindex="-1"><a class="header-anchor" href="#说下计算机网络体系结构" aria-hidden="true">#</a> 说下计算机网络体系结构</h3><p>计算机网络体系结构，一般有三种：OSI 七层模型、TCP/IP 四层模型、五层结构。</p><p><img src="https://s1.vika.cn/space/2022/11/30/98cf70b5ecee4c5791dd2a9c86550664" alt="image-20221130144409670" loading="lazy"></p><p>简单说，OSI 是一个理论上的网络通信模型，TCP/IP 是实际上的网络通信模型、五层结构就是为了介绍网络原理而折中的网络通信模型。</p><blockquote><p>OSI 七层模型</p></blockquote><p>OSI 七层模型是国际标准化组织（International Organization for Standardization）制定的一个用于计算机或通信系统间互联的标准体系。</p><ul><li><p>应用层：通过应用进程之间的交互来完成特定网络应用，应用层协议定义的是应用进程间通信和交互的规划，常见的协议有：<strong>HTTP FTP SMTP SNMP DNS</strong></p></li><li><p>表示层：数据的表示、安全、压缩。确保一个系统的应用层所发送的信息可以被另一个系统的应用层读取。</p></li><li><p>会话层：建立、管理、终止会话，是用户应用程序和网络之间的接口。</p></li><li><p>运输层：提供源端与目的端之间提供可靠的透明数据传输，传输层协议为不同主机上运行的进程提供逻辑通信。</p></li><li><p>网络层：将地址翻译成对应的物理地址，实现不同网络之间的路径选择，协议有 <strong>ICMP IGMP IP</strong> 等。</p></li><li><p>数据链路层：在物理层提供比特流服务的基础上，建立相邻结点之间的数据链路。</p></li><li><p>物理层：建立、维护、断开物理连接。</p></li></ul><blockquote><p>TCP/IP 四层模型</p></blockquote><ul><li>应用层：对应 OSI 参考模型的（应用层、表示层、会话层）</li><li>传输层：对应 OSI 的运输层、为应用层实体提供到端的通信功能，保证了数据包的顺序传送及数据的完整性。</li><li>网际层：对应于 OSI 参考模型的网络层、主要解决主机到主机的通信问题。</li><li>网络接口层：与 OSI 参考模型的数据链路层、物理层对应。</li></ul><blockquote><p>五层体系结构</p></blockquote><ul><li>应用层：对应于 OSI 参考模型的（应用层、表示层、会话层）。</li><li>传输层：对应于 OSI 参考模型的传输层。</li><li>网络层：对应于 OSI 参考摸摸小的网络层。</li><li>数据链路层：对应于 OSI 参考模型的数据链路层。</li><li>物理层：对应于 OSI 参考模型的物理层。</li></ul><h3 id="说一下每一层对应的网络协议有哪些" tabindex="-1"><a class="header-anchor" href="#说一下每一层对应的网络协议有哪些" aria-hidden="true">#</a> 说一下每一层对应的网络协议有哪些？</h3><p>一张表格总结常见网络协议：</p><p><img src="https://s1.vika.cn/space/2022/11/30/00555507695a47cfac546840045a8248" alt="image-20221130150346862" loading="lazy"></p><h3 id="那么数据在各层之间是怎么传输的呢" tabindex="-1"><a class="header-anchor" href="#那么数据在各层之间是怎么传输的呢" aria-hidden="true">#</a> 那么数据在各层之间是怎么传输的呢？</h3><p>对于发送方而言，从上层到下层层层包装，对于接收方而言，从下层到上层，层层解开包装。</p><ul><li>发送方的应用进程向接收方的应用进程传送数据</li><li>AP 先将数据交给本主机的应用层，应用层加上本层的控制信息 H5 就变成了下一层的数据单元</li><li>传输层收到这个数据单元后，加上本层的控制信息 H4，再交给网络层的数据单元</li><li>到了数据链路层，控制信息被分成两部分，分别加到本层数据单元的首部（H2）和尾部（T2）</li><li>最后到物理层，进行比特流传输</li></ul><p><img src="https://s1.vika.cn/space/2022/11/30/fd4e1260801c4f4aa396865e41afc5ee" alt="image-20221130151106375" loading="lazy"></p><p>这个过程类似写信，写一封信，每到一层，就加一个信封，写一些地址的信息。到了目的地之后，又一层层解封，传向下一个目的地。</p><h1 id="💪-网络综合" tabindex="-1"><a class="header-anchor" href="#💪-网络综合" aria-hidden="true">#</a> 💪 网络综合</h1><h3 id="从浏览器地址栏输入-url-到显示主页的过程" tabindex="-1"><a class="header-anchor" href="#从浏览器地址栏输入-url-到显示主页的过程" aria-hidden="true">#</a> 从浏览器地址栏输入 url 到显示主页的过程？</h3><p>这道题，大概的过程比较简单，但是有很多点可以细挖：DNS 解析、TCP 三次挥手、HTTP 报文格式、TCP 四次挥手等等。</p><p>1.DNS 解析：将域名解析成对应的 IP 地址。</p><p>2.TCP 连接：与服务器通过三次挥手，建立 TCP 连接</p><p>3.向服务器发送 HTTP 请求</p><p>4.服务器处理请求，返回 HTTP 响应</p><p>5.浏览器解析并渲染页面</p><p>6.断开连接：TCP 四次挥手，连接结束</p>',29),c={href:"http://www.baidu.com",target:"_blank",rel:"noopener noreferrer"},h=l('<p><img src="https://s1.vika.cn/space/2022/11/30/02a48b235ae5483d8de6de08d93f5868" alt="image-20221130152957625" loading="lazy"></p><blockquote><p>各个过程都使用了哪些协议？</p></blockquote><p><img src="https://s1.vika.cn/space/2022/11/30/7445a91b3de44f599193b355589f40d6" alt="image-20221130153105580" loading="lazy"></p><h3 id="说说-dns-的解析过程" tabindex="-1"><a class="header-anchor" href="#说说-dns-的解析过程" aria-hidden="true">#</a> 说说 DNS 的解析过程？</h3><p>DNS，英文全称是 domain name system，域名解析系统，它的作用也很明确，就是域名和 IP 相互映射。</p><p>DNS 的解析过程如下图：</p><p><img src="https://s1.vika.cn/space/2022/11/30/992c6f99470b480e9175fa672e69810d" alt="image-20221130153542110" loading="lazy"></p>',7),T={href:"http://www.baidu.com",target:"_blank",rel:"noopener noreferrer"},u={href:"http://www.baidu.com",target:"_blank",rel:"noopener noreferrer"},g=e("li",null,"将请求发给本地 DNS 服务器，如果查找到也直接返回，否则继续进行下一步；",-1),P=e("p",null,[e("img",{src:"https://s1.vika.cn/space/2022/11/30/c1650eed5394407d995ef33d508eea6c",alt:"image-20221130153751862",loading:"lazy"})],-1),b=e("li",null,[a("本地 DNS 服务器向根域名服务器发送请求，根域名服务器返回负责 "),e("code",null,"com"),a(" 的顶级域名服务器的 IP 地址的列表。")],-1),m=e("li",null,[a("本地 DNS 服务器再向其中一个负责 "),e("code",null,"com"),a(" 的顶级域名服务器发送一个请求，返回负责 "),e("code",null,"baidu.com"),a(" 的权限域名服务器的 IP 地址列表。")],-1),k={href:"http://www.baidu.com",target:"_blank",rel:"noopener noreferrer"},v=l(`<h3 id="websocket-和-socket-的区别" tabindex="-1"><a class="header-anchor" href="#websocket-和-socket-的区别" aria-hidden="true">#</a> WebSocket 和 Socket 的区别？</h3><ul><li>Socket 其实就是等于 <strong>IP 地址 + 端口 + 协议</strong>。</li></ul><blockquote><p>具体来说，Socket 是一套标准，它完成了对 TCP/IP 的高度封装，屏蔽网络细节，以方便开发者更好地进行网络编程。</p></blockquote><ul><li>WebSocket 是一个持久化协议，它是伴随 H5 而出的协议，用来解决 <strong>http 不支持持久化连接</strong>的问题。</li><li>Socket 一个是网络编程的标准接口，而 WebSocket 则是应用层通信协议。</li></ul><h3 id="说一下你了解的端口及对应的服务" tabindex="-1"><a class="header-anchor" href="#说一下你了解的端口及对应的服务" aria-hidden="true">#</a> 说一下你了解的端口及对应的服务？</h3><table><thead><tr><th>端口</th><th>服务</th></tr></thead><tbody><tr><td>21</td><td>FTP（文件传输协议）</td></tr><tr><td>22</td><td>SSH</td></tr><tr><td>23</td><td>Telnet（远程登录服务）</td></tr><tr><td>53</td><td>DNS 域名解析服务</td></tr><tr><td>80</td><td>HTTP 超文本传输协议</td></tr><tr><td>443</td><td>HTTPS</td></tr><tr><td>1080</td><td>Sockets</td></tr><tr><td>3306</td><td>MySQL 默认端口</td></tr></tbody></table><h1 id="💪-http" tabindex="-1"><a class="header-anchor" href="#💪-http" aria-hidden="true">#</a> 💪 HTTP</h1><h3 id="说说-http-常用的状态码及其含义" tabindex="-1"><a class="header-anchor" href="#说说-http-常用的状态码及其含义" aria-hidden="true">#</a> 说说 HTTP 常用的状态码及其含义？</h3><p>HTTP 状态码首先应该知道个大概的分类：</p><ul><li>1XX：信息性状态码</li><li>2XX：成功状态码</li><li>3XX：重定向状态码</li><li>4XX：客户端错误状态码</li><li>5XX：服务端错误状态码</li></ul><p>几个常用，面试之外，也应该记住：</p><p><img src="https://s1.vika.cn/space/2022/11/30/74836ebbb59a457c9241cdd51f0172f9" alt="image-20221130160147625" loading="lazy"></p><blockquote><p>说一下 301 和 302 的区别？</p></blockquote><ul><li>301：永久性移动，请求的资源已经被永久移动到新位置。服务器返回此响应时，会返回新的资源地址。</li><li>302：临时性移动，服务器从另外的响应资源，但是客户端还应该使用这个地址。</li></ul><p>用⼀个比喻，301 就是嫁人的新垣结衣，302 就是有男朋友的长泽雅美。</p><h3 id="http-有哪些请求方式" tabindex="-1"><a class="header-anchor" href="#http-有哪些请求方式" aria-hidden="true">#</a> HTTP 有哪些请求方式？</h3><p><img src="https://s1.vika.cn/space/2022/11/30/9fd809c18ad3454d804affe9642a314f" alt="image-20221130160619524" loading="lazy"></p><p>其中，POST、DELETE、PUT、GET 的含义分别对应我们最熟悉的增、删、改、查。</p><h3 id="说一下-get-和-post-的区别" tabindex="-1"><a class="header-anchor" href="#说一下-get-和-post-的区别" aria-hidden="true">#</a> 说一下 GET 和 POST 的区别？</h3><p>可以从以下几个方面来说明 GET 和 POST 的区别：</p><p><img src="https://s1.vika.cn/space/2022/11/30/d1178e914f384899a614631e75b47390" alt="image-20221130160859712" loading="lazy"></p><p>1.从 HTTP 报文层面来看，GET 请求将信息放在 URL，POST 将请求信息放在请求体中。这一点使得 GET 请求携带的数据量有限，因为 URL 本身是有长度限制的，而 POST 请求的数据存放在报文体中，因此对大小没有限制。而且从形式上看，GET 请求把数据放在 URL 上不太安全，而 POST 请求把数据放在请求体里相比较而言安全一些。</p><p>2.从数据库层面来看，GET 符合幂等性和安全性，而 POST 请求不符合。这个其实和 GET/POST 请求的作用有关。按照 HTTP 的约定，GET 请求用于查看信息，不会改变服务器上的信息；而 POST 请求用来改变服务器上的信息。正因为 GET 请求只查看信息，不改变信息，对数据库的一次或多次操作获得的结果是一致的，认为它符合幂等性。安全性是指对数据库操作没有改变数据库中的数据。</p><p>3.从其他层面来看，GET 请求能够被缓存，GET 请求能够保存在浏览器的浏览记录里，GET 请求的 URL 能够保存为浏览器书签。这些都是 POST 请求所不具备的。缓存是 GET 请求被广泛应用的根本，他能够被缓存也是因为它的幂等性和安全性，除了返回结果没有其他多余的动作，因此绝大部分的 GET 请求都被 CDN 缓存起来了，大大减少了 Web 服务器的负担。</p><h3 id="get-的长度限制是多少" tabindex="-1"><a class="header-anchor" href="#get-的长度限制是多少" aria-hidden="true">#</a> GET 的长度限制是多少？</h3><p>HTTP 中的 GET 方法是通过 URL 传递数据的，但是 URL 本身其实并没有对数据的长度进行限制，真正限制 GET 长度的是浏览器。</p><p>例如 IE 浏览器对 URL 的最大限制是 2000 多个字符，大概 2kb 左右，像 Chrome、Firefox 等浏览器支持的 URL 字符数更多，其中 Firefox 中 URL 的最大长度限制是 66636 个字符，Chrome 则是 8182 个字符。</p><h3 id="http-请求的过程与原理" tabindex="-1"><a class="header-anchor" href="#http-请求的过程与原理" aria-hidden="true">#</a> HTTP 请求的过程与原理</h3><p>HTTP 协议定义了浏览器怎么向服务器请求文档，以及服务器怎么把文档传给浏览器。</p><p><img src="https://s1.vika.cn/space/2022/11/30/e840909874db46c7990166aee4346570" alt="image-20221130164427049" loading="lazy"></p><ul><li>每个服务都有一个进程，它不断监听 TCP 的端口 80，以便发现是否有浏览器向它发出连接建立请求。</li><li>监听到连接请求，就会建立 TCP 连接。</li><li>浏览器向服务器发出预览某个页面的请求，服务器接着就返回所请求的页面作为响应。</li><li>最后，释放 TCP 连接。</li></ul><p>在浏览器和服务器之间的请求和响应的交互，必须按照规定的格式和遵循一定的规则，这些格式和规则就是超文本传输协议 HTTP。</p><p>PS：这道题和上面浏览器输入网址发生了什么那道题大差不差</p><h3 id="说一下-http-的报文结构" tabindex="-1"><a class="header-anchor" href="#说一下-http-的报文结构" aria-hidden="true">#</a> 说一下 HTTP 的报文结构？</h3><p>HTTP 报文有两种、HTTP 请求报文和 HTTP 响应报文：</p><p><img src="https://s1.vika.cn/space/2022/11/30/324c0e50c00541509bb92178c8e48c3b" alt="image-20221130165118062" loading="lazy"></p><p><strong>HTTP 请求报文</strong></p><p>HTTP 请求报文的格式如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET / HTTP/1.1     // 请求行
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) 
Accept: */*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HTTP 请求报文的第一行叫做请求行，后面的行叫做首部行，首部行后还跟一个实体主体。请求首部之后有一个空行，这个空行不能省略，它用来划分首部与实体。</p><p>请求行包含三个字段：</p><ul><li>方法字段：包括 POST、GET 等请求方法。</li><li>URL 字段</li><li>HTTP 版本字段</li></ul><p><strong>HTTP 响应报文</strong></p><p>HTTP 响应报文的格式如下：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code>HTTP/1.0 200 OK
Content-Type: text/plain
Content-Length: 137582
Expires: Thu, 05 Dec 1997 16:00:00 GMT
Last-Modified: Wed, 5 August 1996 15:55:28 GMT
Server: Apache 0.84
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>Hello World<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
&lt;/html
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HTTP 响应报文的第一行叫做状态行，后面的行是首部行，最后是实体主体。</p><ul><li><strong>状态行</strong>包含三个字段：协议版本字段、状态码和响应的状态信息。</li><li><strong>实体部分</strong>是报文的主要部分，它包含了所请求的对象。</li><li>首部行首部可以分为四种首部，请求首部、响应首部、通用首部和实体首部。通用首部和实体首部在请求报文和响应报文中都可以设置，区别在于请求首部和响应首部。</li><li>常见的请求首部有 Accept 可接收媒体资源的类型、Accept-Charset 可接收的字符集、Host 请求的主机名。</li><li>常见的响应首部有 ETag 资源的匹配信息、Location 客户端重定向的 URI。</li><li>常见的通用首部有 Cache-Control 控制缓存策略、Connection 管理持久连接。</li><li>常见的实体首部有 Content-Length 实体主体的大小、Express 实体主体的过期时间、Last-Modified 资源的最后修改时间。</li></ul><h3 id="uri-和-url-有什么区别" tabindex="-1"><a class="header-anchor" href="#uri-和-url-有什么区别" aria-hidden="true">#</a> URI 和 URL 有什么区别？</h3><p><img src="https://s1.vika.cn/space/2022/11/30/e48fed6cedb540caba919a222b92e34d" alt="image-20221130171635288" loading="lazy"></p><ul><li>URI，统一资源标识符（Uniform Resource Identifier， URI），标识的是 Web 上每一个可用的资源，如 HTML 文档、图像、视频片段、程序等都是由一个 URI 进行标识的。</li><li>URL，统一资源定位符（Uniform Resource Location），它是 URI 的一种子集，主要作用是提供资源的路径。</li></ul><p>他们的主要区别在于，URL 除了提供资源的标识，还提供了资源的访问方式。这么比喻，URI 像是身份证，可以唯一标识一个人，而 URL 更像一个住址，可以通过 URL 找到这个人——人类住址协议://地球/中国/北京市/海淀区/xx 职业技术学院/14 号宿舍楼/525 号寝/张三.男。</p><h3 id="说下-http-1-0-1-1-2-0-的区别" tabindex="-1"><a class="header-anchor" href="#说下-http-1-0-1-1-2-0-的区别" aria-hidden="true">#</a> 说下 HTTP/1.0，1.1，2.0 的区别？</h3><p>关键需要记住 HTTP/1.0 默认是短连接，可以强制开启，HTTP/1.1 默认是长连接，HTTP/2.0 采用多路复用。</p><p><strong>HTTP/1.0</strong></p><ul><li>默认使用短连接，每次请求都需要建立一个 TCP 连接。它可以设置 <code>Connection: keep-alive</code> 这个字段，强制开启长连接。</li></ul><p><strong>HTTP/1.1</strong></p><ul><li>引入了持久连接，即 TCP 连接默认不关闭，可以被多个请求复用。</li><li>分块传输编码，即服务端每产生一块数据，就发送一块，用“流模式”取代“缓存模式”。</li><li>管道机制，即在一个 TCP 连接里面，客户端可以同时发送多个请求。</li></ul><p><strong>HTTP/2.0</strong></p><ul><li>二进制协议，1.1 版本的头信息是文本（ASCII 编码），数据体可以是文本或者二进制；2.0 中，头信息和数据体都是二进制。</li><li>完全多路复用，在一个连接里，客户端和浏览器都可以同时发送多个请求或回应，而且不用按照顺序一一对应。</li><li>报头压缩，HTTP 协议不带有状态，每次请求都必须附上所有信息。Http/2.0 引入了头信息压缩机制，使用 gzip 或 compress 压缩后再发送。</li><li>服务端推送，允许服务器未经请求，主动向客户端发送资源。</li></ul><h3 id="http-3-了解吗" tabindex="-1"><a class="header-anchor" href="#http-3-了解吗" aria-hidden="true">#</a> HTTP/3 了解吗？</h3><p>HTTP/3 主要有两大变化，<strong>传输层基于 UDP、使用 QUIC 保证 UDP 可靠性</strong>。</p><p>HTTP/2 存在的一些问题，比如重传等等，都是由于 TCP 本身的特性导致的，所以 HTTP/3 在 QUIC 的基础上进行发展而来，QUIC（Quick UDP Connections）直译为快速 UDP 网络连接，底层使用 UDP 进行数据传输。</p><p>HTTP/3 主要有这些特点：</p><ul><li>使用 UDP 作为传输层进行通信</li><li>在 UDP 的基础上 QUIC 协议保证了 HTTP/3 的安全性，在传输的过程中就完成了 TLS 加密握手</li><li>HTTPS 要建立一个连接，要花费 6 次交互，先是建立三次握手，然后是 TLS/1.3 的三次握手。QUIC 直接把以往的 TCP 和 TLS/1.3 的 6 次交互合并成了 3 次，减少了交互次数。</li><li>QUIC 有自己的一套机制可以保证传输的可靠性。当某个流发生丢包时，只会阻塞这个流，其他流不会受到影响。</li></ul><p>我们拿一张图看一下 HTTP 协议的变迁：</p><p><img src="https://s1.vika.cn/space/2022/12/03/5538e8d1924d4e50ba99625d567257fa" alt="image-20221203135938780" loading="lazy"></p><h3 id="http-如何实现长连接-在什么时候会超时" tabindex="-1"><a class="header-anchor" href="#http-如何实现长连接-在什么时候会超时" aria-hidden="true">#</a> HTTP 如何实现长连接？在什么时候会超时？</h3><blockquote><p>什么是 HTTP 的长连接？</p></blockquote><p>1.HTTP 分为长连接和短连接，本质上说的是 TCP 的长短连接。TCP 连接是一个双向的通道，它是可以保持一段时间不关闭的，因此 TCP 连接才具有真正的长连接和短连接这一说法。</p><p>2.TCP 长连接可以复用一个 TCP 连接，来发起多次的 HTTP 请求，比如一次请求 HTML，如果是短连接的话，可能还需要请求后续的 JS/CSS。</p><blockquote><p>如何设置长连接？</p></blockquote><p>通过在头部（请求和响应头）设置 Connection 字段指定为 <code>keep-alive</code>，HTTP/1.0 协议支持，但是是默认关闭的，从 HTTP/1.1 以后，连接默认都是长连接。</p><blockquote><p>在什么时候会超时呢？</p></blockquote><ul><li><p>HTTP 一般会有 httpd 守护进程，里面可以设置 <strong>keep-alive timeout</strong>，当 tcp 连接闲置超过这个时间就会关闭，也可以在 HTTP 的 header 里面设置超时时间</p></li><li><p>TCP 的 <strong>keep-alive</strong> 包含三个参数，支持在系统内核的 net.ipv4 里面设置；当 TCP 连接之后，闲置了 <strong>tcp_keepalive_time</strong>，则会发生侦测包，如果没有收到对方的 ACK，那么会每隔 tcp_keepalive_intvl 再发一次，直到发送了 <strong>tcp_keepalive_probes</strong>，就会丢失该连接。</p></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1. tcp_keepalive_intvl = 15
2. tcp_keepalive_probes = 5
3. tcp_keepalive_time = 180
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="公众号" tabindex="-1"><a class="header-anchor" href="#公众号" aria-hidden="true">#</a> 公众号</h2><p>欢迎大家关注我的公众号「<strong>让我先热热手</strong>」获取最新学习资源。</p><p>公众号后台回复「<strong>加群</strong>」，即可加入「<strong>IT达摩院</strong>」进行技术交流</p><h2 id="公众号-1" tabindex="-1"><a class="header-anchor" href="#公众号-1" aria-hidden="true">#</a> 公众号</h2><p><img src="https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff" alt="" loading="lazy"></p>`,80);function f(H,S){const t=p("ExternalLinkIcon");return s(),d("div",null,[o,e("p",null,[a("我们以输入 "),e("a",c,[a("www.baidu.com"),i(t)]),a(" 为例：")]),h,e("p",null,[a("假设你要查询 "),e("a",T,[a("www.baidu.com"),i(t)]),a(" 的 IP 地址：")]),e("ul",null,[e("li",null,[a("首先会查找浏览器的缓存，看看是否能找到 "),e("a",u,[a("www.baidu.com"),i(t)]),a(" 对应的 IP 地址，找到就直接返回；否则进行下一步。")]),g]),P,e("ul",null,[b,m,e("li",null,[a("本地 DNS 服务器再向其中一个权限域名服务器发送一个请求，返回 "),e("a",k,[a("www.baidu.com"),i(t)]),a(" 所对应的 IP 地址。")])]),v])}const C=n(r,[["render",f],["__file","wangluo.html.vue"]]);export{C as default};
