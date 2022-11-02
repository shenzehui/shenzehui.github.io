import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as l,c,a as n,b as a,d as e,e as s,r as o}from"./app.2c190525.js";const i={},r=s(`<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><blockquote><p>Spring Cloud Eureka 是 Spring Cloud Netflix 微服务套件中的一部分，它基于 Netflix Eureka 做了二次封装，主要负责完成微服务架构中的服务治理功能。Spring Cloud 通过为 Eureka 增加了 Spring Boot 风格的自动化配置，我们只需要通过简单引用依赖和注解配置就能让 Spring Boot 构建的微服务应用轻松地与 Eureka 服务治理体系进行整合。</p></blockquote><p>Eureka 有两部分：服务的和客户端，服务端就是注册中心，用来接收其他服务的注册，客户端则是一个Java客户端，用来注册，并可以实现负载均衡等功能。</p><p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/3359132-30071bc42055b587.png" alt="img" loading="lazy"></p><h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始" aria-hidden="true">#</a> 快速开始</h2><h3 id="搭建-eureka-注册中心" tabindex="-1"><a class="header-anchor" href="#搭建-eureka-注册中心" aria-hidden="true">#</a> 搭建 Eureka 注册中心</h3><blockquote><p>Erueka 本身是使用 Java 来开发的，Spring Cloud 使用 Spring Boot技术对 Eureka 进行了封装，所以，在 Spring Cloud 中使用 Eureka 非常方便，只需要引入 <code>spring-cloud-starter-netflix-eureka-server</code> 这个依赖即可，然后就像启动一个普通的 Spring Boot 项目一样启动 Eureka 即可。</p></blockquote><p>创建一个普通的 Spring Boot 项目，创建时，添加 Eureka Server 依赖：</p><p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20220524162142131.png" alt="" loading="lazy"></p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-netflix-eureka-server<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>x
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>项目创建成功后，在项目启动类上添加注解<code>@EnableEurekaServer</code>，标记该项目是一个Eureka Server</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@SpringBootApplication</span>
<span class="token annotation punctuation">@EnableEurekaServer</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">EurekaApplication</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">EurekaApplication</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>@EnableEurekaServer</code> 表示开启 Eureka 的功能</p><p>接下来，在Application.properties中添加基本配置信息</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># 服务名称</span>
<span class="token key attr-name">spring.application.name</span><span class="token punctuation">=</span><span class="token value attr-value">eureka</span>
<span class="token comment"># 设置端口号</span>
<span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">1111</span>
<span class="token key attr-name">eureka.client.register-with-eureka</span><span class="token punctuation">=</span><span class="token value attr-value">false</span>
<span class="token key attr-name">eureka.client.fetch-registry</span><span class="token punctuation">=</span><span class="token value attr-value">false</span>
<span class="token key attr-name">eureka.instance.hostname</span><span class="token punctuation">=</span><span class="token value attr-value">localhost</span>

<span class="token key attr-name">eureka.client.service-url.defaultZone</span><span class="token punctuation">=</span><span class="token value attr-value">http://\${eureka.instance.hostname}:\${server.port}/eureka/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>eureka.client.register-with-eureka：由于应用为注册中心，所以设置为 false，代表不向注册中心注册自己</li><li>eureka.client.fetch-registry：由于注册中心的职责就是维护服务实例，它并不需要去检索服务，所以也设置为 false</li></ul>`,16),u={href:"http://localhost:1111/%E3%80%82%E5%B0%B1%E5%8F%AF%E4%BB%A5%E7%9C%8B%E5%88%B0%E4%B8%8B%E5%9B%BE%E6%89%80%E7%A4%BA%E7%9A%84",target:"_blank",rel:"noopener noreferrer"},d=s(`<p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20220524165130106.png" alt="" loading="lazy"></p><p>补充：</p><p>如果在项目启动时，遇到 <code>java.lang.TypeNotPresentException:Type javax.xml.bind.JAXBContext not present</code>异常，这是因为 JDK9 以上，移除了JAXB，这个时候，只需要我们手动引入JAXB即可。</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>javax.xml.bind<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>jaxb-api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>2.3.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>com.sun.xml.bind<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>jaxb-impl<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>2.3.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.glassfish.jaxb<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>jaxb-runtime<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>2.3.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>javax.activation<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>activation<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>1.1.1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="搭建-eureka-客户端" tabindex="-1"><a class="header-anchor" href="#搭建-eureka-客户端" aria-hidden="true">#</a> 搭建 Eureka 客户端</h3><p>创建 eureka-client 模块，添加如下依赖：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-boot-starter-web<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-netflix-eureka-client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>项目创建成功后，在 applictaion.properties 中配置如下：</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">spring.application.name</span><span class="token punctuation">=</span><span class="token value attr-value">eureka-client</span>
<span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">1110</span>
<span class="token key attr-name">eureka.client.service-url.defaultZone</span><span class="token punctuation">=</span><span class="token value attr-value">http://localhost:1111/eureka</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，启动 Eureka-server，待服务注册中心启动成功后，再启动 Eureka-client。</p>`,10),k={href:"http://localhost:1111",target:"_blank",rel:"noopener noreferrer"},v=s(`<p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102110717175.png" alt="image-20221102110717175" loading="lazy"></p><h2 id="eureka-高可用" tabindex="-1"><a class="header-anchor" href="#eureka-高可用" aria-hidden="true">#</a> Eureka 高可用</h2><p>Eureka Server 的设计一开始就考虑了高可用问题，在 Eureka 的服务治理设计中，所有节点即是服务提供方，也是服务消费方，服务注册中心也不例外。是否还记得在单节点的配置中，我们设置过下面这两个参数，让服务中心不注册自己：</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">eureka.client.register-with-eureka</span><span class="token punctuation">=</span><span class="token value attr-value">false</span>
<span class="token key attr-name">eureka.client.fetch-registry</span><span class="token punctuation">=</span><span class="token value attr-value">false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Eureka Server 的高可用实际上就是将自己作为服务向其他服务注册中心注册自己，这样就可以形成一组互相注册的服务注册中心，已实现服务清单的相互同步，达到高可用的效果。</p><p>搭建 Eureka 集群，首先我们需要一点准备工作，修改电脑的 hosts 文件：</p><p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102112610842.png" alt="" loading="lazy"></p><p>在 eureka-server 模块的 resources 目录下，再添加两个配置文件，分别为 application- a.properties 以及 application-b.properties</p><p>application-a.properites 内容如下：</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># 给当前服务起一个名字</span>
<span class="token key attr-name">spring.application.name</span><span class="token punctuation">=</span><span class="token value attr-value">eureka</span>
<span class="token comment"># 设置端口号</span>
<span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">1111</span>
<span class="token key attr-name">eureka.instance.hostname</span><span class="token punctuation">=</span><span class="token value attr-value">eurekaA</span>
<span class="token key attr-name">eureka.client.register-with-eureka</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token comment"># 表示是否从 Eureka Server 上获取注册中心</span>
<span class="token key attr-name">eureka.client.fetch-registry</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token comment">#A 服务要注册到B服务上</span>
<span class="token key attr-name">eureka.client.service-url.defaultZone</span><span class="token punctuation">=</span><span class="token value attr-value">http://eurekaB:1112/eureka</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>application-b.properites 内容如下：</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># 给当前服务起一个名字</span>
<span class="token key attr-name">spring.application.name</span><span class="token punctuation">=</span><span class="token value attr-value">eureka</span>
<span class="token comment"># 设置端口号</span>
<span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">1112</span>
<span class="token key attr-name">eureka.instance.hostname</span><span class="token punctuation">=</span><span class="token value attr-value">eurekaB</span>
<span class="token key attr-name">eureka.client.register-with-eureka</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token comment"># 表示是否从 Eureka Server 上获取注册中心</span>
<span class="token key attr-name">eureka.client.fetch-registry</span><span class="token punctuation">=</span><span class="token value attr-value">true</span>
<span class="token comment"># B服务注册到A服务上</span>
<span class="token key attr-name">eureka.client.service-url.defalutZone</span><span class="token punctuation">=</span><span class="token value attr-value">http://eurekaA:1111/eureka</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置完成后，对当前项目打包，打成 jar 包</p><p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102111941767.png" alt="image-20221102111941767" loading="lazy"></p><p>打包完成后，在命令行（target目录下执行）启动两个 Eureka 实例。两个启动命令分别如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">java</span> <span class="token parameter variable">-jar</span> eureka-0.0.1-SNAPSHOT.jar <span class="token parameter variable">--spring.profiles.active</span><span class="token operator">=</span>a 
<span class="token function">java</span> <span class="token parameter variable">-jar</span> eureka-0.0.1-SNAPSHOT.jar <span class="token parameter variable">--spring.profiles.active</span><span class="token operator">=</span>b
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>启动成功后，就可以看到，两个服务之间互相注册，共同给组成一个集群。</p><p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102112700070.png" alt="image-20221102112700070" loading="lazy"></p><h2 id="安全的服务注册中心" tabindex="-1"><a class="header-anchor" href="#安全的服务注册中心" aria-hidden="true">#</a> 安全的服务注册中心</h2><blockquote><p>当完成 Eureka 的搭建之后，只要知道 ip 和端口就可以随意的注册服务、调用服务，这是不安全的，我们可以通过设置账号和密码来限制服务的注册及发现</p></blockquote><h3 id="新建一个名叫-eureka-server-security-的模块-添加如下依赖" tabindex="-1"><a class="header-anchor" href="#新建一个名叫-eureka-server-security-的模块-添加如下依赖" aria-hidden="true">#</a> 新建一个名叫 eureka-server-security 的模块，添加如下依赖</h3><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-boot-starter-security<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-netflix-eureka-server<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置-application-properties-文件" tabindex="-1"><a class="header-anchor" href="#配置-application-properties-文件" aria-hidden="true">#</a> 配置 application.properties 文件</h3><blockquote><p>配置登录注册中心的用户名和密码</p></blockquote><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token key attr-name">spring.application.name</span><span class="token punctuation">=</span><span class="token value attr-value">eureka-server-security</span>
<span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">8761</span>
<span class="token key attr-name">eureka.client.register-with-eureka</span><span class="token punctuation">=</span><span class="token value attr-value">false</span>
<span class="token key attr-name">eureka.client.fetch-registry</span><span class="token punctuation">=</span><span class="token value attr-value">false</span>
<span class="token key attr-name">eureka.client.service-url.defaultZone</span><span class="token punctuation">=</span><span class="token value attr-value">http://localhost:8761/eureka/</span>
<span class="token key attr-name">spring.security.user.name</span><span class="token punctuation">=</span><span class="token value attr-value">marico</span>
<span class="token key attr-name">spring.security.user.password</span><span class="token punctuation">=</span><span class="token value attr-value">123</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通过-java-配置类来配置-security" tabindex="-1"><a class="header-anchor" href="#通过-java-配置类来配置-security" aria-hidden="true">#</a> 通过 Java 配置类来配置 Security</h3><blockquote><p>实现基于 Web 服务器于客户端之间进行认证的方式</p></blockquote><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@EnableWebSecurity</span>
<span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SecurityConfig</span> <span class="token keyword">extends</span> <span class="token class-name">WebSecurityConfigurerAdapter</span> <span class="token punctuation">{</span>
    
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">configure</span><span class="token punctuation">(</span><span class="token class-name">HttpSecurity</span> http<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        http<span class="token punctuation">.</span><span class="token function">csrf</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token comment">/*任何http请求都需要验证*/</span>
                <span class="token punctuation">.</span><span class="token function">authorizeRequests</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">anyRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">authenticated</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">and</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">httpBasic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="完成上述配置之后-启动-eureka-server-security-模块" tabindex="-1"><a class="header-anchor" href="#完成上述配置之后-启动-eureka-server-security-模块" aria-hidden="true">#</a> 完成上述配置之后，启动 eureka-server-security 模块</h3>`,29),g={href:"http://localhost:8761/%EF%BC%8C%E5%8F%91%E7%8E%B0%E9%9C%80%E8%A6%81%E8%BF%9B%E8%A1%8C%E5%A6%82%E4%B8%8B%E9%AA%8C%E8%AF%81",target:"_blank",rel:"noopener noreferrer"},m=s(`<p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102134000561.png" alt="image-20221102134000561" loading="lazy"></p><h3 id="服务注册" tabindex="-1"><a class="header-anchor" href="#服务注册" aria-hidden="true">#</a> 服务注册</h3><ul><li>修改 eureka-client 的配置文件</li></ul><p>配置格式：<code>http://&lt;username&gt;:&lt;password&gt;@localhost:1111/eureka</code></p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># 添加账号和密码信息</span>
<span class="token key attr-name">eureka.client.service-url.defaultZone</span><span class="token punctuation">=</span><span class="token value attr-value">http://marico:123@localhost:8761/eureka </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,5),h={href:"http://localhost:8761/",target:"_blank",rel:"noopener noreferrer"},b=s('<p><img src="https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102134438003.png" alt="" loading="lazy"></p><p>发现已经被成功注册到 Eureka 上</p><h2 id="其他配置" tabindex="-1"><a class="header-anchor" href="#其他配置" aria-hidden="true">#</a> 其他配置</h2><p>下面整理了 <code>org.springframework.cloud.netflix.eureka.EurekaClientConfigBean</code> 中定义的常用配置参数以及对应的说明和默认值，这些参数均以 eureka.client 为前缀。</p><table><thead><tr><th>参数名</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>enabled</td><td>启用 Eureka 客户端</td><td>true</td></tr><tr><td>registryFetchIntervalSeconds</td><td>从 Eureka 服务端获取注册信息的间隔时间，单位为秒</td><td>30</td></tr><tr><td>infoReplicationIntervalSeconds</td><td>更新实例信息的变化到 Eureka 服务端的间隔时间，单位为秒</td><td>30</td></tr><tr><td>initialInstanceInfoReplicationIntervalSeconds</td><td>初始化实例信息到 Eureka 服务端的间隔时间，单位为秒</td><td>40</td></tr><tr><td>eurekaServiceUrlPollIntervalSeconds</td><td>轮询 Eureka 服务单地址更改的时间间隔，单位为秒。</td><td>300</td></tr><tr><td>eurekaServerReadTimeoutSeconds</td><td>读取 Eureka Server 信息的超时时间，单位为秒</td><td>8</td></tr><tr><td>eurekaServerConnectTimeoutSeconds</td><td>连接 Eureka Server 的超时时间，单位为秒</td><td>5</td></tr><tr><td>eurekaServerTotalConnections</td><td>从 Eureka 客户端到每个 Eureka 服务端的连接总数</td><td>200</td></tr><tr><td>eurekaServerTotalConnectionsPerHost</td><td>从 Eureka 客户端到每个 Eureka 服务端主机的连接总数</td><td>50</td></tr><tr><td>eurekaConnectionIdleTimeoutSeconds</td><td>Eureka 服务端连接的空闲关闭时间，单位为秒</td><td>30</td></tr><tr><td>heartbeatExecutorThreadPoolSize</td><td>心跳连接池的初始化线程数</td><td>2</td></tr><tr><td>heartbeatExecutorExponentialBackOffBound</td><td>心跳超时重试延迟时间的最大乘数值</td><td>10</td></tr><tr><td>cacheRefreshExecutorThreadPoolSize</td><td>缓存刷新线程池的初始化线程数</td><td>2</td></tr><tr><td>cacheRefreshExecutorExponentialBackOffBound</td><td>缓存刷新重试延迟时间的最大乘数值</td><td>10</td></tr><tr><td>useDnsForFetchingServiceUrls</td><td>使用 DNS 来获取 Eureka 服务端的 serviceUrl</td><td>false</td></tr><tr><td>registerWithEureka</td><td>是否要将自身的实例信息注册到 Eureka 服务端</td><td>true</td></tr><tr><td>preferSameZoneEureka</td><td>是否偏好使用处于相同 Zone 的 Eureka 服务端</td><td>true</td></tr><tr><td>filterOnlyUpInstances</td><td>获取实例时是否过滤，仅保留 UP 状态的实例</td><td>true</td></tr><tr><td>fetchRegistry</td><td>是否从 Eureka 服务端获取注册信息</td><td>true</td></tr></tbody></table>',5);function f(y,E){const t=o("ExternalLinkIcon");return l(),c("div",null,[r,n("p",null,[a("完成上述配置后，就可以启动应用并访问 "),n("a",u,[a("http://localhost:1111/。就可以看到下图所示的"),e(t)]),a(" Eureka 信息面板")]),d,n("p",null,[a("浏览器输入 "),n("a",k,[a("http://localhost:1111"),e(t)]),a("，就可以查看 provider 的注册信息：")]),v,n("p",null,[a("访问 "),n("a",g,[a("http://localhost:8761/，发现需要进行如下验证"),e(t)])]),m,n("ul",null,[n("li",null,[a("启动 eureka-client 模块，访问"),n("a",h,[a("http://localhost:8761/"),e(t)])])]),b])}const I=p(i,[["render",f],["__file","eureka.html.vue"]]);export{I as default};
