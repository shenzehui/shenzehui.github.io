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

**使用 #{} 可以有效的防止 SQL 注入，提高系统安全性。；**