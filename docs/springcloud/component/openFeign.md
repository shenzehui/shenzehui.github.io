---
article: false
title: Spring Cloud Feign 声明式服务调用
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## 简介

> 前面无论是基本调用，还是 Hystrix，我们实际上都是通过手动调用 `RestTemplate` 来实现远程调用的。使用RestTemplate 存在一个问题：繁琐，每一个请求，参数不同，请求地址不同，返回数据类型不同，其他都是一样的，所以我们希望能够对请求进行简化。
>
> 我们希望对请求进行简化，简化方案就是 OpenFeign。
>
> 一开始这个组件不叫这个名字，一开始就叫 Feign，Netﬂix Feign，但是 Netﬂix 中的组件现在已经停止开源工作，`OpenFeign` 是 Spring Cloud 团队在 Netﬂix Feign 的基础上开发出来的声明式服务调用组件。关于 OpenFeign 组件的 Issue：https://github.com/OpenFeign/feign/issues/373

## 快速入门

- 首先，创建一个 Spring Boot 基础工程，取名为 openFeign，并在 pom.xml 中引入 `spring-cloud-starter-netflix-eureka-client` 和 `spring-cloud-starter-openfeign` 依赖，具体内容如下所示：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

- 在应用主类上添加 `@EnableFeignClients` 注解开启 Spring Cloud Feign 的支持功能

```java
@SpringBootApplication
@EnableFeignClients
public class OpenfeignApplication {

    public static void main(String[] args) {
        SpringApplication.run(OpenfeignApplication.class, args);
    }

}
```

- 配置 applictaion.properties 配置文件

```properties
spring.application.name=openfeign
server.port=4000
eureka.client.service-url.defaultZone=http://localhost:1111/eureka
```

- 接下来，定义 HelloService 接口，通过 `@FeignClient` 注解指定服务名来绑定服务，然后再使用 Spring MVC 的注解来绑定具体该服务提供的 REST 接口。

```java
@FeignClient("provider")
public interface HelloService {

    @GetMapping("/hello")  
    String hello(); 

}
```

::: tip 注意

这里服务名不区分大小写，所以使用 provider 和 PROVIDER 都是可以的。

:::

- 最后调用 HelloController 中，调用 HelloService 进行测试：

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

- 接下来，启动 OpenFeign 项目，进行测试：

访问 http://localhost:4000/ 接口，页面返回 'hello marico：1113' 信息。调用服务成功！

## 参数传递

> 上面代码中，我们使用 Spring Cloud Feign 实现的是一个不带参的 REST 服务绑定。然而现实系统中的各个业务接口要比它复杂的多，我们会在 HTTP 的各个位置传入各种不同类型的参数，并且在返回请求响应的时候也可能是一个复杂的对象结构。

- 首先，我们需要在 provider 模块中添加如下接口：

```java
@GetMapping("/hello")
public String hello() {
    System.out.println(new Date());
    return "hello marico：" + port;
}

@GetMapping("/hello2")
public String hello2(String name) {
    System.out.println(new Date() + ">>>" + name);
    return "hello " + name;
}

@PostMapping("/user2")
public User addUser2(@RequestBody User user){
    return user;
}

@DeleteMapping("/user2/{id}")
public void deleteUser2(@PathVariable Integer id){
    System.out.println(id);
}

@GetMapping("/user3")
public void getUserByName(@RequestHeader String name) throws UnsupportedEncodingException {
    System.out.println(URLDecoder.decode(name, "UTF-8"));
}
```

- 然后，在 openfeign 中添加调用接口即可：

```java
@FeignClient("provider")
public interface HelloService {

    @GetMapping("/hello") 
    String hello(); 

    @GetMapping("/hello2")
    String hello2(@RequestParam("name") String name);

    @PostMapping("/user2")
    User addUser(@RequestBody User user);

    @DeleteMapping("/user2/{id}")
    void deleteUserById(@PathVariable("id") Integer id);

    @GetMapping("/user3")
    void getUserByName(@RequestHeader("name") String name);
}
```

- HelloController 中调用 HelloService：

```java
@RestController
public class HelloController {

    @Autowired
    HelloService helloService;

    @GetMapping("/hello")
    public String hello() throws UnsupportedEncodingException {
        String s = helloService.hello2("szh");
        System.out.println(s);

        User user = new User();
        user.setId(1);
        user.setUsername("marico");
        user.setPassword("123456");
        User u = helloService.addUser(user);
        System.out.println(u);

        helloService.deleteUserById(1);

        helloService.getUserByName(URLEncoder.encode("达摩院", "UTF-8"));
        return helloService.hello();
    }
}
```

::: tip 注意

放在 header 中的中文参数，一定要编码之后传递。

:::

## 继承特性

> 通过上面两个小节的实践，相信很多读者已经观察到，当使用 Spring MVC 的注解来绑定服务接口时，我们几乎完全可以从服务提供方的 Controller 中依靠服务操作，构建出响应的服务客户端绑定接口。既然存在这么多复制操作，我们自然需要考虑这部分内容是否可以得到进一步的抽象呢？在 Spring Cloud Feign 中，针对该问题提供了继承特性来帮助我们解决这些复制操作，以进一步减少编码量。

- 为了能够复用 DTO 与 接口定义，我们先创建一个 Maven 工程，命名为 `hello-api`。
- 由于在 `hello-api` 中需要定义可同时复用于微服务与客户端的接口，我们要使用 Spring MVC 的注解，所以在 pom.xml 中引入 `spring-boot-starter-web` 依赖，由于需要引用 User 类，所以添加 `commons` 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.2.2.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.marico</groupId>
    <artifactId>commons</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

- 然后定义公共接口，就是provider 和 openfeign 中公共的部分：

```java
public interface IUserService {
    @GetMapping("/hello")  
    String hello(); 

    @GetMapping("/hello2")
    String hello2(@RequestParam("name") String name);

    @PostMapping("/user2")
    User addUser(@RequestBody User user);

    @DeleteMapping("/user2/{id}")
    void deleteUserById(@PathVariable("id") Integer id);

    @GetMapping("/user3")
    void getUserByName(@RequestHeader("name") String name);
}
```

- 定义完成后，接下来，在 provider 和 openfeign 中，分别引用该模块：

```xml
<dependency>
    <groupId>org.javaboy</groupId>
    <artifactId>hello-api</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

- 添加成功之后，在 provider 中实现该接口：

```java
@RestController
public class HelloController implements IUserService {
    @Value("${server.port}")
    Integer port;

    @Override
    public String hello() {
        return "hello marico：" + port;
    }

    @Override
    public String hello2(String name) {
        System.out.println(new Date() + ">>>" + name);
        return "hello " + name;
    }

    @PostMapping("/user1")
    public User addUser1(User user){
        return user;
    }

    @Override
    public User addUser2(@RequestBody User user){
        return user;
    }

    @PutMapping("/user1")
    public void updateUser1(User user){
        System.out.println(user);
    }

    @PutMapping("/user2")
    public void updateUser2(@RequestBody User user){
        System.out.println(user);
    }

    @DeleteMapping("/user1")
    public void deleteUser1(Integer id){
        System.out.println(id);
    }

    @Override
    public void deleteUser2(@PathVariable Integer id){
        System.out.println(id);
    }

    @Override
    public void getUserByName(@RequestHeader String name) throws UnsupportedEncodingException {
        System.out.println(URLDecoder.decode(name, "UTF-8"));
    }
}
```

- 在 openfeign 中，定义接口只要继承至公共接口即可：

```java
@FeignClient("provider")
public interface HelloService extends IUserService {
}
```

- 最后，调用 openfeign中的 hello 接口进行测试

## Ribbon 配置

> 由于 Spring Cloud Feign 的客户端负载均衡是通过 Spring Cloud Ribbon 实现的，所以我们可以直接通过 Ribbon 客户端的方式来自定义各个服务客户端调用的参数。

### 全局配置

全局配置的方法非常简单，我们可以直接使用 `ribbon.<key>=<value>` 的方式来设置 ribbon 的各项默认参数。比如，修改默认的客户端调用超时时间。

```properties
ribbon.ConnectionTimeout=500  # Ribbon和服务提供者建立连接的最大等待时间
ribbon.ReadTimeout=5000  # 设置读取服务提供者的超时时间
```

### 指定服务配置

之前我们使用 `@FeignClient(value = "provider")` 来创建 Feign 客户端的时候，其实同时也创建了一个名为 provider 的 Ribbon 客户端，既然如此，我们就可以使用 `@FeignClient` 注解中的 name 或 value 属性值来设置对应的 Ribbon 参数

```properties
PROVIDER.ribbon.ConnectionTimeout=500  
PROVIDER.ribbon.ReadTimeout=2000  
PROVIDER.ribbon.OKTORetryOnAllOperations=true
```

### 重试机制

- 在 provider 应用的 /hello 接口实现中，增加了一些随机延迟

```java
@Override
@RateLimiter(name = "rlA")  //属性name是properties中配置的限流名
public String hello() {
    int sleepTime = new Random().nextInt(3000);

    System.out.println("sleepTime = " + sleepTime);
    try {
        Thread.sleep(sleepTime);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    System.out.println(new Date());
    return "hello marico：" + port;
}
```

访问 http://localhost:4000/hello 接口，控制台打印如下：

```shell
Sat Nov 05 19:39:08 CST 2022>>>szh
1
sleepTime = 2602
Sat Nov 05 19:39:11 CST 2022
达摩院
```

可见，Feign 客户端在进行服务调用时，虽然经历一次失败，但是通过重试机制，最终还是获得了请求结果。

## Hystrix 配置

### 全局配置

> 对于 Hystrix 的全局配置同 Spring Cloud Ribbon 的全局配置一样，直接使用它的默认配置前缀 `hystrix.command.default` 就可以进行设置，比如设置全局的超时时间：

```properties
hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds=5000
```

::: tip 注意

在设置之前，需要确认 feign.hystrix.enabled 参数没有设置为 false，否则该参数设置会关闭 Feign 客户端的 Hystrix 支持。

:::

### 服务降级配置

Hystrix 中的容错、服务降级等功能，在 OpenFeign 中一样要使用。首先定义服务降级的方法：

```java
@Component
@RequestMapping("/marico")  //这里接口定义了两次，因此加一个请求前缀（自定义），防止地址接口重复
public class HelloServiceFallback implements HelloService {

    @Override
    public String hello() {
        return "error";
    }

    @Override
    public String hello2(String name) {
        return "error2";
    }

    @Override
    public User addUser2(User user) {
        return null;
    }

    @Override
    public void deleteUser2(Integer id) {

    }

    @Override
    public void getUserByName(String name) throws UnsupportedEncodingException {

    }
}
```

然后，在 HelloService 中配置这个服务降级类：

```java
@FeignClient(value = "provider",fallback = HelloServiceFallback.class)
public interface HelloService extends IUserService {
}
```

最后，在 application.properties 中开启 Hystrix：

```properties
feign.hystrix.enabled=true
```

我们不启动provider进行测试

![](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/image-20221105195451333.png)

也可以通过自定义 FallbackFactory 来实现请求降级：

```java
Component
public class HelloServiceFallBackFactory implements FallbackFactory<HelloService> {
    @Override
    public HelloService create(Throwable throwable) {
        return new HelloService() {
            @Override
            public String hello() {
                return "error---";
            }

            @Override
            public String hello2(String name) {
                return "error2---";
            }

            @Override
            public User addUser2(User user) {
                return null;
            }

            @Override
            public void deleteUser2(Integer id) {

            }

            @Override
            public void getUserByName(String name) throws UnsupportedEncodingException {

            }
        };
    }
}
```

```java
@FeignClient(value = "provider",fallbackFactory = HelloServiceFallBackFactory.class)
public interface HelloService extends IUserService {
}
```

### 禁用 Hystrix

> 如果我们不想全局关闭 Hystrix 支持，而只是想针对某个客户端关闭 Hystrix 支持时，需要通过使用 `@Scope("prototype")` 注解为指定的客户端配置 Feign.Builder 实例。

- 构建一个关闭 Hystrix 的配置类

```java
@Configuration
public class DisableHystrixConfiguration {

    @Bean
    @Scope("prototype")
    public Feign.Builder feignBuilder() {
        return Feign.builder();
    }
}
```

- 在 HelloService 的 `@FeignClient` 注解中，通过 configuration 参数引入上面实现的配置

```java
@FeignClient(value = "provider",fallback = HelloServiceFallback.class,configuration = DisableHystrixConfiguration.class)
public interface HelloService extends IUserService {
}
```

- 测试

![image-20221105202054048](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/image-20221105202054048.png)

即使我们已经添加了给 Feign 客户端指定了降级类，但却不生效。

## 日志配置

OpenFeign 中，我们可以通过配置日志，来查看整个请求的调用过程。日志级别一共分为四种：

1. NONE：不开启日志，默认就是这个

2. BASIC：记录请求方法、URL、响应状态码、执行时间

3. HEADERS：在 BASIC 的基础上，加载请求/响应头

4. FULL：在 HEADERS 基础上，再增加 body 以及请求元数据。

四种级别，可以通过 Bean 来配置：

```java
@SpringBootApplication
@EnableFeignClients
public class OpenfeignApplication {

    public static void main(String[] args) {
        SpringApplication.run(OpenfeignApplication.class, args);
    }

    /*开启日志*/
    @Bean
    Logger.Level loggerLevel(){
        return Logger.Level.FULL;
    }

}
```

在 application.properties 中开启日志级别：

```properties
logging.level.com.marico.openfeign.HelloService=debug
```

访问接口，进行测试：

![image-20221105200124041](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/image-20221105200124041.png)

## 请求压缩

```properties
# 开启请求的数据压缩
feign.compression.request.enabled=true
# 开启响应的数据压缩
feign.compression.response.enabled=true
# 压缩的数据类型
feign.compression.request.mime-types=text/html,application/json
# 压缩的数据下限，2048表示刚要传输的数据大于2048时，才会进行数据压缩
feign.compression.request.min-request-size=2048
```

