---
article: false
title: Spring 基础 - Spring 核心之控制反转(IoC)
tag: Spring
category:
  - Spring框架
---

## 如何理解 IoC

如果你有精力看英文，首推 Martin Fowler 大师的 [Inversion of Control Containers and the Dependency Injection pattern](https://www.martinfowler.com/articles/injection.html)；其次IoC作为一种设计思想，不要过度解读，而是应该简化理解，所以我这里也整合了 张开涛早前的博客[IoC基础](https://www.iteye.com/blog/jinnianshilongnian-1413846)并加入了自己的理解。

### Spring Bean是什么

> IoC Container 管理的是 Spring Bean，那么 Spring Bean 是什么？

Spring 里面的 bean 就类似是定义的一个组件，而这个组件的作用就是实现某个功能的，这里所定义的 bean 就相当于给了你一个更为简便的方法来调用这个组件来实现你要完成的功能。

### IoC 是什么

> IoC—Inversion  of Control，即“控制反转”，**不是什么技术，而是一种设计思想**。在 Java 开发中，Ioc 意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。

我们来深入分析一下：

- **谁控制谁，控制什么？**

传统 Java SE 程序设计，我们直接在对象内部通过 new 进行创建对象，是程序主动去创建依赖对象；而 IoC 是由专门一个容器来创建这些对象，即由 IoC 容器来控制对象的创建；谁控制谁？当然是 IoC 容器控制了对象；控制什么？那就是主要控制了外部资源获取（不只是对象包括比如文件等）。

- **为何是反转，哪些方面反转了？**

有反转就有正传，传统应用程序是由我们自己在对象中主动控制去直接获取依赖对象，也就是正转；而反转则由容器来帮忙创建及注入依赖对象；为何是反转？因为由容器帮我们查找及注入依赖对象，对象只是被动的接收依赖对象，所以是反转；哪些方面反转了？依赖对象的获取被反转了。

- **用图例说明一下？**

传统程序设计下，都是主动去创建相关对象然后再组合起来：

![img](https://s1.vika.cn/space/2022/12/02/9c43fd1b4b0b45bd93d86b3c9039ab5a)

当有了 IoC/DI 的容器后，在客户端中不再主动去创建这些对象了，如图

![img](https://s1.vika.cn/space/2022/12/02/f0a23a7395214d9facb57e2b1629e0f4)

### IoC 能做什么

> IoC **不是一种技术，只是一种思想**，一个重要的面向对象编程的法则，它能指导我们如何设计出松耦合、更优良的程序。

传统应用程序都是由我们在类内部主动创建依赖对象，从而导致类与类之间高耦合，难于测试；有了 IoC 容器后，把创建和查找依赖对象的控制权交给了容器，由容器进行注入组合对象，所以对象与对象之间是松散耦合，这样也方便测试，利于功能复用，更重要的是使得程序的整个体系结构变得非常灵活。

其实 IoC 对编程带来的最大改变不是代码上，而是从思想上，发送了“主从换位”的变化。应用程序原本是老大 ，要获取什么资源都是主动出击，但是在 IoC/DI 思想中，应用程序就编程被动了，被动的等待 IoC 容器来创建并注入它所需要的资源了。

IoC 很好的体现了面向对象设计法则之一— 好莱坞法则：“别找我们，我们找你”；即由 IoC 容器帮对象找响应的依赖对象并注入，而不是由对象主动去找。

### IoC 和 DI 是什么关系

DI—Dependency Injection，即依赖注入：组件之间依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖注入到组件之中。依赖注入的目的并非为软件系统带来更多的功能，而是为了提升组件重用的频率，并为系统搭建一个灵活，可扩展的平台。通过依赖注入机制，我们只需要通过简单的配置，而无需任何代码就可指定目标需要的资源，完成自身的业务逻辑，而不需要关系具体的资源来自何处，由谁实现。

我们来深入分析一下：

- **谁依赖于谁？**

当然是应用程序依赖于 IoC 容器；

- **为什么需要依赖？**

应用程序需要 IoC 容器来提供对象需要的外部资源；

- **谁注入谁？**

很明显是 IoC 容器注入应用程序某个对象，应用程序依赖的对象；

- **注入了什么？**

就是注入某个对象所需要的外部资源（包括对象、资源、常量数据）。

- **IoC 和 DI 有什么关系？**

其实它们是同一个概念的不同角度描述，由于控制反转概念比较含糊（可能只是理解为容器这一个层面，很难让人想到谁来维护对象关系），所以 2004 年大师级人物 Martin Fowler 又给出了一个新的名字：“依赖注入”，相对 IoC 而言，“依赖注入“明确描述了”被注入对象依赖 IoC 容器配置依赖对象”。通俗来说就是 **IoC 是设计思想，ID 是实现方式。**

## IoC  配置的三种方式

> 总体上目前的主流方式是 **注解 + Java 配置**。

### xml 配置

顾名思义，就是将 bean 的信息配置 xml 文件里，通过 Spring 加载文件为我们创建 bean，这种方式出现很多早前的 SSM 项目中，将第三方类库或者一些配置工具类都以这种方式进行配置，主要原因是由于第三方列不支持 Spring 注解。

- 优点：可以使用于任何场景，结构清晰，通俗易懂
- 缺点：配置繁琐，不易维护，枯燥无味，扩展性差

举例：

1. 配置 xx.xml 文件

2. 声明命名看空间和配置 bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="tech.pdai.springframework.service.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

### Java 配置

将类的创建交给我们配置的 JavaConfig 类来完成，Spring 只负责维护和管理，采用纯 Java 创建方式。其本质就是把在 XML 上的配置声明转移到 Java 配置类中

- **优点**：适用于任何场景，配置方便，因为是纯 Java 代码，扩展性高，十分灵活
- **缺点**：由于是采用 Java 类的方式，声明不明显，如何大量配置，可读性比较差

**举例**：

1. 创建一个配置类，添加 @Configuration 注解声明为配置类
2. 创建方法，方法上加上 @Bean，该方法用于创建实例并返回，该实例创建后会交给 Spring 管理，方法名建议与实例名相同（首字母小写）。注：实例类不需要加任何注解

```java
@Configuration
public class BeansConfig {

    /**
     * @return user dao
     */
    @Bean("userDao")
    public UserDaoImpl userDao() {
        return new UserDaoImpl();
    }

    /**
     * @return user service
     */
    @Bean("userService")
    public UserServiceImpl userService() {
        UserServiceImpl userService = new UserServiceImpl();
        userService.setUserDao(userDao());
        return userService;
    }
}
```

### 注解配置

通过类上加注解的方式，来声明一个类交给 Spring 管理，Spring 会自动扫描带有 @Component ，@Controller，@Service，@Repository 这四个注解的类，然后帮我们创建并管理，前提是需要先配置 Spring 的注解扫描器。

- **优点**：开发便捷，通俗易懂，方便维护。
- **缺点**：具有局限性，对于一些第三方资源，无法添加注解。只能采用 XML 或 JavaConfig 的方式配置

**举例**：

1. 对类添加 @Component 相关的注解，比如 @Controller，@Service，@Repository
2. 设置 ComponentScan 的 basePackage， 比如 `<context:component-scan base-package='tech.pdai.springframework'>`， 或者 `@ComponentScan("tech.pdai.springframework")` 注解，或者 `new AnnotationConfigApplicationContext("tech.pdai.springframework")` 指定扫描的 basePackage。

```java
@Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    @Autowired
    private UserDaoImpl userDao;

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return userDao.findUserList();
    }
}
```

## 依赖注入的三种方式

> 常用的注入方式主要有三种：构造方法注入（Construct注入），setter注入，基于注解的注入（接口注入）

### setter 方式

- **在 XML 配置方式中**，property 都是 setter 方式注入，比如下面的 xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="tech.pdai.springframework.service.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

本质上包含两步：

1.第一步，需要 new UserServiceImpl() 创建对象，所以需要默认构造函数

2.第二步，需要 setUserDao() 函数注入 userDao 的值，所以需要 setUserDao() 函数

所以对应的 service 类是这样的：

```java
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private UserDaoImpl userDao;

    /**
     * init.
     */
    public UserServiceImpl() {
    }

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

    /**
     * set dao.
     *
     * @param userDao user dao
     */
    public void setUserDao(UserDaoImpl userDao) {
        this.userDao = userDao;
    }
}
```

- **在注解和 Java 配置方式下**

```java
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private UserDaoImpl userDao;

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

    /**
     * set dao.
     *
     * @param userDao user dao
     */
    @Autowired
    public void setUserDao(UserDaoImpl userDao) {
        this.userDao = userDao;
    }
}
```

在 Spring3.x 刚推出的时候，推荐使用注入的就是这种，但是这种方式比较麻烦，所以在 Spring4.x 版本中推荐构造函数注入。

### 构造函数

- **在 XML 配置方式中**，`<constructor-arg>` 是通过构造函数参数注入，比如下面的 xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- services -->
    <bean id="userService" class="tech.pdai.springframework.service.UserServiceImpl">
        <constructor-arg name="userDao" ref="userDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>
    <!-- more bean definitions for services go here -->
</beans>
```

本质上是 new UserServiceImple(userDao) 创建对象，所以对应的 service 类是这样的：

```java
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private final UserDaoImpl userDao;

    /**
     * init.
     * @param userDaoImpl user dao impl
     */
    public UserServiceImpl(UserDaoImpl userDaoImpl) {
        this.userDao = userDaoImpl;
    }

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

}
```

- **在注解和 Java 配置方式下**

```java
@Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private final UserDaoImpl userDao;

    /**
     * init.
     * @param userDaoImpl user dao impl
     */
    @Autowired // 这里@Autowired也可以省略
    public UserServiceImpl(final UserDaoImpl userDaoImpl) {
        this.userDao = userDaoImpl;
    }

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return this.userDao.findUserList();
    }

}
```

在 Spring4.x 版本中推荐的注入方式就是这种，具体原因看后续章节。

### 注解注入

以 @Autowired(自动注入)注解注入为例，修饰符有三个属性：Constructor，byType，byName。默认按照 byType 注入。

- **constructor**：通过构造方法进行自动注入，spring 会匹配与构造方法参数类型一致的 bean 进行注入，如果有一个多参数的构造方法，一个只有一个参数的构造方法，在容器中查找到多个匹配多参数构造方法的 bean，那么 spring 会优先将 bean 注入到多参数的构造方法中。

- **byName**：被注入 bean 的 id 名必须与 set 方法名后半截匹配，并且 id 名称的第一个单词首字母必须小写，这一点与手动 set 注入有点不同。
- **byType**：查找所有的 set 方法，将符合参数类型的 bean 注入。

比如：

```java
@Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    @Autowired
    private UserDaoImpl userDao;

    /**
     * find user list.
     *
     * @return user list
     */
    public List<User> findUserList() {
        return userDao.findUserList();
    }

}
```

## IoC 和 ID 使用问题小结

> 这里总结下实际开发中会遇到的问题：

### 为什么推荐构造器注入方式？

先来看看 Spring 在文档中怎么说？

> The Spring team generally advocates constructor injection as it enables one to implement application components as immutable objects and to ensure that required dependencies are not null. Furthermore constructor-injected components are always returned to client (calling) code in a fully initialized state.

简单的翻译一下：这个构造器注入的方式`能够保证注入的组件不可变，并且确保需要的依赖不为空`。此外，构造器注入的依赖总是能够在返回客户端（组件）代码的时候保证完全初始化状态。

下面来简单的解释一下：

- **依赖不可变**：其实说的就是 final 关键字。
- **依赖不为空** (省去了我们对其检查)：当要实例化 UserServiceImpl 的时候，由于自己实现了有参数的构造函数，所以不会调用默认构造函数，那么就需要 Spring 容器传入所需要的参数，所以就两种情况：1. 有该类型的参数 —> 传入，OK。2. 无该类型的参数 —> 报错。

- **完全初始化的状态**：这个可以跟上面的依赖不为空结合起来，向构造器传参之前，要确保注入的内容不为空，那么肯定要调用依赖组件的构造方法完成实例化。而在 Java 类加载实例化的过程中，构造方法是最后一步（之前如果有父类先初始化父类，然后自己的成员变量，最后才是构造方法），所以返回来的都是初始化之后的状态。

所以通常是这样的

```java
@Service
public class UserServiceImpl {

    /**
     * user dao impl.
     */
    private final UserDaoImpl userDao;

    /**
     * init.
     * @param userDaoImpl user dao impl
     */
    public UserServiceImpl(final UserDaoImpl userDaoImpl) {
        this.userDao = userDaoImpl;
    }

}
```

如果使用 setter 注入，缺点显而易见，对于 IoC 容器以外的环境，除了返回反射来提供它需要的依赖之外，**无法复用该实现类**，而且将一直是个潜在的隐患，因为你不调用将一直无法发现 NPE 的存在。

```java
// 这里只是模拟一下，正常来说我们只会暴露接口给客户端，不会暴露实现。
UserServiceImpl userService = new UserServiceImpl();
userService.findUserList(); // -> NullPointerException, 潜在的隐患
```

**循环依赖问题**：使用 field 注入可能会导致循环依赖问题，即 A 里面注入 B，B 里面又注入 A：

```java
public class A {
    @Autowired
    private B b;
}

public class B {
    @Autowired
    private A a;
}
```

如果使用构造器注入，在 spring 项目启动的时候，就会抛出：BeanCurrentlyInCreationException：Requested bean is currently in creation：Is there an unresolvable circular reference？从而提醒你避免循环依赖，如果是 field 注入的话，启动时候不会报错，在使用那个 bean 的时候才会报错。

### 我在使用构造器注入方式时注入了太多的类导致 Bad Smell 怎么办？

比如当你一个 Controller 中注入了太多的 Service 类，Sonar 会给你提示相关告警

 ![img](https://s1.vika.cn/space/2022/12/03/f3d691e68ed9434691da2aeb2fc27777)

对于这个问题，说明你的类当中有太多的责任，那么你要好好想一想是不是违反了类的**单一性职责原则**，从而导致有这么多的依赖要注入

### @Autowired 和 @Resource 以及 @Inject 等注解注入有何区别？

> @Autowired 和 @Resource 以及 @Inject 等注解注入有何区别？ 这时平时在开发中，或者常见的面试题。

#### @Autowired

- **@Autowired 注解源码**

在 Spring 2.5 引入了 @Autowired 注解

```java
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
  boolean required() default true;
}
```

从  Autowired 注解源码上看，可以使用在下面这些地方：

```java
@Target(ElementType.CONSTRUCTOR) #构造函数
@Target(ElementType.METHOD) #方法
@Target(ElementType.PARAMETER) #方法参数
@Target(ElementType.FIELD) #字段、枚举的常量
@Target(ElementType.ANNOTATION_TYPE) #注解
```

还有一个 value 属性，默认是 true。

- **简单总结：**

1、@Autowired 是 Spring 自带的注解，通过 AutowiredAnnotationBeanPostProcessor 类实现的依赖注入

2、@Aurowired 可以作用在 CONSTRUCTOR、METHOD、PARAMETER、FIELD、ANNOATION_TYPE

3、@Autowired 默认是根据类型（byType）进行自动装配的

4、如果有多个类型一样的 Bean 候选者，需要指定按照名称（byName）进行装配，则需要配置 @Qualifier。指定名称后，如果 Spring IoC 容器中没有对应的组件 bean 抛出 NoSuchBeanDefinitionException。也可以将 @Autowired 中 required 配置为 false，如果配置为 false 之后，当没有找到响应 bean 的时候，系统不会抛异常

- **简单使用代码：**

在字段属性上。

```java
@Autowired
private HelloDao helloDao;
```

或者

```java
private HelloDao helloDao;
public HelloDao getHelloDao() {
    return helloDao;
}
@Autowired
public void setHelloDao(HelloDao helloDao) {
    this.helloDao = helloDao;
}
```

或者

```java
private HelloDao helloDao;
//@Autowired
public HelloServiceImpl(@Autowired HelloDao helloDao) {
    this.helloDao = helloDao;
}
// 构造器注入也可不写@Autowired，也可以注入成功。
```

将 @Autowired 写在被注入的成员变量上，setter 或者构造器上，就不再 xml 文件中配置了。

如果有多个类型一样的 Bean 候选者，则默认根据设定的属性名称进行获取。如 HelloDao 在 Spring 中有 helloWorldDao 和 helloDao 两个候选者。

```java
@Autowired
private HelloDao helloDao;
```

首先根据类型获取，发现多个HelloDao，然后根据helloDao进行获取，如果要获取限定的其中一个候选者，结合@Qualifier进行注入。

```java
@Autowired
@Qualifier("helloWorldDao")
private HelloDao helloDao;
```

注入名称为helloWorldDao 的Bean组件。@Qualifier("XXX") 中的 XX是 Bean 的名称，所以 @Autowired 和 @Qualifier 结合使用时，自动注入的策略就从 byType 转变成 byName 了。

多个类型一样的Bean候选者，也可以@Primary进行使用，设置首选的组件，也就是默认优先使用哪一个。

注意：使用@Qualifier 时候，如何设置的指定名称的Bean不存在，则会抛出异常，如果防止抛出异常，可以使用：

```java
@Qualifier("xxxxyyyy")
@Autowired(required = false)
private HelloDao helloDao;
```

在SpringBoot中也可以使用@Bean+@Autowired进行组件注入，将@Autowired加到参数上，其实也可以省略。

```java
@Bean
public Person getPerson(@Autowired Car car){
 return new Person();
}
// @Autowired 其实也可以省略
```

#### @Resource

- **Resource注解源码**

```java
@Target({TYPE, FIELD, METHOD})
@Retention(RUNTIME)
public @interface Resource {
    String name() default "";
    // 其他省略
}
```

从Resource注解源码上看，可以使用在下面这些地方：

```java
@Target(ElementType.TYPE) #接口、类、枚举、注解
@Target(ElementType.FIELD) #字段、枚举的常量
@Target(ElementType.METHOD) #方法
```

name 指定注入指定名称的组件。

- **简单总结**：

1、@Resource是JSR250规范的实现，在javax.annotation包下

2、@Resource可以作用TYPE、FIELD、METHOD上

3、@Resource是默认根据属性名称进行自动装配的，如果有多个类型一样的Bean候选者，则可以通过name进行指定进行注入

- **简单使用代码**：

```java
@Component
public class SuperMan {
    @Resource
    private Car car;
}
```

按照属性名称 car 注入容器中的组件。如果容器中BMW还有BYD两种类型组件。指定加入BMW。如下代码：

```java
@Component
public class SuperMan {
    @Resource(name = "BMW")
    private Car car;
}
```

name 的作用类似 @Qualifier

#### @Inject

- **Inject 注解源码**

```java
@Target({ METHOD, CONSTRUCTOR, FIELD })
@Retention(RUNTIME)
@Documented
public @interface Inject {}
```

从 Inject 注解源码上看，可以使用在下面这些地方：

```java
@Target(ElementType.CONSTRUCTOR) #构造函数
@Target(ElementType.METHOD) #方法
@Target(ElementType.FIELD) #字段、枚举的常量
```

- **简单总结**：

1、@Inject是JSR330 (Dependency Injection for Java)中的规范，需要导入javax.inject.Inject jar包 ，才能实现注入

2、@Inject可以作用CONSTRUCTOR、METHOD、FIELD上

3、@Inject是根据类型进行自动装配的，如果需要按名称进行装配，则需要配合@Named；

- **简单使用代码**：

```java
@Inject
private Car car;
```

指定加入BMW组件。

```java
@Inject
@Named("BMW")
private Car car;
```

@Named 的作用类似 @Qualifier！

