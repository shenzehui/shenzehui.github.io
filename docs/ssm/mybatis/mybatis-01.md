---
title: MyBatis 基础篇
shortTitle: 
category:
  - Java 企业级开发
tag:
  - MyBatis
  - ORM框架
date: 2022-10-30
isOriginal: true
description: MyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息，将接口和 Java 的 POJOs(Plain Ordinary Java Object,普通的 Java对象)映射成数据库中的记录。
---

## MyBatis简介

### 框架概念

> 框架，就是软件的半成品，完成了软件开发过程中的通用操作，程序员只需很少或者不用进行加工就能够实 现特定的功能，从而简化开发人员在软件开发中的步骤，提高开发效率。

### 常用框架

- MVC框架：简化了 Servlet 的开发步骤
   - Struts
   - Struts2
   - `SpringMVC`
-  持久层框架：完成数据库操作的框架
   - apache DBUtils
   - Hibernate
   - Spring JPA
   - `MyBatis`
   - EJB3.0
- 胶水框架：`Spring`
- SSM Spring SpringMVC MyBatis
- SSH Spring Struts2 Hibernate

### MyBatis 介绍

> MyBatis 是⼀个 `半自动` 的 `ORM` 框架

> ORM（Object Relational Mapping）对象关系映射，将 Java 中的⼀个对象与数据表中一行记录⼀⼀对应。

> ORM 框架提供了实体类与数据表的映射关系，通过映射文件的配置，实现对象的持久化。

- MyBatis 的前身是 iBatis，iBatis 是 Apache 软件基金会提供的⼀个开源项目
- 2010年 iBatis 迁移到 Google code，正式更名为 MyBatis
- 2013年迁移到 Github 托管
- MyBatis 特点：
   - 支持自定义 SQL、存储过程
   - 对原有的 JDBC 进行了封装，几乎消除了所有 JDBC 代码，让开发者只需关注 SQL 本身
   - 支持 XML 和注解配置方式自定完成 ORM 操作，实现结果映射

## MyBatis 框架部署

> 框架部署，就是将框架引入到我们的项目中

### 创建 Maven 项目

- Java 工程
- Web 工程

### 在项目中添加 MyBatis 依赖

- 在 pom.xml 中添加依赖
   - mybatis
   - mysql driver

```xml
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.4.6</version>
</dependency>
```

### 创建 MyBatis 配置文件

- 创建自定义模板：选择 resources----右键 New----Edit File Templates

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011047.png)

- 在resources中创建名为 `mybatis-config.xml` 的文件

- 在  `mybatis-config.xml` 文件配置数据库连接信息

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
 "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- 在 environments 配置数据库连接信息 -->
    <!-- 在 environments 标签中可以定义多个 environment 标签，每个 environment 标签可以定义⼀套连接配置 -->
    <!-- default 属性，⽤来指定使⽤哪个 environment 标签 -->
    <environments default="mysql">
        <environment id="mysql">
            <!--transactionManager 标签⽤于配置数据库管理⽅式-->
            <transactionManager type="JDBC"></transactionManager>
            <!--dataSource 标签就是⽤来配置数据库连接信息 -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/db_2010_fmwy?
                                            characterEncoding=utf-8"/>
                <property name="username" value="root"/>
                <property name="password" value="admin123"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```

## Mybatis 框架使用

> 案例：学生信息的数据库操作

### 创建数据表

| tb_students |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011588.png) |

### 创建实体类

| Student.java |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011589.png) |

### 创建 DAO 接口，定义操作方法

| DAO 接口                                                     |
| ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011590.png) |

### 创建 DAO 接口的映射文件

- 在 `resources` 目录下，新建名为 `mappers` 文件夹
- 在 `mappers` 中新建名为 `StudentMapper.xml` 的映射文件（根据模板创建）
- 在映射文件中对 DAO 中定义的方法进行实现：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.marico.dao.StudentDao">
    <!--使用 insert,update,delete,select 标签写 sql-->
    <insert id="insertStudent" parameterType="student">
        insert into tb_students(stu_num, stu_name, stu_gender, stu_age)
        values (#{stuNum}, #{stuName}, #{stuGender}, #{stuAge})
    </insert>

    <delete id="deleteStudent">
        delete from tb_students where  stu_num = #{stuNum}
    </delete>
</mapper>
```

### 将映射文件添加到主配置文件

| mybatis-config.xml |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011591.png) |


## 单元测试

### 添加单元测依赖

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>
```

### 创建单元测试类
| 在被测试类名后 alt+insert --- 选择 Test |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011592.png) |

### 测试代码

```java
package com.marico.dao;

import com.marico.pojo.Student;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;

/**
 * @Author marico
 * @Date 2022/7/26 14:54
 * @PackageName:com.marico.dao
 * @ClassName: StudentDaoTest
 * @Description: TODO
 * @Version 1.0
 */
public class StudentDaoTest {

    @Test
    public void insertStudent() {
        InputStream inputStream = null;
        try {
            //加载 mybatis 配置文件
            inputStream = Resources.getResourceAsStream("mybatis-config.xml");
            //会话工厂
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
            //会话（连接）
            SqlSession session = sqlSessionFactory.openSession();
            //通过会话回去 Dao 对象
            StudentDao studentDao = session.getMapper(StudentDao.class);
            //测试 StudentDao 中的方法
            int result = studentDao.insertStudent(new Student(null, "12", "撒贝宁", "男", 50));
            System.out.println("result = " + result);
            //手动提交
            session.commit();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @Test
    public void deleteStudent() {
    }
}
```

## MyBatis 的 CRUD 操作

> 案例：学生信息的增删查改

###  添加操作

略

### 删除操作

> 根据学号删除⼀条学生信息

- 在 StudentDAO 中定义删除方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011593.png)

- 在 StudentMapper.xml 中对接口方法进行"实现"

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011594.png)

- 测试：在 StudentDAO 的测试类中添加测试方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011595.png)

### 修改操作

> 根据学生学号，修改其他字段信息

- 在StudentDAO 接口中定义修改方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011596.png) 

- 在 StudentMapper.xml 中实现接口中定义的修改方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011597.png) 

- 单元测试

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011599.png) 

### 查询操作-查询所有

- 在 StudentDAO 接口定义操作方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011600.png) 

- 在 StudentMapper.xml 中"实现"DAO中定义的方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011601.png) 

- 单元测试

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011602.png) 

### 查询操作-查询一条记录

> 根据学号查询⼀个学生信息

- 在StudentDAO接口中定义方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011603.png) 

- 在 StudentDAOMapper.xml 中配置 StudentDAO 接口的方法实现——SQL

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011604.png) 

- 单元测试
  ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011605.png) 

### 查询操作-多参数查询

> 分页查询（参数 start ， pageSize）

- 在 StudentDAO 中定义操作方法，如果方法有多个参数，使用 `@Param`  注解声明参数的别名

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011606.png) 

- 在 StudentMapper.xml 配置 sql 时，使用 `#{别名}`获取到指定的参数

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011607.png) 

**`注意`** 如果 DAO 操作方法没有通过 @Param 指定参数别名，在 SQL 中也可以通过 `arg0,arg1...` 或者 `param1,param2,...` 获取参数

### 查询操作-查询总记录数

- 在 StudentDAO 接口中定义操作方法

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011608.png) 

- 在 StudentMapper.xml 配置 sql，通过 resultType 指定当前操作的返回类型为 int

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011609.png) 

- 单元测试

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011610.png) 

### 添加操作回填生成的主键

- StudentMapper.xml 的添加操作标签—— insert

```xml
<!--useGeneratedKeys 设置添加操作是否需要回填生成的主键 keyProperty 设置回填的主键值赋值到参数对象的哪个属性-->
<insert id="insertStudent" parameterType="student" useGeneratedKeys="true" keyProperty="stuId">
    insert into tb_students(stu_num, stu_name, stu_gender, stu_age)
    values (#{stuNum}, #{stuName}, #{stuGender}, #{stuAge})
</insert>
```

## MyBatis 工具类封装

- MyBatisUtil

```java
package com.marico.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * @Author marico
 * @Date 2022/7/26 19:36
 * @PackageName:com.marico.utils
 * @ClassName: MyBatisUtil
 * @Description: TODO
 * @Version 1.0
 */
public class MyBatisUtil {

    private static SqlSessionFactory sqlSessionFactory;

    private static final ThreadLocal<SqlSession> local = new ThreadLocal<SqlSession>();
    static {
        try {
            InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static SqlSessionFactory getSqlSessionFactory(){
        return sqlSessionFactory;
    }

    public static SqlSession getSqlSession() {
        SqlSession sqlSession = local.get();
        if (sqlSession == null){
            sqlSession = sqlSessionFactory.openSession();
            local.set(sqlSession);
        }
        return sqlSession;
    }

    /*给无需 commit 的数据库操作提供*/
    public static <T extends Object>T getMapper(Class<T> c){
        SqlSession sqlSession = getSqlSession();
        T dao = sqlSession.getMapper(c);
        return dao;
    }
}
```

## 事务管理

> SqlSession 对象

- getMapper(DAO.class) : 获取 Mapper（DAO接口的实例）
- 事务管理

### 手动提交事务

- `sqlSession.commit()`; 提交事务
- `sqlSession.rollback()`; 事务回滚

**测试类中进行事务管理**

```java
@Test
public void insertStudent() {
    SqlSession session = MyBatisUtil.getSqlSession();
    //1.当我们获取 SqlSession 对象时，就默认开启了事务
    try {
        //通过会话回去 Dao 对象
        StudentDao studentDao = session.getMapper(StudentDao.class);
        //测试 StudentDao 中的方法
        Student student = new Student(null, "122", "康辉", "男", 50);
        int result = studentDao.insertStudent(student);
        System.out.println("result = " + result);
        //主键回填
        System.out.println(student);
        //2.操作完成并成功后，需要手动提交
        session.commit();
    } catch (Exception e) {
        //3.当操作出现异常，调用 rollback 进行回滚
        session.rollback();
    }

}
```

**业务逻辑层手动事务管理**

```java
public class StudentServiceImpl implements StudentService {
    public boolean addStudent(Student student) {
        boolean b = false;
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        try{
            StudentDAO studentDAO = sqlSession.getMapper(StudentDAO.class);
            int i = studentDAO.insertStudent(student);
            b = i>0;
            sqlSession.commit();
        }catch (Exception e){
            sqlSession.rollback();
        }
        return b;
    }
}
```

### 自动提交事务

> 通过 SqlSessionFactory 调用 openSession 方法获取 SqlSession 对象时，可以通过参数设置事务是否自动提交：
> - 如果参数设置为 true，表示自动提交事务： factory.openSession(true);
> - 如果参数设置为 false，或者不设置参数，表示手动提交；

**factory.openSession();/factory.openSession(false);**

**MyBatisUtil 优化**

```java
package com.marico.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * @Author marico
 * @Date 2022/7/26 19:36
 * @PackageName:com.marico.utils
 * @ClassName: MyBatisUtil
 * @Description: TODO
 * @Version 1.0
 */
public class MyBatisUtil {

    private static SqlSessionFactory sqlSessionFactory;

    private static final ThreadLocal<SqlSession> local = new ThreadLocal<SqlSession>();
    static {
        try {
            InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static SqlSessionFactory getSqlSessionFactory(){
        return sqlSessionFactory;
    }

    /**
     * 
     * @param isAutoCommit 是否自动事务提交
     * @return
     */
    public static SqlSession getSqlSession(boolean isAutoCommit) {
        SqlSession sqlSession = local.get();
        if (sqlSession == null){
            sqlSession = sqlSessionFactory.openSession(isAutoCommit);  //设置事务是否自动提交
            local.set(sqlSession);
        }
        return sqlSession;
    }

    //手动事务管理
    public static SqlSession getSqlSession(){
        return getSqlSession(false);
    }

    //自动事务提交
    public static <T extends Object>T getMapper(Class<T> c){
        SqlSession sqlSession = getSqlSession(true);
        T dao = sqlSession.getMapper(c);
        return dao;
    }
}
```

**测试操作**

```java
@Test
public void testDeleteStudent() {
    StudentDao studentDao = MyBatisUtil.getMapper(StudentDao.class);
    int i = studentDao.deleteStudent("12");
    System.out.println(i);
}
```

**业务逻辑层自动事务管理**

```java
public class StudentServiceImpl implements StudentService {
    private StudentDAO studentDAO = MyBatisUtil.getMapper(StudentDAO.class);
    public boolean addStudent(Student student) {
        int i = studentDAO.insertStudent(student);
        boolean b = i>0;
        return b;
    }
}
```

## MyBatis 主配置文件

> mybatis-config.xml 是 MyBatis 框架的主配置文件，只要用于配置 MyBatis 数据源及属性信息


### properties 标签

> 用于设置键值对，或者加载属性文件


- 在 resources 目录下创建 `jdbc.properties` 文件，配置键值对如下：

```properties
mysql_driver=com.mysql.cj.jdbc.Driver
mysql_url=jdbc:mysql://localhost:3306/jdbc?characterEncoding=utf-8&useUnicode=true
mysql_username=root
mysql_password=240518.a
```

- 在 `mybatis-config.xml` 中通过 properties 标签引用 `jdbc.properties` 文件;引入之后，在配置environment 时可以直接使用 jdbc.properties 的 key 获取对应的 value
| mybatis-config.xml |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011611.png) |


### settings 标签

```xml
<!--设置 mybatis 的属性-->
<settings>
    <!-- 启动⼆级缓存-->
    <setting name="cacheEnabled" value="true"/>
    <!-- 启动延迟加载 -->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

### typeAliases 标签

```xml
<!-- typeAliases 标签用于给实体类取别名，在映射文件中可以直接使用别名来替代实体类的全限定名-->
<typeAliases>
    <typeAlias type="com.marico.pojo.Student" alias="Student"></typeAlias>
    <typeAlias type="com.marico.pojo.Book" alias="Book"></typeAlias>
</typeAliases
```

### plugins 标签

```xml
<!-- plugins 标签，用于配置 MyBatis 插件（分页插件）-->
<plugins>
    <plugin interceptor=""></plugin>
</plugins>
```

### environments 标签

```xml
<!-- 在 environments 配置数据库连接信息 -->
<!-- 在 environments 标签中可以定义多个 environment 标签，每个 environment 标签可以定义⼀套连接配置 -->
<!-- default 属性，用来指定使用哪个 environment 标签 -->
<environments default="mysql">
    <environment id="mysql">
        <!--transactionManager 标签用于配置数据库管理方式
            type="JDBC" 可以进⾏事务的提交和回滚操作
            type="MANAGED" 依赖容器完成事务管理，本身不进行事务的提交和回滚操作 -->
        <transactionManager type="JDBC"/>
        <!--dataSource 标签就是用来配置数据库连接信息  POOLED|UNPOOLED-->
        <dataSource type="POOLED">
            <property name="driver" value="${mysql_driver}"/>
            <property name="url" value="${mysql_url}"/>
            <property name="username" value="${mysql_username}"/>
            <property name="password" value="${mysql_password}"/>
        </dataSource>
    </environment>
</environments>
```

### mappers 标签

> 加载映射配置（映射文件、DAO注解）

```xml
<!--mappers 标签用于载入映射文件-->
<mappers>
    <mapper resource="mappers/StudentDao.xml"/>
</mappers>
```

## 映射文件

### MyBatisMapper 初始化

> XML 文件解析：读取 xml 文件中的标签配置封装到 Java 对象中

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/未命名绘图.drawio (62).png)

###  mapper 根标签

> mapper 文件相当于 DAO 接口的'实现类'，namespace 属性要指定实现 DAO 接口的全限定名

###  insert 标签

> 声明添加操作（sql: insert ...）

**常用属性**

- id 属性，绑定对应 DAO 接口中的方法

- parameterType 属性，用以指定接口中对应方法的参数类型（可省略）

- useGeneratedKeys 属性， 设置添加操作是否需要回填生成的主键

- keyProperty 属性，指定回填的id设置到参数对象中的哪个属性

- timeout 属性，设置此操作的超时时间，如果不设置则⼀直等待

**主键回填**

**方式一：**

```xml
<!--useGeneratedKeys 设置添加操作是否需要回填生成的主键 keyProperty 设置回填的主键值赋值到参数对象的哪个属性-->
<insert id="insertStudent" parameterType="student" useGeneratedKeys="true" keyProperty="stuId">
    insert into tb_students(stu_num, stu_name, stu_gender, stu_age)
    values (#{stuNum}, #{stuName}, #{stuGender}, #{stuAge})
</insert>
```

**方式二：**

```xml
<insert id="insertStudent" parameterType="student" useGeneratedKeys="true" keyProperty="stuId" timeout="3000">
    <selectKey keyProperty="stuId" resultType="java.lang.Integer"> <!--resultType 回填值的类型-->
        select last_insert_id()
    </selectKey>
    insert into tb_students(stu_num, stu_name, stu_gender, stu_age)
    values (#{stuNum}, #{stuName}, #{stuGender}, #{stuAge})
</insert>
```

###  delete 标签

> 声明删除操作

###  update 标签

> 声明修改操作

### select 标签

> 声明查询操作

 - id 属性， 指定绑定方法的方法名
 - parameterType 属性，设置参数类型
 - resultType 属性，指定当前 sql 返回数据封装的对象类型（实体类）
 - resultMap 属性，指定从数据表到实体类的字段和属性的对应关系
 - useCache 属性，指定此查询操作是否需要缓存
 - timeout 属性，设置超时时间

### resultMap 标签

```xml
<!-- resultMap 标签用于定义实体类与数据表的映射关系（ORM） -->
<resultMap id="studentMap" type="Student">
    <id column="sid" property="stuId"/>
    <result column="stu_num" property="stuNum"/>
    <result column="stu_name" property="stuName"/>
    <result column="stu_gender" property="stuGender"/>
    <result column="stu_age" property="stuAge"/>
</resultMap>
```

### cache 标签

> 设置当前 DAO 进行数据库操作时的缓存属性设置

```xml
<cache type="" size="" readOnly="false"/>
```

### sql 和 include

> SQL 片段

```xml
<sql id="wanglaoji">sid , stu_num , stu_name , stu_gender , stu_age</sql>
<select id="listStudents" resultMap="studentMap">
    select <include refid="wanglaoji"/> from tb_students
</select>
```