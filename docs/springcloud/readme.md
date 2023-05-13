---
title: 👉前言
tag: SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
article: false
---

[![img](https://img.shields.io/badge/%E5%8D%9A%E5%AE%A2-IT%E8%BE%BE%E6%91%A9%E9%99%A2-blue.svg)](typora://app/blog.html) [![img](https://img.shields.io/badge/%E5%85%AC%E4%BC%97%E5%8F%B7-marico-green.svg)](typora://app/blog.html) [![img](https://img.shields.io/badge/%E6%88%91%E7%9A%84%E4%BA%A4%E6%B5%81%E7%BE%A4-marico-%7B%7D.svg)](typora://app/blog.html)

## 目标

1. 了解微服务的由来以及基本原理 
1. 学会 Spring Cloud 中各个组件的使用 
1. 了解 Spring Cloud 中核心组件的运行原理 
1. 掌握通过 Spring Cloud 搭建微服务架构 
1. 掌握辅助组件的用法

## Spring Cloud 简介

### 什么是微服务

> Spring Cloud 是一个基于 Spring Boot 实现的微服务架构开发工具，它为微服务架构中涉及的配置管理、服务治理、断路器、智能路由、微代理、控制总线、全局锁、决策竞选、分布式会话和集群状态管理等操作提供了一种简单的开发方式。

### 核心特性

1. 服务注册与发现
2. 负载均衡
3. 服务之间调用
4. 容错、服务降级、断路器
5. 消息总线
6. 分布式配置中心
7. 链路器

### Spring Cloud 包含的组件

- Spring Cloud Netflix：这个组件，在 Spring Cloud 成立之初，立下了汗马功劳，但是，2018年的断更，也是Netfilx 掉链子了
- Spring Cloud Config：分布式配置中心，利用 `Git`/Svn 来集中管理项目的配置文件
- Spring Cloud Bus：消息总线，可以构建消息驱动的微服务，也可以用来做一些状态管理
- Spring Cloud Consul:：服务注册发现
- Spring Cloud Stream：基于 Redis、RabbitMQ、Kafka 实现的消息微服务
- Spring Cloud OpenFeign：提供 OpenFeign 集成到 Spring Boot 应用中的方式，主要解决微服务之间的调用问题
- Spring Cloud Gateway：Spring Cloud 官方推出的网关服务
- Spring Cloud Cloudfoundry：利用 Cloudfoundry 集成我们的应用程序
- Spring Cloud Security：在 Zuul 代理中为 OAuth2 客户端认证提供支持
- Spring Cloud AWS ：快速集成亚马逊云服务
- Spring Cloud Contract：一个消费者驱动，面向 Java 的契约框架
- Spring Cloud Zookeeper：基于 Apache Zookeeper 的服务注册发现
- Spring Cloud Data Flow：在一个结构化的平台上，组成数据微服务
- Spring Cloud Kubernetes：Spring Cloud 提供的针对 Kubernetes 的支持
- Spring Cloud Function
- Spring Cloud Task：短生命周期的微服务

### Spring Cloud 和 Spring Boot 版本关系

![](https://s1.vika.cn/space/2022/11/21/0d76c82fed2a4aa5a304ea08667b8e4b)

## 微服务架构

> 微服务架构，是一种架构概念，就是将一个单体应用中的每个功能分解到各个离散的服务中以实现对单体应用的解耦

### 从单体到微服务

![image-20230513224547053](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513224547053.png)

### 主流的微服务架构框架

- Dubbo（阿里、开源apache）：2012年推出、2014年停更、2015年底又继续更新
- Dubbox（当当网基于Dubbo的更新）
- jd-hydra（京东基于Dubbo的更新）
- `SpringCloud Netfilx`（2016年）/`SpringCloud Alibaba`
- ServicComb（CSE）华为 2017年

### 微服务架构优点

- 解决了单体项目的复杂性问题
- 每个服务都可以由单独的团队进行开发
- 每个服务都可以使用单独的技术栈进行开发
- 每个服务都是独立的进行部署的
- 每个服务都可以独立的进行部署和维护
- 每个服务都可以进行扩展

### 微服务架构的缺点

- 微服务架构的本身就是一个缺点，如何把握"微"的力度;
- 微服务架构是一个分布式系统，虽然单个服务变得简单了，但是服务之间存在的相互调用，整个微服务架构的系统变得复杂了;
- 微服务架构需要依赖分布式数据库架构;
- 微服务的单元测试及调用变得比单体更为复杂;
- 部署基于微服务架构的应用程序变得非常复杂;
- 进行微服务架构的应用程序开发的技术成本变得更高;

## 微服务架构开发需要解决的问题

> 在微服务架构开发的系统中必然存在很多个服务，服务之间需要相互感知对方的存在，需要进行服务间的调用，该如何实现呢?——进行微服务架构开发需要解决的问题：
>
> 1. 如此多的服务，服务之间如何相互发现?
> 2. 服务与服务之间该如何通信?
> 3. 如果某个服务挂了，该如何处理?
> 4. 前端访问多个不同的服务时该如何统一访问路径呢?

### 服务之间如何相互发现?

> 微服务架构——每个服务只处理一件事情/一个步骤，在一个复杂的业务中必然会存在服务间的相互调用，服务想要相互调用就需要先发现对方。

**通过服务注册与发现中心实现服务间的相互发现**

![image-20230513224658543](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513224658543.png)

- 服务注册与发现中心也是一台服务器
- 服务提供者在服务注册与发现中心进行注册
- 服务注册与发现中心进行服务记录，并与服务提供者保持心跳
- 服务消费通过服务注册与发现中心进行服务查询（服务发现）
- 服务注册与发现中心返回可用的服务的服务器地址列表
- 服务消费者通过负载均衡访问服务提供者

### 服务之间如何进行通信?

> 服务消费者在调用服务提供者时，首先需要通过`服务注册与发现中心`进行服务查询，返回服务列表给服务消费者，`服务消费者`通过 LoadBalance 调用`服务提供者`，那么他们之间是如何通信呢? ——数据传输规则
>
> 服务与服务之间的通信方式有2种：同步调用和异步调用

##### 同步调用

- REST(SpringCloud Netfilx ，SpringCloud Alibaba)
  - 基于HTTP协议的请求和响应
  - 更容易实现，技术更灵活
  - 支持多语言、同时可以实现跨客户端
  - 适用面很广
- RPC(Dubbo)
  - 基于网络层协议通信
  - 传输效率高
  - 安全性更高
  - 如果有统一的开发规范或者框架，开发效率是比较高的

##### 异步调用

服务间的异步通信通常是通过消息队列实现的

### 服务挂了该如何解决?

##### 服务故障雪崩

![image-20230513224947565](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513224947565.png)

##### 如何解决服务故障雪崩

- 服务集群——尽量保证每个服务可用
- 服务降级与熔断——避免请求阻塞造成正常的服务出现故障

### 客户端如何统一访问多个接口服务?

**通过路由网关实现接口的统一访问**

![image-20230513225049718](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513225049718.png)

## 公众号

 ![img](https://s1.vika.cn/space/2022/11/21/b1bf26f310144a3bbfc2c706ffa3f8fc)