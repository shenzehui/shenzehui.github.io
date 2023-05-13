---
article: false
title: Spring Cloud Ribbon 服务容错保护
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## Hystrix 基本介绍

> `Hystrix` 叫做`断路器/熔断器`。微服务系统中，整个系统出错的概率非常高，因为在微服务系统中，涉及到的模块太多了，每一个模块出错，都有可能导致整个服务出问题，当所有模块都稳定运行时，整个服务才算是稳定运行。
>
> 我们希望当整个系统中，某一个模块无法正常工作时，能够通过我们提前配置的一些东西，来使得整个系统正常运行，即单个模块出问题，不影响整个系统。

**Hystrix 作用：**

- `服务降级`：用户请求 A 服务，A 服务调用 B 服务，当B服务出现故障或者在特定的时间段内不能给 B 服务响应，为了避免 A 服务因等待 B 服务而产生阻塞，A 服务就不等 B 服务的结果了，直接给用户一个降级响应
- `服务熔断`：用户请求 A 服务，A 服务调用 B 服务，当 B 服务出现故障的频率过高达到特定阈值(5s 20次) 时，当用户再请求 A 服务时，`A 服务`不再调用 B 服务，`直接给用户一个降级服务`

![image-20230513225919411](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513225919411.png)

> 上图中，在服务消消费者 A 服务加入**熔断器**，如果 B 服务出现故障且频率达到一个特定的**阈值**，熔断器就断开熔断器一旦断开，服务消费者 A 服务在接收用户请求时将**不再调用 B 服务**，从而减少请求在 A 服务的阻塞。

**Hystrix 熔断器的三种状态：**

![image-20230513230210606](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513230210606.png)

> - 熔断器默认为闭合（close）状态，当用户请求 A 服务时，A 服务调用 B 服务，如果 B 服务在设定的时间不能给 A 服务响应，A 服务则使用降级方案响应，同时记录 B 服务的故障
> - 当 B 服务的故障率达到阈值（Hystrix默认 5s/20次），熔断器就会被断开进入"打开"（open）状态
> - 当熔断器为"打开"（open）状态时，用户请求A服务，A服务不再调用B服务，而是之间进行降级响应
> - 状态"打开"（open）状态的熔断器经过一个时间周期后进入"半开状态"（half open）
> - 当容器为"半开"（half open）状态时，当用户请求 A 服务时，A 服务会对 B 服务进行一次调用
>   - 如果 B 服务成功响应 A 服务，熔断器则进入闭合（close）状态
>   - 如果 B 服务响应失败，熔断器则回到打开（open）状态，再进入一个周期的熔断

**熔断和降级的区别**：

熔断：消费者不再调用提供者（A 不再调用 B） 
降级：调用提供者 B，只是 B 没有给出响应，给用户一个降级服务

## 基本用法

首先创建一个名叫 Hystrix 的 Spring Boot 模块，添加如下依赖

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
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```

项目创建成功后，添加如下配置，将 Hystrix 注册到 Eureka 上

```properties
# 应用名称
spring.application.name=hystrix
# 应用服务 WEB 访问端口
server.port=3000
eureka.client.service-url.defaultZone=http://localhost:1111/eureka
```

然后，在项目启动类上添加如下注解，开启断路器，同时提供一个 RestTemplate 实例

```java
@SpringBootApplication
@EnableCircuitBreaker
public class HystrixApplication {

    public static void main(String[] args) {
        SpringApplication.run(HystrixApplication.class, args);
    }

    @Bean
    @LoadBalanced
    RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

启动类上的注解，也可以使用 `@SpringCloudApplication` 代替：

```java
@SpringBootApplication
@EnableCircuitBreaker
public class HystrixApplication {

    public static void main(String[] args) {
        SpringApplication.run(HystrixApplication.class, args);
    }

    @Bean
    @LoadBalanced
    RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

这样，Hystrix 的配置就算完成了。接下来提供 Hystrix 的接口。

```java
@Service
public class HelloService {

    @Autowired
    RestTemplate restTemplate;

    @HystrixCommand(fallbackMethod = "error")
    public String hello(){
        int i = 1/0;
        return restTemplate.getForObject("http://provider/hello", String.class);
    }

    public String error(){
        return "error";
    }
}
```

> **说明：**在 hello 方法中，我们将发起一个远程调用，去调用 provider 中提供的 hello 接口。但是，这个调用可能会失败。因此，我们在这个方法上添加 `@HystrixCommand` 注解，配置 `fallbackMethod` 属性，这个属性表示该方法调用失败时的替代方法

访问接口

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

**Hystrix 作用演示**

分别启动 eureka、provider 和 hystrix 模块，待完全启动之后，访问 http://localhost:3000/hello 接口，该接口调用 service 中的 hello 方法，由于 ` int i = 1/0;`  会出错，导致该方法调用失败。该方法会调用名叫 error 的替代方法，执行该方法，返回结果给控制器方法。

**注意：这里的 error 方法的返回值应该与 hello 方法的返回值保持一致**

## 请求命令

> 请求命令就是以继承类的方式来替代前面的注解方式。

```java
// 这里泛型就是访问的返回结果
public class HelloCommand extends HystrixCommand<String> {

    @Autowired
    RestTemplate restTemplate;

    public HelloCommand(Setter setter, RestTemplate restTemplate) {
        super(setter);
        this.restTemplate = restTemplate;
    }

    @Override
    protected String run() throws Exception {
        return restTemplate.getForObject("http://provider/hello", String.class);
    }
}
```

在控制器中调用该方法

```java
@GetMapping("/hello2")
public void hello2(){
    // 方式一: 直接执行
    HystrixRequestContext ctx = HystrixRequestContext.initializeContext();
    HelloCommand helloCommand = new HelloCommand(HystrixCommand.Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("marico")), restTemplate,"marico");

    String execute = helloCommand.execute(); 
    System.out.println(execute);

    // 方式二: 先入队，后执行
    HelloCommand helloCommand2 = new HelloCommand(HystrixCommand.Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("marico")), restTemplate,"marico");
    try {
        Future<String> queue = helloCommand2.queue();
        String s = queue.get();
        System.out.println(s);  
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }
    ctx.close();
}
```

**注意**：两种调用方式只能选择一种，new 出来的 HelloCommand 只能执行一次，方法参数中的 marico 为自定义值，没有实际效果；在第一种方法中，不能使用 `helloCommand.run()`

**最佳实践：通过注解实现异步请求**

前面通过继承实现的是同步请求，要想实现异步请求，首先，定义如下方法，返回 `Future<String> `：

```java
@HystrixCommand(fallbackMethod = "error")
public Future<String> hello2(){
    return new AsyncResult<String>() {
        @Override
        public String invoke() {
            return restTemplate.getForObject("http://provider/hello", String.class)
        }
    };
}
```

然后，调用该方法：

```java
@GetMapping("/hello3")
public void hello3(){
    Future<String> stringFuture = helloService.hello2();
    String s = null;
    try {
        s = stringFuture.get();
        System.out.println(s);
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }
}
```

通过继承的方式使用 Hystrix，如何实现`服务容错/降级`？重写继承类的` getFallback `方法即可！

```java
public class HelloCommand extends HystrixCommand<String> {
    
    RestTemplate restTemplate;

    public HelloCommand(Setter setter, RestTemplate restTemplate) { 
        super(setter);
        this.restTemplate = restTemplate;
    }

    @Override
    protected String run() throws Exception {
        return restTemplate.getForObject("http://provider/hello", String.class);
    }

    @Override
    protected String getFallback() { return "error-extends";
                                   }
}
```

## 异常处理

> 当发起服务调用时，如果不是 provider 的原因导致请求调用失败，而是 consumer 中本身代码有问题导致的请求失败，即 consumer 中抛出了异常，这个时候，也会自动进行服务降级，只不过这个时候降级，我们还需要知道到底是哪里出异常了。

如下示例代码，如果 hello 方法中，执行时抛出异常，那么一样也会进行服务降级，进入到 error 方法中，在 error 方法中，我们可以获取到异常的详细信息：

```java
@Service
public class HelloService {

    @Autowired
    RestTemplate restTemplate;

    @HystrixCommand(fallbackMethod = "error")
    public String hello(){
        int i = 1/0;
        return restTemplate.getForObject("http://provider/hello", String.class);
    }

    public String error(Throwable t){
        return "error" + t.getMessage();
    }
}
```

![image-20230513230834973](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513230834973.png)

以上是`注解`方法，也可以通过`继承`方式实现：

```java
public class HelloCommand extends HystrixCommand<String> {

    @Autowired
    RestTemplate restTemplate;

    public HelloCommand(Setter setter, RestTemplate restTemplate) {
        super(setter);
        this.restTemplate = restTemplate;
    }

    @Override
    protected String run() throws Exception {
        int i = 1 / 0;
        return restTemplate.getForObject("http://provider/hello", String.class);
    }

    @Override
    protected String getFallback() {
        return "error-extends：" + getExecutionException().getMessage();
    }
}
```

![image-20230513230851679](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513230851679.png)

如果是通过继承的方式来做 Hystrix，在 `getFallback` 方法中，我们可以通过` getExecutionException` 方法来获取执行的异常信息。

另一种可能性（作为了解）。如果抛异常了，我们希望异常直接抛出，不要服务降级，那么只需要配置 忽略某一个异常即可：

```java
@HystrixCommand(fallbackMethod = "error",ignoreExceptions = ArithmeticException.class) //忽略异常
public String hello(){
    int i = 1/0;
    return restTemplate.getForObject("http://provider/hello", String.class);
}
```

这个配置表示当 hello 方法抛出 ArithmeticException 异常时，不要进行服务降级，直接将错误抛出。

![image-20230513230922391](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513230922391.png)

## 请求缓存

> 请求缓存就是在服务消费中调用同一个接口，如果参数相同，则可以使用之前缓存下来的数据。

- provider 中的 hello2 接口

```java
@GetMapping("/hello2")
public String hello2(String name) {
    System.out.println(new Date() + ">>>" + name);
    return "hello " + name;
}
```

- 在 hystrix 的请求方法中，添加如下注解：

```java
@HystrixCommand(fallbackMethod = "error2")
@CacheResult
public String hello3(String name){
    return restTemplate.getForObject("http://provider/hello2?name={1}", String.class,name);
}
```

`@CacheResult` 说明：表示该方法的请求结果会被缓存下来，默认情况下缓存的 key 就是方法的参数，缓存的 value 就是方法的返回值。其实，这里的缓存原理与 Spring Cache 的原理一样。

**如何缓存？**

当方法第一次被调用时，会将 key（name值） 和 value（方法的返回值）缓存下来，当方法再次被调用时，会将进来的 key（也就是参数 name 值）与被缓存下来的 name 值比较，若相同，直接返回该 key 对应的 value 值（被缓存的 value）；若不相同，执行方法逻辑，将方法返回值缓存。

- 控制中执行该方法

![image-20230513231017003](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513231017003.png)

调用发现抛出没有初始化 `HystrixRequestContext` 异常。一般来说，我们使用缓存，都有一个缓存生命周期这样一个概念。这里也一样，我们需要初始化 `HystrixRequestContext`，初始化完成后，缓存开始生效， `HystrixRequestContext close` 之后，缓存失效。

```java
@GetMapping("/hello4")
public void hello4(){
    /*初始化HystrixRequestContext*/
    HystrixRequestContext ctx = HystrixRequestContext.initializeContext();
    String marico = helloService.hello3("marico");
    marico = helloService.hello3("marico");
    /*close后，缓存失效*/
    ctx.close();
}
```

在` ctx.close()` 之前，缓存是有效的，close 之后，缓存就失效了。也就是说，访问一次 hello4 接口， provider 只会被调用一次（第二次使用的缓存），如果再次调用 hello4 接口，之前缓存的数据是失效的。

![image-20230513231030680](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513231030680.png)

结果只打印了一次，说明第二次请求使用了缓存，但是再次访问接口后，也是同样结果，说明缓存结束了，缓存的周期只能在 init 和 close 之间。

默认情况下，缓存的 key 就是所调用方法的参数，如果参数有多个，就是多个参数组合起来作为缓存的 key。

例如如下方法：

```java
@HystrixCommand(fallbackMethod = "error2")
@CacheResult
public String hello3(String name,Integer age){
    return restTemplate.getForObject("http://provider/hello2?name={1}", String.class,name);
}
```

此时缓存的 key 就是 `name+age`，但是，如果有多个参数，但是又只想使用其中一个作为缓存的 key， 那么我们可以通过 `@CacheKey` 注解来解决。

```java
@HystrixCommand(fallbackMethod = "error2")
@CacheResult
public String hello3(@CacheKey String name, Integer age){
    return restTemplate.getForObject("http://provider/hello2?name={1}", String.class,name);
}
```

上面这个配置，虽然有两个参数，但是缓存时以 name 为准。也就是说，两次请求中，只要 name 一样，即使 age 不一样，第二次请求也可以使用第一次请求缓存的结果。

> 另外还有一个注解叫做 `@CacheRemove()`。在做数据缓存时，**如果有一个数据删除的方法，我们一般除了删除数据库中的数据，还希望能够顺带删除缓存中的数据**，这个时候 @CacheRemove() 就派上用场了。(删除数据时有用)
>
> @CacheRemove() 在使用时，必须指定 `commandKey` 属性，commandKey 其实就是`缓存方法的名字`，**指定了 commandKey，@CacheRemove 才能找到数据缓存在哪里了，进而才能成功删除掉数据。**

例如如下方法定义缓存与删除缓存：

```java
@HystrixCommand(fallbackMethod = "error2")
@CacheResult
public String hello3(String name){
    return restTemplate.getForObject("http://provider/hello2?name={1}", String.class,name);
}

@HystrixCommand(fallbackMethod = "error2")
@CacheRemove(commandKey = "hello3") 
public String deleteUserByName(String name){
    return null;
}

public String error2(String name){
    return "error：javaboy";
}
```

再去调用：

```java
@GetMapping("/hello4")
public void hello4(){
    HystrixRequestContext ctx = HystrixRequestContext.initializeContext();
    String marico = helloService.hello3("marico");
    helloService.deleteUserByName("marico");
    javaboy = helloService.hello3("marico");
    ctx.close();
}
```

![image-20221104095145360](https://s1.vika.cn/space/2022/11/21/dfd900a50ef34d3dbd110858b7342d4d)

如果是继承的方式使用 Hystrix 请求缓存 ，只需要重写 `getCacheKey` 方法即可：

```java
/*指定缓存中的key*/
@Override
protected String getCacheKey() {
    return name;
}
```

调用时候，一定记得初始化 `HystrixRequestContext`

```java
@GetMapping("/hello2")
public void hello2(){
    HystrixRequestContext ctx = HystrixRequestContext.initializeContext();
    HelloCommand helloCommand = new HelloCommand(HystrixCommand.Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("marico")), restTemplate,"marico");

    String execute = helloCommand.execute(); 
    System.out.println(execute);

    HelloCommand helloCommand2 = new HelloCommand(HystrixCommand.Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("javaboy")), restTemplate,"marico");
    try {
        Future<String> queue = helloCommand2.queue();
        String s = queue.get();
        System.out.println(s);  
    } catch (InterruptedException e) {
        e.printStackTrace();
    } catch (ExecutionException e) {
        e.printStackTrace();
    }
    ctx.close();
}
```

![image-20230513231056561](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513231056561.png)

## 请求合并

> 如果在服务消费中，频繁的调用 provider 中的同一个接口，在调用时，只是参数不一样，那么在这种情况下，我们可以将多个请求合并成一个，这样就可以有效提高发送的效率。

```java
@RestController
public class UserController {
    @GetMapping("/user/{ids}") // 假设consumer 传过来的多个id 的格式是 1,2,3,4,5....
    public List<User> getUserByIds(@PathVariable String  ids){
        String[] split = ids.split(",");
        List<User> users = new ArrayList<>();
        for (String s : split) {
            User user = new User();
            user.setId(Integer.parseInt(s));
            users.add(user);
        }
        return users;
    }
}
```

这个接口既可以处理合并之后的请求，也可以处理单个请求（单个请求的话，List  集合中就只有一项数据）

然后，在 Hystrix 中，定义 UserService：

```java
@Service
public class UserService {

    @Autowired
    RestTemplate restTemplate;

    public List<User> getUserByIds(List<Integer> ids){
        User[] users = restTemplate.getForObject("http://provider/user/{1}", User[].class, StringUtils.join(ids, ","));
        return Arrays.asList(users);
    }
}
```

接下来定义` UserBatchCommand `，相当于我们之前的 HelloCommand：

```java
public class UserBatchCommand extends HystrixCommand<List<User>> {
    private List<Integer> ids;
    private UserService userService;

    public UserBatchCommand(List<Integer> ids, UserService userService) {
        super(HystrixCommand.Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("batchCmd")).andCommandKey(HystrixCommandKey.Factory.asKey("bathckey")));
        this.ids = ids;
        this.userService = userService;
    }

    @Override
    protected List<User> run() throws Exception {
        return userService.getUserByIds(ids);
    }
}
```

最后，定义最最关键的请求合并方法：

```java
// 通过继承 HystrixCollapser 实现请求合并器
public class UserCollapseCommand extends HystrixCollapser<List<User>,User,Integer> {

    private UserService userService;
    private Integer id;

    public UserCollapseCommand(Setter setter, UserService userService, Integer id) {
        super(HystrixCollapser.Setter.withCollapserKey(HystrixCommandKey.Factory.asKey("UserCollapseCommand")).andCollapserPropertiesDefaults(HystrixCollapserProperties.Setter().withTimerDelayInMilliseconds(200)));
        this.userService = userService;
        this.id = id;
    }

    /**
    * 请求参数
    */
    @Override
    public Integer getRequestArgument() {
        return id;
    }

    /**
    * 请求合并的方法
    */
    @Override
    protected HystrixCommand<List<User>> createCommand(Collection<CollapsedRequest<User, Integer>> collection) {
        List<Integer> ids = new ArrayList<>(collection.size());
        for (CollapsedRequest<User, Integer> userIntegerCollapsedRequest : collection) {
            ids.add(userIntegerCollapsedRequest.getArgument());
        }
        return new UserBatchCommand(ids, userService);
    }

    /**
     * 请求结果分发
     * @param users provider 返回结果
     * @param collection  请求对象
     */
    @Override
    protected void mapResponseToRequests(List<User> users, Collection<CollapsedRequest<User, Integer>> collection) {
        int count = 0;
        for (CollapsedRequest<User, Integer> request : collection) {
            request.setResponse(users.get(count++));
        }
    }
}
```

最后就是测试调用：

```java
@Autowired
UserService userService;

@GetMapping("/hello5")
public void hello5() throws ExecutionException, InterruptedException {
    HystrixRequestContext ctx = HystrixRequestContext.initializeContext();
    UserCollapseCommand command1 = new UserCollapseCommand(userService, 99);
    UserCollapseCommand command2 = new UserCollapseCommand(userService, 98);
    UserCollapseCommand command3 = new UserCollapseCommand(userService, 97);
    UserCollapseCommand command4 = new UserCollapseCommand(userService, 96);
    Future<User> q1 = command1.queue();
    Future<User> q2 = command2.queue();
    Future<User> q3 = command3.queue();
    Future<User> q4 = command4.queue();
    User u1 = q1.get();
    User u2 = q2.get();
    User u3 = q3.get();
    User u4 = q4.get();
    System.out.println(u1);
    System.out.println(u2);
    System.out.println(u3);
    System.out.println(u4);
    ctx.close();
}
```

前面是通过继承的方式实现，接下来我们通过注解实现请求合并

```java
@Service
public class UserService {

    @Autowired
    RestTemplate restTemplate;

    @HystrixCommand
    public List<User> getUserByIds(List<Integer> ids){
        User[] users = restTemplate.getForObject("http://provider/user/{1}", User[].class, StringUtils.join(ids, ","));
        return Arrays.asList(users);
    }

    /**
     * 批处理注解  batchMethod 指定批处理方法  collapserProperties key 和 value 
     * @param id  
     * @return
     */
    @HystrixCollapser(batchMethod = "getUserByIds",collapserProperties = {@HystrixProperty(name = "timerDelayInMilliseconds",value = "200")})
    public Future<User> getUserById(Integer id){
        return null;
    }
}
```

这里的核心是 `@HystrixCollapser` 注解。在这个注解中，指定批处理的方法即可。

测试代码如下：

```java
@GetMapping("/hello6")
public void hello6() throws ExecutionException, InterruptedException {
    HystrixRequestContext ctx = HystrixRequestContext.initializeContext();
    Future<User> q1 = userService.getUserById(99);
    Future<User> q2 = userService.getUserById(98);
    Future<User> q3 = userService.getUserById(97);
    Future<User> q4 = userService.getUserById(96);
    User u1 = q1.get();
    User u2 = q2.get();
    User u3 = q3.get();
    User u4 = q4.get();
    System.out.println(u1);
    System.out.println(u2);
    System.out.println(u3);
    System.out.println(u4);
    ctx.close();
}
```

## 拓展：Hystrix 仪表盘

> 通过之前的内容，我们已经体验到了 Spring Cloud 对 Hystrix 的优雅整合，除此之外，Spring Cloud 还完美地整合了它的仪表盘组件 Hystrix Dashboard，它主要用来实时监控 Hystrix 的各项指标信息。通过 Hystrix Dashboard 反馈的实时信息，可以帮助我们快速发现系统中存在的问题，从而及时地采取应对措施。

### 搭建熔断器仪表盘

- 创建SpringBoot项目，添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
    <version>2.2.10.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

- 配置仪表盘的 port 和 appName

```properties
server.port=9999
spring.application.name=hystrix-dashboard
hystrix.dashboard.proxy-stream-allow-list="localhost"
```

- 启动类添加`@EnableHystrixDashboard`注解

```java
@SpringBootApplication
@EnableHystrixDashboard
public class HystrixDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(HystrixDashboardApplication.class, args);
    }

}
```

- 访问`http://localhost:9999/hystrix`

![image-20230513231116094](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513231116094.png)

这是 Hystrix Dashboard 的监控首页，该页面中并没有具体的监控信息。从页面的文字内容中我们可以知道，Hystrix Dashboard 共支持三种不同的监控方式，如下所示。

- **默认的集群监控**：通过 URL http://turbine-hostname:port/turbine.stream 开启，实现对默认集群的监控。
- **指定的集群监控**：通过 URL http://turbine-hostname:port/turbine.stream?cluster=[clusterName] 开启，实现对 clusterName 集群的监控。
- **单体应用的监控**：通过 URL http://hystrix-app:port/hystrix.stream 开启，实现对具体某个服务实例的监控。

前两者都是对集群的监控，需要整合 Turbine 才能实现。在这里，我们主要对单个服务实例的监控。

### 服务添加监控功能

既然 Hystrix Dashboard 监控单实例节点需要通过访问实例的 /hystrix.stream 接口来实现，我们自然需要为服务添加这个端点。

- 在 hystrix 服务模块添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
</dependency>
```

- Java 配置

```java
@Configuration
public class DashBoardConfig {

    @Bean
    public ServletRegistrationBean getServletRegistrationBean(){
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(streamServlet);

        //servlet的xml配置
        servletRegistrationBean.setName("ServletRegistrationBean");
        servletRegistrationBean.setLoadOnStartup(1);
        servletRegistrationBean.addUrlMappings("/actuator/hystrix.stream");

        return servletRegistrationBean;
    }
}
```

- application.yml 中添加

```yml
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

- 连接

![image-20230513231133010](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513231133010.png)

在 Hystrix Dashboard 的首页输入：http://localhost:8002/actuator/hystrix.stream，就可以看到一起动对 hystrix 的监控，单击 Monitor Stream按钮，就可以看到如下页面。

![image-20230513231144358](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513231144358.png)

**踩坑：若出现不了该界面，请先发送一次请求之后再访问。**

## 最后

项目源码地址：

- https://github.com/shenzehui/springcloud-learning/tree/master/hystrix

