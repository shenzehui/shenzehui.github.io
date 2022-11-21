---
article: false
title: Spring Cloud Gateway 新一代API服务网关
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## GateWay 简介

> Spring Cloud Gateway 是 Spring 官方基于 Spring 5.0，Spring Boot 2.0 和 Project Reactor 等技术开发的网关，Spring Cloud Gateway 旨在为微服务架构提供一种简单而有效的统一的 API 路由管理方式。Spring Cloud Gateway 作为 Spring Cloud 生态系中的网关，目标是替代 Zuul，其不仅提供统一的路由方式，并且基于 Filter链的方式提供了网关基本的功能，例如：安全，监控/埋点，和限流等。

### 特点

- 限流
- 路径重写
- 动态路由
- 集成 Spring Cloud DiscoveryClient
- 集成Hystrix断路器

和Zuul 对比：

1. Zuul 是 Netﬂix 公司的开源产品，Spring Cloud Gateway 是 Spring 家族中的产品，可以和Spring 家族中的其他组件更好的融合。

2. Zuul1 不支持长连接，例如 websocket。

3. Spring Cloud Gateway 支持限流。

4. Spring Cloud Gateway 基于 `Netty` 来开发，实现了异步和非阻塞，占用资源更小，性能强于Zuul。

### GateWay中的 几个概念

![image-20221121083419255](https://s1.vika.cn/space/2022/11/21/390b872b30af41a3a9c1c9afe3c5acba)

## 快速开始

