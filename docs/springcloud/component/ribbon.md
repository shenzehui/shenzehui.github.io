---
title: Spring Cloud Ribbon 客户端负载均衡
tag:
  - SpringCloud
category:
  - Java 企业级开发
  - Spring Cloud学习教程
---

## 简介

> Spring Cloud Ribbon 是一个基于 HTTP 和 TCP 的客户端负载均衡工具，它基于 Netfilx Ribbon 实现。通过 Spring Cloud 的封装，可以让我们轻松地将面向服务的 REST 的模板请求自动转化成客户端负载均衡的服务调用。Spring Cloud Ribbon 虽然只是一个工具类框架，它不像服务注册中、配置中心、API 网关那样需要独立部署，但是它几乎存在于每一个 Spring Cloud 构建的微服务和基础设施中。所以，对 Spring Cloud Ribbon 的理解和使用，对于我们使用 Spring Cloud 来构建微服务非常重要

## 客户端负载均衡

`客户端负载均衡`，就是调用的客户端本身是知道所有 Server 的详细信息的，当需要调用 Server 上的接口的时候，客户端从自身所维护的 Server 列表中，根据提前配置好的负载均衡策略，自己挑选一个Server 来调用，**此时，客户端知道它所调用的是哪一个 Server**。

![1](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/1.png)

## 服务注册与消费

### 服务注册

##### 新建一个名叫 provider 的模块，作为服务提供者，添加如下依赖

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

##### 配置 applictaion.properties

```properties
spring.application.name=provider
server.port=1113
eureka.client.service-url.defaultZone=http://localhost:1111/eureka
```

##### 定义一个 Hello 接口

```java
@RestController
public class HelloController implements IUserService {
    @Value("${server.port}")
    Integer port;

    @Override
    public String hello() {
        System.out.println(new Date());
        return "hello marico：" + port;
    }
}
```

### 服务消费

##### 新建 consumer 模块，作为服务消费者，添加如下依赖

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

##### 配置 applictaion.properties

```properties
spring.application.name=consumer
server.port=1115
#注册到eureka Server 上
eureka.client.service-url.defaultZone=http://localhost:1111/eureka
```

##### 服务消费

```java
@RestController
public class UseHelloController {
   
    @Autowired
    DiscoveryClient discoveryClient;
    
    @GetMapping("/hello1")
    public String hello1(){
        HttpURLConnection con = null;
        try {
            URL url = new URL("http://localhost:1113/hello");
            con = (HttpURLConnection) url.openConnection();
            if(con.getResponseCode()==200){
                BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String s = br.readLine();
                br.close();
                return s;
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }
}
```

这是一段利用了 ` HttpUrlConnection` 来发起的请求，请求中 provider 的地址写死了，意味着 provider 和 consumer 高度绑定在一起，这个不符合微服务的思想。

要改造它，我们可以借助 Eureka Client 提供的 `DiscoveryClient` 工具，利用这个工具，我们可以根据服务名从 Eureka Server 上查询到一个服务的详细信息，改造后的代码如下：

```java
@GetMapping("/hello2")
public String hello2(){
    List<ServiceInstance> list = discoveryClient.getInstances("provider");
    ServiceInstance instance = list.get(0);
    String host = instance.getHost();
    int port = instance.getPort();
    StringBuffer sb = new StringBuffer();
    sb.append("http://")
            .append(host)
            .append(":")
            .append(port)
            .append("/hello");
    HttpURLConnection con = null;
    try {
        URL url = new URL(sb.toString());
        con = (HttpURLConnection) url.openConnection();
        if(con.getResponseCode()==200){
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String s = br.readLine();
            br.close();
            return s;
        }
    } catch (MalformedURLException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return "error";
}
```

##### 测试

完成上述配置之后，分别启动 eureka-server、provider、consumer 模块，启动完成之后，分别访问 http://localhost:1115/hello1，http://localhost:1115/hello1。结果如下

![image-20221103093308474](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221103093308474.png)

### 集群化部署

**对 provider 进行打包。provider 打包成功之后，我们在命令行启动两个 provider 实例：**

```shell
java -jar provider-0.0.1-SNAPSHOT.jar --server.port=1113 
java -jar provider-0.0.1-SNAPSHOT.jar --server.port=1116
```

启动完成后，检查 Eureka Server 上，这两个 provider 是否成功注册上来

![image-20221103094936450](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221103094936450.png)

注册成功后，在 consumer 中再去调用 provider，DiscoveryClient 集合中，获取到的就不是一个实例了，而是两个实例。这里我们可以手动实现一个负载均衡：

```java
int count = 0;
@GetMapping("/hello3")
public String hello3(){
    List<ServiceInstance> list = discoveryClient.getInstances("provider");
    /*0-1-0-1-0-1*/
    ServiceInstance instance = list.get((count++)% list.size());
    String host = instance.getHost();
    int port = instance.getPort();
    StringBuffer sb = new StringBuffer();
    sb.append("http://")
            .append(host)
            .append(":")
            .append(port)
            .append("/hello");
    HttpURLConnection con = null;
    try {

        URL url = new URL(sb.toString());
        con = (HttpURLConnection) url.openConnection();
        if(con.getResponseCode()==200){
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String s = br.readLine();
            br.close();
            return s;
        }
    } catch (MalformedURLException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return "error";
}
```

测试：

![image-20221103110042313](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221103110042313.png)

![image-20221103110053216](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221103110053216.png)

## RestTemplate 介绍

> RestTemplate 是从 Spring3.0 开始支持的一个 Http 请求工具，这个请求工具和 Spring Boot 无关，更和 Spring Cloud 无关。RestTemplate 提供了常见的 REST 请求方法模板，例如 GET、POST、PUT、DELETE 请求以及一些通用的请求执行方法 exchange 和 execute 方法。

这里的 GET、POST、PUT、DELETE 相当于 Ajax 中的 get、put... 后面两个相当于$.ajax...

> `RestTemplate` 本身实现了 `RestOperations` 接口，而在 RestOperations 接口中，定义了常见的`RESTful` 操作，这些操作在 RestTemplate 中都得到了很好的实现

### GET 请求

第一种：`getForEntity` 函数。

> 该方法返回的是 ResponseEntity，该对象是 Spring 对 HTTP 请求响应的封装，其中主要存储了 HTTP 的几个重要元素，比如 HTTP 请求状态码的枚举对象 HttpStatus（也就是我们常说的 404、500 这些错误码）、在它的父类 HttpEntity 中还存储着 HTTP 请求头的信息对象 HttpHeaders 以及泛型类型的请求体对象。

- 首先我们在 provider 中定义一个 hello2 接口：

```java
@Override
public String hello2(String name) {
    System.out.println(new Date() + ">>>" + name);
    return "hello " + name;
}
```

- 在 consumer 模块的启动类中添加 RestTemplate，并添加 `@LoadBalanced` 注解实现负载均衡

```java
@Bean
@LoadBalanced
RestTemplate restTemplate(){
    return new RestTemplate();
}
```

- 服务消费

```java
@GetMapping("/hello6")
public void hello6() {
    ResponseEntity<String> responseEntity = restTemplate.getForEntity("http://provider/hello2?name={1}", String.class, "marico");
    String body = responseEntity.getBody();
    System.out.println("body = " + body);
    HttpStatus statusCode = responseEntity.getStatusCode();
    /*响应状态码 200 OK*/
    System.out.println("statusCode = " + statusCode);
    /*响应状态码 200*/
    int statusCodeValue = responseEntity.getStatusCodeValue();
    System.out.println("statusCodeValue = " + statusCodeValue);

    /*获取响应头*/
    HttpHeaders headers = responseEntity.getHeaders();
    Set<String> keySet = headers.keySet();
    for (String s : keySet) {
        System.out.println(s + ":" + headers.get(s));
    }
}
```

- 启动服务，访问 http://localhost:1115/hello6

![image-20221103111852573](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221103111852573.png)

![image-20221103111913771](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/image-20221103111913771.png)

第二种：`getForObject` 函数。

> 该方法可以理解为对 getForEntity 的进一步封装，他通过 HttpMessageConverterExtractor 对 Http 的请求响应体 body 内容的进行对象转化，实现请求直接返回包装好的对象内容。

```java
@GetMapping("/hello6")
public void hello6() {
    String result = restTemplate.getForObject("http://provider/hello2?name={1}", String.class, "marico");
    System.out.println("result = " + result);
}
```

**当不需要关注请求响应除 body 外的其他内容时，该函数就非常好用**。

### POST 请求

在 RestTemplate 中，对 POST 请求可以通过如下三个方法进调用实现。

第一种：`postForEntity` 函数。

> 该方法同 GET 请求中的 getForEntity 类型，会在调用后返回 `ResponseEntity<T>` 对象，其中 T 为 请求响应的 body 类型。

第二种：`postForObject` 函数，

> 该方法也根 getForObjetc 的类型相似。

- 在 provider 模块中定义 user1 接口

```java
@PostMapping("/user1")
public User addUser1(User user){
    return user;
}
```

- consumer 消费

```java
@GetMapping("/hello8")
public void hello8() {
    MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
    map.add("username", "marico");
    map.add("password", "123");
    map.add("id", 99);
    ResponseEntity<User> userResponseEntity = restTemplate.postForEntity("http://provider/user1", map, User.class);
    User body = userResponseEntity.getBody();
    System.out.println(body);
    User user = restTemplate.postForObject("http://provider/user1", map, User.class);
    System.out.println("user = " + user);
}
```

- 输出：

```shell
User{id=99, username='marico', password='123'}
User{id=99, username='marico', password='123'}
```

第三种：postForLocation 函数。

> 由于 postForLocation 函数会返回新资源的 URI，该 URI 就相当于指定了返回类型，所以此方法来实现的 POST 请求不需要像 postForEntity 和 postForObject 那样指定 responseType。其他参数用法相同。

- 在 provider 模块中定义如下

```java
@Controller
public class RegisterController {
    @PostMapping("/register")
    public String register(User user){
        return "redirect:http://provider/loginPage?username="+ user.getUsername();
    }

    @GetMapping("/loginPage")
    @ResponseBody
    public String loginPage(String username){
        return "loginPage:" + username;
    }
}
```

- consumer 模块消费接口

```java
@GetMapping("/hello9")
public void hello9() {
    MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
    map.add("username", "marico");
    map.add("password", "123");
    map.add("id", 99);
    URI uri = restTemplate.postForLocation("http://provider/register", map);
    String result = restTemplate.getForObject(uri, String.class);
    System.out.println("result = " + result);
}
```

- 测试

```shell
result = loginPage:marico
```

### PUT、DELETE 请求

> put 函数为 void 类型，所以没有返回内容

```java
@GetMapping("/hello10")
public void hello10() {
    MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
    map.add("username", "marico");
    map.add("password", "123");
    map.add("id", 99);
    restTemplate.put("http://provider/user1", map);
    User user = new User();
    user.setId(98);
    user.setUsername("zhangsan");
    user.setPassword("456");
    restTemplate.put("http://provider/user2", user);
}
```

> 由于我们在进行 REST 请求时，通常将 DELETE 请求的唯一标识拼接在 url 中，所以 DELETE 请求也不需要 reqesut 的 body 信息。

```java
@GetMapping("/hello11")
public void hello11() {
    restTemplate.delete("http://provider/user1?id={1}", 99);
    restTemplate.delete("http://provider/user2/{1}", 99);
}
```

## 负载均衡原理

在 Spring Cloud 中，实现负载均衡非常容易，只需要添加 `@LoadBalanced 注解`即可。只要添加了该注解，一个原本普普通通做` Rest 请求的工具 RestTemplate `就会自动具备负载均衡功能，这个是怎么实现的呢？

**整体上来说，这个功能的实现就是三个核心点：**

1. **从 Eureka Client 本地缓存的服务注册信息中，选择一个可以调用的服务**

2. **根据 1 中所选择的服务，重构请求 URL 地址(将provider替换成要请求的地址)**

3. **将 1、2 步的功能嵌入到 RestTemplate 中**
