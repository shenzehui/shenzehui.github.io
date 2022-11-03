---
title: MyBatis 高级篇
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
## 分页插件

> 分页插件是⼀个独⽴于MyBatis框架之外的第三方插件;

### 添加分页插件的依赖

> PageHelper

```xml
<!--pagehelper 分页插件-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.1.10</version>
</dependency>
```

### 配置插件

> 在mybatis的主配置文件 `mybatis-config.xml` 中通过 `plugins` 标签进行配置

```xml
<!--plugins标签，用于配置 MyBatis 插件（分页插件）-->
<plugins>
    <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
```

###  分页实例

> 对学生信息进行分页查询

```java
@Test
public void listStudentByPagePro(){
    StudentDao studentDao = MyBatisUtil.getMapper(StudentDao.class);  //sqlSession
    PageHelper.startPage(2,1);     
    List<Student> students = studentDao.listStudent();
    PageInfo<Student> pageInfo = new PageInfo<Student>(students);
    //PageInfo 中就包含了数据及分页信息
    List<Student> list = pageInfo.getList();
    for (Student student : list) {
        System.out.println(student);
    }
}
```

**带条件分页**

```java
@Test
public void listStudentByPagePro(){
    StudentDao studentDao = MyBatisUtil.getMapper(StudentDao.class);  //sqlSession
    PageHelper.startPage(1,1);
    List<Student> students = studentDao.listStudentByGender("女");
    PageInfo<Student> pageInfo = new PageInfo<Student>(students);
    //PageInfo 中就包含了数据及分页信息
    List<Student> list = pageInfo.getList();
    for (Student student : list) {
        System.out.println(student);
    }
}
```

## 关联映射

### 实体关系

> 实体——数据实体，实体关系指的就是数据与数据之间的关系

> 例如：用户和角色、房屋和楼栋、订单和商品


实体关系分为以下四种：

**⼀对⼀关联**

实例：人和身份证、学生和学生证、用户基本信息和详情

数据表关系：

- 主键关联（用户表主键 和详情主键相同时，表示是匹配的数据）

用户基本信息表（5个字段）   															用户详情表（20+）

`用户ID`，账号，密码，姓名，最后登录时间 					  	`详情ID`，......

1              zhangsan   shangsan 	张三  	2002:2:27                   1          	13838384388

2           	lisi            lisi      李四   ....														3				13738214633

3              wangwu	wangwu	王五 ..... 											  2             18257292958

用户登录：根据用户名查询用户信息，当用户表中数据量很大且字段很多时会严重影响查询的速度

- 唯一外键关联

用户基本信息表（5个字段）   															用户详情表（20+）

`用户ID`，账号，密码，姓名，最后登录时间 					  	 详情ID，...... 							 	`uid(外键)`

1              zhangsan   shangsan 	张三  	2002:2:27                   1          	13838384388			  2

2           	lisi            lisi      李四   ....														3				13738214633			  3

3              wangwu	wangwu	王五 ..... 											  2             18257292958			   1

**一对多关联、多对一关联**

实例：

- 一对多： 班级和学生 、 类别和商品、楼栋和房屋

- 多对一：学生和班级 、 商品和类别

数据表关系：

- 在多的一端添加外键和⼀的⼀段进行关联

**多对多关联**

实例：用户和角色、角色和权限、房屋和业主、学生和社团、订单和商品

数据表关系：建立第三张关系表添加两个外键分别与两张表主键进行关联

用户(user_id) 		用户角色表(uid,rid)	 	角色(role_id)

### 创建项目，部署 MyBatis 框架

- 创建 web 项目（maven）

```xml
<!--添加 web 依赖-->
<dependency>
    <groupId>javax.servlet.jsp</groupId>
    <artifactId>jsp-api</artifactId>
    <version>2.2</version>
</dependency>
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
</dependency>
```

- 部署 MyBatis 框架

   - 添加依赖

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.1</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.29</version>
</dependency>
```

- 配置文件

- 帮助类

```java
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

    private static SqlSession getSqlSession(boolean isAutoCommit) {
        SqlSession sqlSession = local.get();
        if (sqlSession == null){
            sqlSession = sqlSessionFactory.openSession(isAutoCommit);  
            local.set(sqlSession);
        }
        return sqlSession;
    }

    public static SqlSession getSqlSession(){
        return getSqlSession(false);
    }

    public static <T extends Object>T getMapper(Class<T> c){
        SqlSession sqlSession = getSqlSession(true);
        T dao = sqlSession.getMapper(c);
        return dao;
    }
}
```

### 一对一关联

> 实例：用户---详情

##### 创建数据表

```sql
-- 用户信息表
create table users(
	user_id int primary key auto_increment,
    user_name varchar(20) not null unique,
    user_pwd varchar(20) not null,
    user_realname varchar(20) not null,
    user_img varchar(100) not null
);
-- 用户详情表
create table details(
	detail_id int primary key auto_increment,
    user_addr varchar(50) not null,
    user_tel char(11) not null,
    user_desc varchar(200),
    user_id int not null unique
    -- constraint FK_USER foreign key(uid) references users(user_id) 物理关联 
)
```

##### 创建实体类

**User**

```java
@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private int userId;
    private String userName;
    private String userPwd;
    private String userRealname;
    private String userImg;
}
```

**Detail**

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Detail {
    private int detailId;
    private String userAddr;
    private String userTel;
    private String userDesc;
    private int userId;
}
```

##### 添加操作（事务）
| 测试代码 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011613.png) |


##### 一对一关联查询

> 在查询用户的同时关联查询出与之对应的详情

**实体**

| User | Detail |
| --- | --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011614.png) | ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011615.png) |


**映射文件**

| 连接查询 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011616.png) |

| 子查询                                                       |
| ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011617.png) |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011618.png) |

###  一对多关联

> 案例：班级(1)—学生(n)

##### 创建数据表

```sql
-- 创建班级信息表
create table classes(
	cid int primary key auto_increment,
    cname varchar(30) not null unique,
    cdesc varchar(100)
);

-- 创建学生信息表
create table students(
	sid char(5) primary key,
    sname varchar(20) not null,
    sage int not null,
    scid int not null 
);
```

##### 创建实体类
| Clazz | Student |
| --- | --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011619.png) | ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011620.png) |

##### 关联查询

> 当查询⼀个班级的时候， 要关联查询出这个班级下的所有学生

**连接查询**

| 连接查询的映射配置 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011621.png) |


**子查询**

| 子查询的映射配置 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011622.png) |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011623.png) |

### 多对一关联

> 实例：学生(n)—班级(1)

> 当查询⼀个学生的时候，关联查询这个学生所在的班级信息

##### 创建实体类
| Student | Clazz |
| --- | --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011624.png) | ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011625.png) |

##### 关联查询

**连接查询**

| 连接查询映射配置 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011626.png) |

**子查询**

| 子查询映射配置 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011627.png) |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011628.png) |


### 多对多关联

> 案例：学生（m）—课程（n）

##### 创建数据表

```sql
-- 学生信息表（如上）
-- 课程信息
CREATE TABLE course(
	course_id int PRIMARY KEY auto_increment,
	course_name VARCHAR(50) not NULL
);
-- 选课信息表/成绩表（学号、课程号、成绩）
CREATE TABLE grades(
	sid char(5) not NULL,
	cid int not NULL,
	score int not NULL
);
```

##### 关联查询

> 查询学生时，同时查询学生选择的课程

| Student | Course |
| --- | --- |
| ![](https://gitee.com/shenzehui/image-repo/raw/master/img/202210051011629.png#alt=image-20220727200447434) | ![](https://gitee.com/shenzehui/image-repo/raw/master/img/202210051011630.png#alt=image-20220727200503234) |

> 根据课程编号查询课程时，同时查询选择了这门课程的学生

| Student | Course |
| --- | --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011631.png) | ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011632.png) |

| 连接查询映射配置 |
| --- |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011633.png) |

| 子查询                                                       |
| ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011634.png) |
| ![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011635.png) |

## 动态 SQL

> 交友网：珍爱网、百合网 筛选心仪对象 性别 年龄 城市 身高

> 电商：淘宝、京东 筛选商品 羽毛球拍 品牌 价格


李四 		性别 	女		select * from members where gender='⼥'

王五 		性别 	女		年龄 18-23 		select * from members where gender='女' and age >=18 and age <=23

张三 		年龄 	城市 		select * from members where age >=18 and age <=23 and city=""

> 用户的筛选条件不同，我们完成筛选执行的 SQL 也不一样；我们可以通过穷举来一一的完成不同条件的筛 选，但是这种实现思路过于繁琐和复杂，MyBatis 就提供了动态SQL的配置方式来实现多条件查询。

### 什么是动态 SQL ？

> 根据查询条件动态完成SQL的拼接


### 动态 SQL 使用案例

> 案例：心仪对象搜索

##### 创建数据表

```sql
create table memebers(
    member_id int primary key auto_increment,
    member_nick varchar(20) not null unique,
    member_gender char(2) not null,
    member_age int not null,
    member_city varchar(30) not null
);
```

#####  创建实体类

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Member {
    private int memberId;
    private String memberNick;
    private String memberGender;
    private int memberAge;
    private String memberCity;
}
```

##### 创建 DAO 接口

> 在 DAO 接口中定义⼀个多条件查询的方法

```java
public interface MemberDao {

    //在多条件查询中，如果查询条件不确定，可以直接使用 HashMap 作为参数
    //优点：无需单独定义传递查询条件的类
    //缺点：当向 Map 中存放参数时，key 必须与动态 sql 保持一致（）
	//List<Member> queryMemberBy(HashMap<String,Object> params);


    //也可以定义专门用于存放查询条件的实体类存放参数
    //优点：设置参数时无需关注属性名
    //缺点：需要单独定义一个类来封装参数
    List<Member> queryMemberBy(MemberSearchCondition params);
}
```

### if 标签

```xml
<resultMap id="MemberMap" type="member">
    <id column="member_id" property="memberId"/>
    <result column="member_nick" property="memberNick"/>
    <result column="member_gender" property="memberGender"/>
    <result column="member_age" property="memberAge"/>
    <result column="member_city" property="memberCity"/>
</resultMap>
<select id="queryMemberBy" resultMap="MemberMap">
    select member_id,member_nick,member_gender,member_age,member_city
    from members
    where 1=1
    <if test="gender != null"> <!--这里的 gender 就是参数对象的属性或者 Map 的 key-->
        and member_gender = #{gender}
    </if>
    <if test="minAge != null">
        and member_age &gt;= #{minAge} <!--&gt; -->
    </if>
    <if test="maxAge != null">
        and member_age &lt;= #{maxAge}
    </if>
    <if test="city != null">
        and member_city = #{city}
    </if>
</select>
```

**测试**

```java
public class MemberDaoTest {

    @Test
    public void queryMemberBy() {
        HashMap<String,Object> params = new HashMap<>();
        params.put("gender","女");
        params.put("minAge",18);
        params.put("maxAge",25);
        params.put("city","杭州");

        //---------------------------------------------------------------------------
        MemberSearchCondition params2 = new MemberSearchCondition();
        params2.setGender("女");
        params2.setMinAge(20);
//        params2.setMaxAge(25);
//        params2.setCity("杭州");

        //===========================================================================

        MemberDao memberDao = MyBatisUtil.getMapper(MemberDao.class);
        List<Member> members = memberDao.queryMemberBy(params2);
        for (Member member : members) {
            System.out.println(member);
        }
    }
}
```

### where 标签

```xml
<resultMap id="MemberMap" type="member">
    <id column="member_id" property="memberId"/>
    <result column="member_nick" property="memberNick"/>
    <result column="member_gender" property="memberGender"/>
    <result column="member_age" property="memberAge"/>
    <result column="member_city" property="memberCity"/>
</resultMap>
<select id="queryMemberBy" resultMap="MemberMap">
    select member_id,member_nick,member_gender,member_age,member_city
    from members
    <where>
        <if test="gender != null"> <!--这里的 gender  就是参数对象的属性或者 Map 的 key -->
            and member_gender = #{gender}
        </if>
        <if test="minAge != null">
            and member_age &gt;= #{minAge} <!--&gt; -->
        </if>
        <if test="maxAge != null">
            and member_age &lt;= #{maxAge}
        </if>
        <if test="city != null">
            and member_city = #{city}
        </if>
    </where>
</select>
```

### trim 标签

```xml
<select id="queryMemberBy" resultMap="MemberMap">
    select member_id,member_nick,member_gender,member_age,member_city
    from members
    <trim prefix="where" prefixOverrides="and | or" suffix="order by member_age">			 <!--prefixOverrides="and | or" 语句开头若有 and 或者 or 则会被去除  suffix 后缀 prefix 前缀 -->
        <if test="gender != null"> <!--这里的 gender  就是参数对象的属性或者 Map 的 key-->
            and member_gender = #{gender}
        </if>
        <if test="minAge != null">
            and member_age &gt;= #{minAge} <!--&gt; -->
        </if>
        <if test="maxAge != null">
            and member_age &lt;= #{maxAge}
        </if>
        <if test="city != null">
            and member_city = #{city}
        </if>
    </trim>
</select>
```

### foreach 标签

```java
public interface MemberDao {
    List<Member> queryMemberByCity(List<String> cities);
}
```

```xml
<select id="queryMemberByCity" resultMap="MemberMap">
    select member_id,member_nick,member_gender,member_age,member_city
    from members
    where member_city in
    <foreach collection="list" item="cityName" separator="," open="(" close=")">
        #{cityName}
    </foreach>
</select>
```

**测试**

```java
@Test
public void queryMemberByCity() {
    List<String> cities = new ArrayList<>();
    cities.add("杭州");
    cities.add("深圳");
    MemberDao memberDao = MyBatisUtil.getMapper(MemberDao.class);
    List<Member> members = memberDao.queryMemberByCity(cities);
    for (Member member : members) {
        System.out.println(member);
    }
}
```

## 模糊查询

> 案例：根据昵称查询会员信息（模糊匹配 like）


###  模糊查询实现

##### DAO 接口

```java
public interface MemberDao {
    //根据昵称查询用户信息——模糊查询
    //默认查询需要使用${}取值，与 sql进行拼接
    // 在使用${}时，即使只有一个参数也需要使用 @Param 注解声明参数的 key(非 String 对象参数可以不用声明)
    List<Member> searchMemberByNick(@Param("keyWord") String keyWord);
}
```

#####  映射文件

```xml
<select id="searchMemberByNick" resultMap="MemberMap">
    select member_id,member_nick,member_gender,member_age,member_city
    from members
    where member_nick like '%${keyWord}%'
</select>
```

#####  测试

```java
@Test
public void testSearchMemberByNick(){
    MemberDao memberDao = MyBatisUtil.getMapper(MemberDao.class);
    List<Member> members = memberDao.searchMemberByNick("小");
    for (Member member : members) {
        System.out.println(member);
    }
}
```

###  #{}和${}的区别

- ${key}  表示获取参数，先获取参数的值`拼接`到SQL语句中，再编译执行 SQL 语句；可能引起 SQL 注入问题
- #{key}  表示获取参数，先完成 SQL 编译（`预编译`），预编译之后再将获取的参数设置到 SQL 语句中，可以避免 SQL 注入问题

## MyBatis 日志配置

> MyBatis 做为⼀个封装好的 ORM 框架，其运行过程我们没办法跟踪，为了让开发者了解 MyBatis 执行流程及每个执行步骤所完成的工作，MyBatis 框架本身支持 log4j 日志框架，对运行的过程进行跟踪记录。我们只需对 MyBatis 进行相关的日志配置，就可以看到 MyBatis 运行过程中的日志信息。


### 添加日志框架依赖

```xml
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

###  添加日志配置文件

- 在resources目录下创建名为`log4j.properties`（文件名必须是这个名字）文件
- 在`log4j.properties`文件配置日志输出的方式

```properties
# 声明日志的输出级别及输出方式
log4j.rootLogger=DEBUG,stdout
# MyBatis logging configuration...
log4j.logger.org.mybatis.example.BlogMapper=TRACE
# Console output...
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
# 定义日志的打印格式 %t 表示线程名称 %5p 日志级别 %msg日志信息
log4j.appender.stdout.layout.ConversionPattern=[%t] %5p - %msg \:%m%n
```

### 日志信息的级别

> 在使用日志框架输出日志信息的时候，会根据输出的日志信息的重要程度分为5个级别

| 级别 | 说明 |
| --- | --- |
| DEBUG | 输出调试信息 |
| INFO | 输出提示信息 |
| WARN | 输出警告信息 |
| ERROR | 一般性错误信息 |
| FATAL | 致命性错误 |

## 配置数据库连接池—整合 Druid

> MyBatis 做为⼀个 ORM 框架，在数据库操作时是需要和数据库连接连接的，MyBatis 支持基于数据库连接池的连接创建方式。 当我们配置 MyBatis 数据源时，只要配置了dataSource 标签的 type 属性值为 POOLED 时，就可以使用 MyBatis 内置的连接池管理连接。
>
> 如果我们想要使用第三方的数据库连接池，则需进行自定义配置。

###  常见的连接池

- DBCP

- C3P0

- Druid 性能也比较好，提供了比较便捷的监控系统

- Hikari 性能最好

###  添加Druid依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.11</version>
</dependency>
```

###  创建 Druid 连接池工厂

```java
public class DruidDataSourceFactory extends PooledDataSourceFactory {

    public DruidDataSourceFactory() {
        this.dataSource = new DruidDataSource();
    }
}
```

###  将 DruidDataSourceFactory 配置给 MyBatis 数据源

```xml
<environments default="mysql">
    <environment id="mysql">
        <transactionManager type="JDBC"/>

        <!--POOLED 使用 MyBatis 内置的连接池实现  -->
        <!--Mybatis 需要一个连接池工厂，这个工厂可以产生数据库连接池  PooledDataSourceFactory-->
        <dataSource type="com.qfedu.utils.DruidDataSourceFactory">
            <property name="driverClass" value="${driver}"/>
            <property name="jdbcUrl" value="${url}"/>
            <property name="username" value="${username}"/>
            <property name="password" value="${password}"/>
        </dataSource>
    </environment>
</environments>
```

## MyBatis 缓存

> MyBatis 是基于 JDBC 的封装，使数据库操作更加便捷；MyBatis 除了对 JDBC 操作步骤进行封装之外也对其性能进行了优化：
>
> - 在 MyBatis 引入缓存机制，用于提升 MyBatis 的检索效率
> - 在 MyBatis 引入延迟加载机制，用于减少对数据库不必要的访问

### 缓存的工作原理

> 缓存，就是存储数据的内存

![111](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/未命名绘图.drawio (63).png)

### MyBatis 缓存

> MyBatis 缓存分为一级缓存和二级缓存

##### 一级缓存

> ⼀级缓存也叫做 SqlSession 级缓存，为每个 SqlSession 单独分配的缓存内存，无需手动开启可直接使用；多个 SqlSession 的缓存是不共享的。

> 特性：
>
> 1. 如果多次查询使用的是同⼀个 SqlSession 对象，则第⼀次查询之后数据会存放到缓存，后续的查询则直接访问缓存中存储的数据；
> 2. 如果第一次查询完成之后，对查询出的对象进行修改（此修改会影响到缓存），第二次查询会直接访问缓存，造成第二次查询的结果与数据库不一致；

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011637.png)

> 3. 当我们进行在查询时想要跳过缓存直接查询数据库，则可以通过 sqlSession.clearCache(); 来清除当前 SqlSession 的缓存;

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011638.png)

> 4. 如果第一次查询之后第二查询之前，使用当前的 sqlsession 执行了修改操作，此修改操作会使第一次查询并`缓存的数据失效`，因此第⼆次查询会再次访问数据库。(缓存失效场景)

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011639.png)

**测试代码**

```java
@Test
public void testQueryMemberById(){
    SqlSession sqlSession1 = MyBatisUtil.getSqlSessionFactory().openSession();
    SqlSession sqlSession2 = MyBatisUtil.getSqlSessionFactory().openSession();
    MemberDAO memberDAO1 = sqlSession1.getMapper(MemberDAO.class);
    Member member1 = memberDAO1.queryMemberById(1);
    System.out.println(member1);
    member1.setMemberAge(99);
    sqlSession1.clearCache();
    System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    MemberDAO memberDAO2 = sqlSession1.getMapper(MemberDAO.class);
    Member member2 =memberDAO2.queryMemberById(1);
    System.out.println(member2);
}
```

#####  两次查询与数据库数据不一致问题

![tupian](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/tupian.png)

##### 二级缓存

> 二级缓存也称为 SqlSessionFactory 级缓存，通过同一个 factory 对象获取的 Sqlsession 可以共享二级缓存；在应用服务器中 SqlSessionFactory 是单例的，因此我们二级缓存可以实现全局共享。

> 特性：
>
> 1. 二级缓存默认没有开启，需要在 mybatis-config.xml 中的 settings 标签开启
> 2. 二级缓存只能缓存实现序列化接口的对象

- 在 mybatis-config.xml 开启使用二级缓存

```xml
<settings>
    <!--开启二级缓存-->
    <setting name="cacheEnable" value="true"/>
</settings>
```

- 在需要使用二级缓存的 Mapper 文件中配置 cache 标签使用功能二级缓存

```xml
<!--
    eviction      表示缓存策略  FIFO 按对象先进先出移出   LRU 移出最长时间不被使用的对象 默认LRU
    flushInterval 刷新间隔  60s  默认不设置
    size 	      最多可以存储结果对象512个  默认 1024
    readOnly      返回对象被认为是只读,无法修改  默认是false
-->
<cache readOnly="true" size="521" flushInterval="60000" eviction="LRU"/>
```

- 被缓存的实体类实现序列化接口

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Member implements Serializable {
    private Integer memberId;
    private String memberNick;
    private String memberGender;
    private Integer memberAge;
    private String memberCity;
}
```

- **测试**

```java
@Test
public void testQueryMemberById(){
    SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
    /*多个 SqlSession 对象必须来自于同一个 SqlSessionFactory*/
    SqlSession sqlSession1= sqlSessionFactory.openSession();
    SqlSession sqlSession2= sqlSessionFactory.openSession();

    MemberDao memberDao = sqlSession1.getMapper(MemberDao.class);
    Member member = memberDao.queryMemberById(1);
    System.out.println(member);
    
    sqlSession1.commit();//第一次查询之后，执行 sqlSession1.commit() 会将当前 sqlSession 的查询结果缓存到二级缓存
    System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    MemberDao memberDao2 = sqlSession2.getMapper(MemberDao.class);
    Member member1 = memberDao2.queryMemberById(1);
    System.out.println(member1);
}
```

###  查询操作的缓存开关

```xml
<select id="queryMemberById" resultMap="MemberMap" useCache="true">
    select member_id,member_nick,member_gender,member_age,member_city
    from members
    where member_id = #{mid}
</select>
```

### 更新操作刷新缓存

```xml
<!--flushCache 表示修改后会自动修改缓存-->
<update id="updateMember" flushCache="true">
    update members set member_age = #{age}
    where member_id = #{mid}
</update>
```

## 延迟加载

> 延迟加载——如果在 MyBatis 开启了延迟加载，在执行了`子查询`（至少查询两次及以上）时，默认只执行第⼀ 次查询，当用到子查询的查询结果时，才会触发子查询的执行；如果无需使用子查询结果，则子查询不会执 行.

**开启延迟加载：**

```xml
<settings>
    <!--开启二级缓存-->
    <setting name="cacheEnabled" value="true"/>
    <!-- 启动延迟加载 -->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011641.png)

**测试代码**

```java
/*延迟加载*/
@Test
public void queryClazzByCid() {
    ClazzDao clazzDao = MyBatisUtil.getMapper(ClazzDao.class);
    Clazz clazz = clazzDao.queryClazzByCid(1);
    System.out.println(clazz.getStus());
}
```

**运行日志：**

![](https://cdn.jsdelivr.net/gh/shenzehui/CDN/img/202210051011642.png)