---
title: MyBatis 精选面试题🔥
tag: MyBatis
category:
  - 面试题
  - 框架
article: false
---

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

## #{} 和 ${} 的区别是什么？

#{} 是预编译处理，是占位符，${} 是字符串替换，是拼接符。

Mybatis 在处理 #{} 时，会将  sql 中的 #{} 替换为 ？号，调用 PreparedStatement 来赋值；

Mybatis 在处理 ${} 时，就是把 ${} 替换成变量的值，调用 Statement 来赋值；

#{} 的变量替换是在 DBMS 中、变量替换后，#{} 对应的变量自动加上单引号；

${} 的变量替换是在 DBMS 外、变量替换后，${} 对应的变量不会加上单引号；

**使用 #{} 可以有效的防止 SQL 注入，提高系统安全性。**

## 👊 基础

### 说一说什么是 MyBatis?

先吹一下：

- Mybatis 是一个半 ORM(对象关系映射)框架，它内部封装了 JDBC，开发时只需要关注 SQL 语句本身，不需要花费精力去处理加载驱动、创建连接、创建 statement 等繁杂的过程。程序员直接编写原生态 sql，可以严格控制 sql 执行性能，灵活度高。
- MyBatis 可以使用 XML 或注解配置和映射原生信息，将 POJO 映射成数据库中的记录，避免了几乎所有的 JDBC  代码和手动设置参数以及获取结果集。

再说一下缺点：

- SQL 语句的编写工作量较大，尤其当字段多、关联表多时，对开发人员编写 SQL 语句的功能有一定的要求。
- SQL 语句依赖于数据库，导致数据库移植性差，不能随意更换数据库

> ORM 是什么？

![image-20221202184508372](https://s1.vika.cn/space/2022/12/02/bd0df350c9834de191d179d5d9456354)

- ORM(Object Relational Mapping)，对象关系映射，是一种为了解决关系型数据库数据与简单 Java 对象(POJO)的映射关系技术。简单来说，ORM 是通过使用描述对象和数据库之间映射的元数据，将程序中的对象自动持久化到关系型数据库中。

> 为什么说 MyBatis 是半自动 ORM 映射工具？它与全自动的区别在哪里？

- Hibernate 属于全自动 ORM 映射工具，使用 Hibernate 查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。
- 而 Mybatis 在查询关联对象或关联集合对象时，需要手动编写 SQL 来完成，所以，被称之为半自动 ORM 映射工具。

> JDBC 编程有哪些不足之处，MyBatis 是如何解决的？

 ![](https://s1.vika.cn/space/2022/12/02/caa025cb3bae4678a94f2c223ec46f84)

- 1数据库连接创建、释放频繁造成系统资源浪费从而影响系统性能，在 mybatis-config.xml 中配置数据库连接池，使用连接池统一管理数据库连接。
- 2.sql 语句写在代码中造成代码不易维护，将 sql 语句配置在  XXXXmapper.xml 文件中与 java 代码分离。
- 3.向 sql 语句传参麻烦，因为 sql 语句的  where 条件不一定，可能多也可能少，占位符需要和参数一一对应。Mybatis 自动将 java 对象映射至 sql 语句。
- 4.对结果集解析麻烦，sql 变化导致解析代码变化，且解析前需要遍历，如果能将数据库记录封装成 pojo 对象解析比较方便。Mybatis 自动将 sql 执行结果映射至 java 对象。

### Hibernate 和 MyBatis 有什么区别？

**相同点**

- 都是对 jdbc 的封装，都是应用于持久层的框架 。

**不同点**

**1、映射关系**

- MyBatis 是一个半自动映射的框架，配置 Java 对象与 sql 语句执行结果的对应关系，多表关联关系配置简单。
- Hibernate 是一个全表映射的框架，配置 Java 对象与数据库表的对应 关系，多表关联关系配置复杂。

**2、SQL 优化和移植性**

- Hibernate 对 SQL 语句封装，提供了日志、缓存、级联（级联比 MyBatis 强大）等特性，此外还提供 HQL(Hibernate Query Language)操作数据库，数据库无关性支持好，但会多消耗性能。如果项目需要支持多种数据库，代码开发量少，但 SQL 语句优化困难。
- MyBatis 需要手动编写 SQL，支持动态  SQL，处理列表、动态生成表名、支持存储过程。开发工作量相对大些。直接使用 SQL 语句操作数据库，不支持数据库无关性，但 sql 语句优化容易。

**3、MyBatis 和 Hibernate 的适用场景不同**

- Hibernate 是标准的 ORM 框架，SQL 编写量较少，但不够灵活，适合需求相对稳定，中小型的软件项目，比如：办公自动化系统
- MyBatis  是半 ORM 框架，需要编写较多 SQL，但是比较灵活，适合于需求变化频繁，快速迭代的项目，比如：电商网站

### MyBatis 使用过程？生命周期？

MyBatis 基本使用的过程大概可以分为这么几步：

![image-20221202194409318](https://s1.vika.cn/space/2022/12/02/ec195b8f0ce742da9eb5fc8d9f54838d)

- **1.创建 SqlSessionFactory**

可以从配置或者直接编码来创建 SqlSessionFactory

```java
String resource = "org/mybatis/example/mybatis-config.xml";
InputStream inputStream = Resources. getResourceAsStream (resource) ;
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream) ;
```

- **2.通过 SqlSessionFactory 创建 SqlSession**

SqlSession(会话) 可以理解为程序和数据库之间的桥梁

```java
SqlSession session = sqlSessionFactory.openSession();
```

- **3.通过 sqlsession 执行数据库操作**

可以通过 SqlSession 实例来直接执行已映射的 SQL 语句：

```java
Blog blog = (Blog)session.selectOne("org.mybatis.example.BlogMapper.selectBlog",101);
```

更常用的方式是先获取 Mapper(映射)，然后再执行 SQL 语句：

```java
BlogMapper mapper = session.getMapper(BlogMapper.class);
Blog blog = mapper.selectBlog(101);
```

- **4.调用 session.commit() 提交事务**

如果是更新、删除语句，我们还需提交一下事务。

- **5.调用 session.close() 关闭会话**

最后一定要关闭会话

> MyBatis  生命周期？

上面提到了几个 MyBatis 的组件，一般说的 MyBatis 生命周期就是这些组件的什么周期。

- SqlSessionFactoryBuilder

一旦创建了 SqlSessoinFactory，就不需要它了。因此 SqlSessionFactoryBuilder 实例的生命周期只存在于方法的内部。

- SqlSessionFactory

SqlSessionFactory 是用来创建 SqlSession 的，相当于一个数据库连接池，每次创建 SqlSessionFactory 都会使用数据库资源，多次创建和销毁是对资源的浪费。所以 SqlSessionFactory 是应用级的生命周期，而且应该是单例的。

- SqlSession

SqlSession 相当于 JDBC 中的 Connection，SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳生命周期是一次请求或一个方法。

- Mapper

映射器是一些绑定映射语句的接口。映射器接口的实例是从 SqlSession 中获得的，它的生命周期在 sqlsession 事务方法之内，一般控制在方法级。

![image-20221202195837737](https://s1.vika.cn/space/2022/12/02/584b070a9cc843558b8de31d7f732b14)

当然，万物皆可集成 Spring，MyBatis 通常也是和 Spring 集成使用，Spring 可以帮助我们创建线程安全的、基于事务的 SqlSession 和映射器，并将它们注入到我们的 bean 中，我们不需要关心它们的创建过程和生命周期，那就是另外的故事了。

### 在 Mapper 中如何传递多个参数？

![image-20221202200726706](https://s1.vika.cn/space/2022/12/02/3f36aa2c375d48ee80b2aea72391b001)

**方法1：顺序传参法**

```xml
public User selectUser(String name,int deptId);
<select id="selectUser" resultMap="UserResultMap">
    select * from user
    where user_name=#{0} and dept_id=#{1}
</select >
```

- **\#{}** 里面的数字代表传入参数的顺序。
- 这种方式不建议使用，sql 层表达不直观， 且一旦顺序调整容易出错。

**方法2：@Param 注解传参法**

```xml
public User selectUser(@Param("userName") String name,@Param("deptId") int deptId);
<select id="selectUser" resultMap="UserResultMap">
    select * from user
    where user_name=#{userName} and dept_id=#{deptId}
</select>
```

- **\#{}** 里面的名称对应的是注解 @Param 括号里面修饰的名称。
- 这种方法在参数不多的情况下还是比较直观的。（推荐使用）。

**方法3：Map 传参法**

```xml
public User selectUser(Map <String,Object> params);
<select id="selectUser" parameterType="java.util.Map" resultMap="UserResultMap">
     select * from user
     where user_name=#{userName} and dept_id=#{deptId}
</select>    
```



## 公众号

 ![](https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff)