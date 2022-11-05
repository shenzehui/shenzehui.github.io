---
article: false
title: 自定义多数据源
---

> 

## 快速开始

### 新建 Spring Boot 工程，添加如下依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.12</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 自定义 @DataSource 注解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface DataSource {

    /**
     * 如果一个方法上加了 @DataSource 注解，但是却没有指定数据源的名称，那么默认使用 master 数据源
     * @return
     */
    String value() default DataSourceType.DEFAULT_DS_NAME;

}
```