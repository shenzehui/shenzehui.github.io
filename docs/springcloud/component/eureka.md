---
article: false
title: Spring Cloud Eureka 服务注册中心
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## 简介

> Spring Cloud Eureka 是 Spring Cloud Netflix 微服务套件中的一部分，它基于 Netflix Eureka 做了二次封装，主要负责完成微服务架构中的服务治理功能。Spring Cloud 通过为 Eureka 增加了  Spring Boot 风格的自动化配置，我们只需要通过简单引用依赖和注解配置就能让 Spring Boot 构建的微服务应用轻松地与 Eureka 服务治理体系进行整合。

Eureka 有两部分：服务的和客户端，服务端就是注册中心，用来接收其他服务的注册，客户端则是一个Java客户端，用来注册，并可以实现负载均衡等功能。

![img](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/3359132-30071bc42055b587.png)

## 快速开始

### 搭建 Eureka 注册中心

> Erueka 本身是使用 Java 来开发的，Spring Cloud 使用 Spring Boot技术对 Eureka 进行了封装，所以，在 Spring Cloud 中使用 Eureka 非常方便，只需要引入 `spring-cloud-starter-netflix-eureka-server` 这个依赖即可，然后就像启动一个普通的 Spring Boot 项目一样启动 Eureka 即可。

创建一个普通的 Spring Boot 项目，创建时，添加 Eureka Server 依赖：

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20220524162142131.png)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

项目创建成功后，在项目启动类上添加注解`@EnableEurekaServer`，标记该项目是一个Eureka Server

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

`@EnableEurekaServer` 表示开启 Eureka 的功能

接下来，在Application.properties中添加基本配置信息

```properties
# 服务名称
spring.application.name=eureka
# 设置端口号
server.port=1111
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.instance.hostname=localhost

eureka.client.service-url.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/
```

- eureka.client.register-with-eureka：由于应用为注册中心，所以设置为 false，代表不向注册中心注册自己
- eureka.client.fetch-registry：由于注册中心的职责就是维护服务实例，它并不需要去检索服务，所以也设置为 false

完成上述配置后，就可以启动应用并访问 http://localhost:1111/。就可以看到下图所示的 Eureka 信息面板

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20220524165130106.png)

补充：

如果在项目启动时，遇到 `java.lang.TypeNotPresentException:Type javax.xml.bind.JAXBContext not present`异常，这是因为 JDK9 以上，移除了JAXB，这个时候，只需要我们手动引入JAXB即可。

```xml
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.3.0</version>
</dependency>
<dependency>
    <groupId>com.sun.xml.bind</groupId>
    <artifactId>jaxb-impl</artifactId>
    <version>2.3.0</version>
</dependency>
<dependency>
    <groupId>org.glassfish.jaxb</groupId>
    <artifactId>jaxb-runtime</artifactId>
    <version>2.3.0</version>
</dependency>
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
```

### 搭建 Eureka 客户端

创建 eureka-client 模块，添加如下依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

项目创建成功后，在 applictaion.properties 中配置如下：

```properties
spring.application.name=eureka-client
server.port=1110
eureka.client.service-url.defaultZone=http://localhost:1111/eureka
```

接下来，启动 Eureka-server，待服务注册中心启动成功后，再启动 Eureka-client。

浏览器输入 http://localhost:1111，就可以查看 provider 的注册信息：

![image-20221102110717175](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102110717175.png)

## Eureka 高可用

Eureka Server 的设计一开始就考虑了高可用问题，在 Eureka 的服务治理设计中，所有节点即是服务提供方，也是服务消费方，服务注册中心也不例外。是否还记得在单节点的配置中，我们设置过下面这两个参数，让服务中心不注册自己：

```properties
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

Eureka Server 的高可用实际上就是将自己作为服务向其他服务注册中心注册自己，这样就可以形成一组互相注册的服务注册中心，已实现服务清单的相互同步，达到高可用的效果。

搭建 Eureka 集群，首先我们需要一点准备工作，修改电脑的 hosts 文件：

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102112610842.png)

在 eureka-server 模块的 resources 目录下，再添加两个配置文件，分别为 application- a.properties 以及 application-b.properties。

application-a.properites 内容如下：

```properties
# 给当前服务起一个名字
spring.application.name=eureka
# 设置端口号
server.port=1111
eureka.instance.hostname=eurekaA
eureka.client.register-with-eureka=true
# 表示是否从 Eureka Server 上获取注册中心
eureka.client.fetch-registry=true
#A 服务要注册到B服务上
eureka.client.service-url.defaultZone=http://eurekaB:1112/eureka
```

application-b.properites 内容如下：

```properties
# 给当前服务起一个名字
spring.application.name=eureka
# 设置端口号
server.port=1112
eureka.instance.hostname=eurekaB
eureka.client.register-with-eureka=true
# 表示是否从 Eureka Server 上获取注册中心
eureka.client.fetch-registry=true
# B服务注册到A服务上
eureka.client.service-url.defalutZone=http://eurekaA:1111/eureka
```

配置完成后，对当前项目打包，打成 jar 包

![image-20221102111941767](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102111941767.png)

打包完成后，在命令行（target目录下执行）启动两个 Eureka 实例。两个启动命令分别如下：

```shell
java -jar eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=a 
java -jar eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=b
```

启动成功后，就可以看到，两个服务之间互相注册，共同给组成一个集群。

![image-20221102112700070](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102112700070.png)

## 安全的服务注册中心

> 当完成 Eureka 的搭建之后，只要知道 ip 和端口就可以随意的注册服务、调用服务，这是不安全的，我们可以通过设置账号和密码来限制服务的注册及发现

### 新建一个名叫 eureka-server-security 的模块，添加如下依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

### 配置 application.properties 文件

> 配置登录注册中心的用户名和密码

```properties
spring.application.name=eureka-server-security
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.security.user.name=marico
spring.security.user.password=123
```

### 通过 Java 配置类来配置 Security

> 实现基于 Web 服务器于客户端之间进行认证的方式

```java
@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                /*任何http请求都需要验证*/
                .authorizeRequests().anyRequest().authenticated()
                .and()
                .httpBasic();
    }

}
```

### 完成上述配置之后，启动 eureka-server-security 模块

访问 http://localhost:8761/，发现需要进行如下验证

![image-20221102134000561](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102134000561.png)

### 服务注册

- 修改 eureka-client 的配置文件

配置格式：`http://<username>:<password>@localhost:1111/eureka`

```properties
# 添加账号和密码信息
eureka.client.service-url.defaultZone=http://marico:123@localhost:8761/eureka 
```

- 启动 eureka-client 模块，访问http://localhost:8761/

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221102134438003.png)

发现已经被成功注册到 Eureka 上

## 其他配置

下面整理了 `org.springframework.cloud.netflix.eureka.EurekaClientConfigBean` 中定义的常用配置参数以及对应的说明和默认值，这些参数均以 eureka.client 为前缀。

| 参数名                                        | 说明                                                   | 默认值 |
| --------------------------------------------- | ------------------------------------------------------ | ------ |
| enabled                                       | 启用 Eureka 客户端                                     | true   |
| registryFetchIntervalSeconds                  | 从 Eureka 服务端获取注册信息的间隔时间，单位为秒       | 30     |
| infoReplicationIntervalSeconds                | 更新实例信息的变化到 Eureka 服务端的间隔时间，单位为秒 | 30     |
| initialInstanceInfoReplicationIntervalSeconds | 初始化实例信息到 Eureka 服务端的间隔时间，单位为秒     | 40     |
| eurekaServiceUrlPollIntervalSeconds           | 轮询 Eureka 服务单地址更改的时间间隔，单位为秒。       | 300    |
| eurekaServerReadTimeoutSeconds                | 读取 Eureka Server 信息的超时时间，单位为秒            | 8      |
| eurekaServerConnectTimeoutSeconds             | 连接 Eureka Server 的超时时间，单位为秒                | 5      |
| eurekaServerTotalConnections                  | 从 Eureka 客户端到每个 Eureka 服务端的连接总数         | 200    |
| eurekaServerTotalConnectionsPerHost           | 从 Eureka  客户端到每个 Eureka 服务端主机的连接总数    | 50     |
| eurekaConnectionIdleTimeoutSeconds            | Eureka 服务端连接的空闲关闭时间，单位为秒              | 30     |
| heartbeatExecutorThreadPoolSize               | 心跳连接池的初始化线程数                               | 2      |
| heartbeatExecutorExponentialBackOffBound      | 心跳超时重试延迟时间的最大乘数值                       | 10     |
| cacheRefreshExecutorThreadPoolSize            | 缓存刷新线程池的初始化线程数                           | 2      |
| cacheRefreshExecutorExponentialBackOffBound   | 缓存刷新重试延迟时间的最大乘数值                       | 10     |
| useDnsForFetchingServiceUrls                  | 使用 DNS 来获取 Eureka 服务端的 serviceUrl             | false  |
| registerWithEureka                            | 是否要将自身的实例信息注册到 Eureka 服务端             | true   |
| preferSameZoneEureka                          | 是否偏好使用处于相同 Zone 的 Eureka 服务端             | true   |
| filterOnlyUpInstances                         | 获取实例时是否过滤，仅保留 UP 状态的实例               | true   |
| fetchRegistry                                 | 是否从 Eureka 服务端获取注册信息                       | true   |



