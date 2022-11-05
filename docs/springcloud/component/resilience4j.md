---
article: false
title: Spring Cloud Reslience4j 新一代容错解决方案
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## Reslience4j 简介

> `Resilience4j` 是 Spring Cloud Greenwich 版推荐的容错解决方案，相比` Hystrix`，Resilience4j 专为 Java8 以及函数式编程而设计。

Resilience4j 主要提供了如下功能：

1. 断路器

2. 限流

3. 基于信号量的隔离

4. 缓存
5. 限时
6. 请求重试

## 快速开始

### 首先搭建一个简单的测试环境。

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

### 断路器

Resilience4j 提供了很多功能，不同的功能对应不同的依赖，可以按需添加。使用断路器，则首先添加断路器的依赖：

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-circuitbreaker</artifactId>
    <version>0.13.2</version>
</dependency>
```





