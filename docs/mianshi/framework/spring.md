## Spring Boot、Spring MVC 和 Spring 有什么区别？

Spring 是 IOC 容器，用来管理 Bean，使用依赖注入实现控制反转，可以很方便整合各种框架，提供 AOP 机制弥补 OOP 的代码重复问题、更方便将不同类不同方法中的共同处理抽取切面、自动注入给方法执行，比如日志、异常等

springmvc 是 spring 对 web 框架的一个解决方案，提供了一个总的前端控制器 Servlet，用来接收请求，然后定义了一套路由策略（url 到 handled 的映射）及适配执行 handle，将 handle 结果使用视图解析器技术生成视图展示给前端

springboot 是 spring 提供的一个快速开发工具包，让程序员更方便，更快速的开发 spring + springmvc 应用，简化了配置（约定了默认配置），整合了一系列解决方案（starter 机制）、redis、mongodb、es，可以开箱即用

## #{} 和 ${} 的区别是什么？

#{} 是预编译处理，是占位符，${} 是字符串替换，是拼接符。

Mybatis 在处理 #{} 时，会将  sql 中的 #{} 替换为 ？号，调用 PreparedStatement 来赋值；

Mybatis 在处理 ${} 时，就是把 ${} 替换成变量的值，调用 Statement 来赋值；

#{} 的变量替换是在 DBMS 中、变量替换后，#{} 对应的变量自动加上单引号；

${} 的变量替换是在 DBMS 外、变量替换后，${} 对应的变量不会加上单引号；

**使用 #{} 可以有效的防止 SQL 注入，提高系统安全性。；**

## ApplicatoinContext 和 BeanFactory 有什么区别？

BeanFactory 是 Spring 中非常核心的组件，表示 Bean 工厂，可以生成 Bean，维护 Bean，而 ApplicationContext 继承了 BeanFactory，所以 ApplictaionContext 拥有 BeanFactory 所有的特点，也是 Bean 工厂，但是 ApplicationContext 除了继承 BeanFactory 之外，还继承了诸如 Environment、MessageSource、ApplicationEventPublish 等接口，从而 ApplicationContxt 还有获取系统环境变量、国际化、事件发布等功能，这是 BeanFactory 所不具备的。

ApplictaionConetxt 提供了更完善的功能：

① 继承 MessageSource，因此支持国际化

② 统一的资源文件访问方式

③ 提供在监听器中注册 bean 的事件

④ 同时加载多个配置文件

⑤ 载入多个（有继承关系）上下文，使得每一个上下文都专注于特定的层次，比如应用 web 层。

- BeanFactory 采用的是**延迟加载**形式来注入 Bean 的，即只有在使用到某个 Bean 时（调用 getBea()），才对该 Bean 进行加载实例化。这样，我们就不能发现一些存在的 Spring 配置问题。如果 Bean 的某一个属性没有注入，BeanFactory 加载后，知道第一个使用调用 getBean() 方法才会抛出异常

- ApplicationContext，它是在容器启动时，一次性创建了所有的 Bean。这样，在容器启动时，我们就可以发现 Spring 中存在的配置错误，这样有利于检查所依赖属性是和否注入。ApplicationContext 启动后预载入所有的单实例 Bean，通过预载入单实例 Bean，确保当前你需要的时候，你就不用等待，因为它们已经创建好了。
- 相对于基本的 BeanFactory，ApplicationContext 唯一的不足时占用内存空间。当应用的程序配置 Bean 较多时，程序启动较慢。
- BeanFactory 通常以编程的方式被创建，ApplicationContext 还能以声明的方式创建，如使用 ConetxtLoader。
- BeanFactory 和 ApplicationContext 都支持 BeanPostProcessor、BeanFactoryPostProcessor 的使用，但两者区别是：BeanFactory 需要手动注册，而 ApplicationContext 则是自动注册。

## 简述 Mybatis 的插件运行原理，如何编写一个插件？

答：Mybatis 只支持针对 ParameterHander（sql 中所需的参数数据类型转化）、ResultSetHandler（结果集）、StatementHandler（负责设置参数，结果集转换）、Executor（负责生成 sql 语句） 这 4 种接口的插件，Mybatis 使用 JDK 的动态代理，为需要拦截的接口生成代理对象以及实现接口方法拦截功能，每当执行这 4 种接口对象的方法时，就会进入拦截方法，具体就是 InvacationHandler 的 invoke() 方法，拦截那些你指定需要拦截的方法。

- Executor：拦截内部执行器，它负责调用 StatementHandler 操作数据库，并把结果集通过 ResultSetHandler 进行自动映射，另外它还处理了二级缓存的操作；
- StatementHandler：拦截 SQL 语法构建的处理，它是 MyBatis 直接和数据库执行 SQL 脚本的对象，另外它也实现了 MyBatis 的一级缓存；
- ParameterHandler：拦截参数的处理；
- ResultSetHandler：拦截结果集的处理。

编写插件：实现 MyBatis 的 Interceptor 接口并复写 interceptor() 方法，然后在给插件编写注解，指定要拦截哪一个接口的哪些方法，在配置文件中配置编写的插件。

**自定义插件实现示例：**

```java
@Intercepts({@Signature(type = Executor. class, method = "query",
                        args = {MappedStatement. class, Object. class, RowBounds. class, ResultHandler. class})})

public class TestInterceptor implements Interceptor {

    public Object intercept(Invocation invocation) throws Throwable {

        Object target = invocation. getTarget(); //被代理对象

        Method method = invocation. getMethod(); //代理方法

        Object[] args = invocation. getArgs(); //方法参数

        // do something . . . . . .  方法拦截前执行代码块

        Object result = invocation. proceed();

        // do something . . . . . . . 方法拦截后执行代码块

        return result;

    }

}
```

## MyBatis 中存在哪些优点和缺点

优点：

1. 基于 SQL 语句编程，相对灵活，不会对应用程序或者数据库的现有设计造成任何影响，SQL 单独写，解除 sql  与程序代码的耦合，便于统一管理。
2. 与 JDBC 相比，减少了 50% 以上的代码量，消除了 JDBC 大量冗余的代码，不需要手动开关连接；
3. 很好的与各种数据库兼容（因为 MyBatis 使用了 JDBC 来连接数据库，所以只要 JDBC 支持数据库 MyBatis 都支持）。
4. 能够与 Spring 很好的集成；
5. 提供映射标签，支持对象与数据库的 ORM 字段关系映射；提供对象关系映射标签，支持对象关系组件维护。

缺点：

1. SQL 语句的编写工作量较大，尤其当字段多、关联表多时，对开发人员编写 SQL 语句的功底有第一要求。
2. SQL 语句依赖于数据库，导致数据库移植性差，不能随意更换数据库。

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

![image-20221113130132884](../typora-user-images/image-20221113130132884.png)

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