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

创建一个名叫 reslience4j 的 Spring Boot 工程，添加如下依赖：

- 测试依赖

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

- Resilience4j 提供了很多功能，不同的功能对应不同的依赖，可以按需添加。使用断路器，则首先添加断路器的依赖


```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-circuitbreaker</artifactId>
    <version>0.13.2</version>
</dependency>
```

### 在测试类中编写如下代码

步骤如下：

1. 先通过 `CircuitBreakerRegistry.ofDefaults()` 获取一个 `CircuitBreakerRegistry` 实例
2. 为 `CircuitBreakerConfig` 断路器配置类设置属性值
   - failureRateThreshold(50)：表示故障率阈值百分比，超过这个阈值，断路器就会打开
   - waitDurationInOpenState(Duration.ofMillis(1000))：断路器保持打开时间，在到达的设置的时间之后，断路器会进入到 half open 状态 （半打开）
   - `ringBufferSizeInHalfOpenState(2)`， `ringBufferSizeInClosedState(2)` ：当断路器处于 half open 状态时，环形缓冲区的大小
3. 通过 `r1.circuitBreaker("marico");` 得到断路器对象，`marico` 是自定义断路器名称
4. 自定义 supplier 函数，执行成功会返回"hello resilience4j"
5. 使用 java8 新特性调用该函数，输出是否成功以及输出的值

```java
@Test
public void test1() {
    CircuitBreakerRegistry registry = CircuitBreakerRegistry.ofDefaults();
    CircuitBreakerConfig config = CircuitBreakerConfig.custom()
        .failureRateThreshold(50)
        .waitDurationInOpenState(Duration.ofMillis(1000))
        .ringBufferSizeInHalfOpenState(2)
        .ringBufferSizeInClosedState(2)
        .build();
    CircuitBreakerRegistry r1 = CircuitBreakerRegistry.of(config);
    CircuitBreaker cb1 = r1.circuitBreaker("marico");
    CheckedFunction0<String> supplier = CircuitBreaker.decorateCheckedSupplier(cb1, () -> "hello resilience4j");
    Try<String> result = Try.of(supplier)
        .map(v -> v + " hello world");
    System.out.println(result.isSuccess());
    System.out.println(result.get());
}
```

执行上述代码，控制台输出如下：

```shell
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
true
hello resilience4j hello world

Process finished with exit code 0
```

因为没有出错，所以断路器处于闭合状态

### 手动故障测试

```java
@Test
public void test2(){
    CircuitBreakerConfig config = CircuitBreakerConfig.custom()
            .failureRateThreshold(50)
            .waitDurationInOpenState(Duration.ofMillis(1000))
            /*两条数据的时候就会测试故障*/
            .ringBufferSizeInClosedState(2)
            .build();
    CircuitBreakerRegistry r1 = CircuitBreakerRegistry.of(config);
    CircuitBreaker cb1 = r1.circuitBreaker("javaboy");
    System.out.println(cb1.getState());  //获取断路器的状态 ：CLOSE
    /*当故障率超过50%就会打开*/
    cb1.onError(0, new RuntimeException());
    System.out.println(cb1.getState());
    cb1.onError(0, new RuntimeException());
    System.out.println(cb1.getState());

    CheckedFunction0<String> supplier = CircuitBreaker.decorateCheckedSupplier(cb1, () -> "hello resilience4j");
    Try<String> result = Try.of(supplier)
            .map(v -> v + " hello world");
    System.out.println(result.isSuccess());
    System.out.println(result.get());
}
```

::: tip 提示

cb1.getState() 方法表示获取断路器的状态，由于 `ringBuﬀerSizeInClosedState` 的值为 2，表示当`有两条数据时才会去统计故障率`，所以， 上面的手动故障测试，至少调用两次` onError` ，断路器才会打开。

:::

执行以上代码，控制台打印结果：

![image-20221106191428379](https://s1.vika.cn/space/2022/11/21/43a0deb810134f588802390dc91458e3)

## 限流

### 首先添加依赖

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-ratelimiter</artifactId>
    <version>0.13.2</version>
</dependency>
```

### 限流测试

```java
@Test
public void test3(){
    /*限流配置*/
    RateLimiterConfig config = RateLimiterConfig.custom()
        /*阈值刷新时间*/
        .limitRefreshPeriod(Duration.ofMillis(1000))
        .limitForPeriod(2) //阈值刷新的频次
        .timeoutDuration(Duration.ofMinutes(1000)) //限流之后的冷却时间
        .build();
    RateLimiter rateLimiter = RateLimiter.of("javaboy", config);
    CheckedRunnable checkedRunnable = RateLimiter.decorateCheckedRunnable(rateLimiter, () -> {
        System.out.println(new Date());
    });
    Try.run(checkedRunnable)
        .andThenTry(checkedRunnable)
        .andThenTry(checkedRunnable)
        .andThenTry(checkedRunnable)
        .onFailure(t-> System.out.println(t.getMessage()));
}
```

::: tip 说明

以上代码通过对限流的配置，表示每秒处理两个请求。

:::

### 测试结果

```shell
Sun Nov 06 19:18:39 CST 2022
Sun Nov 06 19:18:39 CST 2022
Sun Nov 06 19:18:40 CST 2022
Sun Nov 06 19:18:40 CST 2022
```

## 请求重试

### 首先第一步还是加依赖

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-retry</artifactId>
    <version>0.13.2</version>
</dependency>
```

### 请求重试测试

```java
@Test
public void test4() {
    RetryConfig config = RetryConfig.custom()
        /*配置重试次数*/
        .maxAttempts(5)
        /*重试间隔时间*/
        .waitDuration(Duration.ofSeconds(1))  //ofMillis 毫秒数    ofSeconds 秒数
        /*执行过程中指定抛出异常，重试*/
        .retryExceptions(RuntimeException.class)
        .build();
    Retry retry = Retry.of("javaboy", config);
    Retry.decorateRunnable(retry, new Runnable() {
        int count = 0;

        @Override
        public void run() {
            if (count++ < 3) {
                System.out.println(count);
                throw new RuntimeException();
            }
        }
    }).run();
}
```

> 代码说明：`retryExceptions` 指定重试的条件，这里表示若抛出 RuntimeException 运行时异常将会进行重试，且最大重试次数为 5，每一秒后进行重试，直至超过最大重试次数或者不抛出异常

### 测试结果

![image-20221106192446046](https://s1.vika.cn/space/2022/11/21/74b286bff44844fba501853a260149aa)

## 结合微服务使用

### Retry 请求重试

- 首先创建一个 reslience4j-2 的 springboot 工程，添加如下依赖

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
    <version>1.2.0</version>
    <exclusions>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-circuitbreaker</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-ratelimiter</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-bulkhead</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-timelimiter</artifactId>
        </exclusion>
    </exclusions>
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

::: tip 说明

`resilience4j-spring-boot2 `中包含了 Resilience4j 的所有功能，但是没有配置的功能无法使用，需要将之从依赖中剔除掉。

:::

- 接下来，在 application.yml 中配置 retry

> 这里主要定义了一个名叫 retryA 的重试策略

```yml
resilience4j:
  retry:
    retry-aspect-order: 399 # 表示Retry的优先级
    backends:
      retryA:  #自定义重试名称
        maxRetryAttempts: 5 # 重试的次数
        waitDuration: 500 # 重试等待时间
        exponentialBackoffMultiplier: 1.1 #间隔乘数 
        retryExecptions:
         - java.lang.RuntimeException
spring:
  application:
    name: resilience4j
server:
  port: 5000
eureka:
  client:
    service-url:
      defaultZone: http://localhost:1111/eureka
```

- 然后，创建测试 RestTemplate 和 HelloService

```java
@SpringBootApplication
public class Resilience4j2Application {

    public static void main(String[] args) {
        SpringApplication.run(Resilience4j2Application.class, args);
    }

    @Bean
    RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

```java
@Service
@Retry(name = "retryA")
public class HelloService {
    @Autowired
    RestTemplate restTemplate;

    public String hello(){
        return restTemplate.getForObject("http://localhost:1113/hello", String.class);
    }
}
```

> @Retry 注解中的 name 属性表示要使用的重试策略

- 最后，在 controller 中进行调用

```java
@RestController
public class HelloController {

    @Autowired
    HelloService helloService;

    @GetMapping("/hello")
    public String hello(){
        return helloService.hello();
    }

}
```

- 测试

修改 provider 中的接口：直接抛出运行时异常

```java
@Override
public String hello() {
 	throw new RuntimeException("自定义错误");
}
```

分别启动 eureka、provider 和 resilience4j 服务，访问 http://localhost:5000/hello

![image-20221106195134394](https://s1.vika.cn/space/2022/11/21/4b91f9faf9e943928a52c9a015c2fe81)

**由此可以看出 resilience4j  服务连续尝试请求了 5 次！**

### CircuitBreaker 服务降级

- 首先从依赖中删除排除 CircuitBreaker

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
    <!--此版本与SpringBoot版本相对应-->
    <version>1.2.0</version>
    <exclusions>
        <!--                <exclusion>-->
        <!--                    <groupId>io.github.resilience4j</groupId>-->
        <!--                    <artifactId>resilience4j-circuitbreaker</artifactId>-->
        <!--                </exclusion>-->
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-ratelimiter</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-bulkhead</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-timelimiter</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

- 然后在 application.yml 中进行配置

```yml
resilience4j:
  retry:
    retry-aspect-order: 399 # 表示Retry的优先级
    backends:
      retryA:  #自定义重试名称
        maxRetryAttempts: 5 # 重试的次数
        waitDuration: 500 # 重试等待时间
        exponentialBackoffMultiplier: 1.1 #间隔乘数
        retryExecptions:
         - java.lang.RuntimeException
  circuitbreaker:
    instances:
      cbA:
        ringBufferSizeInClosedState: 5
        ringBufferSizeInHalfOpenState: 3
        waitInterval: 5000
        recordsException:
          - org.springframeword.web.client.HttpServerErrorException # 服务端报错就自动降级
    circuit-breaker-aspect-order: 398
```

- 配置完成后，用 `@CircuitBreakder `注解标记降级方法：

```java
@Service
//@Retry(name = "retryA")
@CircuitBreaker(name = "cbA",fallbackMethod = "error")
public class HelloService {
    @Autowired
    RestTemplate restTemplate;

    public String hello(){
        return restTemplate.getForObject("http://localhost:1113/hello", String.class);
    }

    public String error(Throwable t){
        System.out.println(t.getMessage());
        return "error";
    }
}
```

::: tip 注意

`@CircuitBreaker` 注解中的 `name `属性用来指定 circuitbreaker 配置，`fallbackMethod` 属性用来指定服务降级的方法，**需要注意的是，服务降级方法中，要添加异常参数**。

:::

- 测试，浏览器访问 http://localhost:5000/hello

![image-20221106195717111](https://s1.vika.cn/space/2022/11/21/5d096e50f1294cc28be44a6c76baa18b)

### RateLimiter 限流

- `RateLimiter `作为限流工具，主要在服务端使用，用来保护服务端的接口。首先在 provider 中添加 RateLimiter 依赖（要排除 resilience4j-ratelimiter 依赖）

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
    <version>1.2.0</version>
    <exclusions>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-circuitbreaker</artifactId>
        </exclusion>
        <!--                <exclusion>-->
        <!--                    <groupId>io.github.resilience4j</groupId>-->
        <!--                    <artifactId>resilience4j-ratelimiter</artifactId>-->
        <!--                </exclusion>-->
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-bulkhead</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.github.resilience4j</groupId>
            <artifactId>resilience4j-timelimiter</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

- 接下来，在 provider 的 application.properties 配置文件中，去配置 RateLimiter

```properties
# 这里配置每秒钟处理一个请求
resilience4j.ratelimiter.limiters.rlA.limit-for-period=1
# 刷新时间1s
resilience4j.ratelimiter.limiters.rlA.limit-refresh-period=1s
# 冷却时间
resilience4j.ratelimiter.limiters.rlA.timeout-duration=1s
```

- 为了查看请求效果，在 provider 的 HelloController 中打印每一个请求的时间

```java
@Override
@RateLimiter(name = "rlA")
public String hello() {
    System.out.println(new Date());
    return "hello marico：" + port;
}
```

::: tip 提示

这里通过`@RateLimiter`注解标记该接口限流，属性 name 是 properties 中配置的限流名。

:::

- 配置完成后，重启provider，然后，在客户端模拟多个请求，查看限流效果

```java
/*模拟RateLimiter请求*/
public String hello(){
    for (int i = 0; i < 5; i++) {
        restTemplate.getForObject("http://localhost:1113/hello", String.class);
    }
    return "success";
}
```

- 测试，浏览器访问 http://localhost:5000/hello，控制台打印如下：

![image-20221106200704472](https://s1.vika.cn/space/2022/11/21/fddeef6a32134cbd9e13189634c2eece)

**由此我们可以发现请求每秒钟后得到一次响应，限流起作用了！**

## 服务监控

微服务由于服务数量众多，所以出故障的概率很大，这种时候不能单纯的依靠人肉运维。

早期的 Spring Cloud 中，服务监控主要使用 `Hystrix Dashboard`，集群数据库监控使用 `Turbine`。在 `Greenwich` 版本中，官方建议监控工具使用 `Micrometer`。

Micrometer：

1.  提供了度量指标，例如 `timers、counters`

2.  一揽子开箱即用的解决方案，例如`缓存、类加载器、垃圾收集`等等

新建一个名为 micrometer 的项目，添加 Actuator 依赖。项目创建成功后，添加如下配置，开启所有端点：

```properties
management.endpoints.web.exposure.include=*
```

然后就可以在浏览器查看项目的各项运行数据，但是这些数据都是 JSON 格式。

![image-20220707193406719](https://s1.vika.cn/space/2022/11/21/d45f87af1f6e4195ac6f130db163c7a6)

我们需要一个可视化工具来展示这些 JSON 数据。这里主要和大家介绍 Prometheus（普罗米修斯）。

### 下载 Prometheus

```shell
wget https://github.com/prometheus/prometheus/releases/download/v2.16.0/prometheus- 2.16.0.linux-amd64.tar.gz
tar -zxvf prometheus-2.16.0.linux-amd64.tar.gz
```

- 解压完成后，配置一下数据路径和要监控的服务地址

```shell
cd prometheus-2.16.0.linux-amd64/ 
vi prometheus.yml
```

![image-20220707194549799](https://s1.vika.cn/space/2022/11/21/1d2a1e73f721405b90daf0972a2a47cc)

### 与 Spring Boot 整合

将 Prometheus 整合到 Spring Boot 项目中。首先加依赖

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

- 然后在 application.properties 配置中，添加 Prometheus 配置

```properties
management.endpoints.web.exposure.include=*

management.endpoint.prometheus.enabled=true
management.metrics.export.prometheus.enabled=true
management.endpoint.metrics.enabled=true
```

- 可输入actuator地址查看信息

![image-20220707195346282](https://s1.vika.cn/space/2022/11/21/107a91b8c5c444d1a7c239fd4dcfc1cf)

### 启动 Prometheus

接下来启动 Prometheus，启动命令：

```shell
./prometheus --config.file=prometheus.yml
```

如果看到 `Server is ready to receive web requests.` 字样，说明已经启动成功了

启动成功后，浏览器输入http://192.168.88.128:9090/graph（这里我的虚拟机地址是 192.168.88.128）查看 Prometheus 数据信息。

![image-20220707201935911](https://s1.vika.cn/space/2022/11/21/b8dde6f0cb2047748a382759c172c021)

### Grafana 下载和启动

https://grafana.com/grafana/download?platform=linux

```shell
wget https://dl.grafana.com/oss/release/grafana-6.6.1-1.x86_64.rpm
sudo yum install grafana-6.6.1-1.x86_64.rpm
```

```shell
systemctl start grafana-server.service
```

访问 http://192.168.88.128:3000/login，这里我的虚拟机地址是 192.168.88.128。

![](https://s1.vika.cn/space/2022/11/21/914bb21d265148508e05f3bfb73f8731)

默认账号密码 admin admin

- 登录成功后

![](https://s1.vika.cn/space/2022/11/21/de2c3f91f3e34db481dd8f53d5999ddb)

- 可以看到创建流程

![](https://s1.vika.cn/space/2022/11/21/757ea684035045978e125c01896d9f2c)

- 添加数据源

![](https://s1.vika.cn/space/2022/11/21/0a7ab95479ec4247a3892a4edfc2cda2)

- 填写 Prometheus 端口 点击'Save & Test'

![](https://s1.vika.cn/space/2022/11/21/18a356cab4084eb6aa8187191444ba13)

- 添加 DashBoard

![](https://s1.vika.cn/space/2022/11/21/1f61040a83a946b6b2ce1a5d85031342)

- Add Query

![](https://s1.vika.cn/space/2022/11/21/108c18ad0d594bf6a86be15b278f623f)
