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