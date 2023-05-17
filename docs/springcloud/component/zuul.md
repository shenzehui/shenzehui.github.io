---
article: false
title: Spring Cloud Stream API 网关服务
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## 什么是服务网关 ？

>  Api Gateway（APIGW/API 网关），是出现在系统边界的一个面向 Api 的、串行集中式的强管控服务，这里的边界是企业IT系统的边界，可以理解为企业级应用防火墙。主要起到隔离外部访问与内部系统的作用。在微服务概念的流行之前，Api 网关就已经诞生了，例如银行、证券等领域的前置机系统，它可以解决访问认证、报文转换、访问统计等问题。
>
> Api 网关是一个服务器，是系统对外的唯一入口。Api 网关封装了系统内部架构，为每个客户端提供定制 Api。所有的客户端和消费端都需要通过统一的网关接入微服务，在网关层处理所有非业务功能。Api网关并不是微服务场景中必须的组件，如下图，不管有没有 Api 网关，后端微服务都可以通过 Api 很好的支持客户端的访问。

Spring Cloud 中，网关主要有两种实现方案：

- Zuul
- Spring Cloud Gateway

## Zuul 简介

> zuul 是从设备和网站到应用程序后端的所有请求的前门。作为边缘服务的应用程序，旨在实现动态路由、监视、弹性和安全性。包含了队请求的路由和过滤这两个最主要的功能。

zuul 是 Netflix 开源的服务网关，它可以和 Eureka、Ribbon、Hystrix 等组件配合使用。核心就是一系列的过滤器。并以过滤器完成以下的功能：

- 权限控制，可以做认证和授权
- 监控
- 动态路由
- 负载均衡
- 静态资源处理

Zuul 中的功能基本上都是基于过滤器来实现，它的过滤器有几种不同的类型：

- PRE（前置过滤器）
- ROUTING（将请求路由到微服务中）
- POST
- ERROR

## 快速入门

创建一个基础的 Spring Boot 工程，命名为 zuul，并在 pom.xml 中添加如下依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

项目创建成功之后，将 zuul 注册到 eureka 上：

```properties
spring.application.name=zuul
server.port=2022
eureka.client.service-url.defaultZone=http://localhost:1111/eureka
```

创建应用主类，使用 `@EnableZuulProxy` 注解开启 Zuul 的 API 网关服务功能：

```java
@SpringBootApplication
@EnableZuulProxy //开启网关代理
public class ZuulApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZuulApplication.class, args);
    }
}
```

完成上面的工作后，通过 Zuul 实现的 API 服务网关就构建完毕了。

## 请求路由

### 传统的路由方式

使用 Spring Cloud Zuul 实现路由功能非常简单，只需要对 zuul 服务增加一些关于路由规则的配置，就能实现传统的路由转发功能，比如：

```properties
zuul.routes.marico.path=/marico/**
zuul.routes.marico.url=http://localhost:2020/
```

::: tip 提示

该配置定义了发往 API 网关服务的请求中，所有符合 `/api-a-url/**` 规则的访问都将被路由转发到http://localhost:8080/ 地址上，也就是说，当我们访问 http://localhost:2020/marico/hello 的时候，API 网关服务会将该请求路由到 http://localhost:2020/hello 提供的微服务接口上。其中，配置属性 `zuul.routes.marico.path` 中的 marico 部分为路由的名字，可以任意定义，但是一组 path 和 url 映射关系名要相同。

:::

### 面向服务的路由

> 很显然，传统的路由的配置方式对于我们来说并不友好，它同样需要运维人员花费大量的时间来维护各个路由 path 与 url 的关系。为了解决这个问题，Spring Cloud Zuul 实现了与 Spring Cloud Eureka 的无缝整合，我们可以让路由的 path 不是映射具体的 url，而是让它映射到某个具体的服务，而具体的 url 则是交给 Eureka 的服务发现机制去自动维护，我们将这类路由为面向服务的路由。

在 zuul 的 applictaion.properties 配置文件中配置服务路由，具体如下：

```properties
zuul.routes.marico.path=/marico/**
zuul.routes.marico.service-id=provider
```

也可以将伤处两个配置精简为一行配置：

```properties
zuul.routes.provider=/marico/**
```

配置完成之后，分别启动 eureka、zuul、provider 服务，启动完成之后，访问 http://localhost:2022/marico/hello

![image-20230517163058418](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230517163058418.png)

::: tip 说明

http://localhost:2022/marico/hello，该 url 符合 `/marico/**` 规则，由名叫 marico 的路由负责转发，该路由映射的 serviceId 为 provider，所以最终 /hello 请求会被发送到 provider 服务的某个实例上去。

:::

通过面向服务的路由配置方式，我们不需要再为各个路由维护微服务应用的具体实例的位置，而是通过简单的 path 与 serviceId 的映射结合，使得维护工作变得非常简单。完美的解决了对路由映射实例的维护问题。

## 请求过滤

> 到目前为止，服务路由并没有限制权限这样的功能，所有请求都会被毫无保留地转发到具体的应用并返回结果，为了实现对客户端请求的安全校验和权限控制，最简单和粗暴的方法就是为每个微服务应用都实现一套用于校验签名和鉴别权限的过滤器和拦截器。

对于来自客户端的请求，可以在 Zuul 中进行预处理，例如权限判断等。定义一个简单的`权限过滤器`：

```java
package com.marico.zuul;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class PermissFilter extends ZuulFilter {
    /**
     * 过滤器类型，权限判断一般是 pre
     * @return
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤器优先级
     * @return
     */
    @Override
    public int filterOrder() {
        return 0;
    }

    /**
     * 是否过滤
     * @return
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if(!"marico".equals(username)||!"123".equals(password)){
            ctx.setSendZuulResponse(false);
            ctx.setResponseStatusCode(401);
            ctx.addZuulResponseHeader("content-type", "text/html;charset=utf-8");
            ctx.setResponseBody("非法访问");
        }
        return null;
    }
}
```

重启 Zuul，接下来，发送请求必须带上 username 和 password 参数，否则请求不通过。

![image-20230517163131395](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230517163131395.png)

不携带或者携带参数值错误：

![image-20230517163141529](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230517163141529.png)

## 其他配置

### 路径匹配

在 Zuul 中，路由匹配的路径表达式采用了 Ant 风格定义。

Ant 风格的路径表达式使用起来非常简单，它一共有下面这三种通配符

| 通配符 | 说明                             |
| ------ | -------------------------------- |
| ？     | 匹配任意单个字符                 |
| *      | 匹配任意数量的字符               |
| **     | 匹配任意数量的字符，支持多级目录 |

通过下表中的示例来进一步理解这三个通配符的含义

| URL 路径     | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| /provider/?  | 它可以匹配 /provider/ 之后拼接一个任意字符的路径。           |
| /provider/*  | 它可以匹配 /provider/ 之后拼接任意字符的路径。               |
| /provider/** | 不仅可以匹配 /provider/* 包含的内容之外，还可以匹配形如 /provider/a/b 的多级目录 |

### 忽略表达式

> Zuul 提供了一个忽略表达式参数 `zuul.ignored-patterns` 。该参数可以用来设置不希望被 API 官网进行路由的 URL 表达式。

比如，不希望 /hello 接口被路由，可以在 application.properties 配置如下：

```properties
zuul.ignored-patterns=/**/hello/**
```

同时，如果不想被某个服务做代理服务，可以忽略该服务

```properties
zuul.ignored-services=provider 
```

### 路由前缀

> 为了方便全局地为路由规则增加前缀信息。Zuul 提供了 zuul.prefix 参数来进行设置。

```properties
# 添加前缀
#zuul.prefix=/marico
```

这样，以后所有的请求地址自动多了前缀 /marico
