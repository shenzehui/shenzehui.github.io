---
title: Spring 精选面试题🔥
tag: Spring
category:
  - 面试题
  - 框架
article: false
---

## Spring Boot、Spring MVC 和 Spring 有什么区别？

Spring 是 IOC 容器，用来管理 Bean，使用依赖注入实现控制反转，可以很方便整合各种框架，提供 AOP 机制弥补 OOP 的代码重复问题、更方便将不同类不同方法中的共同处理抽取切面、自动注入给方法执行，比如日志、异常等。

springmvc 是 spring 对 web 框架的一个解决方案，提供了一个总的前端控制器 Servlet，用来接收请求，然后定义了一套路由策略（url 到 handled 的映射）及适配执行 handle，将 handle 结果使用视图解析器技术生成视图展示给前端。

springboot 是 spring 提供的一个快速开发工具包，让程序员更方便，更快速的开发 spring + springmvc 应用，简化了配置（约定了默认配置），整合了一系列解决方案（starter 机制）、redis、mongodb、es，可以开箱即用。

## ApplicatoinContext 和 BeanFactory 有什么区别？

BeanFactory 是 Spring 中非常核心的组件，表示 Bean 工厂，可以生成 Bean，维护 Bean，而 ApplicationContext 继承了 BeanFactory，所以 ApplictaionContext 拥有 BeanFactory 所有的特点，也是 Bean 工厂，但是 ApplicationContext 除了继承 BeanFactory 之外，还继承了诸如 Environment、MessageSource、ApplicationEventPublish 等接口，从而 ApplicationContxt 还有获取系统环境变量、国际化、事件发布等功能，这是 BeanFactory 所不具备的。

ApplictaionConetxt 提供了更完善的功能：

① 继承 MessageSource，因此支持国际化

② 统一的资源文件访问方式

③ 提供在监听器中注册 bean 的事件

④ 同时加载多个配置文件

⑤ 载入多个（有继承关系）上下文，使得每一个上下文都专注于特定的层次，比如应用 web 层。

- BeanFactory 采用的是**延迟加载**形式来注入 Bean 的，即只有在使用到某个 Bean 时（调用 getBea()），才对该 Bean 进行加载实例化。这样，我们就不能发现一些存在的 Spring 配置问题。如果 Bean 的某一个属性没有注入，BeanFactory 加载后，知道第一个使用调用 getBean() 方法才会抛出异常。

- ApplicationContext，它是在容器启动时，一次性创建了所有的 Bean。这样，在容器启动时，我们就可以发现 Spring 中存在的配置错误，这样有利于检查所依赖属性是和否注入。ApplicationContext 启动后预载入所有的单实例 Bean，通过预载入单实例 Bean，确保当前你需要的时候，你就不用等待，因为它们已经创建好了。
- 相对于基本的 BeanFactory，ApplicationContext 唯一的不足时占用内存空间。当应用的程序配置 Bean 较多时，程序启动较慢。
- BeanFactory 通常以编程的方式被创建，ApplicationContext 还能以声明的方式创建，如使用 ConetxtLoader。
- BeanFactory 和 ApplicationContext 都支持 BeanPostProcessor、BeanFactoryPostProcessor 的使用，但两者区别是：BeanFactory 需要手动注册，而 ApplicationContext 则是自动注册。

## Spring MVC 的底层工作原理

1. 用户发送请求至前端控制器 DispatcherServlet。
2. DispatcherServlet 收到请求调用 HandlerMapping 处理器映射器。
3. 处理器映射器找到具体的处理器（可以根据 xml 配置、注解进行查找），生成处理器以及处理器拦截器（如果有则生成）一并返回给 DispatcherServlet。
4. DispatcherServlet 调用 HandlerAdapter 处理器适配器。
5. HandlerAdapter 经过适配器调用具体的处理器（Controller，也叫后端控制器）
6. Controller 执行完成后返回 ModelAndView。
7. HandlerAdapter 将 controller 执行结果 ModeAndView 返回给 DispatcherServlet。
8. DispatcherServlet 将 ModeAndView 传给 ViewResolver 视图解析器。
9. ViewResolver 解析后返回具体 View。
10. DispatcherServlet 根据 View 进行渲染视图（即将根据模型数据填充至视图中）。
11. DispatcherServlet 响应用户。

## Spring Boot 自动配置原理

@Import + @Configuration + Spring spi

自动 配置类由各个 starter 提供，使用 @Configuration + @Bean 定义配置类，放到 META-INF/spring.factories 下 

使用 Spring spi 扫描 META-INF/spring.factories 下的配置类

使用 @Import 导入自动配置类

![image-20221113130132884](https://cdn.jsdelivr.net/gh/itmarico/image-repository/img/image-20221113130132884.png)

## Spring MVC 中的控制器是不是单例模式？如果是，如何保证线程安全？

控制器肯定是单例模式。

单例模式下就会有线程安全问题。

Spring 中保证线程安全的方法

1. 将 scope 设置成非 singleton。prototype，request。
2. 最好的方式是将控制器设置成无状态模式。在控制器中，不要携带数据，但是可以引用无状态的 service 和 dao。

## Sping 框架中的单例 Bean 是线程安全的么？

Spring 中的 Bean 默认是单例模式的，框架并没有对 bean 进行多线程的封装处理。

如果 Bean 是有状态的，那就需要开发人员自己俩进行线程安全的保证，最简单的方法就是改变 bean 的作用域，把 "singleton" 改为 "protopyte"，这样每次请求 Bean 就相当于是 new Bean（）这样就可以保证线程安全了。

- 有状态就是由数据存储功能
- 无状态就是不会保存数据       controller、service 和 dao 层本身并不是线程安全的，只是如果只是调用里面的方法，而且多线程调用一个实例的方法，会在内存中复制变量，这是自己的线程的内存工作，是安全的。

Dao 会操作数据库 Connection，Connection 是带有状态的，比如说数据库事务，Spring 的事务管理器使用 Threadlocal 为不同线程维护了一条独立的 connection 副本，保证线程之间不会互相影响（Spring 是如何保证事务获取同一个 Connection 的）

不要在 bean 中声明任何有状态的实例变量或类变量，如果必须如此，那么就使用 ThreadLocal 把变量变为线程私有的，如果 bean 的实例变量或类变量需要在多个线程之间共享，那么就只能使用 synchronized、lock、CAS 等这些实现线程同步的方法了。

## Spring 框架中都用到了哪些设计模式？

简单工厂：由一个工厂类根据传入的参数，动态决定应该创建哪一个产品类。

> Spring 中的 BeanFactory 就是简单工程模式的体现，根据传入一个唯一的标识来获得 Bean 对象，但是否在传入参数后创建还是传入参数前创建这个要根据聚具体情况来定

工厂方法：

> 实现了 FactoryBean 接口的 bean 是一类叫做 factory 的 bean，其特点是：**spring 会在使用 getBean()** 调用获得该 bean 时，会自动调用该 **bean 的 getObject()** 方法，所以返回的不是 factory 这个 bean，而是这个 **bean.getObject() 方法的返回值**。

单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点

> spring 对单例的实现：spring 中的单例模式完成了后半句话，即提供了全局的访问点 BeanFactory。但没有从构造器级别去控制单例，这是因为 spring 管理的是任意的 java 对象。

适配器模式：

> Spring 定义了一个适配器接口，使得每一种 Controller 有一种对应的适配器实现类，让适配器代替 controller 执行相应的方法，这样的扩展 Controller 时，只需要增加一个适配器类就完成了 SpringMVC 的扩展了。

装饰器模式：动态地给一个对象添加一个额外的职责。就增加功能来说，Decorator 模式相比生成子类更为灵活。

> Spring 中用到的包装器模式在类名上有两种表现：一种是类名中含有 Wrapper，另一种是类名含有 Decorator

动态代理：

> 切面在应用运行的时候被织入，一般情况下，在织入切面时，AOP 容器会为目标对象创建一个代理对象。SpringAOP 就是以这种方式织入切面的。
>
> 织入：把切面应用到目标对象并创建新的代理对象的过程。

观察者模式：

> spring 的事件驱动模型使用的是观察者模式，Spring 中 Observer 模式常用的地方是 listener 的实现。

策略者模式：

> Spring 框架的资源访问 Resource 接口。该接口提供了更强的资源访问能力，Spring 框架本身大量使用了 Resource 接口来访问底层资源。

## 👍 基础篇

### Spring 是什么？特性？有哪些模块？

![image-20221128084758739](https://s1.vika.cn/space/2022/11/28/35e5394158f7405798e3c00d563744e3)

一句话概况：**Spring 是一个轻量级、非侵入式的控制反转（IoC）和面向切面（AOP）的框架**。

2003 年，⼀个⾳乐家 Rod Johnson 决定发展⼀个轻量级的 Java 开发框架， Spring 作为 Java 战场 的龙骑兵渐渐崛起，并淘汰了 EJB 这个传统的重装骑兵。

![image-20221128084917411](https://s1.vika.cn/space/2022/11/28/ea0790e05d2f4641aa13f70532331721)

到了现在，企业级开发的标配基本就是 Spring5 + Spring Boot 2 + JDK 8

> Spring 有哪些特性呢？

Spring 有很多优点：

![image-20221128085405178](https://s1.vika.cn/space/2022/11/28/5083268448d842709d97f1903b632b99)

**1. IoC 和 DI 的支持**

Spring 的核心就是一个大的工厂容器，可以维护所有对象的创建和依赖关系，Spring 工厂用于生成 Bean，并且管理 Bean 的生命周期，实现高内聚低耦合的设计理念。

**2. AOP 编程的支持**

Spring 提供了面向切面编程，可以方便的实现对程序进行权限拦截、运行监控等切面功能。

**3. 声明式事务的支持**

支持通过配置就来完成对事务的管理，而不需要通过硬编码的方式，以前重复的一些事务提交。回滚的 JDBC 代码，都可以不用自己写了。

**4. 快捷测试的支持**

Spring 对 Junit 提供支持，可以通过注解快捷的测试 Spring 程序。

**5. 快速集成功能**

方便集成各种优秀框架，Spring 不排除各种优秀的开源框架，其内部提供了对各种优秀框架（如：Structs、Hibernate、MyBatis、Quartz 等）的直接支持。

**6. 复杂 API 模块安装**

Spring 对 JavaEE 开发中非常难用的一些 API（JDBC、JavaMail、远程调用等）都提供了模块化的封装，这些封装 API 的提供使得应用难度大大降低。

### Spring 有哪些模块呢？

Spring 框架是分模块存在，除了最核心的 `Spring Core Container` 是必要模块之外，其他模块都是`可选`，大约有 20 多个模块。

![image-20221128090519772](https://s1.vika.cn/space/2022/11/28/daeba07e5fb44fd5b1acd34315b4c02a)

最主要的七大模块：

1. Spring Core：Spring 核⼼，它是框架最基础的部分，提供 IOC 和依赖注⼊ DI 特性。 
2.  Spring Context：Spring 上下⽂容器，它是 BeanFactory 功能加强的⼀个⼦接⼜。 
3.  Spring Web：它提供 Web 应⽤开发的⽀持。 
4. Spring MVC：它针对 Web 应⽤中 MVC 思想的实现。 
5. Spring DAO：提供对 JDBC 抽象层，简化了 JDBC 编码，同时，编码更具有健壮性。 
6.  Spring ORM：它⽀持⽤于流⾏的 ORM 框架的整合，⽐如：Spring + Hibernate、Spring + iBatis、Spring + JDBC 的整合等。 
7. Spring AOP：即⾯向切⾯编程，它提供了与 AOP 联盟兼容的编程实现。

### Spring 有哪些常用注解呢？

Spring 有很多模块，甚至广义的 Spring Boot、Spring Cloud 也算是 Spring 的一部分，我们来分模块，按功能看一下常用的注解：

![yuque_diagram (1)](https://s1.vika.cn/space/2022/11/29/304e5f1bf4d2449485b3389958ce3a2a)

**Web：**

- @Controller：组合注解（组合了 @Component 注解），应用在 MVC 层（控制层）。
- @RestController：该注解为⼀个组合注解，相当于 @Controller 和 @ResponseBody 的组合， 注解在类上，意味着，该 Controller 的所有方法都默认加上了@ResponseBody。
- @RequestMapping：用于映射 Web 请求，包括访问路径和参数。如果是 Restful 风格接口，还可以根据请求类型使用不同的注解： 
  - @GetMapping 
  - @PostMapping 
  - @PutMapping 
  - @DeleteMapping
- @ResponseBody：支持将返回值放在 response 内，而不是⼀个页面，通常用户返回 json 数据。
- @RequestBody：允许 request 的参数在 request 体中，而不是直接连接在地址后面。
- @PathVariable：用于接收路径参数，比如`@RequestMapping(“/hello/{name}”)` 申明的路径，将注解放在参数中前，即可获取该值，通常作为 Restful 的接口实现方法。
- @RestController：该注解为一个组合注解，相当于 @Controller 和 @ResponseBody 的组合，注解在类上，意味着，该 Controller 的所有方法都默认加上了 @ResponseBody。

**容器：**

- @Component：表示一个带注释的类是一个“组件”，成为 Spring 管理的 Bean。当使用基于注解的配置和类路径扫描时，这些类被视为自动检测的候选对象。同时@Component 还是一个元注解。
- @Service：组合注解（组合了@Component注解），应用在 service 层（业务逻辑层）。
- @Repository：组合注解（组合了@Component注解），应用在 dao 层（数据访问层）。
- @Autowired：Spring 提供的工具（由 Spring 的依赖注入工具（BeanPostProcessor、BeanFactoryPostProcessor）自动注入）。
- @Qualifier：该注解通常跟 @Aurowired 一起使用，当想对注入的过程做更多的控制、@Qualifier 可帮助配置，比如两个以上相同类型的 Bean 时 Spring 无法抉择，用到此注解。
- @Configuration：声明当前类是一个配置类（相当于一个 Spring 配置的 xml 文件）
- @Value：可用在字段，构造器参数跟方法参数，指定一个默认值，支持 `#{}，${}` 两个方式。一般将 SpringBoot 中的 appliction.properties 配置的属性值赋给变量。
- @Bean：注解在方法上，声明当前方法的返回值为一个 Bean。返回的 Bean 对应的类中可以定义 init() 方法和 destory() 方法，然后 `@Bean(initMethod=”init”,destroyMethod=”destroy”)`定义 ，在构造之后执行 init，在销毁之前执行 destory。
- @Scope：定义我们采用什么模式去创建 Bean（方法上、得有 @Bean）其设置类型包括：Singleton、Prototype、Request、Session、GlobalSession。

**AOP：**

- @Aspect：声明一个切面（类上）使用 @After、@Before、@Around 定义建言（advice），可直接将拦截规则（切点）作为参数。
  - @After：在方法执行之后执行（方法上）。
  - @Before：在方法执行之前执行（方法上）。
  - @Around：在方法执行之前与之后执行（方法上）。
  - @PointCut：声明切点在 java 配置类中使用 @EnableAspectJAutoProxy 注解开启 Spring 对 Aspectj 代理的支持（类上）。

**事务：**

- @Transactional：在要开启事务的方法上使用 @Transactional 注解，即可声明式开启事务。

### Spring 中应用了哪些设计模式呢？

Spring 框架中广泛使用了不同类型的设计模式，下面我们来看看到底有哪些 设计模式？

![image-20221129185929693](https://s1.vika.cn/space/2022/11/29/084125adaf7d4014897675a238a7351f)

1. 工厂模式：Spring 容器本质是一个大工厂，使用工厂模式通过 BeanFactory，ApplictionContext 创建 bean 对象。
2. 代理模式：Spring AOP 功能就是通过代理模式来实现的，分为动态代理和静态代理。
3. 单例模式：Spring 中的 Bean 默认就是单例的，这样有利于容器对 Bean 的管理。
4. 模板模式：Spring 中 JdbcTemplate、RestTemplate 等以 Template 结尾的对数据库、网络等进行操作的模板类，就使用到了模板模式。
5. 观察者模式：Spring 事件驱动模型就是观察者模式很经典的一个应用。
6. 适配器模式：Spring AOP 的增强或通知（Adivce）使用到了适配器模式、Spring MVC 中也是用到了适配器模式去适配 Controller。
7. 策略模式：Spring 中有一个 Resource 接口，它的不同实现类，会根据不同的策略去访问资源。

## 👍 IOC

### 说一说什么是 IOC？什么是 DI？

Java 是面向对象的编程语言，一个个实例对象互相合作组成了业务逻辑，原来，我们都是在代码里创建对象和对象的依赖。

所谓的 **IOC**（控制反转）：就是由容器来负责控制对象的生命周期和对象间的关系。以前是我们想要什么，就自己创建什么，现在是我们需要什么，容器就给我们送来什么。

也就是说，控制对象生命周期的不再是引用它的对象，而是容器。对具体对象，以前是它控制其它对象，现在所有对象都被容器控制，所以这叫控制反转。

![image-20221129191151346](https://s1.vika.cn/space/2022/11/29/5c7ea1940e5b4a49b2cf05cb3646a99d)

**DI**（依赖注入）：指的是容器在实例化对象的时候把它依赖的类注入给它。有的说法 IC 和 DI 是一回事，有的说法是  IOC 是思想，DI 是 IOC 的实现。

> 为什么要使用 IOC 呢？

最主要的是两个字**解耦**，硬编码会造成对象间的过渡耦合，使用 IOC 之后，我们可以不用关心对象间的依赖，专心开发应用就行。

### 能简单说一下 Spring IoC 的实现机制吗？

PS：这道题老三在面试题中被问到过，问法是"你有自己实现过简单的 Spring 吗？"

Spring 的 IOC 本质就是一个大工厂，我们想想一个大工厂是怎么运行的呢？

![image-20221129191829768](https://s1.vika.cn/space/2022/11/29/79288ba88b3b4444b0b5fa3eb8746c69)

- 生产产品：一个工厂最核心的功能就是生产产品。在 Spring 里，不用 Bean 自己来实例化，而是交给 Spring，应该怎么实现呢？——答案毫无疑问，反射。

  那么这个厂子的生产管理是怎么做的？你应该也知道——工厂模式

- 库存产品：工厂一般都是有库房的，用来库存产品，毕竟生产的产品不能立马就拉走。Spring 我们都知道是一个容器，这个容器里存的就是对象，不能每次来取对象，都得现场来反射创建对象，得把创建出的对象存起来。

- 订单处理：还有最重要的一点，工厂根据什么来提供产品呢？订单。这些订单可能五花八门，有线上签的、有道工厂签的、还有工厂销售上面签约... ...最后经过处理，指导工厂的出货。

  在 Spring 里，也有这样的订单，它就是我们 bean 的定义和依赖关系，可以是 xml 形式，也可以是我们最熟悉的注解形式。

我们简单地实现一个 mini  版的 Spring IOC：

![image-20221129192548758](https://s1.vika.cn/space/2022/11/29/6accd17bcb8e4b308c40c98f7cd10dd4)

**Bean 定义：**

Bean 通过一个配置文件定义，把它解析成一个类型。

- beans.properties

  偷懒，这里直接用了最方便解析的 properties，这里直接用一个 `<key，value>`

## 公众号

 ![](https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff)
