---
article: false
title: 若依开源项目学习笔记
tag: 开源项目
---

> 项目地址：https://gitee.com/y_project/RuoYi-Vue

## 项目修改

1.  全局查找替换：com.ruoyi  -->  org.javaboy 
2.  全局查找替换：3.8.2 -->  0.0.1 
3.  全局查找替换：ruo yi  ->  tienchin，这一步注意需要强调大小写匹配。 
4.  若依-->TienChin 健身 
5.  Shift+F6修改模块名 
6.  Shift+F6修改项目名 
7.  修改包名 
8.  全局搜索 org.javaboy.common，改为 org.javaboy.tienchin.common 
9.  org.javaboy.tienchin.framework.config.CaptchaConfig 类中修改 KaptchaTextCreator 类的引用地址。 
10.  全局搜索 org.javaboy.system.--》org.javaboy.tienchin.system. 
11.  前端修改 @/assests/ruoyi.scss 文件和 @/utils/ruoyi.js 文件 

**Spring Boot 自定义启动 Banner 在线生成工具：**[**https://bootschool.net/**](https://bootschool.net/)

## 验证码响应结果分析

### 请求结果

![image-20230526183539956](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230526183539956.png)

- captchaEnabled：是否显示验证码
- img：图片base64值
- uuid：服务端session唯一id

### base64 转图片

[https://tool.jisuapi.com/base642pic.html](https://tool.jisuapi.com/base642pic.html)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012150508214.png)

## 验证码生成接口分析

### 1. 从数据库中获取是否开启验证码

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012152205133.png)

##### 接口实现类

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012152321969.png)

**分析：先从 redis 中获取验证码配置类，若有，直接返回 captchaEnabled 值，若没有，则从数据库中查询，再保存到 redis 中，并返回 captchaEnabled 值**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012152341329.png)

##### 对应数据表 sys_config

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012152438135.png)

### 2. 生成验证码

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012152752317.png)

##### capthaType 定义

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012152846366.png)

**分析：若为 math 值，则以1+1=?@2的形式得到，将@前面的值生成图片返回给前端，@后面的值存到 redis 中去，反之，若为 char 值，则将得到的字符串值都存到 redis 和返回给前端，最后需要做 base64 转化图片**

## 验证码配置分析

[https://github.com/penggle/kaptcha](https://github.com/penggle/kaptcha)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012160137742.png)

### CaptchaConfig 类

##### 自动存入session中去

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012160218607.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012160447011.png)

### 指定自定义文本生成器

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012160255159.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012160315552.png)

### 验证码的校验

##### 登录接口

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012161414325.png)

##### 验证码校验

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012161436978.png)

1. 从 redis 中获取验证码，key 为固定前缀 +uuid
2. 若为 null 值，说明验证码过期自动删除，开启异步任务保存 日志到数据库中，并抛出异常，若不正确，也抛出自定义异常，并写到数据库中

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012161502335.png)

##### 数据表

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012161718909.png)

> **总结：后端先将 uuid 和图片信息传给前端，并将验证码正确结果根据 uuid 存入 redis 中，前端用户在登录的时候将 uuid 和前端用户输入的验证码信息传给后端，后端在根据 uuid 从 redis 中拿出验证码正确结果（若无，说明登录验证码过期），再和前端用户输入验证码结果比较，若正确则校验成功，再执行登录流程。**


## 登录流程分析

##### 登录成功后的返回

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012162040954.png)

##### 登录接口

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012162634701.png)

##### 前端传参封装

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012162722167.png)

**注意：uuid 是在验证码生成的时候添加返回给前端的**

##### 登录操作执行

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012162553395.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012163125652.png)

##### 最后根据用户信息生成 token

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012163545565.png)

**以 CacheConstants.LOGIN_TOKEN_KEY + uuid 为 key 存入 redis 中去**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012163651081.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012165645040.png)

> 总结：登录之后，redis 中存的是用户信息，而 jwt 中存放的仅仅只是 uuid 而已


## 登录 JWT 校验

> 前端每次请求都会将 JWT 放在请求头中来请求后端数据


![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012165906570.png)

### Token过滤器

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012170055351.png)

##### 从请求中获取用户信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012170217275.png)

- 从请求中获取token

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012170324609.png)

**从请求头中获取，并去除'Bearer '前缀**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012170343832.png)

- 解析jwt获取uuid，通过uuid再从redis中获取用户信息并返回

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012170542019.png)

##### 令牌续签

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221012180930330.png)

> 总结：每次携带 jwt 发起请求，通过jwt获取当前的用户信息，存储到 SecutyContextHolder 中，并续签 token


## SpringSecurity 登录配置

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019122407163.png)

## 自定义多数据源

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019122557480.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019122635009.png)

1.  自定义一个注解 @DataSource，将来可以将该注解加在 service 层方法或者类上面，表示方法或者类中的所有方法都使用一个数据源。 
```java
/**
 * @Author szh
 * @Date 2022/10/19 16:26
 * @PackageName:org.javaboy.dd
 * @ClassName: DataSource
 * @Description: TODO
 * @Version 1.0
 */

/**
 * 这个注解将来可以加在某一个 service 类上或者方法上，通过value 属性来指定类或者方法应该使用哪个数据源
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface DataSource {

    String value();

}
```


2.  对于第一步，如果某个方法上面有 [@DataSource ](/DataSource ) 注解，那么就将该方法需要使用的数据源名称存入到 ThreadLoal。  
```java
/**
 * 这个类用来存储当前线程所使用的数据源名称
 */
public class DynamicDataSourceContextHolder {
    private static ThreadLocal<String> CONTEXT_HOLDER = new ThreadLocal<>();

    public static void setDataSourceType(String dsType) {
        CONTEXT_HOLDER.set(dsType);
    }

    public static String getDataSourceType() {
        return CONTEXT_HOLDER.get();
    }

    public static void clearDataSourceType() {
        CONTEXT_HOLDER.remove();
    }
}
```


3.  自定义切面，在切面中解析 [@DataSource ](/DataSource ) 注解，当一个方法或者类上面有 [@DataSource ](/DataSource ) 注解的时候，将 [@DataSource ](/DataSource ) 注解所标记的数据源存入到 ThreadLocal 中。  
```java
@Component
@Aspect
public class DataSourceAspect {

    /**
     * @annotation(org.javaboy.dd.annoation.DataSource) 表示方法上有 @DataSource 注解，就将方法拦截下来
     * @within(org.javaboy.dd.annoation.DataSource) 表示如果类上面有 @DataSource 注解，就将类中的方法拦截下来
     */
    @Pointcut("@annotation(org.javaboy.dd.annoation.DataSource) || @within(org.javaboy.dd.annoation.DataSource)")
    public void pc() {
    }

    @Around("pc()")
    public Object around(ProceedingJoinPoint pjp) {
        //获取方法上面的有效注解
        DataSource dataSource = getDataSource(pjp);
        if (dataSource != null) {
            //获取注解中数据源的名称
            String value = dataSource.value();
            DynamicDataSourceContextHolder.setDataSourceType(value); //存到ThreadLocal中去
        }
        try {
            return pjp.proceed();
        } catch (Throwable e) {
            e.printStackTrace();
        } finally {
            DynamicDataSourceContextHolder.clearDataSourceType(); //清除ThreadLocal中的数据源名称
        }
        return null;
    }

    private DataSource getDataSource(ProceedingJoinPoint pjp) {
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        //查找方法上的注解
        DataSource annotation = AnnotationUtils.findAnnotation(signature.getMethod(), DataSource.class);
        if (annotation != null) {
            //说明方法上面有 @DataSource 注解
            return annotation;
        }
        return AnnotationUtils.findAnnotation(signature.getDeclaringType(), DataSource.class);  //获取类上面的 @DataSource 注解
    }
}
```


4.  最后，当 Mapper 执行的时候，需要 DataSource，他会自动去 AbstractRoutingDataSource 类中查找需要的数据源，我们只需要在 AbstractRoutingDataSource 中返回 ThreadLocal 中的值即可
![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019172225505.png) 

- 读取配置文件中的数据源，并设置公共属性

```java
@ConfigurationProperties("spring.datasource")
@Component
public class DruidProperties {

    private String type;
    private String driverClassName;
    private Map<String, Map<String, String>> ds;
    private Integer initialSize;
    private Integer minIdle;
    private Integer maxActive;
    private Integer maxWait;

    /**
     * 一会在外部构造好一个 DruidDataSource 对象，但是这个对象只包含三个核心属性 url、username、password
     * 在这个方法中，给这个对象设置公共属性
     *
     * @param druidDataSource
     * @return
     */
    public DataSource dataSource(DruidDataSource druidDataSource) {
        druidDataSource.setInitialSize(initialSize);
        druidDataSource.setMinIdle(minIdle);
        druidDataSource.setMaxActive(maxActive);
        druidDataSource.setMaxWait(maxWait);
        return druidDataSource;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    public Map<String, Map<String, String>> getDs() {
        return ds;
    }

    public void setDs(Map<String, Map<String, String>> ds) {
        this.ds = ds;
    }

    public Integer getInitialSize() {
        return initialSize;
    }

    public void setInitialSize(Integer initialSize) {
        this.initialSize = initialSize;
    }

    public Integer getMinIdle() {
        return minIdle;
    }

    public void setMinIdle(Integer minIdle) {
        this.minIdle = minIdle;
    }

    public Integer getMaxActive() {
        return maxActive;
    }

    public void setMaxActive(Integer maxActive) {
        this.maxActive = maxActive;
    }

    public Integer getMaxWait() {
        return maxWait;
    }

    public void setMaxWait(Integer maxWait) {
        this.maxWait = maxWait;
    }
}
```

- 加载所有数据源（不是公共的属性），返回Map集合

```java
@Component
@EnableConfigurationProperties(DruidProperties.class)
public class LoadDataSource {

    @Autowired
    DruidProperties druidProperties;

    //加载所有的数据源
    public Map<String, DataSource> loadAllDataSource() {
        Map<String, DataSource> map = new HashMap<>();
        Map<String, Map<String, String>> ds = druidProperties.getDs();
        try {
            Set<String> keySet = ds.keySet();
            for (String key : keySet) {
                map.put(key, druidProperties.dataSource((DruidDataSource) DruidDataSourceFactory.createDataSource(ds.get(key))));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }
}
```

- 自定义默认数据源

```java
public interface DataSourceType {
    String DEFAULT_DS_NAME = "master";
}
```

- **核心类**，像MyBatis、JPA、JDBC需要数据源的时候都会经过该类来加载数据源

```java
@Component
public class DynamicDataSource extends AbstractRoutingDataSource {

    public DynamicDataSource(LoadDataSource loadDataSource) {
        //1.设置所有的数据源
        Map<String, DataSource> allDataSource = loadDataSource.loadAllDataSource();
        super.setTargetDataSources(new HashMap<>(allDataSource));
        //2.设置默认的数据源
        //将来，并不是所有的方法上都有 @DataSource 注解，对于那些没有 @DataSource 注解的方法，该使用哪个数据源?
        super.setDefaultTargetDataSource(allDataSource.get(DataSourceType.DEFAULT_DS_NAME));
        //3.
        super.afterPropertiesSet();
    }

    /**
     * 这个方法用来返回数据源名称，当系统需要获取数据源的时候，会自动调用该方法获取数据源的名称
     *
     * @return
     */
    @Override
    protected Object determineCurrentLookupKey() {
        return DynamicDataSourceContextHolder.getDataSourceType();
    }
}
```

**测试：在Service层的类或方法上添加该注解实现**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019173138560.png)![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019173201875.png)

## 手动实现网页上切换数据源

- 接口定义

```java
@RestController
public class DataSourceController {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceController.class);

    @Autowired
    private UserService userService;

    /**
     * 修改数据源的接口
     *
     * @param dsType
     */
    @PostMapping("/dsType")
    public void setDsType(String dsType, HttpSession session) {
        session.setAttribute(DataSourceType.DS_SESSION_KEY, dsType); //将数据源信息存入session
        logger.info("数据源切换为 {}", dsType);

    }

    @GetMapping("/")
    public List<User> getAllUser() {
        return userService.getAllUsers();
    }
}
```

- 定义全局切面

```java
@Aspect
@Component
@Order(10)
public class GlobalDataSourceAspect {

    @Autowired
    HttpSession session;

    @Pointcut("execution(* org.javaboy.dd.service.*.*(..))")
    public void pc() {

    }

    @Around("pc()")
    public Object around(ProceedingJoinPoint pjp) {
        DynamicDataSourceContextHolder.setDataSourceType((String) session.getAttribute(DataSourceType.DS_SESSION_KEY));
        try {
            return pjp.proceed();
        } catch (Throwable e) {
            e.printStackTrace();
        } finally {
            DynamicDataSourceContextHolder.clearDataSourceType();
        }
        return null;
    }

}
```

> 原理：先得到 session 中的 DataSourceType（指定切换的数据源），再执行方法，方法执行中，如果需要使用到数据源（ MyBatis 的查找操作），系统会自动执行如下方法：


![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019191909499.png)

> 获取当前指定的数据源并设置数据源，方法执行完成之后，将 ThreadLocal 中的数据源名称删除


> 总结：前面自定义多数据源是通过 [@DataSource ](/DataSource ) 自定义注解来传递数据源的 key ，而这次通过网页实现的切换数据源是通过用户传递过来的 key 实现的，原理相同 
>  
> 问题阐述：当用户执行的 service 方法有 [@DataSource ](/DataSource ) 注解，该如何切换数据源？ 
>  
> 解决：可以自定义两个切面类的执行顺序，后执行的优先级高（ @Order() 注解中的value值大）


**页面代码：**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    请选择数据源：
    <select name="" id="" onchange="dsChange(this.options[this.options.selectedIndex].value)">
        <option value="请选择">请选择</option>
        <option value="master">master</option>
        <option value="slave">slave</option>
    </select>
</div>
<div id="result"></div>

<button onclick="loadData()">加载数据</button>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
    function dsChange(value) {
        $.post("/dsType", {dsType: value});
    }

    function loadData() {
        $.get("/", function (data) {
            $("#result").html(JSON.stringify(data));
        });
    }
</script>
</html>
```

**测试实现：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019192918649.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221019192935405.png)

## 自定义限流注解

- 自定义限流注解

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RateLimiter {
    /**
     * 限流的 key，主要是指前缀
     * @return
     */
    String key() default "rate_limit:";

    /**
     * 限流时间窗
     * @return
     */
    int time() default 60;

    /**
     * 在时间窗内的限流次数
     * @return
     */
    int count() default 100;

    /**
     * 限流的类型
     * @return
     */
    LimitType limit_type() default LimitType.DEFAULT;

}
```

- 自定义限流策略

```java
/**
 * 限流的类型
 */
public enum LimitType {

    /**
     * 默认限流策略，针对某一个接口进行限流
     */
    DEFAULT,
    /**
     * 针对某一个 IP 进行限流
     */
    IP

}
```

- Redis 序列化策略配置以及 Lua 脚本定义

```java
@Configuration
public class RedisConfig {

    /**
     * RedisTemplate
     * name zhangsan
     * 采用的是 jdk 的序列化方案，缺点：会自动加一串前缀
     * \alksjd\asdlkasd\name     \aksldjlkas\aksldjals\zhangsan
     */
    RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        //设置 JSON 序列化方案 (取代 jdk 序列化方案)
        template.setKeySerializer(serializer);
        template.setHashKeySerializer(serializer);
        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);
        return template;
    }

    /**
     * 注册lua脚本
     * @return
     */
    @Bean
    DefaultRedisScript<Long> limitScript(){
        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setResultType(Long.class);
        script.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/limit.lua")));
        return script;
    }
}
```

- lua 脚本 （目前还看不懂![](https://gw.alipayobjects.com/os/lib/twemoji/11.2.0/2/svg/1f62d.svg#id=yiNoP&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=18)）

```lua
local key = KEYS[1]
local time = tonumber(ARGV[1])
local count = tonumber(ARGV[2])
local current = redis.call('get', key)
if current and tonumber(current) > count then
    --超过限流了
    return tonumber(current)
end
current = redis.call('incr', key)
if tonumber(current) == 1 then
    redis.call('expire', key, time)
end
return tonumber(current)
```

- 自定义异常以及全局异常处理

```java
public class RateLimitException extends Exception {
    public RateLimitException(String message) {
        super(message);
    }
}
```

```java
@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(RateLimitException.class)
    public Map<String, Object> rateLimitException(RateLimitException e) {
        Map<String, Object> map = new HashMap<>();
        map.put("status", 500);
        map.put("message", e.getMessage());
        return map;
    }
}
```

- 自定义切面类

```java
@Aspect
@Component
public class RateLimiterAspect {

    private static final Logger logger = LoggerFactory.getLogger(RateLimiterAspect.class);

    @Autowired
    RedisTemplate<Object, Object> redisTemplate;

    @Autowired
    RedisScript<Long> redisScript;

    @Before("@annotation(rateLimiter)")
    public void before(JoinPoint jp, RateLimiter rateLimiter) throws RateLimitException {
        int time = rateLimiter.time();
        int count = rateLimiter.count();
        String combineKey = getCombineKey(rateLimiter, jp);
        try {
            Long number = redisTemplate.execute(redisScript, Collections.singletonList(combineKey), time, count);//执行 lua 表达式
            if (number == null || number.intValue() > count) {
                //超过限流
                logger.info("当前接口已达到最大限流次数");
                throw new RateLimitException("访问过于频繁，请稍后访问");
            }
            logger.info("一个时间窗内请求次数：{}，当前请求次数：{}，缓存的 key 为 {}", count, number, combineKey);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * 这个 key 其实就是接口调用次数缓存在 redis 的 key
     * rate_limit:key:11.11.11.11-org.javaboy.ratelimit.controller.HelloController-hello
     * rate_limit:key:org.javaboy.ratelimit.controller.HelloController-hello
     *
     * @param rateLimiter
     * @param jp
     * @return
     */
    private String getCombineKey(RateLimiter rateLimiter, JoinPoint jp) {
        StringBuffer key = new StringBuffer(rateLimiter.key());
        if (rateLimiter.limit_type() == LimitType.IP) {
            //请求 IP 添加
            key.append(IpUtils.getIpAddr(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest())).append("-");
        }
        MethodSignature signature = (MethodSignature) jp.getSignature();
        Method method = signature.getMethod();
        key.append(method.getDeclaringClass().getName()) //类路径
                .append("-")
                .append(method.getName());
        return null;
    }
}
```

- IpUtils 工具类

```java
package org.javaboy.rate_limiter.utils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * @Author szh
 * @Date 2022/10/19 20:32
 * @PackageName:org.javaboy.rate_limiter.utils
 * @ClassName: IpUtils
 * @Description: TODO
 * @Version 1.0
 */
public class IpUtils {
    /**
     * 获取客户端IP
     *
     * @param request 请求对象
     * @return IP地址
     */
    public static String getIpAddr(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Forwarded-For");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }

        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : getMultistageReverseProxyIp(ip);
    }

    /**
     * 检查是否为内部IP地址
     *
     * @param ip IP地址
     * @return 结果
     */
    public static boolean internalIp(String ip) {
        byte[] addr = textToNumericFormatV4(ip);
        return internalIp(addr) || "127.0.0.1".equals(ip);
    }

    /**
     * 检查是否为内部IP地址
     *
     * @param addr byte地址
     * @return 结果
     */
    private static boolean internalIp(byte[] addr) {
        if (addr == null || addr.length < 2) {
            return true;
        }
        final byte b0 = addr[0];
        final byte b1 = addr[1];
        // 10.x.x.x/8
        final byte SECTION_1 = 0x0A;
        // 172.16.x.x/12
        final byte SECTION_2 = (byte) 0xAC;
        final byte SECTION_3 = (byte) 0x10;
        final byte SECTION_4 = (byte) 0x1F;
        // 192.168.x.x/16
        final byte SECTION_5 = (byte) 0xC0;
        final byte SECTION_6 = (byte) 0xA8;
        switch (b0) {
            case SECTION_1:
                return true;
            case SECTION_2:
                if (b1 >= SECTION_3 && b1 <= SECTION_4) {
                    return true;
                }
            case SECTION_5:
                switch (b1) {
                    case SECTION_6:
                        return true;
                }
            default:
                return false;
        }
    }

    /**
     * 将IPv4地址转换成字节
     *
     * @param text IPv4地址
     * @return byte 字节
     */
    public static byte[] textToNumericFormatV4(String text) {
        if (text.length() == 0) {
            return null;
        }

        byte[] bytes = new byte[4];
        String[] elements = text.split("\\.", -1);
        try {
            long l;
            int i;
            switch (elements.length) {
                case 1:
                    l = Long.parseLong(elements[0]);
                    if ((l < 0L) || (l > 4294967295L)) {
                        return null;
                    }
                    bytes[0] = (byte) (int) (l >> 24 & 0xFF);
                    bytes[1] = (byte) (int) ((l & 0xFFFFFF) >> 16 & 0xFF);
                    bytes[2] = (byte) (int) ((l & 0xFFFF) >> 8 & 0xFF);
                    bytes[3] = (byte) (int) (l & 0xFF);
                    break;
                case 2:
                    l = Integer.parseInt(elements[0]);
                    if ((l < 0L) || (l > 255L)) {
                        return null;
                    }
                    bytes[0] = (byte) (int) (l & 0xFF);
                    l = Integer.parseInt(elements[1]);
                    if ((l < 0L) || (l > 16777215L)) {
                        return null;
                    }
                    bytes[1] = (byte) (int) (l >> 16 & 0xFF);
                    bytes[2] = (byte) (int) ((l & 0xFFFF) >> 8 & 0xFF);
                    bytes[3] = (byte) (int) (l & 0xFF);
                    break;
                case 3:
                    for (i = 0; i < 2; ++i) {
                        l = Integer.parseInt(elements[i]);
                        if ((l < 0L) || (l > 255L)) {
                            return null;
                        }
                        bytes[i] = (byte) (int) (l & 0xFF);
                    }
                    l = Integer.parseInt(elements[2]);
                    if ((l < 0L) || (l > 65535L)) {
                        return null;
                    }
                    bytes[2] = (byte) (int) (l >> 8 & 0xFF);
                    bytes[3] = (byte) (int) (l & 0xFF);
                    break;
                case 4:
                    for (i = 0; i < 4; ++i) {
                        l = Integer.parseInt(elements[i]);
                        if ((l < 0L) || (l > 255L)) {
                            return null;
                        }
                        bytes[i] = (byte) (int) (l & 0xFF);
                    }
                    break;
                default:
                    return null;
            }
        } catch (NumberFormatException e) {
            return null;
        }
        return bytes;
    }

    /**
     * 获取IP地址
     *
     * @return 本地IP地址
     */
    public static String getHostIp() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
        }
        return "127.0.0.1";
    }

    /**
     * 获取主机名
     *
     * @return 本地主机名
     */
    public static String getHostName() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
        }
        return "未知";
    }

    /**
     * 从多级反向代理中获得第一个非unknown IP地址
     *
     * @param ip 获得的IP地址
     * @return 第一个非unknown IP地址
     */
    public static String getMultistageReverseProxyIp(String ip) {
        // 多级反向代理检测
        if (ip != null && ip.indexOf(",") > 0) {
            final String[] ips = ip.trim().split(",");
            for (String subIp : ips) {
                if (false == isUnknown(subIp)) {
                    ip = subIp;
                    break;
                }
            }
        }
        return ip;
    }

    /**
     * 检测给定字符串是否为未知，多用于检测HTTP请求相关
     *
     * @param checkString 被检测的字符串
     * @return 是否未知
     */
    public static boolean isUnknown(String checkString) {
        return checkString == null || checkString.length() == 0 || "unknown".equalsIgnoreCase(checkString);
    }
}
```

**测试：**

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    /**
     * 限流，10 秒之内，这个接口可以访问 3 次
     */
    @RateLimiter(time = 10, count = 3)
    public String hello() {
        return "hello";
    }
}
```

**用 postman 发起三次请求后：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221020101737824.png)

**控制台输出：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221020101830421.png)

**Redis 中的数据：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221020101907005.png)

**加上 IP 后：**

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    /**
     * 限流，10秒之内，这个接口可以访问 3 次
     */
    @RateLimiter(time = 10, count = 3, limit_type = LimitType.IP)
    public String hello() {
        return "hello";
    }
}
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221020102035984.png)

## 幂等性实现的 6 种思路梳理

1.  Token 机制 
   1. 首先客户端请求服务端，获取一个 token，每一次请求都获取到一个全新的 token (当然这个 token 会有一个超时时间)，将 token 存到 redis 中，然后将 token 返回给客户端。
   2. 客户端将来携带刚刚返回的 token 去请求一个接口。
   3. 服务端收到请求后，分为两种情况： 
      1. 如果 token 在 redis 中，直接删除该 token，然后继续处理业务请求。
      2. 如果 token 不在 redis 中，说明 token 过期或者当前业务已经执行过了，那么此时就不执行业务逻辑。
   4. 优势：实现方式简单。
   5. 劣势：多了一次获取 token 的过程。
2.  去重表（主要是利用 MySQL 的唯一索引机制来实现的） 
   1. 客户端请求服务端，服务端将这次的请求信息（请求地址、参数...）存入到一个 MySQL 去重表中，这个去重表要根据这次请求的某个特殊字段建立唯一索引或者主键索引。
   2. 是否插入成功： 
      1. 成功：继续完成业务功能。
      2. 失败：表示业务已经执行过了，这次就不执行业务了。
   3. 存在的问题：MySQL 的容错性会影响业务、高并发环境可能效率低。
3.  用 Redis 的 setnx 
   1. 客户端请求服务端，服务端将能代表本次请求唯一性的业务字段，通过 setnx 存入 redis，并设置超时时间。
   2. 判断 setnx 是否成功： 
      1. 成功：继续处理业务。
      2. 失败：业务已经执行过了。
4.  设置一个状态字段 
   - 要处理的数据，有一个状态字段。
5.  锁机制： 
   1.  乐观锁：数据库中增加版本号字段，每次更新都根据版本号来判断，更新之前先去查询要更新记录的版本号，第二步更新的时候，将版本号也作为查询条件。 
      1. select version from xxx where id = xxx;
      2. update xxx set xxx = xxx where xx = xx and version = xx;
   2.  悲观锁 
      1.  假设每一次拿数据都会被修改，所以直接上排他锁就行了。 
      2.  
```
start; 
select * from xxx where xxx for update;
update xxx;
commit;
```


## 实现 JSON 格式参数多次读取

- 定义拦截器

```java
@Component
public class RepeatSubmitInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("request.getReader().readLine() = " + request.getReader().readLine()); //根据 IO 流来读取参数 （用于JSON读取）
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
```

- 注册拦截器

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private RepeatSubmitInterceptor repeatSubmitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(repeatSubmitInterceptor).addPathPatterns("/**");
    }

    @Bean
    FilterRegistrationBean<RepeatableRequestFilter> repeatableRequestFilterFilterRegistrationBean() {
        FilterRegistrationBean<RepeatableRequestFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new RepeatableRequestFilter());
        bean.addUrlPatterns("/*"); //过滤所有请求
        return bean;
    }
}
```

> 说明：该拦截器会在请求到接口之前执行，相当于把请求的请求体的携带的 JSON 数据用 IO 读走，导致后端在接口数据的时候没有请求数据，报错


> 解决思路：将每次请求过来的 JSON 数据存放在 byte 数组中，之后接下来的每次请求若需要 JSON 数组，则从 byte 数组中读取即可


- 装饰者模式

```java
public class RepeatableReadRequestWrapper extends HttpServletRequestWrapper {
    private final byte[] bytes;

    public RepeatableReadRequestWrapper(HttpServletRequest request, HttpServletResponse response) throws IOException {
        super(request);
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        bytes = request.getReader().readLine().getBytes();
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
        return new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return false;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener readListener) {

            }

            @Override
            public int read() throws IOException {
                return bais.read();
            }

            @Override
            public int available() throws IOException {
                return bytes.length;
            }
        };
    }
}
```

- 过滤器（在拦截器之前执行）

```java
public class RepeatableRequestFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        if (StringUtils.startsWithIgnoreCase(request.getContentType(), "application/json")) {
            RepeatableReadRequestWrapper requestWrapper = new RepeatableReadRequestWrapper(request, (HttpServletResponse) servletResponse);
            //请求是 JSON 格式，通过装饰者模式处理过的请求
            filterChain.doFilter(requestWrapper, servletResponse);
            return;
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
```

- 注册过滤器

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private RepeatSubmitInterceptor repeatSubmitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(repeatSubmitInterceptor).addPathPatterns("/**");
    }

    @Bean
    FilterRegistrationBean<RepeatableRequestFilter> repeatableRequestFilterFilterRegistrationBean() {
        FilterRegistrationBean<RepeatableRequestFilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new RepeatableRequestFilter());
        bean.addUrlPatterns("/*"); //过滤所有请求
        return bean;
    }
}
```

## 防止请求重复提交

- 封装 Redis 操作命令

```java
@Component
public class RedisCache {
    @Autowired
    RedisTemplate redisTemplate;

    public <T> void setCacheObject(final String key, final T value, Integer timeout, final TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    public <T> T getCacheObject(final String key) {
        ValueOperations<String, T> valueOperations = redisTemplate.opsForValue();
        return valueOperations.get(key);
    }
}
```

- 使用拦截器来解析注解

```java
@Component
public class RepeatSubmitInterceptor implements HandlerInterceptor {

    public static final String REPEAT_PARAMS = "repeat_params";
    public static final String REPEAT_SUBMIT_KEY = "repeat_submit_key";
    public static final String REPEAT_TIME = "repeat_time";
    public static final String HEADER = "Authorization"; //区分人的

    @Autowired
    private RedisCache redisCache;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //拦截器解析注解
        if (handler instanceof HandlerMethod) { //HandlerMethod 就是接口方法
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            Method method = handlerMethod.getMethod();
            RepeatSubmit repeatSubmit = method.getAnnotation(RepeatSubmit.class);
            if (repeatSubmit != null) {
                if (isRepeatSubmit(request, repeatSubmit)) {
                    //是重复提交的
                    Map<String, Object> map = new HashMap<>();
                    map.put("status", 500);
                    map.put("message", repeatSubmit.message());
                    response.setContentType("application/json;charset=utf-8");
                    response.getWriter().write(new ObjectMapper().writeValueAsString(map));
                    return false;
                }
            }
        }
        System.out.println("request.getReader().readLine() = " + request.getReader().readLine()); //根据 IO 流来读取参数 （用于JSON读取）
        return true;
    }

    /**
     * 判断是否重复提交，返回 true 是重复提交
     *
     * @param request
     * @param repeatSubmit
     * @return
     */
    private boolean isRepeatSubmit(HttpServletRequest request, RepeatSubmit repeatSubmit) {
        //请求参数字符串
        String nowParams = "";
        if (request instanceof RepeatableReadRequestWrapper) { //说明请求参数是 JSON
            try {
                nowParams = ((RepeatableReadRequestWrapper) request).getReader().readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        //否则就说明请求参数是 key-value 格式的
        if (StringUtils.isEmpty(nowParams)) {
            try {
                nowParams = new ObjectMapper().writeValueAsString(request.getParameterMap()); //通过 Map 拿到并转成 String
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        Map<String, Object> nowDataMap = new HashMap<>();
        nowDataMap.put(REPEAT_PARAMS, nowParams);
        nowDataMap.put(REPEAT_TIME, System.currentTimeMillis());
        String requestURI = request.getRequestURI();
        String header = request.getHeader(HEADER); //获取请求头
        String cacheKey = REPEAT_SUBMIT_KEY + requestURI + header.replace("Bearer ", ""); //缓存key
        Object cacheObject = redisCache.getCacheObject(cacheKey);
        if (cacheObject != null) {
            Map<String, Object> map = (Map<String, Object>) cacheObject;
            if (compareParams(map, nowDataMap) && compareTime(map, nowDataMap, repeatSubmit.interval())) {
                return true;
            }
        }
        redisCache.setCacheObject(cacheKey, nowDataMap, repeatSubmit.interval(), TimeUnit.MILLISECONDS);
        return false;
    }

    private boolean compareTime(Map<String, Object> map, Map<String, Object> nowDataMap, int interval) {
        Long time1 = (Long) map.get(REPEAT_TIME);
        Long time2 = (Long) nowDataMap.get(REPEAT_TIME);
        if ((time2 - time1) < interval) {
            return true; //间隔时间太短了，说明是重复提交
        }
        return false;
    }

    private boolean compareParams(Map<String, Object> map, Map<String, Object> nowDataMap) {
        String nowParams = (String) nowDataMap.get(REPEAT_PARAMS);
        String dataParams = (String) map.get(REPEAT_PARAMS);
        return nowParams.equals(dataParams);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
```

> 思路：请求若携带 JSON 格式数据，将会被过滤器使用装饰者模式将 request 请求替换为 requestWrapper，之后再通过拦截器判断 request 是不是 requestWrapper，是，则判断该接口方法上面是否有 [@RepeatSubmit ](/RepeatSubmit ) 注解，若有，再判断是否是重复提交。如何判断？ 
>  
> 先将当前的请求参数，请求时间封装成 Map 集合，再根据当前请求 URI、请求头 header 组成唯一缓存  key，（说明：这个 key 应该能区别不同用户的提交请求）。通过该 key 向 redis 中获取数据，若有，说明之前请求过，通过 redis 中的数据 (Map 集合) 与当前的 Map 集合比较，如果请求 URI 一致和两次请求时间间隔小于指定的时间间隔同时满足，说明是重复提交，服务端再封装返回数据响应前端，若 redis 中没有数据，说明是第一次请求或者请求间隔时长大于指定间隔时长，允许请求。


**测试：**

```java
@RestController
public class HelloController {

    @PostMapping("/hello")
    @RepeatSubmit(interval = 10000)
    public String hello(@RequestBody String json){
        return json;
    }
}
```

加上 header 数据和 json 数据，在 10 秒内进行第二次请求：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221020155354438.png)

## 登录流程再分析

登录流程：（ ruo yi 中使用的是 JwtFilter，与 SecurityContextPersistenceFilter 作用一致）

1. 登录的时候，会经过一个过滤器叫做 SecurityContextPersistenceFilter，当用户登录成功后，会将用户信息存入 SecurityContextHolder 中（SecurityContextHolder 默认底层是将用户存入到 ThreadLocal 中的），然后在登录请求结束的时候，在 SecurityContextPersistenceFilter 过滤器中，会将 SecurityContextHolder 中的用户信息读取出来存入到 HttpSession 中。
2. 以后每次用户发起请求的时候，都会经过 SecurityContextPersistenceFilter，在这个过滤器中，系统会从 HttpSession 中读取出来当前登录的用户信息并存入 SecurityContextHolder 中。接下来进行后续的业务处理，在后续的处理中，凡是需要获取当前用户信息的，都从 SecurityContextHolder 直接获取，当当期请求结束的时候，就会将 SecurityContextHolder 中的信息清除，下一次请求来的时候，重复步骤2。

## 自定义数据权限注解 [@DataSource ](/DataSource ) 

> 实现原理：对目标执行的 SQL 语句动态的追加搜索条件，实现不同的角色能够看到不同的数据表数据信息


**角色表：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022113410198.png)

**前提准备：**

- 使用 MyBatis-Plus 逆向工程生成代码

```java
@Test
void contextLoads() {
    FastAutoGenerator.create("jdbc:mysql://localhost:3306/tienchin?serverTimezone=Asia/Shanghai&useSSL=false", "root", "240518.a")
        .globalConfig(builder -> {
            builder.author("szh") // 设置作者
                .fileOverride() // 覆盖已生成文件
                .outputDir("F:\\tienchin\\code\\data_scope\\src\\main\\java"); // 指定输出目录
        })
        .packageConfig(builder -> {
            builder.parent("org.javaboy.ds") // 设置父包名
                .pathInfo(Collections.singletonMap(OutputFile.xml, "F:\\tienchin\\code\\data_scope\\src\\main\\resources\\mapper\\")); // 设置mapperXml生成路径
        })
        .strategyConfig(builder -> {
            builder.addInclude("sys_dept", "sys_role", "sys_user") // 设置需要生成的表名
                .addTablePrefix("sys_"); // 设置过滤表前缀
        })
        .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
        .execute();

}
```

- 在 User 类中实现UserDetail接口，UserServiceImpl 实现 UserDetailService 接口，并添加如下接口

```java
@TableName("sys_user")
public class User extends BaseEntity implements Serializable, UserDetails {
}

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService, UserDetailsService {
}
```

```java
@RestController
@RequestMapping("/dept")
public class DeptController {

    @Autowired
    private IDeptService deptService;

    @GetMapping("/")
    public List<Dept> getAllDept() {
        return deptService.list();
    }

}
```

- 新建 BaseEntity 类

```java
public class BaseEntity {
    //追加的 sql 语句存放位置
    @TableField(exist = false)
    private Map<String, String> params = new HashMap<>();

    public Map<String, String> getParams() {
        return params;
    }

    public void setParams(Map<String, String> params) {
        this.params = params;
    }
}
```

-  所有实体类都继承至 BaseEntity 
-  数据表分析 

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022114335825.png)

**sql 语句：**

```sql
SELECT * FROM `sys_dept` WHERE del_flag = 0 and dept_id in(SELECT rd.dept_id FROM sys_user_role ur,sys_role_dept rd WHERE user_id = 2 AND ur.role_id = rd.role_id)
```

**根据登录用户查询出能够显示的部门**

而 [@DataScope ](/DataScope ) 注解就是为了 使 **dept_id in(SELECT rd.dept_id FROM sys_user_role ur,sys_role_dept rd WHERE user_id = 2 AND ur.role_id = rd.role_id)** 能够动态生成

**新建 Controller 接口**

```java
@RestController
@RequestMapping("/dept")
public class DeptController {

    @Autowired
    private IDeptService deptService;

    @GetMapping("/")
    public List<Dept> getAllDept(Dept dept) {
        return deptService.getAllDepts(dept);
    }
}
```

**映射文件**

```xml
<select id="getDepts" resultType="org.javaboy.ds.entity.Dept">
    SELECT *
    FROM `sys_dept`
    WHERE del_flag = 0
    ${dept.params.data_scope}
</select>
```

**自定义 **[**@DataScope **](/DataScope )** 注解 **

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface DataScope {

    String deptAlias() default "";  //部门别名
    String userAlias() default "";  //用户别名
}
```

**切面类定义（难点）**

```java
package org.javaboy.ds.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.javaboy.ds.annoation.DataScope;
import org.javaboy.ds.entity.BaseEntity;
import org.javaboy.ds.entity.Role;
import org.javaboy.ds.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author szh
 * @Date 2022/10/22 12:13
 * @PackageName:org.javaboy.ds.aspect
 * @ClassName: DataScopeAspect
 * @Description: TODO
 * @Version 1.0
 */
@Aspect
@Component
public class DataScopeAspect {
    public static final String DATA_SCOPE_ALL = "1"; //查询所有部门
    public static final String DATA_SCOPE_CUSTOMER = "2"; //根据 sys_role_dept 关联表查询部门
    public static final String DATA_SCOPE_DEPT = "3"; //查询用户所在部门的信息
    public static final String DATA_SCOPE_DEPT_AND_CHILD = "4"; //查找所在部门及子部门的信息
    public static final String DATA_SCOPE_DEPT_SELF = "5"; //查找仅限本人部门信息
    public static final String DATA_SCOPE = "data_scope";

    @Before("@annotation(dataScope)")
    public void doBefore(JoinPoint jp, DataScope dataScope) {
        clearDataScope(jp);
        //获取当前登录用户信息
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user.getUserId() == 1) {
            //说明是超级管理员，不用进行权限过滤
            return;
        }
        //进行权限过滤
        StringBuilder sql = new StringBuilder();
        List<Role> roles = user.getRoles();

        // SELECT * FROM `sys_dept` d WHERE d.del_flag = 0 and (xxx or xxx or xxx)
        // dept_id in(SELECT rd.dept_id FROM sys_user_role ur,sys_role_dept rd WHERE user_id = 2 AND ur.role_id = rd.role_id)   代表一个 xxx
        for (Role role : roles) {
            String ds = role.getDataScope(); //获取角色对应的数据权限
            if (DATA_SCOPE_ALL.equals(ds)) {
                //如果用户能查看所有数据，这里什么都不用做
                return;
            } else if (DATA_SCOPE_CUSTOMER.equals(ds)) {
                //自定义的数据权限，那么就根据用户角色去查找到 部门 id
                //SELECT * FROM `sys_dept` d WHERE d.del_flag = 0 and d.dept_id in(SELECT rd.dept_id FROM sys_role_dept rd WHERE rd.role_id = 2)
                sql.append(String.format(" OR %s.dept_id in(SELECT rd.dept_id FROM sys_role_dept rd WHERE rd.role_id = %d)", dataScope.deptAlias(), role.getRoleId())); //使用占位符
            } else if (DATA_SCOPE_DEPT.equals(ds)) {
                //SELECT * FROM `sys_dept` d WHERE d.del_flag = 0 and d.dept_id = XXX  只能查询自己部门的数据
                sql.append(String.format(" OR %s.dept_id = %d", dataScope.deptAlias(), user.getDeptId()));
            } else if (DATA_SCOPE_DEPT_AND_CHILD.equals(ds)) {
                // 查询自己部门以及部门下的子部门
                //SELECT * FROM `sys_dept` d WHERE d.del_flag = 0 and d.dept_id in(SELECT dept_id FROM sys_dept WHERE dept_id = 102 OR FIND_IN_SET(102,ancestors))
                sql.append(String.format(" OR %s.dept_id in(SELECT dept_id FROM sys_dept WHERE dept_id = %d OR FIND_IN_SET(%d,ancestors))", dataScope.deptAlias(), user.getDeptId(), user.getDeptId()));
            } else if (DATA_SCOPE_DEPT_SELF.equals(ds)) {
                String s = dataScope.userAlias();
                if ("".equals(s)) {
                    //数据权限仅限于本人
                    sql.append(" OR 1=0");
                } else {
                    sql.append(String.format(" OR %s.user_id=%d", dataScope.userAlias(), user.getUserId()));
                }
            }
        }
        Object arg = jp.getArgs()[0];
        if (arg != null && arg instanceof BaseEntity) {
            BaseEntity baseEntity = (BaseEntity) arg;
            baseEntity.getParams().put(DATA_SCOPE, " And (" + sql.substring(4) + " )");
        }
    }

    /**
     * 如果 params 已经有参数了，则删除掉，防止 sql 注入
     *
     * @param jp
     */
    private void clearDataScope(JoinPoint jp) {
        Object arg = jp.getArgs()[0];
        if (arg != null && arg instanceof BaseEntity) {
            BaseEntity baseEntity = (BaseEntity) arg;
            baseEntity.getParams().put(DATA_SCOPE, "");
        }
    }
}
```

**测试**

- data_scope = 1，查询所有

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134221849.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134528254.png)

- data_scope = 2，自定义查询

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134630959.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134619931.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134741729.png)

- data_scope = 3，查询用户所在部门的信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134822917.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134916184.png)



![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134848457.png)

- data_scope = 4，查找所在部门及子部门的信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022134956110.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022135236170.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022135219334.png)

- data_scope = 5

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022135400357.png)

## 数据权限过滤角色数据（难点）

**接口**

```java
@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    IRoleService roleService;

    @GetMapping("/")
    @DataScope(deptAlias = "d")
    public List<Role> getAllRoles(Role role) {
        return roleService.getAllRoes(role);
    }
}
```

**映射文件**

```xml
<mapper namespace="org.javaboy.ds.mapper.RoleMapper">

    <select id="getAllRoes" resultType="org.javaboy.ds.entity.Role">
        SELECT r.*
        FROM sys_role r
                 LEFT JOIN sys_user_role ur on r.role_id = ur.role_id
                 LEFT JOIN sys_user u on ur.user_id = u.user_id
                 LEFT JOIN sys_dept d on u.dept_id = d.dept_id
        WHERE r.del_flag = '0'
            ${role.params.data_scope}
    </select>
</mapper>
```

> 将 role 表和 dept 表通过 user 表关联在一起
>  
> 根据角色表中的 data_scope 的值，来决定其所具有的权限（dept_id 所属的范围）
>  
> 通过 dept_id 的范围，查询 role 数据


**测试**

- data_scope = 1，查询出所有的角色信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022145247256.png)

-  data_scope = 2 
   - sys_role_dept 表 （自定义查询实际以这张表的数据为准，如果这张表中的 105 数据不存在，则不会查询到普通角色！）

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022145433255.png)

   - sys_user 表

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022145508050.png)

   - sys_role 表

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022145751261.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022145815223.png)

- data_scope = 3 ，查询本部门的信息，再查询到部门关联的用户角色信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022150358282.png)

- data_scope = 4，查询子部门所对应的用户角色信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022150526109.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022150515120.png)

**105 所在部门没有子部门**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022150702427.png)

- data_scope = 5

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022151607280.png)

```java
@GetMapping("/")
@DataScope(deptAlias = "d")
public List<Dept> getAllDept(Dept dept) {
    return deptService.getAllDepts(dept);
}
```

**不会查询到任何数据**

```java
@GetMapping("/")
@DataScope(deptAlias = "d", userAlias = "u") // 指定 user 表的别名
public List<Role> getAllRoles(Role role) {
    return roleService.getAllRoes(role);
}
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022151550321.png)

## 数据权限过滤用户数据

> 用户表通过 dept_id 关联部门表，再根据 role 表中的 data_scope 值，来指定部门表中的 dept_id 的值，继而查询出用户表


```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping("/")
    @DataScope(deptAlias = "d",userAlias = "u")
    public List<User> getAllUsr(User user) {
        return userService.getAllUsr(user);
    }

}
```

```sql
<select id="getAllUsr" resultType="org.javaboy.ds.entity.User">
        SELECT u.* FROM sys_user u LEFT JOIN sys_dept d  on u.dept_id = d.dept_id
        where u.del_flag = '0'
        ${user.params.data_scope}
</select>
```

- data_scope = 1，查询所有

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153049092.png)

- data_scope = 2

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153448919.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153804317.png)

**存在 dept_id = 105 ，查询出此用户**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153902383.png)

- data_scope = 3，查询登录用户信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153902383.png)

- data_scope = 4，查询该部门及其子部门的所有用户信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153902383.png)

- data_scope = 5，查询本人用户信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022153902383.png)

## Seata 简介

seata 官网：[https://seata.io/zh-cn/](https://seata.io/zh-cn/)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/cf4d4239-7b3a-4af7-84da-21b72dc8ab1d.png)

- TC：事务协调者（Transaction Coordinator），这个负责维护全局事务和分支事务的状态，驱动全局事务提交和回滚。
- TM：事务管理器（Transaction Manager），这个是定义全局事务的范围，全局事务什么时候开启？什么时候开启？什么时候回滚？什么时候提交等等。。。
- RM：资源管理器（Resource Manager），管理分支事务的资源，向 TC 注册分支事务的状态，驱动分支事务提交或者回滚。

### 自动补偿/反向补偿

例如有微服务 A、B、C，现在在 A 中分别去调用 B 和 C，为了确保 B 和 C 的调用同时成功或者同时失败，那么就要用分布式事务。假设先调用 B ，再调用 C，B 调用完成后，事务就提交了，然后调用 C ，C 出错，现在要回滚。此时 B 需要回滚，但是 B 的回滚并不是我们传统意义上所说的回滚，而是通过一条更新 SQL，将 B 中的数据复原。这个过程就叫做反向补偿。

### AT 模式

- [https://seata.io/zh-cn/docs/dev/mode/at-mode.html](https://seata.io/zh-cn/docs/dev/mode/at-mode.html)

> 大致原理说明：
>  
> -  一阶段
通过要更新的 SQL 语句，查询出更新前的数据和更新后的数据，插入到 `UNDO_LOG` 表中，并将本地事务提交的结果上报给 TC 
> -  二阶段 
>    -  回滚 
>       1. 收到 TC 的分支回滚请求，开启一个本地事务，执行如下操作。
>       2. 通过 XID 和 Branch ID 查找到相应的 UNDO LOG 记录。
>       3. 数据校验：拿 UNDO LOG 中的后镜与当前数据进行比较，如果有不同，说明数据被当前全局事务之外的动作做了修改。这种情况，需要根据配置策略来做处理，详细的说明在另外的文档中介绍。
>       4. 根据 UNDO LOG 中的前镜像和业务 SQL 的相关信息生成并执行回滚的语句：
> 

>  
>       - 提交
> 

>       1.  提交本地事务。并把本地事务的执行结果（即分支事务回滚的结果）上报给 TC。 
>       2.  收到 TC 的分支提交请求，把请求放入一个异步任务的队列中，马上返回提交成功的结果给TC。 
>       3.  异步任务阶段的分支提交请求将异步和批量地删除相应 UNDO LOG 记录。 
> 


```sql
update product set name = 'TXC' where id = 1;
```

**回滚日志表**

UNDO_LOG Table：不同数据库在类型上会略有差别。

以 MySQL 为例：

| Field | Type |
| --- | --- |
| branch_id | bigint PK |
| xid | varchar(100) |
| context | varchar(128) |
| rollback_info | longblob |
| log_status | tinyint |
| log_created | datetime |
| log_modified | datetime |


```sql
-- 注意此处0.7.0+ 增加字段 context
CREATE TABLE `undo_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `branch_id` bigint(20) NOT NULL,
  `xid` varchar(100) NOT NULL,
  `context` varchar(128) NOT NULL,
  `rollback_info` longblob NOT NULL,
  `log_status` int(11) NOT NULL,
  `log_created` datetime NOT NULL,
  `log_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

### 安装 seater-server

seater 所提供的 seater-server 本质上就是 springboot

1. 下载 seater-server：[https://github.com/seata/seata/releases/download/v1.5.1/seata-server-1.5.1.tar.gz](https://github.com/seata/seata/releases/download/v1.5.1/seata-server-1.5.1.tar.gz)
2. 解压，建议解压目录不要有中文，不要有空格。
3. 修改一下 ./bin/seata-server.sh 脚本（启动不报错不用修改）

注释除了`JAVA_OPT="${JAVA_OPT} -Xlog:gc*:file=${BASEDIR}/logs/seata_gc.log:time,tags:filecount=10,filesize=102400"`代码

```java
JAVA_MAJOR_VERSION=$($JAVACMD -version 2>&1 | sed '1!d' | sed -e 's/"//g' | awk '{print $3}' | awk -F '.' '{print $2}')
if [[ "$JAVA_MAJOR_VERSION" -ge "9" ]] ; then
  JAVA_OPT="${JAVA_OPT} -Xlog:gc*:file=${BASEDIR}/logs/seata_gc.log:time,tags:filecount=10,filesize=102400"
else
  JAVA_OPT="${JAVA_OPT} -Xloggc:${BASEDIR}/logs/seata_gc.log -verbose:gc -XX:+PrintGCDetails  -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M"
fi
```

4. 执行 .bat 文件，启动 seata-server。
5. 启动之后，浏览器输入 http://localhost:7091，进入 seata 管理页面

**配置文件说明：**![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022172310769.png)

-  applictaion.example.yml：是全部配置文件 
-  application.yml：是当前项目的配置文件 

### 分布式事务 AT 模式 实战

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/architecture.png)

```java
@Service
public class BusinessService {

    @Autowired
    StorageFeign storageFeign;

    @Autowired
    OrderFeign orderFeign;

    @GlobalTransactional
    public void purchase(String account, String productId, Integer count) {
        orderFeign.createOrder(account, productId, count);
        storageFeign.deduct(productId, count);
    }
}
```

**两个调用做到同时成功，同时失败**

`@GlobalTransactional` 相当于 TM

undo_log 表记录生成时机：当一个事务还没有回滚时，会先将数据库记录保存在 `undo_log` 中

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022202914454.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221022203015003.png)

**rollback_info 数据**

```json
{
    "@class":"io.seata.rm.datasource.undo.BranchUndoLog",
    "xid":"192.168.88.1:8091:72377057366732804",
    "branchId":72377057366732805,
    "sqlUndoLogs":[
        "java.util.ArrayList",
        [
            {
                "@class":"io.seata.rm.datasource.undo.SQLUndoLog",
                "sqlType":"UPDATE",
                "tableName":"account_tbl",
                "beforeImage":{
                    "@class":"io.seata.rm.datasource.sql.struct.TableRecords",
                    "tableName":"account_tbl",
                    "rows":[
                        "java.util.ArrayList",
                        [
                            {
                                "@class":"io.seata.rm.datasource.sql.struct.Row",
                                "fields":[
                                    "java.util.ArrayList",
                                    [
                                        {
                                            "@class":"io.seata.rm.datasource.sql.struct.Field",
                                            "name":"id",
                                            "keyType":"PRIMARY_KEY",
                                            "type":4,
                                            "value":1
                                        },
                                        {
                                            "@class":"io.seata.rm.datasource.sql.struct.Field",
                                            "name":"money",
                                            "keyType":"NULL",
                                            "type":4,
                                            "value":998800
                                        }
                                    ]
                                ]
                            }
                        ]
                    ]
                },
                "afterImage":{
                    "@class":"io.seata.rm.datasource.sql.struct.TableRecords",
                    "tableName":"account_tbl",
                    "rows":[
                        "java.util.ArrayList",
                        [
                            {
                                "@class":"io.seata.rm.datasource.sql.struct.Row",
                                "fields":[
                                    "java.util.ArrayList",
                                    [
                                        {
                                            "@class":"io.seata.rm.datasource.sql.struct.Field",
                                            "name":"id",
                                            "keyType":"PRIMARY_KEY",
                                            "type":4,
                                            "value":1
                                        },
                                        {
                                            "@class":"io.seata.rm.datasource.sql.struct.Field",
                                            "name":"money",
                                            "keyType":"NULL",
                                            "type":4,
                                            "value":898800
                                        }
                                    ]
                                ]
                            }
                        ]
                    ]
                }
            }
        ]
    ]
}
```

### 多数据源处理事务

- 添加依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
    <version>2.2.2.RELEASE</version>
</dependency>
```

- 配置文件

```yaml
spring:
 cloud:
    alibaba:
      seata:
        tx-service-group: my_test_tx_group
  main:
    allow-circular-references: true
  application:
    name: dd

seata:
  enable-auto-data-source-proxy: false
```

- 添加 file.conf 和  registry.conf 文件

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023120820594.png)

- 加载 seata 提供的 DataSourceProxy 数据源

```java
//加载所有的数据源
public Map<String, DataSourceProxy> loadAllDataSource() {
    Map<String, DataSourceProxy> map = new HashMap<>();
    Map<String, Map<String, String>> ds = druidProperties.getDs();
    try {
        Set<String> keySet = ds.keySet();
        for (String key : keySet) {
            DataSource dataSource = druidProperties.dataSource((DruidDataSource) DruidDataSourceFactory.createDataSource(ds.get(key)));
            map.put(key, new DataSourceProxy(dataSource));
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return map;
}
```

- 切面类方法错误应当抛出异常，让 seata 捕获回滚

```java
@Around("pc()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    //获取方法上面的有效注解
    DataSource dataSource = getDataSource(pjp);
    if (dataSource != null) {
        //获取注解中数据源的名称
        String value = dataSource.value();
        DynamicDataSourceContextHolder.setDataSourceType(value); //存到ThreadLocal中去
    }
    try {
        return pjp.proceed();
    } catch (Throwable e) {
        e.printStackTrace();
        throw e;
    } finally {
        DynamicDataSourceContextHolder.clearDataSourceType(); //清除ThreadLocal中的数据源名称
    }
}
```

**测试：**

```java
@Service
public class SlaveService {

    @Autowired
    SlaveMapper slaveMapper;

    @DataSource("slave")
    public void incrAge(String username, Integer age) {
        slaveMapper.updateUserAge(username, age);
        int i = 1 / 0;
    }
}
```

**执行后两次不同数据源的操作都会回滚**

### TCC 模式

[https://seata.io/zh-cn/docs/dev/mode/tcc-mode.html](https://seata.io/zh-cn/docs/dev/mode/tcc-mode.html)

Try Confirm Cancel（TCC），也是基于两阶段提交发展出来的分布式事务处理方案。

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/seata_tcc-1.png)

### TCC 实战

- 在 common 模块添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
    <version>2.2.6.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
    <version>2.2.2.RELEASE</version>
</dependency>
```

- 创建三个 Feign 客户端

```java
@LocalTCC
public interface AccountServiceApi {

    /**
     * 这是一阶段操作
     * 这个方法用来检查资源，例如检查账户是否存在，检查账户余额是充足，余额充足的话，就冻结余额
     * <p>
     * prepare 是开发者手动调用的，commit 或者 rollback 则是 seata 根据（所有的） prepare 执行的情况，自动调用的。
     *
     * @return
     * @TwoPhaseBusinessAction 两阶段提交，指定实例名称，两阶段提交方法名，两阶段回滚方法名
     * BusinessActionContext 分布式事务执行的时候的上下文，可以用来存放参数，用于参数传递
     * @BusinessActionContextParameter(paramName = "money") 将该参数以 paramName 为 key 存放到 BusinessActionContext 中
     */
    @TwoPhaseBusinessAction(name = "accountServiceApi", commitMethod = "commit", rollbackMethod = "rollback")
    @RequestMapping("/account/deduct/prepare")
    boolean prepare(@RequestBody BusinessActionContext actionContext,
                    @RequestParam("userId") @BusinessActionContextParameter(paramName = "userId") String userId,
                    @RequestParam("money") @BusinessActionContextParameter(paramName = "money") Double money);

    /**
     * 这是二阶段的提交（返回值必须为 boolean 类型）
     * 真正的提交操作在这里完成，主要是扣款操作（操作冻结的金额即可）
     *
     * @return
     */
    @RequestMapping("/account/deduct/commit")
    boolean commit(@RequestBody BusinessActionContext actionContext);

    /**
     * 这是二阶段的回滚操作（返回值必须为 boolean 类型）
     * 回滚不要是将冻结的金额复原
     *
     * @return
     */
    @RequestMapping("/account/deduct/rollback")
    boolean rollback(@RequestBody BusinessActionContext actionContext);

}
```

```java
@LocalTCC
public interface OrderServiceApi {

    @TwoPhaseBusinessAction(name = "orderServiceApi", commitMethod = "commit", rollbackMethod = "rollback")
    @RequestMapping("/order/create/prepare")
    boolean prepare(@RequestBody BusinessActionContext actionContext,
                    @RequestParam("userId") @BusinessActionContextParameter(paramName = "userId") String userId,
                    @RequestParam("productId") @BusinessActionContextParameter(paramName = "productId") String productId,
                    @RequestParam("count") @BusinessActionContextParameter(paramName = "count") Integer count
    );

    @RequestMapping("/order/create/commit")
    boolean commit(@RequestBody BusinessActionContext actionContext);

    @RequestMapping("/order/create/rollback")
    boolean rollback(@RequestBody BusinessActionContext actionContext);
}
```

```java
@LocalTCC
public interface StorageServiceApi {

    @TwoPhaseBusinessAction(name = "storageServiceApi", commitMethod = "commit", rollbackMethod = "rollback")
    @RequestMapping("/storage/deduct/prepare")
    boolean prepare(@RequestBody BusinessActionContext actionContext,
                    @RequestParam("productId") @BusinessActionContextParameter(paramName = "productId") String productId,
                    @RequestParam("count") @BusinessActionContextParameter(paramName = "count") Integer count
    );

    @RequestMapping("storage/deduct/commit")
    boolean commit(@RequestBody BusinessActionContext actionContext);

    @RequestMapping("storage/deduct/rollback")
    boolean rollback(@RequestBody BusinessActionContext actionContext);
}
```

- 实体类定义

```java
public class Account {
    private Integer id;
    private String userId;
    private Double money;
    private Double freezeMoney;
	// 此处省略 getter and setter
}
```

- AccountController 实现 AccountServiceApi 接口，并处理自己的业务逻辑

```java
@RestController
public class AccountController implements AccountServiceApi {

    @Autowired
    AccountService accountService;

    @Override
    public boolean prepare(BusinessActionContext actionContext, String userId, Double money) {
        return accountService.prepare(userId, money);
    }

    @Override
    public boolean commit(BusinessActionContext actionContext) {
        return accountService.commit(actionContext);
    }

    @Override
    public boolean rollback(BusinessActionContext actionContext) {
        return accountService.rollback(actionContext);
    }
}
```

- AccountService 完成 prepare commit rollback 业务逻辑

```java
@Service
public class AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
    @Autowired
    private AccountMapper accountMapper;

    /**
     * 这里实际上是准备工作，也是分布式事务一阶段的工作
     * 这个时候主要检查一下账户是否存在，检查一下余额是否充足，把要扣的钱先冻结起来
     *
     * @param userId
     * @param money
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean prepare(String userId, Double money) {
        Account account = accountMapper.getAccountByUserId(userId);
        if (account == null) {
            throw new RuntimeException("账户不存在");
        }
        if (account.getMoney() < money) {
            throw new RuntimeException("账户余额不足，预扣款失败");
        }
        //先把钱冻结起来
        account.setFreezeMoney(account.getFreezeMoney() + money);
        account.setMoney(account.getMoney() - money);
        Integer i = accountMapper.updateAccount(account);
        logger.info("{} 账户预扣款 {} 元", userId, money);
        return i == 1;
    }

    /**
     * 二阶段 commit 操作
     * 实际扣款阶段
     *
     * @param actionContext
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean commit(BusinessActionContext actionContext) {
        //获取 prepare 阶段的两个参数
        String userId = (String) actionContext.getActionContext("userId");
        double money = ((BigDecimal) actionContext.getActionContext("money")).doubleValue();
        Account account = accountMapper.getAccountByUserId(userId);
        if (account.getFreezeMoney() < money) {
            throw new RuntimeException("账户余额不足，扣款失败");
        }
        account.setFreezeMoney(account.getFreezeMoney() - money);
        Integer i = accountMapper.updateAccount(account);
        logger.info("{} 账户扣款 {} 元", userId, money);
        return i == 1;
    }

    /**
     * 二阶段回滚
     * <p>
     * 主要是把冻结的钱释放
     *
     * @param actionContext
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean rollback(BusinessActionContext actionContext) {
        //获取 prepare 阶段的两个参数
        String userId = (String) actionContext.getActionContext("userId");
        double money = ((BigDecimal) actionContext.getActionContext("money")).doubleValue();
        Account account = accountMapper.getAccountByUserId(userId);
        if (account.getFreezeMoney() >= money) {
            account.setMoney(account.getMoney() + money);
            account.setFreezeMoney(account.getFreezeMoney() - money);
            Integer i = accountMapper.updateAccount(account);
            logger.info("{} 账户释放冻结金额 {} 元", userId, money);
            return i == 1;
        }
        logger.info("{} 账户冻结金额已释放", userId);
        return true;
    }
}
```

- AccountMapper

```java
@Mapper
public interface AccountMapper {
    @Update("update account_tbl set money = #{money},freezeMoney=#{freezeMoney} where userId = #{userId}")
    Integer updateAccount(Account account);

    @Select("select * from account_tbl where userId = #{userId}")
    Account getAccountByUserId(String userId);
}
```

- order 模块 Feign 客户端

```java
@FeignClient("account")
public interface AccountServiceApiImpl extends AccountServiceApi {
}
```

- OrderController

```java
@RestController
public class OrderController implements OrderServiceApi {

    @Autowired
    OrderService orderService;

    @Override
    public boolean prepare(BusinessActionContext actionContext, String userId, String productId, Integer count) {
        return orderService.prepare(actionContext, userId, productId, count);
    }

    @Override
    public boolean commit(BusinessActionContext actionContext) {
        return orderService.commit(actionContext);
    }

    @Override
    public boolean rollback(BusinessActionContext actionContext) {
        return orderService.rollback(actionContext);
    }
}
```

- OrderService

```java
@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    OrderMapper orderMapper;

    @Autowired
    AccountServiceApi accountServiceApi;

    @Transactional(rollbackFor = Exception.class)
    public boolean prepare(BusinessActionContext actionContext, String userId, String productId, Integer count) {
        //先去扣款，假设每个产品 100 元
        boolean prepare = accountServiceApi.prepare(actionContext, userId, count * 100.0);
        logger.info("{} 用户购买了 {} 商品，共计 {} 件，预下单成功", userId, productId, count);
        return prepare;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean commit(BusinessActionContext actionContext) {
        String userId = (String) actionContext.getActionContext("userId");
        String productId = (String) actionContext.getActionContext("productId");
        Integer count = (Integer) actionContext.getActionContext("count");
        Integer i = orderMapper.addOrder(userId, productId, count,count*100.0);
        logger.info("{} 用户购买了 {} 商品，共计 {} 件，下单成功", userId, productId, count);
        return i == 1;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean rollback(BusinessActionContext actionContext) {
        String userId = (String) actionContext.getActionContext("userId");
        String productId = (String) actionContext.getActionContext("productId");
        Integer count = (Integer) actionContext.getActionContext("count");
        logger.info("{} 用户购买了 {} 商品，共计 {} 件，订单回滚成功", userId, productId, count);
        return true;
    }
}
```

- OrderMapper

```java
@Mapper
public interface OrderMapper {

    @Insert("insert into order_tbl(userId,productId,count,money) values(#{userId},#{productId},#{count},#{money})")
    Integer addOrder(@Param("userId") String userId,
                     @Param("productId") String productId,
                     @Param("count") Integer count,
                     @Param("money") Double money);
}
```

- Storage 实体类

```java
public class Storage {
    private Integer id;
    private String productId;
    private Integer count;
    private Integer freezeCount;
    //此处省略 getter and setter...
}
```

- StorageController

```java
@RestController
public class StorageController implements StorageServiceApi {

    @Autowired
    StorageService storageService;

    @Override
    public boolean prepare(BusinessActionContext actionContext, String productId, Integer count) {
        return storageService.prepare(productId, count);
    }

    @Override
    public boolean commit(BusinessActionContext actionContext) {
        return storageService.commit(actionContext);
    }

    @Override
    public boolean rollback(BusinessActionContext actionContext) {
        return storageService.rollback(actionContext);
    }
}
```

- StorageService

```java
@Service
public class StorageService {

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
    @Autowired
    StorageMapper storageMapper;

    @Transactional(rollbackFor = Exception.class)
    public boolean prepare(String productId, Integer count) {
        Storage storage = storageMapper.getStorageByProductId(productId);
        if (storage == null) {
            throw new RuntimeException("商品不存在");
        }
        if (storage.getCount() < count) {
            throw new RuntimeException("库存不足，预扣库存失败");
        }
        storage.setFreezeCount(storage.getFreezeCount() + count);
        storage.setCount(storage.getCount() - count);
        Integer i = storageMapper.updateStorage(storage);
        logger.info("{} 商品库存冻结 {} 个", productId, count);
        return i == 1;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean commit(BusinessActionContext actionContext) {
        String productId = (String) actionContext.getActionContext("productId");
        Integer count = (Integer) actionContext.getActionContext("count");
        Storage storage = storageMapper.getStorageByProductId(productId);
        if (storage.getFreezeCount() < count) {
            throw new RuntimeException("库存不足，扣库存失败");
        }
        storage.setFreezeCount(storage.getFreezeCount() - count);
        Integer i = storageMapper.updateStorage(storage);
        logger.info("{} 商品扣库存 {} 个", productId, count);
        return i == 1;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean rollback(BusinessActionContext actionContext) {
        String productId = (String) actionContext.getActionContext("productId");
        Integer count = (Integer) actionContext.getActionContext("count");
        Storage storage = storageMapper.getStorageByProductId(productId);
        if (storage.getFreezeCount() >= count) {
            storage.setFreezeCount(storage.getFreezeCount() - count);
            storage.setCount(storage.getCount() + count);
            Integer i = storageMapper.updateStorage(storage);
            logger.info("{} 商品释放库存 {} 个", productId, count);
            return i == 1;
        }
        logger.info("{} 商品冻结的库存已释放", productId);
        return true;
    }
}
```

- StorageMapper

```java
@Mapper
public interface StorageMapper {
    @Select("select * from storage_tbl where productId=#{productId} ")
    Storage getStorageByProductId(String productId);

    @Update("update storage_tbl set count=#{count},freezeCount=#{freezeCount} where productId=#{productId}")
    Integer updateStorage(Storage storage);
}
```

**Business 模块**

- 定义 order 和 storage Feign 客户端

```java
@FeignClient("order")
public interface OrderServiceApiImpl extends OrderServiceApi {
}
```

```java
@FeignClient("storage")
public interface StorageServiceApiImpl extends StorageServiceApi {
}
```

- BusinessService

```java
@Service
public class BusinessService {

    @Autowired
    StorageServiceApi storageServiceApi;

    @Autowired
    OrderServiceApi orderServiceApi;

    @GlobalTransactional
    public void purchase(String account, String productId, Integer count) {
        String xid = RootContext.getXID(); //获取全局事务 ID
        BusinessActionContext actionContext = new BusinessActionContext();
        actionContext.setXid(xid);
        orderServiceApi.prepare(actionContext, account, productId, count);
        storageServiceApi.prepare(actionContext, productId, count);
    }
}
```

- BusinessController

```java
@RestController
public class BusinessController {
    @Autowired
    BusinessService businessService;

    @PostMapping("/order")
    public RespBean order(String account, String productId, Integer count) {
        try {
            businessService.purchase(account, productId, count);
            return RespBean.ok("下单成功");
        } catch (Exception e) {
            e.printStackTrace();
            return RespBean.error("下单失败", e.getMessage());
        }
    }
}
```

**成功测试：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160416819.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160322751.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160345209.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160358026.png)

**失败测试：**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160448206.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160612148.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023160630430.png)

### XA

XA 模式是 X/Open 组织定义的分布式事务处理标准。

XA 规范描述了全局的事务管理器与局部的资源管理器之间的接口，利用 XA 规范可以实现多个资源，例如数据库、MQ 等，在同一个事务中进行访问，这样就可以使得数据库的 ACID 属性在跨应用的时候依然有效。

目前所有主流的数据库基本上都支持 XA 协议，包括 MySQL，

MySQL 中的 XA 事务分为两种：

- 内部 XA：内部 XA 可以用作同一个 MySQL 实例下，跨多个引擎的事务，这种一般使用 binlog 作为协调者。
- 外部 XA：外部 XA 可以参与到外部的分布式事务中，这种一般需要应用层介入作为协调者。

**XA 在 MYSQL 中的应用**

```sql
xa start "事务名称";  ## 开启分布式事务
update delete insert ...
xa end "事务名称"； ## 结束分布式事务  //事务处于 IDLE 状态
xa prepare "事务名称"  ## 一阶段结束（给协调者报告状态）  这一步可以省略，可以直接提交，但后面要加 ONE PHASE; xa commit ONE PHASE 一阶段直接提交
xa commit "事务名称" / xa rollback "事务名称" ## 二阶段结束
xa recouver # 可以查看所有处于 prepare 中的事务

xa rollback "截取前gtrid_length个字符的data","dara被截取后的剩余字符",formatID ## 回滚完整命令
```

**XA 在 Seata 中的应用**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106184937218.png)

1. 首先 TM 开启全局的分布式事务。
2. 不同的微服务开始执行，各个微服务（RM）依次执行 xa start->SQL->xa end->xa prepare，这是一阶段的操作。
3. 在一阶段的操作中，xa prepare 会将当前分支事务的状态报告给 TC。
4. TC 判断一下，各个分支事务都执行成功了，此时就通知各个分支事务提交，如果分支事务中有人执行失败，那么此时就通知各个分支事务一起回滚（真正的回滚）。

### XA 实战

`MySQL 版本统一使用 8.0.11，据说其他会出错`

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
    <version>8.0.11</version>
</dependency>
```

`不需要再添加 druid 依赖`

**凡是涉及到数据库操作的都需要关闭数据代理**

```properties
seata.enable-auto-data-source-proxy=false
```

**数据源配置（替换成 DataSourceProxyXA）**

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DruidDataSource druidDataSource() {
        return new DruidDataSource();
    }

    @Bean("dataSourceProxy")
    @Primary //这里因为 Spring 容器中存在两个 DataSource，@Primary 作用是当容器中存在多个时，优先使用以下数据源
    public DataSource dataSource(DruidDataSource druidDataSource) {
        return new DataSourceProxyXA(druidDataSource); // XA 模式数据源，只要换上这种数据源，就自动开启了 XA 模式
    }

    //配置 MyBatis
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSourceProxy) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSourceProxy);
        bean.setTransactionFactory(new SpringManagedTransactionFactory());
        return bean.getObject();
    }
}
```

**在启动类上排除 **`**DataSourceAutoConfiguration.class**`** 声明数据源无需再配置**

```java
@SpringBootApplication(scanBasePackages = "org.javaboy", exclude = DataSourceAutoConfiguration.class)
public class AccountApplication {

    public static void main(String[] args) {
        SpringApplication.run(AccountApplication.class, args);
    }

}
```

post请求：[http://localhost:1112/order?account=javaboy&count=10&productId=1111](http://localhost:1112/order?account=javaboy&count=10&productId=1111)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023192027570.png)





![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023192100514.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221023192143326.png)

> 跟 AT 相比，只要切换成 XA 数据源即可，但有些版本问题需要注意！！！

### 分布式事务总结
![](https://cdn.nlark.com/yuque/0/2023/jpeg/29665700/1683014304892-96451dc7-99db-44a8-ad42-4c5338d9e125.jpeg)
## 操作日志记录

- 自定义 Log 注解

```java
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    /**
     * 模块
     */
    public String title() default "";

    /**
     * 功能
     */
    public BusinessType businessType() default BusinessType.OTHER;

    /**
     * 操作人类别
     */
    public OperatorType operatorType() default OperatorType.MANAGE;

    /**
     * 是否保存请求的参数
     */
    public boolean isSaveRequestData() default true;

    /**
     * 是否保存响应的参数
     */
    public boolean isSaveResponseData() default true;
}
```

- 定义切面（正常处理和异常处理）

```java
@Aspect
@Component
public class LogAspect {
    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);

    /**
     * 排除敏感属性字段
     */
    public static final String[] EXCLUDE_PROPERTIES = {"password", "oldPassword", "newPassword", "confirmPassword"};

    /**
     * 处理完请求后执行
     * 返回通知
     * @param joinPoint 切点
     */
    @AfterReturning(pointcut = "@annotation(controllerLog)", returning = "jsonResult")
    public void doAfterReturning(JoinPoint joinPoint, Log controllerLog, Object jsonResult) {
        handleLog(joinPoint, controllerLog, null, jsonResult);
    }

    /**
     * 拦截异常操作
     * 异常通知
     * @param joinPoint 切点
     * @param e         异常
     */
    @AfterThrowing(value = "@annotation(controllerLog)", throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint, Log controllerLog, Exception e) {
        handleLog(joinPoint, controllerLog, e, null);
    }

    protected void handleLog(final JoinPoint joinPoint, Log controllerLog, final Exception e, Object jsonResult) {
        try {
            // 获取当前的用户
            LoginUser loginUser = SecurityUtils.getLoginUser();

            // *========数据库日志=========*//
            SysOperLog operLog = new SysOperLog();
            operLog.setStatus(BusinessStatus.SUCCESS.ordinal());
            // 请求的地址
            String ip = IpUtils.getIpAddr(ServletUtils.getRequest());
            operLog.setOperIp(ip);
            operLog.setOperUrl(StringUtils.substring(ServletUtils.getRequest().getRequestURI(), 0, 255));
            if (loginUser != null) {
                operLog.setOperName(loginUser.getUsername());
            }

            if (e != null) {
                operLog.setStatus(BusinessStatus.FAIL.ordinal());
                operLog.setErrorMsg(StringUtils.substring(e.getMessage(), 0, 2000));
            }
            // 设置方法名称
            String className = joinPoint.getTarget().getClass().getName();
            String methodName = joinPoint.getSignature().getName();
            operLog.setMethod(className + "." + methodName + "()");
            // 设置请求方式
            operLog.setRequestMethod(ServletUtils.getRequest().getMethod());
            // 处理设置注解上的参数
            getControllerMethodDescription(joinPoint, controllerLog, operLog, jsonResult);
            // 保存数据库，异步操作
            AsyncManager.me().execute(AsyncFactory.recordOper(operLog));
        } catch (Exception exp) {
            // 记录本地异常日志
            log.error("==前置通知异常==");
            log.error("异常信息:{}", exp.getMessage());
            exp.printStackTrace();
        }
    }

    /**
     * 获取注解中对方法的描述信息 用于Controller层注解
     *
     * @param log     日志
     * @param operLog 操作日志
     * @throws Exception
     */
    public void getControllerMethodDescription(JoinPoint joinPoint, Log log, SysOperLog operLog, Object jsonResult) throws Exception {
        // 设置action动作
        operLog.setBusinessType(log.businessType().ordinal());
        // 设置标题
        operLog.setTitle(log.title());
        // 设置操作人类别
        operLog.setOperatorType(log.operatorType().ordinal());
        // 是否需要保存request，参数和值
        if (log.isSaveRequestData()) {
            // 获取参数的信息，传入到数据库中。
            setRequestValue(joinPoint, operLog);
        }
        // 是否需要保存response，参数和值
        if (log.isSaveResponseData() && StringUtils.isNotNull(jsonResult)) {
            operLog.setJsonResult(StringUtils.substring(JSON.toJSONString(jsonResult), 0, 2000));
        }
    }

    /**
     * 获取请求的参数，放到log中
     *
     * @param operLog 操作日志
     * @throws Exception 异常
     */
    private void setRequestValue(JoinPoint joinPoint, SysOperLog operLog) throws Exception {
        String requestMethod = operLog.getRequestMethod();
        if (HttpMethod.PUT.name().equals(requestMethod) || HttpMethod.POST.name().equals(requestMethod)) {
            ////参数存放在请求体里边的情况
            // 如果请求参数在地址栏中，请求参数主要是 key-value ，如果请求参数在请求体中，那么可能存在二进制的参数
            String params = argsArrayToString(joinPoint.getArgs());
            operLog.setOperParam(StringUtils.substring(params, 0, 2000));
        } else {
            //参数放在地址栏的情况
            //提取地址栏中的参数
            Map<?, ?> paramsMap = (Map<?, ?>) ServletUtils.getRequest().getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
            operLog.setOperParam(StringUtils.substring(paramsMap.toString(), 0, 2000));
        }
    }

    /**
     * 参数拼装
     */
    private String argsArrayToString(Object[] paramsArray) {
        String params = "";
        if (paramsArray != null && paramsArray.length > 0) {
            for (Object o : paramsArray) {
                if (StringUtils.isNotNull(o) && !isFilterObject(o)) {
                    try {
                        String jsonObj = JSON.toJSONString(o, excludePropertyPreFilter());
                        params += jsonObj.toString() + " ";
                    } catch (Exception e) {
                    }
                }
            }
        }
        return params.trim();
    }

    /**
     * 忽略敏感属性
     */
    public PropertyPreExcludeFilter excludePropertyPreFilter() {
        return new PropertyPreExcludeFilter().addExcludes(EXCLUDE_PROPERTIES);
    }

    /**
     * 判断是否需要过滤的对象。
     *
     * 上传文件对象、集合中保存了文件上传对象、Map 中保存了文件上传对象、HttpServletRequest、HttpServletResponse、BindResult
     *
     * @param o 对象信息。
     * @return 如果是需要过滤的对象，则返回true；否则返回false。
     */
    @SuppressWarnings("rawtypes")
    public boolean isFilterObject(final Object o) {
        Class<?> clazz = o.getClass();
        if (clazz.isArray()) {
            return clazz.getComponentType().isAssignableFrom(MultipartFile.class);
        } else if (Collection.class.isAssignableFrom(clazz)) {
            Collection collection = (Collection) o;
            for (Object value : collection) {
                return value instanceof MultipartFile;
            }
        } else if (Map.class.isAssignableFrom(clazz)) {
            Map map = (Map) o;
            for (Object value : map.entrySet()) {
                Map.Entry entry = (Map.Entry) value;
                return entry.getValue() instanceof MultipartFile;
            }
        }
        return o instanceof MultipartFile || o instanceof HttpServletRequest || o instanceof HttpServletResponse
                || o instanceof BindingResult;
    }
}
```

## 理解 Aware 接口

- aware：意思是感知

```java
package org.springframework.beans.factory;

/**
 * A marker superinterface indicating that a bean is eligible to be notified by the
 * Spring container of a particular framework object through a callback-style method.
 * The actual method signature is determined by individual subinterfaces but should
 * typically consist of just one void-returning method that accepts a single argument.
 *
 * <p>Note that merely implementing {@link Aware} provides no default functionality.
 * Rather, processing must be done explicitly, for example in a
 * {@link org.springframework.beans.factory.config.BeanPostProcessor}.
 * Refer to {@link org.springframework.context.support.ApplicationContextAwareProcessor}
 * for an example of processing specific {@code *Aware} interface callbacks.
 *
 * @author Chris Beams
 * @author Juergen Hoeller
 * @since 3.1
 */
public interface Aware {

}
```

- BeanFatoryAware：可以获取 Spring 容器中的 Bean

**实战**

```java
@Service
public class UserService implements BeanNameAware {

    public void sayHello() {
        System.out.println("hello javaboy");
    }

    @Override
    public void setBeanName(String s) {
        System.out.println("bean name is" + s);
    }
}
```

- 实现 BeanNameAware 接口，使该类感知到自己在 Spring 容器中的名称
- 项目启动后...

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221024193600927.png)

**Spring Bean 工具类：**

- 实现 BeanFactoryAware 接口，能够获取到 BeanFactory `Bean工厂`对象，之后就可以通过该对象获取 Spring 容器中的对象

```java
/**
 * 这是一个 bean 的工具类，通过这个工具类可以查到各种 bean
 */
@Component
public class BeanUtils implements BeanFactoryAware {
    private static BeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        BeanUtils.beanFactory = beanFactory;
    }

    public static <T> T getBean(String beanName) {
        return (T) beanFactory.getBean(beanName);
    }

}
```

**测试**

```java
@Test
void contextLoads() {
    UserService userService = BeanUtils.getBean("userService");
    userService.sayHello();
}
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221024193846179.png)

**通过 **`**ApplicationContext**`** Spring 容器对象获取对象**

- 实现 ApplicationContextAware 接口

```java
@Component
public class BeanUtils2 implements ApplicationContextAware {
    private static ApplicationContext applicationContext;


    public static <T> T getBean(String beanName) {
        return (T) applicationContext.getBean(beanName);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        BeanUtils2.applicationContext = applicationContext;
    }
}
```

**测试**

```java
@Test
void test2() {
    UserService userService = BeanUtils2.getBean("userService");
    userService.sayHello();
}
```

> 总结：当你想在一个类中获取想要的对象，就可以实现该对象的 Aware 接口


**若依代码分析**

- 注册一个执行任务对象到 Spring 容器中

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221024194614044.png)

- SpringUtils，获取 Spring 容器上下文环境

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221024194734401.png)

**注意：实现 BeanFactoryPostProcessor 接口：可以对 Spring 容器中的 bean 进行修改，并在之后可以获取**

- 获取 Spring 容器中的对象方法

```java
/**
 * 获取对象
 *
 * @param name
 * @return Object 一个以所给名字注册的bean的实例
 * @throws org.springframework.beans.BeansException
 */
@SuppressWarnings("unchecked")
public static <T> T getBean(String name) throws BeansException {
    return (T) beanFactory.getBean(name);
}
```

- 在异步任务管理器中就可以从 Spring 容器中获取执行任务对象

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221024195047783.png)

- 操作日志记录（进行插入数据库操作，生成日志）

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221024195251291.png)

通过 Spring 容器中获取对象，并执行其中的方法

```java
/**
 * 操作日志记录
 *
 * @param operLog 操作日志信息
 * @return 任务task
 */
public static TimerTask recordOper(final SysOperLog operLog) {
    return new TimerTask() {
        @Override
        public void run() {
            // 远程查询操作地点
            operLog.setOperLocation(AddressUtils.getRealAddressByIP(operLog.getOperIp()));
            SpringUtils.getBean(ISysOperLogService.class).insertOperlog(operLog);
        }
    };
}
```

## 自定义注解 + AOP

在系统运行的时候，动态的向系统中添加代码的行为，就是面向切面编程 AOP。

- 前置通知：在目标方法执行之前执行。
- 后置通知：在目标方法执行之后执行。
- 异常通知：当目标方法抛出异常的时候通知。
- 返回通知：当目标方法有返回值的时候通知。
- 环绕通知：这是一个集大成者，包含了上面的四种情况。

在实际项目中，更多的是通过自定义注解+AOP解决各种项目问题：

1. 事务的处理。
2. 接口限流处理：通过一个前置通知，在目标方法执行之前，统计目标方法在给定的时间窗内已经被调用了多少次了，如果超过流量限制，就禁止执行。
3. 接口幂等性处理：通过一个前置通知，在目标方法执行之前，先去统计当前请求在给定的时间内是否已经执行过了，如果已经执行过了，那么本次就拒绝执行。
4. 多数据源切换：通过一个前置通知，在目标方法执行之前，切换系统的数据源，这样，当目标方法执行的时候，就能够获取到切换之后的数据源了。
5. 日志记录：通过一个返回通知或者异常通知，当目标方法执行出错的时候或者执行有返回值的时候，通过一个异步任务，将日志记录下来。
6. 数据权限的处理：通过一个前置通知，在目标方法执行之前，添加 SQL 条件，这些条件最终会被添加到 SQL 语句中，进而实现数据的过滤。
7. JDBC Template...
8. XXX Template...

## AOP 原理

AOP 就是基于动态代理，但是动态代理有两种实现方式：

1. 基于 JDK 的动态代理：要求被代理的对象要有接口。
2. 基于 CGLIB 的动态代理：不需要被代理的对象要有接口。

在 Spring 中：

1.  如果被代理的对象有接口，那么默认就使用 JDK 动态代理。 
2.  如果被代理的对象没有接口，否则就使用 CGLIB 动态代理。 

在 SpringBoot 中：

1.  在 Spring Boot 2.0 之前（不含 2.0）：
a. 如果开发者没有配置 `spring.aop.proxy-target-class`属性，默认使用 JDK 动态代理。
b. 如果 `spring.aop.proxy-target-class` 属性设置为 true ，对于有接口的对象，也会只用 CGLIB 动态代理。
c. 如果 `spring.aop.proxy-target-class` 属性设置为 false，对于由接口的对象，会使用 JDK 动态代理。 
2.  在 Spring Boot 2.0 之后：
a. 默认情况下，就是使用 CGLIB 动态代理，无论被代理的对象是否有接口，都使用 CGLIB 动态代理。
b. 如果 `spring.aop.proxy-target-class` 属性设置为 true ，对于有接口的对象，也会只用 CGLIB 动态代理。
c. 如果 `spring.aop.proxy-target-class` 属性设置为 false，对于由接口的对象，会使用 JDK 动态代理。 

总结：

- Spring 中，有接口用 JDK 动态代理；没接口，用 CGLIB 动态代理。
- Spring Boot 中，2.0 之前，和 Spring 一样；2.0 之后，首选 CGLIB，如果想用 JDK 动态代理，需要开发者手动配置。

## Ruo Yi 权限管理配置

**菜单表分析**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025095256524.png)

**UserDeatilServiceImpl 类**

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    private ISysUserService userService;

    @Autowired
    private SysPasswordService passwordService;

    @Autowired
    private SysPermissionService permissionService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser user = userService.selectUserByUserName(username);
        if (StringUtils.isNull(user)) {
            log.info("登录用户：{} 不存在.", username);
            throw new ServiceException("登录用户：" + username + " 不存在");
        } else if (UserStatus.DELETED.getCode().equals(user.getDelFlag())) {
            log.info("登录用户：{} 已被删除.", username);
            throw new ServiceException("对不起，您的账号：" + username + " 已被删除");
        } else if (UserStatus.DISABLE.getCode().equals(user.getStatus())) {
            log.info("登录用户：{} 已被停用.", username);
            throw new ServiceException("对不起，您的账号：" + username + " 已停用");
        }

        passwordService.validate(user);

        return createLoginUser(user);
    }

    public UserDetails createLoginUser(SysUser user) {
        return new LoginUser(user.getUserId(), user.getDeptId(), user, permissionService.getMenuPermission(user));
    }
}
```

**LoginUser类实现UserDeatil接口，但是 getAuthorities 返回角色方法为null**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025140638525.png)

**这里他自定义 permissions  属性作为属性的权限参数**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025140729546.png)

**在 loadUserByUsername 方法返回值时查询出所有用户权限**

使用 `@PreAuthorize` 注解来限制接口的权限

```java
@PreAuthorize("@ss.hasPermi('system:config:list')")
@GetMapping("/list")
public TableDataInfo list(SysConfig config) {
    startPage();
    List<SysConfig> list = configService.selectConfigList(config);
    return getDataTable(list);
}
```

> 注解说明：这是 SPEL(Spring Expression Lanuage) 的一种写法，表示去执行 spring 容器中名叫 ss 类中的 hasPermi 方法，参数是 'system:config:list'


![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025141223045.png)

**从 SecurityContextHolder 中获取登录用户信息（就是 loadByUserName 方法的返回对象）,将该对象中的权限属性（permissions）与参数传递过来的权限比较，若存在权限，则返回 true...**

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025141418953.png)

## 权限注解的理解

> SPEL：Spring Expression Lanuage
>  
> 相当于 js 中的 eval() 函数，把参数作为脚本代码来执行


- 一个例子

```java
@Test
void contextLoads() {
    //eval
    String exp1 = "1+2";
    SpelExpressionParser spelExpressionParser = new SpelExpressionParser();
    Expression expression = spelExpressionParser.parseExpression(exp1);
    Object value = expression.getValue();
    System.out.println("value = " + value);
}
```

**执行结果：value = 3**

- 调用某个类中的某个属性

```java
@Test
void test1() {
    //这个表达式的意思就是调用 user 对象中的 username 属性
    String exp = "#user.username";
    SpelExpressionParser spelExpressionParser = new SpelExpressionParser();
    Expression expression = spelExpressionParser.parseExpression(exp);
    User user = new User();
    user.setId(11);
    user.setUsername("szh");
    user.setAddress("德清");
    StandardEvaluationContext ctx = new StandardEvaluationContext(); //创建上下文环境，并设置值
    ctx.setVariable("user", user);
    String value = expression.getValue(ctx, String.class);
    System.out.println("value = " + value);
}
```

**执行结果：value = szh**

- 调用某个类中的某个方法

```java
public class UserService {

    public String sayHello(String name) {
        return "hello " + name;
    }

    public String sayHello() {
        return "hello";
    }
}
```

- 带参

```java
@Test
void test3() {
    //这个表达式的意思就是调用 user 对象中的 username 属性
    String exp = "sayHello('szh')";
    SpelExpressionParser spelExpressionParser = new SpelExpressionParser();
    Expression expression = spelExpressionParser.parseExpression(exp);
    StandardEvaluationContext ctx = new StandardEvaluationContext(); //创建上下文环境，并设置值
    UserService userService = new UserService();
    ctx.setRootObject(userService);
    String value = expression.getValue(ctx, String.class);
    System.out.println("value = " + value);
}
```

**执行结果：value = hello szh**

- 不带参

```java
@Test
void test3() {
    //这个表达式的意思就是调用 user 对象中的 username 属性
    String exp = "sayHello()";
    SpelExpressionParser spelExpressionParser = new SpelExpressionParser();
    Expression expression = spelExpressionParser.parseExpression(exp);
    StandardEvaluationContext ctx = new StandardEvaluationContext(); //创建上下文环境，并设置值
    UserService userService = new UserService();
    ctx.setRootObject(userService);
    String value = expression.getValue(ctx, String.class);
    System.out.println("value = " + value);
}
```

**执行结果：value = hello**

- 从 spring 容器中获取对象并执行方法

```java
@Service("bs")
public class BookService {

    public String sayBook() {
        return "这是一本好书...";
    }
}
```

```java
@Autowired
BeanFactory beanFactory;

@Test
void test5() {
    String exp = "@bs.sayBook()";
    SpelExpressionParser spelExpressionParser = new SpelExpressionParser();
    Expression expression = spelExpressionParser.parseExpression(exp);
    StandardEvaluationContext context = new StandardEvaluationContext();
    context.setBeanResolver(new BeanFactoryResolver(beanFactory));
    String value = expression.getValue(context, String.class);
    System.out.println("value = " + value);
}
```

**执行结果：value = 这是一本好书...**

## 权限中的概念梳理

Permission 是一个个具体的权限，例如可以删除一个用户、添加一个用户等等，这些都是操作权限，多个权限合并在一起，就是一个角色。

Shiro 中，当要控制权限的时候，框架本身中是由两个概念的：

- Role
- Permission

但是在 Spring Security 中，反映到代码上，并无明确的 Role 和 Permission：

- 当前用户类，要实现 UserDetails 接口，在这个接口中，如果要返回用户`角色/权限`的话，调用 getAuthorities 方法，此时，getAuthorities 方法究竟是返回角色还是返回权限呢？理论上来说，这里是返回角色还是返回权限，都是 OK 的，但是由于角色是权限的集合，所以我们可以拿着用户的角色，去查询用户的权限，这个地方返回权限更合理一些（粒度更小）。
- 例如创建一个用户的时候，给用户设置角色还是设置权限，最终都是调用同一个方法，只是角色里边多了一个 `ROLE_` 前缀而已。

以 Spring Security 官方用户创建为例：

```java
@Configuration
public class SecurityConfig {

    @Bean
    UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("szh").password("{noop}123")
                //给用户设置角色
                .roles("admin")
                //给用户设置两个权限，可以添加或者删除用户的权限
                .authorities("system:user:add", "system:user:delete")
                .build());
        return manager;
    }
}
```

在这里，虽然我们可以为用户设置 role 或者 权限，但是，在代码层面，这两个的区别仅仅只是 role 的字符串额外带有一个 `ROLE_` 前缀。

当用户登录成功之后，我们去获取用户权限的时候，Spring Security 会自动根据权限和角色字符串的区别。给我们返回用户的权限（角色是不会返回的）；

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public void hello() {
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        for (GrantedAuthority authority : authorities) {
            System.out.println(authorities);
            //[system:user:add, system:user:delete]
            //[system:user:add, system:user:delete]
        }
    }

}
```

上面这个返回也是符合逻辑的，因为一般来说，权限才会控制用户具体的操作，角色一般是不控制用户具体的操作，角色仅仅只是用户权限的集合而已。

权限注解 `@PreAuthorize("hasPermission('/add','system:user:add')")`中，里边的 `hasPermission('/add','system:user:add')` 实际上就是 SPEL 表达式，但是这个执行的方法没有指定这个方法是哪个对象中的方法，所以只有一种可能，这个方法是这里执行的 SPEL 的 RootObject 中的方法（SecurityExpressionRoot）。

使用 @PreAuthorize()注解：

```java
@RestController
public class UserController {

    @RequestMapping("/add")
    @PreAuthorize("hasPermission('/add','system:user:add')")
    public String add() {
        return "add";
    }

    @PreAuthorize("hasPermission('/delete','system:user:delete')")
    @RequestMapping("/delete")
    public String delete() {
        return "delete";
    }

    @PreAuthorize("hasPermission('/update','system:user:update')")
    @RequestMapping("/update")
    public String update() {
        return "update";
    }

    @PreAuthorize("hasPermission('/select','system:user:select')")
    @RequestMapping("/select")
    public String select() {
        return "select";
    }

}
```

在 Security  配置文件上添加 `@EnableGlobalMethodSecurity(prePostEnabled = true)`：

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
```

自定义权限评估器（PermissionEvaluator）：

```java
/**
 * 自定义的权限评估器
 * 只需要将这个自定义的权限评估器注册到 Spring 容器中，就会自动生效
 */
@Component
public class CustomerPermissionEvaluator implements PermissionEvaluator {
    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        // 获取当前用户所具备的所有角色
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        for (GrantedAuthority authority : authorities) {
            if (authority.getAuthority().equals(permission)) {
                //说明当前登录用户具备当前访问所需要的权限
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        return false;
    }
}
```

测试：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025165450824.png)

`system:user:*` 表示具备对用户的所有权限

Spring Security 支持通配符实现：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025165933610.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221025165954062.png)

## 另一种权限判断方式

- 不用评估器的写法（底层已经帮你实现好了）

```java
@RestController
public class UserController {

    @RequestMapping("/add")
    @PreAuthorize("hasAuthority('system:user:add')")
    public String add() {
        return "add";
    }

    @PreAuthorize("hasAuthority('system:user:delete')")
    @RequestMapping("/delete")
    public String delete() {
        return "delete";
    }

    @PreAuthorize("hasAuthority('system:user:update')")
    @RequestMapping("/update")
    public String update() {
        return "update";
    }

    @PreAuthorize("hasAuthority('system:user:select')")
    @RequestMapping("/select")
    public String select() {
        return "select";
    }

}
```

在 Spring Security 中，注解中，判断权限和判断角色的逻辑是一模一样的，唯一的区别在于角色有一个 `ROLE_` 前缀，而权限没有这个前缀

```java
public final boolean hasAuthority(String authority) {
    return this.hasAnyAuthority(authority);
}

public final boolean hasAnyAuthority(String... authorities) {
    return this.hasAnyAuthorityName((String)null, authorities);
}

public final boolean hasRole(String role) {
    return this.hasAnyRole(role);
}

public final boolean hasAnyRole(String... roles) {
    return this.hasAnyAuthorityName(this.defaultRolePrefix, roles);
}

// 无论是判断角色还是判断权限，最终调用的都是 hasAnyAuthorityName，区别主要在于第一参数，判断权限的时候，第一个参数为null，因为权限没有前缀，判断第二个角色的手，第一个参数有前缀，前缀为 ROLE_，这是者两个唯一的区别
private boolean hasAnyAuthorityName(String prefix, String... roles) {
    Set<String> roleSet = this.getAuthoritySet();
    String[] var4 = roles;
    int var5 = roles.length;

    for(int var6 = 0; var6 < var5; ++var6) {
        String role = var4[var6];
        String defaultedRole = getRoleWithDefaultPrefix(prefix, role);
        if (roleSet.contains(defaultedRole)) {
            return true;
        }
    }
}
```

## 自定义权限表达式

- 自定义 SPEL 的根对象（重点）

```java
public class CustomerSecurityExpressionRoot extends SecurityExpressionRoot implements MethodSecurityExpressionOperations {

    private Object filterObject;
    private Object returnObject;

    private AntPathMatcher antPathMatcher = new AntPathMatcher();

    public CustomerSecurityExpressionRoot(Authentication authentication) {
        super(authentication);
    }

    /**
     * 判断当前对象是否具备某一个权限
     *
     * @param permission
     * @return
     */
    public boolean hasPermission(String permission) {
        //获取当前登录用户所具有的权限
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        for (GrantedAuthority authority : authorities) {
            if (antPathMatcher.match(authority.getAuthority(), permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否具备多个权限中的任何一个权限
     *
     * @param permissions
     * @return
     */
    public boolean hasAnyPermissions(String... permissions) {
        if (permissions == null || permissions.length == 0) {
            return false;
        }
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        for (GrantedAuthority authority : authorities) {
            for (String s : permissions) {
                if (antPathMatcher.match(authority.getAuthority(), s)) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean hasAllPermissions(String... permissions) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        if (permissions == null || permissions.length == 0) {
            return false;
        }
        for (String permission : permissions) {
            boolean flag = false;
            for (GrantedAuthority authority : authorities) {
                if (antPathMatcher.match(authority.getAuthority(), permission)) {
                    flag = true;
                }
            }
            if (flag == false) {
                return flag;
            }
        }
        return true;
    }

    @Override
    public void setFilterObject(Object filterObject) {
        this.filterObject = filterObject;
    }

    @Override
    public Object getFilterObject() {
        return filterObject;
    }

    @Override
    public void setReturnObject(Object returnObject) {
        this.returnObject = returnObject;
    }

    @Override
    public Object getReturnObject() {
        return returnObject;
    }

    @Override
    public Object getThis() {
        return null;
    }
}
```

- 处理该根对象

```java
public class CustomerMethodeSecurityExpressionHandler extends DefaultMethodSecurityExpressionHandler {
    
    @Override
    protected MethodSecurityExpressionOperations createSecurityExpressionRoot(Authentication authentication, MethodInvocation invocation) {
        CustomerSecurityExpressionRoot root = new CustomerSecurityExpressionRoot(authentication);
        root.setTrustResolver(getTrustResolver());
        root.setPermissionEvaluator(getPermissionEvaluator());
        root.setRoleHierarchy(getRoleHierarchy());
        return root;
    }
}
```

- 配置 SecurityConfig

```java
@Bean
CustomerMethodeSecurityExpressionHandler customerMethodeSecurityExpressionHandler() {
    return new CustomerMethodeSecurityExpressionHandler();
}
```

- 添加注解，设置接口权限

```java
@RestController
public class UserController {

    @RequestMapping("/add")
    @PreAuthorize("hasPermission('system:user:add')")
    public String add() {
        return "add";
    }

    @PreAuthorize("hasAnyPermissions('system:user:add','system:user:delete')")
    @RequestMapping("/delete")
    public String delete() {
        return "delete";
    }


    @RequestMapping("/update")
    @PreAuthorize("hasAllPermissions('system:user:add','system:user:delete')")
    public String update() {
        return "update";
    }

    @RequestMapping("/select") @PreAuthorize("hasAllPermissions('system:user:add','system:user:delete','system:user:select')")
    public String select() {
        return "select";
    }

}
```

- 测试...

## 使用 Postman 测试项目接口

关闭验证码，登录

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221026082847449.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221026082911832.png)

- 测试接口

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221026082958026.png)

## 自定义 Ruo Yi 项目权限判断表达式（新版貌似不能实现）

- 自定义 CustomerSecurityExpressionRoot 、CustomerMethodeSecurityExpressionHandler 两个类
- 将这两个类放到 Spring 容器中

```java
@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

    @Bean
    CustomerMethodeSecurityExpressionHandler customerMethodeSecurityExpressionHandler(){
        return new CustomerMethodeSecurityExpressionHandler();
    }
}
```

- 全局替换

[@ss.hasPermi ](/ss.hasPermi ) ->  hasPermission 

- 修改 LoginUser 中的 getAuthorities 方法

```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    if (permissions != null && permissions.size() > 0) {
        return permissions.stream().map(p -> new SimpleGrantedAuthority(p)).collect(Collectors.toList());
    }
    return new ArrayList<>();
}
```

## 登录鉴权流程梳理

### 登录流程梳理

##### 登录请求

1.  登录请求，直接发送给登录接口 `/login`，具体方法的处理位于 `org.javaboy.tienchin.web.controller.system.SysLoginController#login`。
a. 调用 `authenticationManager.authenticate(authenticationToken);` 方法执行登录操作，最终会调用到 `org.javaboy.tienchin.framework.web.service.UserDetailsServiceImpl#loadUserByUsername` 方法进行用户登录的认证，认证成功之后会返回一个 LoginUser，这个 LoginUser 中包含用户的基本信息，包括根据用户 id 从数据库中查询到的用户权限。
b. 接下来创建登录令牌，所谓登录的令牌，实际上是一个 JWT 字符串，具体的生成过程如下：
	i. 先获取一个经过处理的 UUID。
	ii. 以 UUID 为 key，登录成功的用户 LoginUser 为 value，将之存储到 Redis 中。
iii. 生成一个 JWT 字符串，这个JWT 字符串的内容就只有第一步获取到的 UUID。 

##### 其他请求

以后所有的登录之外的请求，只要需要认证，都会经过 `org.javaboy.tienchin.framework.security.filter.JwtAuthenticationTokenFilter`类，这个类核心功能就是根据用户登录的时候的 JWT 字符串，去 Redis 中查询到登录用户对象，并存入到 SecurityContextHolder 中。

1.  以后其他请求来的时候，必须携带上 JWT 字符串，携带方式就是将 JWT 字符串放入到请求头中，不携带的话，就认证不通过。 
2.  在 `JwtAuthenticationTokenFilter` 过滤器中，会直接进行 JWT 字符串的处理，根据 JWT 字符串解析出当前登录的用户（从 redis 中获取），具体的处理逻辑在 `org.javaboy.tienchin.framework.web.service.TokenService#getLoginUser` 方法中：
a. 先从请求头中提取出 JWT 字符串。
b. 使用 JWT 解析 这个 JWT 字符串。
c. 根据解析后的 JWT 字符串，再提取出 JWT 中的 token（uuid），然后根据这个 token 去 redis 中查询到当前	登录的用户对象。
d. 由于用户对象存储在 Redis 中，有过期时间，这里拿到之后，刷新一下当前用户在 Redis 中的过期时间。
e. 最后，将当前登录用户对象存到 SecurityContextHolder 中。 

### 鉴权流程梳理

1. 当用户登录成功的时候，就已经把用户的权限信息保存在 LoginUser 中了，当每次请求到达的时候，都会在 `JwtAuthenticationTokenFilter` 过滤器中，重新获取到用户的基本信息（包括用户的权限）存入到 SecurityContextHolder 中。
2. 以后，用户访问某个接口，或者某一个方法，我们需要进行权限控制的时候，直接通过 `@PreAuthorize("@ss.hasPermi('monitor:cache:list')")` 注解去执行即可，这个注解中，会获取到当前用户的角色信息，并和需要的角色信息进行比对。

## AOP 与 动态代理

AOP 面向切面编程，AOP 底层是动态代理，Java 中的动态代理有两种：

- JDK 动态代理：被代理的对象要有接口，才能使用 JDK 动态代理。

定义一个接口和实现类：

```java
public interface Calculator {
    Integer add(int a,int b);
    Integer minus(int a,int b);
}
```

```java
public class CalculatorImpl implements Calculator {
    @Override
    public Integer add(int a, int b) {
        System.out.println(a + "+" + b + "=" + (a + b));
        return a + b;
    }

    @Override
    public Integer minus(int a, int b) {
        System.out.println(a + "-" + b + "=" + (a - b));
        return a - b;
    }
}
```

编写代理对象

```java
public class ProxyDemo01 {
    public static void main(String[] args) {
        CalculatorImpl calculatorImpl = new CalculatorImpl();
        /**
         * 1. classLoader 类加载器
         * 2. 将来生成的代理对象实现的接口/被代理的对象实现的接口
         *
         * Proxy.newProxyInstance 方法的返回值其实就是生成的代理对象，这个代理对象是系统自动为 Calculator 接口提供的实现类，这个实现类就是
         * com.sun.proxy.$Proxy0，相当于系统中，现在 Calculator 接口有两个实现类，一个是自动生成的，一个是 CalculatorImpl。
         *
         * 我们最终实际上调用的是自动生成的代理对象中的 add/minus 方法。
         *
         * 自动生成的代理对象，逻辑类似下面这样：
         *
         * public class $proxy0 implements Calculator{
         *     public int add(int a,int b){
         *              long startTime = System.nanoTime();
         *              //执行反射对象中的方法
         *              Object invoke = method.invoke(calculatorImpl, args);
         *              long endTime = System.nanoTime();
         *              System.out.println(method.getName() + "方法执行耗时 " + (endTime - startTime) + "纳秒");
         *              return invoke;
         *     }
         * }
         */
        Calculator calculator = (Calculator) Proxy.newProxyInstance(ProxyDemo01.class.getClassLoader(), new Class[]{Calculator.class}, new InvocationHandler() {

            /**
             *
             * @param proxy 被代理的对象
             * @param method  接口中的方法 (加法/减法)
             * @param args 方法的参数
             * @return 方法的返回值
             * @throws Throwable
             */
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                long startTime = System.nanoTime();
                Object invoke = method.invoke(calculatorImpl, args);
                long endTime = System.nanoTime();
                System.out.println(method.getName() + "方法执行耗时 " + (endTime - startTime) + "纳秒");
                return invoke;
            }
        });

        calculator.add(3, 4);
    }
}
```

- CGLIB 动态代理：所有的对象都能代理，无论被代理的对象有没有接口。

```java
public class Dog {
    public void eat(){
        System.out.println("dog eat");
    }
}
```

```java
public class DogInterceptor implements MethodInterceptor {

    /**
     * 这个方法类似于 InvocationHandler 方法
     *
     * @param o           代理对象
     * @param method      代理的方法
     * @param objects     方法的参数
     * @param methodProxy 方法对象
     * @return
     * @throws Throwable
     */
    @Override
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        long startTime = System.nanoTime();
        // 这个相当于 jdk 动态代理中的 method.invoke 方法
        Object result = methodProxy.invokeSuper(o, objects);
        long endTime = System.nanoTime();
        System.out.println(method.getName() + "方法执行耗时" + (endTime - startTime) + "纳秒");
        return result;
    }
}
```

```java
public class ProxyDemo02 {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(Dog.class);
        enhancer.setCallback(new DogInterceptor());
        //这里拿到的 Dog 对象，实际上不是我们自己定义的 Dog 对象，而是我们通过动态代理为 Dog 类自动生成的子类对象
        Dog dog = (Dog) enhancer.create();
        dog.eat();
    }
}
```

- 执行加上注解后的 Service 方法

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221026152818319.png)

- debug 执行

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221026152919057.png)

该类实际上是一个代理对象，使用 CGLIB 代理，相当于是 UserService 的子类，而这个子类里面执行的逻辑就相当于 AOP 切面类中执行的逻辑（增强）

事务/注解失效演示：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221026153518690.png)

```java
@Test
void test02(){
    userService.getAllUsers2();
}
```

这里没有使用代理对象去执行，所以注解会失效

## 动态菜单加载思路

### 整体思路

1. 当用户登录成功之后，前端会自动发送一个请求，去后端查询当前这个登录成功的用户的动态菜单，具体的实现思路就是根据当前登录成功的用户 id，去 sys_user_role 表中查询到这个用户的角色 id，然后根据角色 id 去 sys_role_menu 表中查询到菜单 id，然后再根据菜单 id  去 sys_menu 表中查询到具体的菜单数据。
2. 前端定义了一个前置路由导航守卫，当发生页面跳转的时候，这个路由导航守卫会监听到所有的页面跳转，监听到之后，回去检查是否需要服务端返回动态菜单数据，如果需要的话，就去服务端加载，加载到之后，渲染到侧边栏菜单，同时将菜单项都加入到 router 中。

### 菜单表细节

#### is_frame：

- 1 表示不是外链：这个菜单将来点击之后，会在当前系统的一个新的选项卡中打开

```json
{
  "name": "Http://tienchin.vip",
  "path": "/",
  "hidden": false,
  "component": "Layout",
  "meta": {
    "title": "TienChin健身官网",
    "icon": "guide",
    "noCache": false,
    "link": null
  },
  "children": [
    {
      "name": "Tienchin/vip",
      "path": "tienchin/vip",
      "hidden": false,
      "component": "InnerLink",
      "meta": {
        "title": "TienChin健身官网",
        "icon": "guide",
        "noCache": false,
        "link": "http://tienchin.vip"
      }
    }
  ]
}
```

- 0 表示是外链：这个菜单将来点击之后，会在一个浏览器的新的选项卡中打开

```json
{
    "name":"Http://tienchin.vip",
    "path":"http://tienchin.vip",
    "hidden":false,
    "component":"Layout",
    "meta":{
        "title":"TienChin健身官网",
        "icon":"guide",
        "noCache":false,
        "link":"http://tienchin.vip",
        "name":"Http://tienchin.vip",
        "path":"http://tienchin.vip"
    }
}
```

区别：

1. 前者有 children，后者无 children（但是最终渲染出来的侧边栏菜单是一样的）。
2. 前者是需要在当前系统中展示这个外链的内容，所以需要 children，chilren 会给出来外链展示所需要的 component 组件（InnerLink），将来这个外链，就在 InnerLink 这个组件中展示出来。
3. 后者不需要 children，因为后者的菜单项相当于就是一个超链接，点击之后，直接就在浏览器中打开一个新的选项卡去展示。

#### menu_type：

正常来说：

M：这个菜单项是一个目录。

C：这个菜单项是一个具体的菜单。

但是有一些特殊情况：

- 如果一个菜单项，是 C 类型的，那么它必须有一个 parent，如果没有，系统会自动给添加上 Layout 作为其 parent。例如下面这个，角色管理作为一级菜单，它本身是没有 parent （parent 为 0），此时服务端会自动为其添加一个 parent ，并将 Layout 作为 parent 的 component。将来前端在渲染的时候，如果发现这个菜单项只有一个 children，那么就会自动渲染其 children，而不会渲染 parent 了。

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101105059305.png)

```json
{
  "path": "/",
  "hidden": false,
  "component": "Layout",
  "children": [
    {
      "name": "Role",
      "path": "role",
      "hidden": false,
      "component": "system/role/index",
      "meta": {
        "title": "角色管理",
        "icon": "peoples",
        "noCache": false,
        "link": null
      }
    }
  ]
```

- 如果一个菜单项，是 M 类型的，那么它展示的时候，如果不是外链，可能会有一些问题。

```json
{
  "name": "Role",
  "path": "/role",
  "hidden": false,
  "component": "system/role/index",
  "meta": {
    "title": "角色管理",
    "icon": "peoples",
    "noCache": false,
    "link": null
  }
}
```

这个渲染的时候，直接就是渲染它自己，将来展示的组件是缺乏一个 parent，所以，如果点击这个菜单项，这个菜单项的内容会直接填满整个页面。因为相当于当期页面跟登录页面以及项目的主页面平级了。

### 正常的菜单数据

```json
{
  "name": "Tool",
  "path": "/tool",
  "hidden": false,
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "系统工具",
    "icon": "tool",
    "noCache": false,
    "link": null
  },
  "children": [
    {
      "name": "Build",
      "path": "build",
      "hidden": false,
      "component": "tool/build/index",
      "meta": {
        "title": "表单构建",
        "icon": "build",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Gen",
      "path": "gen",
      "hidden": false,
      "component": "tool/gen/index",
      "meta": {
        "title": "代码生成",
        "icon": "code",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Swagger",
      "path": "swagger",
      "hidden": false,
      "component": "tool/swagger/index",
      "meta": {
        "title": "系统接口",
        "icon": "swagger",
        "noCache": false,
        "link": null
      }
    }
  ]
}
```

### 服务端动态菜单 JSON

服务端返回动态菜单 JSON 的接口，整体上来说，分为两个步骤：

1. 去数据库中查询菜单数据。
2. 将查到的菜单数据，构造为前端需要的 JSON 格式。

```java
//org.javaboy.tienchin.web.controller.system.SysLoginController#getRouters
/**
     * 获取路由信息
     *
     * @return 路由信息
     */
@GetMapping("getRouters")
public AjaxResult getRouters() {
    Long userId = SecurityUtils.getUserId();
    List<SysMenu> menus = menuService.selectMenuTreeByUserId(userId);
    return AjaxResult.success(menuService.buildMenus(menus));
}
```

第一步，去数据库中查询菜单 JSON：

```java
/**
 * 根据用户ID查询菜单
 *
 * @param userId 用户名称
 * @return 菜单列表
 */
@Override
public List<SysMenu> selectMenuTreeByUserId(Long userId) {
    List<SysMenu> menus = null;
    if (SecurityUtils.isAdmin(userId)) {
        menus = menuMapper.selectMenuTreeAll();
    } else {
        menus = menuMapper.selectMenuTreeByUserId(userId);
    }
    return getChildPerms(menus, 0);
}
```

如果当前用户是 admin，说明是超级管理员，那么此时直接查询所有菜单数据即可。

如果不是 admin，那么就根据当前登录用户的 id 去查询菜单数据即可。

menus 是查询到的没有进行菜单层级处理的一个集合。

getChildPerms 方法则是通过一个`递归操作`，将菜单的层级关系给建立起来

第二步，构建菜单

```java
/**
 * 构建前端路由所需要的菜单
 *
 * @param menus 菜单列表
 * @return 路由列表
 */
@Override
public List<RouterVo> buildMenus(List<SysMenu> menus) {
    List<RouterVo> routers = new LinkedList<RouterVo>();
    for (SysMenu menu : menus) {
        RouterVo router = new RouterVo();
        router.setHidden("1".equals(menu.getVisible()));
        router.setName(getRouteName(menu));
        router.setPath(getRouterPath(menu));
        router.setComponent(getComponent(menu));
        router.setQuery(menu.getQuery());
        router.setMeta(new MetaVo(menu.getMenuName(), menu.getIcon(), StringUtils.equals("1", menu.getIsCache()), menu.getPath()));
        List<SysMenu> cMenus = menu.getChildren();
        if (!cMenus.isEmpty() && cMenus.size() > 0 && UserConstants.TYPE_DIR.equals(menu.getMenuType())) {
            router.setAlwaysShow(true);
            router.setRedirect("noRedirect");
            router.setChildren(buildMenus(cMenus));
        } else if (isMenuFrame(menu)) {
            router.setMeta(null);
            List<RouterVo> childrenList = new ArrayList<RouterVo>();
            RouterVo children = new RouterVo();
            children.setPath(menu.getPath());
            children.setComponent(menu.getComponent());
            children.setName(StringUtils.capitalize(menu.getPath()));
            children.setMeta(new MetaVo(menu.getMenuName(), menu.getIcon(), StringUtils.equals("1", menu.getIsCache()), menu.getPath()));
            children.setQuery(menu.getQuery());
            childrenList.add(children);
            router.setChildren(childrenList);
        } else if (menu.getParentId().intValue() == 0 && isInnerLink(menu)) {
            router.setMeta(new MetaVo(menu.getMenuName(), menu.getIcon()));
            router.setPath("/");
            List<RouterVo> childrenList = new ArrayList<RouterVo>();
            RouterVo children = new RouterVo();
            String routerPath = innerLinkReplaceEach(menu.getPath());
            children.setPath(routerPath);
            children.setComponent(UserConstants.INNER_LINK);
            children.setName(StringUtils.capitalize(routerPath));
            children.setMeta(new MetaVo(menu.getMenuName(), menu.getIcon(), menu.getPath()));
            childrenList.add(children);
            router.setChildren(childrenList);
        }
        routers.add(router);
    }
    return routers;
}
```

从这段代码中，可以看出来，返回的动态菜单 JSON 一共分为了四种情况。

常规数据：

1. 可见性

```java
router.setHidden("1".equals(menu.getVisible()));
```

1. name：正常来说，name 都是 path 首字母大写，特殊情况就是如果当前类型为 C 并且是一级菜单而且还不是 外链，这个时候会自动为这个菜单项生成一个 parent，这个 parent 的 name 为空字符串。

```java
/**
 * 获取路由名称
 *
 * @param menu 菜单信息
 * @return 路由名称
 */
public String getRouteName(SysMenu menu) {
    String routerName = StringUtils.capitalize(menu.getPath());
    // 非外链并且是一级目录（类型为菜单）
    if (isMenuFrame(menu)) {
        routerName = StringUtils.EMPTY;
    }
    return routerName;
}
```

1.  path：
a. 不是一级菜单，并且还是内链打开外网（在当前系统中，新开一个选项卡，打开外部链接）：去除掉 path 中的 http 或者 https 即可。
b. 非外链并且是一级目录并且是 M 类型，此时 path 就在数据库查出来的 path 前加上 / 。
c. 非外链并且是一级目录并且是 C 类型，此时 path 就是 / 。
d. 其他情况就是直接返回菜单项即可。
e. **对于正常的菜单数据而言，parent 实际上就是走第二个 if（在  path 前加上 / ），children 实际上就是不会进入到任何分支中，直接返回。** 

```java
/**
 * 获取路由地址
 *
 * @param menu 菜单信息
 * @return 路由地址
 */
public String getRouterPath(SysMenu menu) {
    String routerPath = menu.getPath();
    // 内链打开外网方式
    if (menu.getParentId().intValue() != 0 && isInnerLink(menu)) {
        routerPath = innerLinkReplaceEach(routerPath);
    }
    // 非外链并且是一级目录（类型为目录）
    if (0 == menu.getParentId().intValue() && UserConstants.TYPE_DIR.equals(menu.getMenuType())
            && UserConstants.NO_FRAME.equals(menu.getIsFrame())) {
        routerPath = "/" + menu.getPath();
    }
    // 非外链并且是一级目录（类型为菜单）
    else if (isMenuFrame(menu)) {
        routerPath = "/";
    }
    return routerPath;
}
```

4.  component：
a. Layout：项目的主页面。
b. Inner_Link：展示外链的组件（当前系统展示的选项卡）。
c. Parent_View：如果一个二级菜单还有子菜单，那么这个二级菜单对应的 component 就是 Parent_View。
d. 首先定义一个默认的 component，就是 Layout。
e. 如果当前菜单项有 component，并且当前菜单项还不是一个内部跳转的菜单，那么这个 component 就是从数据库中实际查询到的 component。
f. 如果自己没有 component，并且不是一级菜单，并且还是一个内链（想在当前系统中打开外部链接），设置默认的组件为 Inner_Link。
g. 如果自己没有 component，并且还有子菜单，那么就设置当前菜单的 component 为 Parent_View。（日志管理） 

```java
/**
 * 获取组件信息
 *
 * @param menu 菜单信息
 * @return 组件信息
 */
public String getComponent(SysMenu menu) {
    String component = UserConstants.LAYOUT;
    if (StringUtils.isNotEmpty(menu.getComponent()) && !isMenuFrame(menu)) {
        component = menu.getComponent();
    } else if (StringUtils.isEmpty(menu.getComponent()) && menu.getParentId().intValue() != 0 && isInnerLink(menu)) {
        component = UserConstants.INNER_LINK;
    } else if (StringUtils.isEmpty(menu.getComponent()) && isParentView(menu)) {
        component = UserConstants.PARENT_VIEW;
    }
    return component;
}
```

5.  query、meta 都按实际情况来 
6.  如果当前菜单有 children，那么递归处理 children。 
7.  如果当前菜单是 C 类型的，并且还不是外链还是一级菜单，那么就自动给这个菜单项添加一个 children（menu_type 中的第一种情况） 
8.  如果是一级菜单并且想在内部选项卡中展示一个外部页面，对应 is_frame 中的第一种情况，也就是会自动生成一个 chilren。 
9.  三个分支都没进来，说明就没有 chilren，is_frame 中的第二种情况，menu_type 中的第二种情况。 

## 动态菜单思路梳理

整体上，菜单分为四种情况：

### 有父有子

这种情况，有父菜单，有子菜单：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101141946284.png)

**菜单 JSON**

```json
{
  "name": "System",
  "path": "/system",
  "hidden": false,
  "redirect": "noRedirect",
  "component": "Layout",
  "alwaysShow": true,
  "meta": {
    "title": "系统管理",
    "icon": "system",
    "noCache": false,
    "link": null
  },
  "children": [
    {
      "name": "User",
      "path": "user",
      "hidden": false,
      "component": "system/user/index",
      "meta": {
        "title": "用户管理",
        "icon": "user",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Menu",
      "path": "menu",
      "hidden": false,
      "component": "system/menu/index",
      "meta": {
        "title": "菜单管理",
        "icon": "tree-table",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Dept",
      "path": "dept",
      "hidden": false,
      "component": "system/dept/index",
      "meta": {
        "title": "部门管理",
        "icon": "tree",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Post",
      "path": "post",
      "hidden": false,
      "component": "system/post/index",
      "meta": {
        "title": "岗位管理",
        "icon": "post",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Dict",
      "path": "dict",
      "hidden": false,
      "component": "system/dict/index",
      "meta": {
        "title": "字典管理",
        "icon": "dict",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Config",
      "path": "config",
      "hidden": false,
      "component": "system/config/index",
      "meta": {
        "title": "参数设置",
        "icon": "edit",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Notice",
      "path": "notice",
      "hidden": false,
      "component": "system/notice/index",
      "meta": {
        "title": "通知公告",
        "icon": "message",
        "noCache": false,
        "link": null
      }
    },
    {
      "name": "Log",
      "path": "log",
      "hidden": false,
      "redirect": "noRedirect",
      "component": "ParentView",
      "alwaysShow": true,
      "meta": {
        "title": "日志管理",
        "icon": "log",
        "noCache": false,
        "link": null
      },
      "children": [
        {
          "name": "Operlog",
          "path": "operlog",
          "hidden": false,
          "component": "monitor/operlog/index",
          "meta": {
            "title": "操作日志",
            "icon": "form",
            "noCache": false,
            "link": null
          }
        },
        {
          "name": "Logininfor",
          "path": "logininfor",
          "hidden": false,
          "component": "monitor/logininfor/index",
          "meta": {
            "title": "登录日志",
            "icon": "logininfor",
            "noCache": false,
            "link": null
          }
        }
      ]
    }
  ]
}
```

### 只有一个一级菜单

这种又细分为三种情况：

##### 普通的菜单

这种普通菜单，点击之后，在右边打开一个新的选项卡，展示我们的系统内容

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101142326522.png)

菜单 JSON

```json
[
  {
    "name": "Role",
    "path": "role",
    "hidden": false,
    "component": "system/role/index",
    "meta": {
      "title": "角色管理",
      "icon": "peoples",
      "noCache": false,
      "link": null
    }
  }
]
```

##### 超链接（非外链）

对应的数据表中，is_frame 为 1，menu_type 为 M

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101142639404.png)

```java
{
  "name": "Https://shenzehui.github.io/",
  "path": "/",
  "hidden": false,
  "component": "Layout",
  "meta": {
    "title": "TienChin健身官网",
    "icon": "guide",
    "noCache": false,
    "link": null
  },
  "children": [
    {
      "name": "Shenzehui/github/io/",
      "path": "shenzehui/github/io/",
      "hidden": false,
      "component": "InnerLink",
      "meta": {
        "title": "TienChin健身官网",
        "icon": "guide",
        "noCache": false,
        "link": "https://shenzehui.github.io/"
      }
    }
  ]
}
```

##### 超链接（外链）

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101142822101.png)

菜单 JSON 有两种情况（is_frame 为 1，但是 menu_type 为 C）

```json
{
  "path": "/",
  "hidden": false,
  "component": "Layout",
  "children": [
    {
      "name": "Https://shenzehui.github.io/",
      "path": "https://shenzehui.github.io/",
      "hidden": false,
      "meta": {
        "title": "TienChin健身官网",
        "icon": "guide",
        "noCache": false,
        "link": "https://shenzehui.github.io/"
      }
    }
  ]
}
```

另一种情况，is_frame 为 0，menu_type 为M

```java
{
  "name": "Https://shenzehui.github.io/",
  "path": "https://shenzehui.github.io/",
  "hidden": false,
  "component": "Layout",
  "meta": {
    "title": "TienChin健身官网",
    "icon": "guide",
    "noCache": false,
    "link": "https://shenzehui.github.io/"
  }
}
```

is_frame 为 0，menu_type 为 C

```java
{
  "name": "Https://shenzehui.github.io/",
  "path": "https://shenzehui.github.io/",
  "hidden": false,
  "component": "Layout",
  "meta": {
    "title": "TienChin健身官网",
    "icon": "guide",
    "noCache": false,
    "link": "https://shenzehui.github.io/"
  }
}
```

### 总结

1.  如果 is_frame 为 0，说明这个菜单为外链，此时无论 menu_type 是 M 还是 C，都是在浏览器新的选项卡中打开外链。 
2.  如果 is_frame 为 1，说明不是一个外链（准确来说这个菜单项的打开不需要打开浏览器新的选项卡），菜单点击之后，是在自己的项目中打开一个新的选项卡，但是这个新的选项卡的展示需要有两种情况：
a. 展示了一个外部网站的页面（此时，menu_type 为 M）：超链接（非外链展示）
b. 展示了项目中的一个菜单项（此时，menu_type 为 C）：普通菜单（角色管理，又父有子的子菜单） 

## Vue3 中的动态菜单递归渲染

### layout 文件夹下的 index.vue 组件

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101154851131.png)

### Siderbar/index.vue

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101154939832.png)

### Sidebar-Item.vue 组件（递归实现）

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101154430730.png)

## 前端固定路由定义

### 公共路由

> 公共路由：不考虑用户角色/权限等信息，无论用户的身份如何，这些公共路由都是要加入进来的


```javascript
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]
```

### 动态路由

> 基于用户权限动态去加载


```javascript
xport const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]
```

**注：这些路由都是隐藏起来的，所以说这些路由不会在 sideBar 侧边栏展示出来，而是当用户有特定权限后，在不同页面执行特定操作后才会进行展示。**

比如用户管理中的分配角色功能，角色管理中的分配用户功能。

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101155538000.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101155457265.png)

## Vue3 中的数据加载

### Pinia

Pinia 也是一个状态管理工具，作用是 Vuex 基本上是一致的。Pinia 的用法和 Vuex 基本上一模一样，只有导入的时候有一些差异，其他地方基本上一致的，所以，使用 Pinia，大家将之当作 Vuex 来使用即可。

Pinia 是一个轻量级的状态管理库（相对于 Vuex 而言），Pinia 和 Vuex 的运行都是比较快的，在一些特殊情况下，Pinia 的运行效率甚至要高于 Vuex，最主要的原因还是因为 Pinia 是一个轻量级框架，他的体积约为 1KB。

### 前端请求的封装

vhr：封装的请求工具类，将对应的请求方法作为 Vue 的插件，在需要使用的地方，直接通过 this.getRequest() 去执行网络请求的。

tiechine：将所有的网络请求统一封装起来，然后在需要做网络请求的地方，直接去调用对应的方法。

所有被封装的请求，都在 src/api 文件夹中：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221101161339749.png)

- login.js：这个 js 文件封装了所有和登录相关的网络请求方法，所有的请求方法都已经提前写好了请求地址、请求参数、请求头等信息。
- menu.js：封装的就是所有和菜单相关的网络请求。

例如登录请求：

src/api/login.js

```javascript
// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
```

在需要登录的地方，直接调用这个方法，并传递响应的参数即可。

### 登录流程

1. 根据 router/index.js 的定义，可以找到登录页面是 views/login.vue 文件。
2. 执行具体的登录方法，已经在 `src/api/login.js` 文件中封装好了，还要保存用户的基本信息（例如 token），所以还对登录请求方法进行了二次封装，二次封装是在 Pinia 中进行封装的，具体位置在 `src/store/modules/user.js` 文件中，当用户登录成功之后，顺便保存用户的基本信息（Token）。
3. 需要注意的是，单纯就登录来说，登录成功之后，只是保存了用户的 token，其他事情都没做

### 动态菜单加载

TienChin 中的动态菜单加载和 vhr 中的加载思路是一模一样：

1. 用户数据以及动态菜单数据，都是保存在 Pinia 中，Pinia 中的数据特点，就是当用户按了浏览器刷新按钮或者 F5 按钮之后，Pinia 中的数据会丢失。所以，我们需要确保当用户按了浏览器刷新按钮之后，要主动的重新加载一起动态菜单数据。
2. 加载的思路，就是利用全局前置导航守卫，当发生页面跳转的时候，通过全局导航守卫可以监听到所有的页面跳转，监听到之后，先去判断 Pinia 中的菜单数据是否还在，如果还在，说明当前跳转就是一次普普通通的页面跳转，否则说明用户是按了 F5 进行的页面跳转，那么此时就要先去加载浏览器的菜单数据了。

### 为什么要把菜单数据存到 Pinia/Vuex 中？

不能存到 sessionStorage 或者 localStorage 中吗？

首先要明白，服务端返回的动态菜单实际上有两方面的作用：

1.  渲染左侧的菜单栏，这个好说，哪怕你把菜单数据存到 sessionStorage、localStorage 或者是 Cookie 中，将来都是可以渲染出来的。 
2.  添加到路由中，这个路由，说白了，这个路由其实是一个内存对象，从服务端加载到菜单数据之后，我们会将菜单数据动态加到 router 中，这样，点击左边的菜单项，右边才会进行页面跳转，**但是，这个 router 中的数据，是保存在内存中的。**这就意味着，如果用户点击了浏览器刷新按钮，或者用户点击了 F5 按钮，都会导致 router 中的数据丢失。如果 router 中的数据丢失了，那么就无法进行页面跳转了。 

所以说白了，其实就是 router 这个对象，限制了动态菜单数据，他要求必须在浏览器刷新之后（或者按 F5 之后）重新加载一次动态菜单，否则，浏览器刷新之后，router 中没东西了，没东西就无法进行页面跳转了。

假设动态菜单存到 sessionStorage 中：

1.  动态菜单渲染是没问题的。 
2.  router：按了 F5 之后，router 中的数据就没了，此时虽然 sessionStorage 中有数据，但是 router 中没有数据，跳转不了。那么能不能把 sessionStroage 中的数据拿出来放到 router 中呢，想拿是可以的，但是有一个问题：什么时候拿？
a. 监听浏览器的刷新事件。
b. 在导航守卫里边去处理。 

## 前端路由守卫代码分析

```javascript
/**
 *路由前置导航守卫
 * 在 Vue 中的所有页面跳转，都会被这个全局前置导航守卫监听到，这个类似于 Java 中的 Filter
 * to：要去哪，去哪个页面：类似于 HttpServletResponse
 * from：从哪来，从哪个页面来，类似于 HttpServletReqeust
 * next：一个继续向下执行的函数，类似于 FilterChain
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 获取令牌，当用户登录成功之后，用户的登录令牌会被存入到 Cookie 中，所以这里其实就是从 Cookie 中获取登录令牌，以此作为判断用户是否已经登录的依据
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token*/
    // 如果已经登录了，但是此时还想跳转到登录页面，这个操作是不允许的，此时默认就会跳转到项目首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果去的不是登录页面，而是去普通页面，此时又分为两种情况：
      // useUserStore().roles.length === 0 表示此时 Pinia 中没有保存用户信息，也没有保存菜单信息（意味着用户可能点击了浏览器的刷新按钮或 F5）
      // 两种情况下。这个 roles 的长度为 0：1.刚登录的时候，还没去服务端请求用户信息的时候（当然这个时候动态菜单信息也没请求） 2.按浏览器刷新按钮的时候，这个长度会变为0
      // 通过这个，可以判断出从服务端加载到的动态菜单是否还存在
      if (useUserStore().roles.length === 0) { // 第一次登录或者 F5 刷新
        isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        // 加载用户基本信息
        useUserStore().getInfo().then(() => {
          isRelogin.show = false
          // 加载路由信息
          usePermissionStore().generateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            // 将加载的路由添加到 router 中
            accessRoutes.forEach(route => {
              if (!isHttp(route.path)) {
                router.addRoute(route) // 动态添加可访问路由表
              }
            })
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          useUserStore().logOut().then(() => {
            ElMessage.error(err)
            next({ path: '/' })
          })
        })
      } else {
        // 说明是普普通通的用户跳转
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
```

## 前端动态菜单加载的四个核心变量

```javascript
state: () => ({
    /**
   * 保存了本地的公共路由和服务端返回的动态路由（菜单），这个 routes 将来主要在两个地方使用：
   * 1. 首页搜索时使用
   * 2. tagview 中使用
   *
   * 从 routes 的使用场景中，可以看到，routes 变量实际上并不涉及到页面渲染，单纯的只是处理页面的逻辑
   */
    routes: [],
    // 暂无具体使用场景，可以删除之
    addRoutes: [],
    /**
   * 这个相当于动态路由的一个备份，也可以理解为是完整的 sidebarRoutes 的一个备份，无论什么情况，defaultRoutes 都表示 1-n 级菜单
   */
    defaultRoutes: [],
    /**
   * 如果开启了顶部导航菜单，相关的渲染就是由 topbarRouters 完成的
   */
    topbarRouters: [],
    /**
   * 左侧的导航栏，正常来说，这个会参与左侧菜单的渲染，默认也是完整的 1-n 级菜单，但是如果开启了顶部菜单，这个变量就是 2-n 级菜单
   */
    sidebarRouters: []
}),
```

-  routes：保存了本地的公共路由和服务端返回的动态路由（菜单），这个 routes 将来主要在两个地方使用 
   -  首页搜索时使用 
   -  tagView 中使用
   ![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221104193017489.png) 

> 从 routes 的使用场景中，可以看到，routes 变量实际上并不涉及到页面渲染，单纯的只是处理页面的逻辑


- addRoutes：暂无具体使用场景，可以删除之
- defaultRoutes：这个相当于动态路由的一个备份，也可以理解为是完整的 sidebarRoutes 的一个备份，无论什么情况，defaultRoutes 都表示 1-n 级菜单
- topbarRouters：如果开启了顶部导航菜单，相关的渲染就是由 topbarRouters 完成的
- siderbarRouters：左侧的导航栏，正常来说，这个会参与左侧菜单的渲染，默认也是完整的 1-n 级菜单，但是如果开启了顶部菜单，这个变量就是 2-n 级菜单。

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221104193820837.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221104194000380.png)

使用场景：

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105104436828.png)

## routes 变量多级菜单铺平

> 菜单铺平：这个 routes 有区别于下面三个变量的特点，这个 routes 中的 children 铺平了：就是把所有的 3-n 级菜单，全部变成 2 级菜单，这个铺平一共干了两件事：
>  
> 1. 所有的 3-n 级菜单，全部变为 2 级菜单
> 2. 在变的过程中，将组件的 path 改为 父组件的 path + 子组件的 path
> 

> 由于这个 routes 变量做的是幕后的工作，不影响菜单的渲染，所以可以做铺平操作

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105105951808.png)



## 生成动态路由方法分析

### component 字符串转对象

```javascript
// 这个变量保存的是服务端返回的动态 JSON 中的 component 字符串变为了对象
const sidebarRoutes = filterAsyncRouter(sdata)
// 这个变量保存的是服务端返回的动态 JSON 中的 component 字符串变为了对象
const defaultRoutes = filterAsyncRouter(defaultData)
```

- filterAsyncRouter 方法

```javascript
/**
 * 这个方法主要将服务端返回的 component 字符串转为 component 组件（对象）
 * @param asyncRouterMap 服务端返回的动态 JSON 字符串
 * @param lastRouter 是否是最后一个路由（没有用到）
 * @param type  是否需要进行 children 铺平操作
 * @returns {*}
 */
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        // 说明是一些功能性组件
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      //递归处理 children 中的 component，将 children 的 component 字符串也变为对象
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}
```

- 功能性组件加载

```javascript
/**
 * 去动态加载功能性的组件
 *
 * modules 保存了所有的功能性组件
 *
 * modules 中保存的数据类似如下格式 这是一种 key->value 格式，key 是路径，value 是懒加载的函数
 * ./../../views/system/menu/index.vue : () => import("/src/views/system/menu/index.vue")
 * @param view 后端返回的 component 字符串的名字
 * @returns {function(): Promise<{[p: string]: any}>}
 */
export const loadView = (view) => {
  let res;
  for (const path in modules) {
    // system/menu/index.vue -> system/menu/index
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();  //根据 key 获取对应 value 返回即可
    }
  }
  return res;
}
```

- modules 变量

```javascript
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105113920412.png)

### 多级菜单铺平

```javascript
// 这是一个重写后的 routes，这个重写后的 routes 主要是将 3-n 级菜单统统变为 2 级菜单
const rewriteRoutes = filterAsyncRouter(rdata, false, true)
```

- 调用该方法

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105114459168.png)

```javascript
/**
 * 这个方法主要是做菜单铺平操作、菜单铺平涉及两件事：
 * 1. 将 3-n 级菜单变为 2 级菜单
 * 2. 将 3-n 级菜单的 path 变为父组件的 path，变为子组件的 path
 *
 * @param childrenMap 要处理的菜单数组 用户管理、菜单管理、部门管理...
 * @param lastRouter
 * @returns {*[]}
 */
function filterChildren(childrenMap, lastRouter = false) {
    // 将 2-n 级菜单都装入 children 变量中
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) { // 日志管理进入
            if (el.component === 'ParentView' && !lastRouter) {  // 后端处理中添加 ParentView
                el.children.forEach(c => {
                    // 操作日志的 path = 日志管理的 path(log) + "/" + 操作日志的path(operlog)
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        // 如果操作日志还有 children，那么就通过一个递归，将其 children 都过滤出来
                        children = children.concat(filterChildren(c.children, c)) // lastRouter 为true，方便后面的 path 拼接
                        // 操作日志不用添加到 children
                        return
                    }
                    children.push(c) //将操作日志放入
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        /**
         * 以系统管理为例，从用户管理到通知公告，上面两个 if 都不会进去，直接将之放到 children 中即可（因为这些本来就是二级菜单，并且没有 children）
         * @type {*[]}
         */
        children = children.concat(el)
    })
    return children
}
```

### 根据登录用户权限过滤前端本地动态路由

```javascript
const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
asyncRoutes.forEach(route => {
    router.addRoute(route)
})
```

> 本地动态路由，根据用户权限查询出本地定义的可用的动态路由，这些动态路由都不涉及到菜单渲染，所以查询到之后，直接遍历，放到 router 对象中即可（因为router.js 中并没有导出动态路由，需要自己加载）


```javascript
// 动态路由遍历，验证是否具备权限
/**
 * 根据当前登录用户的权限，过滤出本地定义的动态路由中，有哪些是可用的
 * @param routes
 * @returns {*[]}
 */
export function filterDynamicRoutes(routes) {
    const res = [] //根据用户权限过滤出来的本地动态路由
    routes.forEach(route => {
        if (route.permissions) {
            if (auth.hasPermiOr(route.permissions)) {
                res.push(route)
            }
        } else if (route.roles) {
            if (auth.hasRoleOr(route.roles)) {
                res.push(route)
            }
        }
    })
    return res
}
```

- hasPermior 方法

```javascript
// 验证用户是否含有指定权限，只需包含其中一个
hasPermiOr(permissions) {
  return permissions.some(item => {
    return authPermission(item)
  })
},
```

```javascript
function authPermission(permission) {  //permission 是需要的权限
  const all_permission = "*:*:*";
  const permissions = useUserStore().permissions // permissions 是登录用户的权限
  if (permission && permission.length > 0) {
    return permissions.some(v => {   // 遍历登录用户的权限
      return all_permission === v || v === permission // 若登录用户权限为超级管理员（具有所有权限）或者具有所需要的权限，返回 true
    })
  } else {
    return false
  }
}
```

router.js

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105121704651.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105121736550.png)

### generateRoutes 方法

```javascript
generateRoutes(roles) {
    return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
            // 这个类似于 Java 中的深拷贝，如果直接将服务端返回的 JSON 变量赋值给三个普通的变量，那么三个变量会指向同一个内存地址，这样就导致了一个变量发生变化，另外两个变量会跟着变
            // 将 JSON 转为字符串，再将字符串转为 JSON，这样三个变量就使用三个不同的内存地址，将来在具体应用的过程中就互不影响
            // Object.assign() 对象拷贝方法
            const sdata = JSON.parse(JSON.stringify(res.data))
            const rdata = JSON.parse(JSON.stringify(res.data))
            const defaultData = JSON.parse(JSON.stringify(res.data))

            // 这个变量保存的是服务端返回的动态 JSON 中的 component 字符串变为了对象
            const sidebarRoutes = filterAsyncRouter(sdata)
            // 这是一个重写后的 routes，这个重写后的 routes 主要是将 3-n 级菜单统统变为 2 级菜单
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            // 这个变量保存的是服务端返回的动态 JSON 中的 component 字符串变为了对象
            const defaultRoutes = filterAsyncRouter(defaultData)
            // 本地动态路由，根据用户权限查询出本地定义的可用的动态路由，这些动态路由都不涉及到菜单渲染，所以查询到之后，直接遍历，放到 router 对象中即可（因为router.js 中并没有导出动态路由，需要自己加载）
            const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
            asyncRoutes.forEach(route => {
                router.addRoute(route)
            })
            // 这个实际上是前端公共路由和服务端返回的动态路由，赋值给 routes
            this.setRoutes(rewriteRoutes)
            // 左侧菜单栏渲染，这个也是公共路由 + sidebarRoutes
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
            // 这个中永远保存的是最最完整的菜单项数据，也是 constantRoutes + constantRoutes，只不过是在 set 方法中添加
            this.setDefaultRoutes(sidebarRoutes)
            // 这个是顶部菜单数据源
            this.setTopbarRoutes(defaultRoutes)
            resolve(rewriteRoutes)
        })
    })
}
```

## Promise

### 回调地狱

登录 —> 获取用户信息 —> 获取用户菜单。

如果我们用 Ajax 来写，伪代码如下：

```javascript
$.ajax({
    url:'/login',
    data:loginForm,
    success:function (data){
        //登录成功
        $.ajax({
            url:'/getInfo',
            success:function (data){
                //获取用户信息成功
                $.ajax({
                    url:'/getMenus',
                    success:function (data){
                        //获取菜单成功
                    }
                })
            }
        })
    }
})
```

原生的 Ajax，异步任务执行的逻辑和处理的逻辑写在了一起，导致如果有多个网络请求，并且多个请求存在依赖的关系，就会造成**回调地狱**。

我们希望能够将异步任务执行的代码和处理的代码分离开，能够实现这一需求的工具就是 **Pormise**。

### Promise

登录 —> 获取用户信息 —> 获取用户菜单。

```javascript
<script>
    /**
     * 登录
     * @param resolve
     * @param reject
     */
    function login(resolve, reject) {
        setTimeout(() => {
            // 生成一个随机数
            let number = Math.random();
            if (number > 0.5) {
                // 登录成功，利用 resolve 函数将登录成功后的结果扔出去
                resolve('login success');
            } else {
                // 登录失败，利用 reject 函数将登录失败的结果扔出去
                reject('login error');
            }
        }, 2000)
    }

    function getInfo(resolve, reject) {
        setTimeout(() => {
            let number = Math.random();
            if (number > 0.5) {
                resolve('getInfo success');
            } else {
                reject('getInfo error');
            }
        }, 2000)
    }

    function getMenus(resolve, reject) {
        setTimeout(() => {
            let number = Math.random();
            if (number > 0.5) {
                resolve('getMenus success');
            } else {
                reject('getMenus error');
            }
        }, 2000)
    }

    new Promise(login).then(data => {
        //如果 login 将来执行成功（就是 resolve 方法抛出执行结果的时候）
        console.log("login:" + data);
        return new Promise(getInfo);
    }).then(data => {
        // getInfo 执行成功，会进入到这里
        console.log("getInfo:" + data);
        return new Promise(getMenus);
    }).then(data => {
        // getMenus 执行成功，会进入到这里
        console.log("getMenus:" + data);
    }).catch(error=>{
        // 如果上面任意一个出异常了，都会进入到最近的 catch 代码块中
        console.error("error:" + error);
    })
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105135707616.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105135717200.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105135756285.png)

Promise 中，执行成功，就通过 resolve 将成功的结果抛出去；执行失败，就通过 reject 将失败的结果抛出去。

在 Promise 中，只管抛出执行结果即可。

如果是 resolve 执行了，则进入到接下来的 then 中，对异步任务的执行结果进行处理；如果是 reject 执行了，则进入到 catch 代码块中，对异常的结果进行处理。

### then

#### then 方法的参数

then 方法中，可以传递两个回调函数，第一个是成功的回调函数，第二个是失败的回调函数，如果没有传递第二个参数，那么可以在 catch 中处理失败。

```javascript
<script>
    /**
     * 登录
     * @param resolve
     * @param reject
     */
    function login(resolve, reject) {
    setTimeout(() => {
        // 生成一个随机数
        let number = Math.random();
        if (number > 0.5) {
            // 登录成功，利用 resolve 函数将登录成功后的结果扔出去
            resolve('login success');
        } else {
            // 登录失败，利用 reject 函数将登录失败的结果扔出去
            reject('login error');
        }
    }, 2000)
}

new Promise(login).then(data => {
    //如果 login 将来执行成功（就是 resolve 方法抛出执行结果的时候）
    console.log("login:" + data);
},error=>{
    console.error("error:" + error);
})
</script>
```

#### then 方法的返回值

##### 返回 promise

前面的例子，返回的就是 Pormise，这样的话，下一个 then 他的主语就是上一个 then 返回的 Promise。

```javascript
A.then(data=>(xxxx;return B)).then(data=>{xxxx})
```

由于在 A 的 then 中，返回了 B，所以第二个 then 的主语，其实是 B，不是 A（假设 A 和 B 都是 Promise 对象）。

##### 返回字符串

then 方法中可以就返回一个字符串，此时可以一直 then 下去，所有的 then 方法此时都是同一个主语。

```javascript
<script>
    /**
     * 登录
     * @param resolve
     * @param reject
     */
    function login(resolve, reject) {
        setTimeout(() => {
            // 生成一个随机数
            let number = Math.random();
            if (number > 0.5) {
                // 登录成功，利用 resolve 函数将登录成功后的结果扔出去
                resolve('login success');
            } else {
                // 登录失败，利用 reject 函数将登录失败的结果扔出去
                reject('login error');
            }
        }, 2000)
    }

    new Promise(login).then(data => {
        //如果 login 将来执行成功（就是 resolve 方法抛出执行结果的时候）
        console.log("then1:" + data);
        return data;
    }).then(data => {
        console.log("then2:" + data);
        return data;
    }).then(data => {
        console.log("then3:" + data);
    }).catch(error => {
        console.error("error:", error);
    })
</script>
```

此时，三个 then 都是同一个主语，因为在 then 中，没有返回新的 Promise 对象。每一个 then 的参数，都是上一个 then 的返回值。

##### 抛出异常

then 方法也可以抛出异常

```javascript
<script>
    /**
     * 登录
     * @param resolve
     * @param reject
     */
    function login(resolve, reject) {
        setTimeout(() => {
            // 生成一个随机数
            let number = Math.random();
            if (number > 0.5) {
                // 登录成功，利用 resolve 函数将登录成功后的结果扔出去
                resolve('login success');
            } else {
                // 登录失败，利用 reject 函数将登录失败的结果扔出去
                reject('login error');
            }
        }, 2000)
    }

    new Promise(login).then(data => {
        //如果 login 将来执行成功（就是 resolve 方法抛出执行结果的时候）
        console.log("then1:" + data);
        return data;
    }).then(data => {
        console.log("then2:" + data);
        return data;
    }).then(data => {
        throw new Error("出错啦");
    }).catch(error => {
        console.error("error:", error);
    })
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105145713532.png)

then 中，还可以直接抛出异常，抛出异常就进入到 catch 中了。

### catch

- catch 不是必须的，也可以在 then 中写两个回调函数，第二个回调函数就是用来处理 catch 的，不过更多情况下，都是单独写 catch 的。

进入到 catch 中，分为两种情况：

1. Promise 在执行的过程中，通过 reject 返回数据。
2. 在 then 中抛出异常。

进入 catch 的时候，都是就近进入。

### finally

无论最终执行的是 then 还是 catch，反正都是会进入到 finally 代码块中：

```javascript
<script>
    /**
     * 登录
     * @param resolve
     * @param reject
     */
    function login(resolve, reject) {
    setTimeout(() => {
        // 生成一个随机数
        let number = Math.random();
        if (number > 0.5) {
            // 登录成功，利用 resolve 函数将登录成功后的结果扔出去
            resolve('login success');
        } else {
            // 登录失败，利用 reject 函数将登录失败的结果扔出去
            reject('login error');
        }
    }, 2000)
}

new Promise(login).then(data => {
    //如果 login 将来执行成功（就是 resolve 方法抛出执行结果的时候）
    console.log("then1:" + data);
    return data;
}).then(data => {
    console.log("then2:" + data);
    return data;
}).then(data => {
    throw new Error("出错啦");
}).catch(error => {
    console.error("error:", error);
}).finally(()=>{
    console.log("over！")
})
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105151023507.png)

这个类似于 Java 中的 finally，就是前面无论是 catch 还是 then，反正 finally 都是会执行。

不过不同于 Java 中的 finally，前端的 finally 执行完成之后，还可以继续 then

```javascript
}).finally(()=>{
    console.log("over！")
}).then(()=>{
    console.log("finally 完成之后的执行！")
})
```

### 静态方法

#### Promise.resolve();

返回一个带有给定值解析后的 Promise 对象：

```javascript
<script>
    let p1 = Promise.resolve("hello Promise!")
p1.then(data=>{
    console.log(data);
}).catch(error=>{
    // 除非在 then 中抛出异常，就会进入到 catch 中，否则不会进入到 catch 中
})
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105151846897.png)

#### Promise.reject();

返回一个带有 reject 原因的 Promise 对象：

```javascript
<script>
    function resolved() {
        console.log("resolved")
    }

    function rejected(error) {
        console.error("error:" + error);
    }

    let p1 = Promise.reject("出错啦");
    // p1.then(resolved,rejected)
    p1.then(resolved).catch(rejected);
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221105152412784.png)

这个时候，p1 只会进入到 catch 中。

#### Promise.all();

这个静态方法接受多个 Promise 对象，并且只返回一个 Promise 实例，all 方法中会传入多个 Promise 实例，他会等所有 Promise 对象都 resolve 之后，才会进入到 then 中，否则只要参数中的 Promise 中有一个对象 reject 中，就会进入到 catch 中。

**简而言之一句话，所有的 Promise 都成功，进入 then；有一个 Promise 失败，进入 catch。**

```javascript
<script>
    let p1 = Promise.resolve('javaboy');
    let p2 = 88;
    let p3 = new Promise((resolved,rejected)=>{
        setTimeout(resolved,3000,"hello javaboy");
    })
    Promise.all([p1,p2,p3]).then(data=>{
        // p1,p2,p3 都是 resolve，就会进入到 then 中
        console.log("data:" + data);
    }).catch(error=>{
        // p1,p2,p3 有一个 reject，就会进入到 catch 中
        console.log("error:" + error);
    })
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106092655856.png)

all 方法能够帮助我们确保多个异步任务同时执行成功

#### Promise.race();

这个也可以接收多个 Promise 对象，一旦参数中的 Promise 对象 resolve 或者 reject，就会进入到 resolve 或者 reject 中。

**简而言之，参数中只要有一个执行成功或者失败，就 OK，不会等其他的 Promise 了，其他执行慢的 Promise 对象就直接被抛弃了。**

```javascript
<script>
    let p1 = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, "one");
    })
    let p2 = new Promise((resolve, reject) => {
        setTimeout(resolve, 200, "two")
    })
    Promise.race([p1, p2]).then(data => {
        console.log("data:" + data);
    }).catch(error => {
        console.log("error:" + error);
    })
</script>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106093307089.png)

由于 p2 执行的 快，所以最终进入到 then 中的就是 p2，p1 被舍弃了。

## Vue3 和 Vue2 的差异

### vue3 工程创建步骤

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106095316361.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106095354855.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106095425414.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106095445242.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106095522459.png)

### 变量定义

Vue3 中可以原封不动的使用 Vue2 中的方法（Options API）。

但是 Vue3 中提供了一些语法糖。

例如 Vue2 中，我们定义变量，可以按照如下方式：

```vue
<template>
<div>hello 01</div>
<h1>{{ msg }}</h1>
</template>

<script>
    export default {
        name: "My01",
        data() {
            return {
                msg: 'Hello Javaboy'
            }
        }
    }
</script>

<style scoped>

</style>
```

以上代码可以在 Vue3 中，可以按照如下方式来写：

```vue
<template>
  <input type="text" v-model="msg">
  <h1>{{ msg }}</h1>
</template>

<script>

  import {ref} from "vue";

  export default {
    name: "My02",
    /**
     * 我们以前在 Vue2 中定义的各种变量，方法，生命周期钩子函数等等，现在统一都在 setup 中进行定义
     *
     * 需要注意的是，所有定义的变量，方法等，都需要返回之后才可以使用
     */
    setup(){

      // 注意，直接这样写，这个变量不是响应式数据
      // let msg = "Hello Vue3";

      // 这个 msg 表示有响应式的特点，如果没有 ref，就不会随着输入框动态修改
      let msg = ref("Hello Vue3");
      return {msg}; //这里返回一个对象
    }
  }
</script>

<style scoped>

</style>
```

两个要点：

1. 变量定义需要用到 ref 函数，该函数直接从 vue 中导入，否则直接定义的变量不具备响应式的特性。
2. 所有定义的变量、方法等，都需要 return，不 return，就用不了

### 方法定义

在 Vue2 中，我们一般将方法定义在 methods 节点中，但是在 Vue3 中，我们将方法 定义在 setup 方法中，**尤其要注意，方法定义完成之后，必须要返回方法名，否则方法用不了。**

```vue
<template>
  <input type="text" v-model="msg">
  <h1>{{ msg }}</h1>
  <button @click="doLogin('zhangsan','123')">登录</button>
</template>

<script>

import {ref} from "vue";

export default {
  name: "My02",
  /**
   * 我们以前在 Vue2 中定义的各种变量，方法，生命周期钩子函数等等，现在统一都在 setup 中进行定义
   *
   * 需要注意的是，所有定义的变量，方法等，都需要返回之后才可以使用
   */
  setup() {

    // 注意，直接这样写，这个变量不是响应式数据
    // let msg = "Hello Vue3";

    // 这个 msg 表示有响应式的特点，如果没有 ref，就不会随着输入框动态修改
    let msg = ref("Hello Vue3");

    const doLogin = (username, password) => {
      console.log(username);
      console.log(password);
    }
    return {msg,doLogin}; //这里返回一个对象

  }
}
</script>

<style scoped>

</style>
```

如上，像定义一个变量一样去定义方法，方法定义完成之后，一定要返回。

### 钩子函数

在 Vue2 中，定义钩子函数，直接定义对应的方法名即可：

```vue
<template>
  <div>hello 01</div>
  <h1>{{ msg }}</h1>
</template>

<script>
export default {
  name: "My01",
  data() {
    return {
      msg: 'Hello Javaboy'
    }
  },
  mounted() {
    console.log("=======Vue2==========mounted()========")
  }
}
</script>

<style scoped>

</style>
```

但是，在 Vue3 中，由于所有的东西都是在 setup 中定义的，包括钩子函数。

```javascript
// 使用钩子函数时，首先导入钩子函数
import {onMounted} from "vue";
```

```javascript
// 调用钩子函数，并传入回调函数
// 另外需要注意，这个钩子函数不需要返回
onMounted(()=>{
    // 回调函数中定义方法
  console.log("My02 初始化了")
})
```

- 首先从 vue 中导入钩子函数。
- 在 setup 方法中去定义钩子函数的逻辑
- 在 return 中，不需要返回钩子函数

钩子函数对照：

| Vue2 | Vue3 |
| --- | --- |
| mounted | OnMounted |
| beforeUpdate | OnBeforeUpdate |
| updated | OnUpdated |
| beforeUnmount | OnBeforUnmount |
| unmounted | OnUnmounted |
| errorCapture | OnErrorCapture |
| renderTracked | OnRenderTracked |
| renderTriggered | OnRenderTriggered |
| activated | OnActivated |
| deactivated | OnDeactivated |


### computed 属性

计算属性和钩子函数比较类似，计算属性使用步骤：

1. 从 vue 中导入计算属性函数。
2. 定义计算属性。
3. 在 return 中返回计算属性值。

```javascript
// 计算属性的使用，也需要首先导入计算属性
import {onMounted, computed} from "vue";
```

```javascript
// 现在就可以通过计算属性定义一个变量了
const currentTime = computed(() => {
    return Date.now();
})
//注意，计算属性需要在 return 中返回
return {msg, doLogin,currentTime};
```

计算属性更新的例子：

```vue
<template>
  <input type="text" v-model="msg">
  <h1>{{ msg }}</h1>
  <h1>{{ age }}</h1>
  <button @click="doLogin('zhangsan','123')">登录</button>
  <div>{{ currentTime }}</div>
</template>

<script>

import {ref} from "vue";
// 使用钩子函数时，首先导入钩子函数
// 计算属性的使用，也需要首先导入计算属性
import {onMounted, computed} from "vue";

export default {
  name: "My02",
  /**
   * 我们以前在 Vue2 中定义的各种变量，方法，生命周期钩子函数等等，现在统一都在 setup 中进行定义
   *
   * 需要注意的是，所有定义的变量，方法等，都需要返回之后才可以使用
   */
  setup() {

    // 注意，直接这样写，这个变量不是响应式数据
    // let msg = "Hello Vue3";

    // 这个 msg 表示有响应式的特点，如果没有 ref，就不会随着输入框动态修改
    let msg = ref("Hello Vue3");
    let age = ref(99);

    const doLogin = (username, password) => {
      console.log(username);
      console.log(password);
      age.value++;
      msg.value = '登录成功';
    }
    // 调用钩子函数，并传入回调函数
    // 另外需要注意，这个钩子函数不需要返回
    onMounted(() => {
      console.log("My02 初始化了")
    })
    // 现在就可以通过计算属性定义一个变量了
    const currentTime = computed(() => {
      age.value++;
      return Date.now();
    })
    //注意，计算属性需要在 return 中返回
    return {msg, doLogin, currentTime, age}; //这里返回一个对象
  }
}
</script>

<style scoped>

</style>
```

由于生成计算属性 currentTime 依赖 age 变量，所以当 age 变量发生变化的时候，计算属性会自动更新，否则计算属性将一直使用缓存中的数据（age 没有发生变化的情况）。

另外还有一点，就是定义的变量 age、msg 等，在 HTML 节点中，直接使用 age、msg，但是如果是方法中操作这些变量，则一定要使用 age.value 或者 msg.value 来操作这些变量。

### watch 函数

Vue3 中，watch 函数的写法

```javascript
import {onMounted, computed, watch} from "vue";
```

```javascript
/**
 * 参数 监听变量
 *     新值和原值
 */
watch(age, (newValue, oldValue) => {
  console.log("newValue", newValue);
  console.log("oldValue", oldValue);
})
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106110140177.png)

1. 先从 vue 中导入 watch 函数，
2. 在 setup 中去监控变量，第一参数是要监控的变量，第二个参数则是一个回调函数，回调函数的参数就是所监控变量值的变化。

### ref 和 reactive

```vue
<template>
  <div>
    <div>{{ age }}</div>
    <div>{{ book.name }}</div>
    <div>{{ book.author }}</div>
    <div>{{ book.price }}</div>
  </div>
</template>

<script>

import {ref, reactive} from "vue";

export default {
  name: "My03",
  setup() {
    const book = reactive({
      name: '水浒传',
      author: '施耐庵',
      price: '33.3',
    })
    const age = ref(99);
    return {age, book};
  }
}
</script>

<style scoped>

</style>
```

一般来说，我们通过 ref 来定义一个变量，一般都是原始数据类型，例如 String，Number，Bigint，Boolean 等，通过 reactive 来定义一个对象。

如上面的案例所示，定义了 book 对象之后，接下来的访问中，通过 book.xxx 就可以访问到 book 中的属性值了。

但是，假设我们在定义的时候，定义的是 book 对象，但是我们访问的时候，却希望能够直接按照属性来访问，此时可以直接展开变量，但是如果直接通过三个点去展开变量，会导致变量的响应式特点失效，此时，我们可以通过 toRefs 函数，让变量恢复响应式的特点

- 使用 `...变量名` 方法：会导致响应式失效

```vue
<template>
  <div>
    <div>{{ age }}</div>
    <div>{{ name }}</div>
    <div>{{ author }}</div>
    <div>{{ price }}</div>
  </div>
</template>

<script>

import {ref, reactive} from "vue";

export default {
  name: "My03",
  setup() {
    const book = reactive({
      name: '水浒传',
      author: '施耐庵',
      price: '33.3',
    })
    const age = ref(99);
    return {age, ...book};
  }
}
</script>

<style scoped>

</style>
```

```vue
<template>
  <div>
    <div>{{ age }}</div>
    <!--        <div>{{ book.name }}</div>-->
    <!--        <div>{{ book.author }}</div>-->
    <!--        <div>{{ book.price }}</div>-->
    <div>{{ name }}</div>
    <div>{{ author }}</div>
    <div>{{ price }}</div>
    <button @click="updateBookInfo">更新图书信息</button>
  </div>
</template>

<script>

import {ref, reactive} from "vue";

export default {
  name: "My03",
  setup() {
    const updateBookInfo = () => {
      // 修改图书信息，注意，在 Vue3 中，现在方法中访问变量，不需要 this
      book.name = '西游记';
      book.author = '吴承恩';
      book.price = '66.6';
    }

    const book = reactive({
      name: '水浒传',
      author: '施耐庵',
      price: '33.3',
    })
    const age = ref(99);
    // 如果直接这样写，会导致响应式失效
    return {age, ...book, updateBookInfo};
  }
}
</script>

<style scoped>

</style>
```

点击更新图书信息按钮，发现图书信息并没有发生改变，说明响应式已经失效。

- 使用 `toRefs` 函数

```vue
<template>
  <div>
    <div>{{ age }}</div>
    <div>{{ name }}</div>
    <div>{{ author }}</div>
    <div>{{ price }}</div>
    <button @click="updateBookInfo">更新图书信息</button>
  </div>
</template>

<script>

import {ref, reactive} from "vue";
import {toRefs} from "vue";

export default {
  name: "My03",
  setup() {
    const updateBookInfo = () => {
      book.name = '西游记';
      book.author = '吴承恩';
      book.price = '66.6';
    }

    const book = reactive({
      name: '水浒传',
      author: '施耐庵',
      price: '33.3',
    })
    const age = ref(99);
    return {age, ...toRefs(book), updateBookInfo};
  }
}
</script>

<style scoped>

</style>
```

总结：

1. ref 定义原始数据类型；reactive 定义对象。
2. 如果用到了对象展开，那么需要用到 toRefs 函数将对象中的属性变为响应式 。
3. 在 vue3 中，定义的变量、函数等等，在使用的时候，都不需要 this。

### setup

1. 写的时候，容易忘记返回变量或者方法等等。
2. 写法有点臃肿。

```vue
<template>
  <div>
    <div>{{ age }}</div>
    <div>{{ name }}</div>
    <div>{{ author }}</div>
    <div>{{ price }}</div>
    <button @click="updateBookInfo">更新图书信息</button>
  </div>
</template>

<!--直接在 script 节点中定义  setup 属性，然后 script 节点就像以前 jquery 写法一样-->
<script setup>
  import {ref, reactive} from "vue";
  import {toRefs} from "vue";

  const updateBookInfo = () => {
    book.name = '西游记';
    book.author = '吴承恩';
    book.price = '66.6';
  }

  const book = reactive({
    name: '水浒传',
    author: '施耐庵',
    price: '33.3',
  })
  const age = ref(99);

  // 展开的变量
  const {name, author, price} = toRefs(book);
</script>

<style scoped>

</style>
```

现在，就直接在 script 节点中，增加 setup 属性，然后 script 节点中定义的变量名、方法名等等，默认就会自动返回，我们只需要定义即可。

## Vue3 中自定义插件

### 自定义全局方法

**Vue2 中定义全局方法**

在 Vue2 中，自定义全局方法的思路如下：

```javascript
Vue.prototype.postRequest = postRequest;
```

通过 Vue.prototype 将一个方法挂载为全局方法，这样，在具体的 .vue 文件中，我们就可以通过 this 来引用这个全局方法了：

```javascript
this.postRequest('/doLogin', this.loginForm).then(resp => {
    this.loading = false;
    if (resp) {
        this.$store.commit('INIT_CURRENTHR', resp.obj);
        window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
        let path = this.$route.query.redirect;
        this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
    }else{
        this.vcUrl = '/verifyCode?time='+new Date();
    }
})
```

在 vue2 中，我们可以将一个方法挂载为全局方法。

Vue3 这个写法则完全变了：

1. 定义的方式变了，不再是 Vue.prototype。
2. 引用的方式变了，因为在 Vue3 中，没法直接通过 this 去引用全局方法了。

**Vue3 中定义全局方法**

首先来看方法定义：

```javascript
/**  main.js 中定义如下
 * Vue3 中定义全局方法
 */
app.config.globalProperties.sayHello=()=>{
    console.log("hello marico")
}
```

定义好之后，需要引用，方式如下：

```javascript
// getCurrentInstance 方法可以获取到当前的 Vue 对象
import {ref, reactive,onMounted,getCurrentInstance} from "vue";
// 来自该方法的 proxy 对象则相当于之前的 this
const {proxy} =  getCurrentInstance();
```

方法调用：

```javascript
const btnClick = () => {
  // 想在这里调用全局方法
  proxy.sayHello();
}
```

1. 首先需要导入 getCurrentInstance() 方法。
2. 从第一步导入的方法中，提取出 proxy 对象，这个 proxy 对象就类似于之前在 vue2 中用的 this。
3. 接下来，通过 proxy 对象就可以引用全局方法了。
4. 其他一些曾经在 Vue2 中使用 this 的地方，现在都可以通过 proxy 来代替了。

### store

```javascript
import { createStore } from 'vuex'

export default createStore({
  state: {
    name:'marico'
  },
  getters: {
  },
  mutations: {
    SET_NAME(state,name){
      state.name = name;
    }
  },
  actions: {
  },
  modules: {
  }
})
```

```javascript
function btnClick2() {
  console.log(proxy.$store.state.name);
  proxy.$store.commit('SET_NAME', "沈泽辉");
  console.log(proxy.$store.state.name);
}
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106132746921.png)

### 自定义插件

一些工具方法可以定义为全局方法，如果这个全局的工具，不仅仅是一个工具方法，里边还包含一些页面等，那么此时，全局方法就不适用了，这个时候我们需要定义插件。

上面全局方法的定义，可以理解为是一个简单的插件。

Vue2 和 Vue3 中自定义插件的流程基本上差不多的，但是，插件内部的钩子函数不一样。

#### 自定义插件

```javascript
// 在这里定义插件
import MyBanner from "@/components/MyBanner";

export default {
    /**
     * @param app 这个就是 vue 对象
     * @param options 这是一个可选参数
     *
     * 当项目启动的时候，插件方法就会自动执行
     */
    install: (app, options) => {
        console.log("这是我的第一个插件")；
    }
}
```

安装插件

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入插件
import plugins from "@/plugins";

createApp(App)
    // 安装插件
    .use(plugins)
    .use(store)
    .use(router)
    .mount('#app')
```

启动项目

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106150928292.png)

#### 在自定义插件中注册全局组件

首先定义一个组件：

```vue
<template>
  <div>
    <a href="https://shenzehui.github.io/">我的博客</a>
  </div>
  <div>
    <a href="https://shenzehui.github.io/">我的博客</a>
  </div>
</template>

<script>
export default {
  name: "MyBanner",

}
</script>

<style scoped>

</style>
```

接下来，就可以在插件中导入组件并注册：

```javascript
// 在这里定义插件
// 在插件中，可以引入 vue 组件，并注册（这里的注册，就相当于全局注册）
import MyBanner from "@/components/MyBanner";

export default {
    /**
     * @param app 这个就是 vue 对象
     * @param options 这是一个可选参数
     *
     * 当项目启动的时候，插件方法就会自动执行
     */
    install: (app, options) => {
        console.log("这是我的第一个插件");
        //在这里完成组件的注册，注意，这是一个全局注册
        app.component("my-banner", MyBanner);
    }
}
```

最后就可以在项目的任意位置使用这个组件了

```vue
<template>
    <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
        </nav>
    <div>
        <!--这里就可以直接使用插件中全局注册的组件了-->
        <my-banner/>
        </div>
    <router-view/>
</template>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106151032745.png)

#### 自定义指令

首先注册全局指令：

```javascript
export default {
    install: (app, options) => {
        // 自定义指令，第一个参数是自定义指令的名称，第二个参数是自定义指令的逻辑
        // el 表示添加这个自定义指令的节点 例如这里的 a 标签
        // binding 中包含了自定义指令的参数
        app.directive('font-size', (el, binging, vnode) => {
            let size = 18;
            // binging.arg 获取到的就是 small 或 large
            switch (binging.arg) {
                case "small":
                    size = 14;
                    break;
                case "large":
                    size = 36;
                    break;
                default:
                    break
            }
            // 为使用 v-font-size 指令的标签设置 fontsize 的大小
            el.style.fontSize = size + 'px';
        })
    }
}
```

然后就可以在任意地方使用这个全局指令了（无需再注册）

```vue
<template>
<div>
    <a href="https://shenzehui.github.io/" v-font-size:small>我的博客</a>
    </div>
<div>
    <!--使用自定义指令，来指定文本的大小，指令的名字就是 font-size-->
    <a href="https://shenzehui.github.io/" v-font-size:large>我的博客</a>
    </div>
</template>

<script>
    export default {
        name: "MyBanner",
   }
</script>

<style scoped>

</style>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106155156775.png)

#### 参数传递

自定义插件的时候，可以通过 options 传递参数到插件中：

```javascript
import MyBanner from "@/components/MyBanner";

export default {
    install: (app, options) => {
        console.log("这是我的第一个插件");
        app.component("my-banner", MyBanner);
        app.directive('font-size', (el, binging, vnode) => {
            let size = 18;
            switch (binging.arg) {
                case "small":
                    size = options.fontSize.small;
                    break;
                case "large":
                    size = options.fontSize.large;
                    break;
                default:
                    break
            }
            // 为使用 v-font-size 指令的标签设置 fontsize 的大小
            el.style.fontSize = size + 'px';
        })
    }
}
```

`options.fontSize.small` 就是插件在引用的时候传递的参数。

```javascript
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from "@/plugins";
createApp(App)
    .use(plugins, {
        fontSize: {
            small: 6,
            large: 64
        }
    })
    .use(store)
    .use(router)
    .mount('#app')
```

#### provide 和 inject

可以通过 provide 去定义一个方法，然后在需要使用的时候，通过 inject 去注入这个方法然后使用

```javascript
import MyBanner from "@/components/MyBanner";

export default {
    function clickMe(){
        console.log("=====  clickMe ========")
    }
    //这里相当于注册方法
    app.provide("clickMe",clickMe);
}
```

注意定义的时候，方法要写在 install 中。

方法使用：

```vue
<template>
  <div>
    <a href="https://shenzehui.github.io/" v-font-size:small>我的博客</a>
  </div>
  <div>
    <a href="https://shenzehui.github.io/" v-font-size:large>我的博客</a>
  </div>
</template>

<script>
import {inject} from "vue";

export default {
  name: "MyBanner",
  mounted() {
    //注入 clickMe 函数
    const clickMe = inject("clickMe");
    clickMe();
  }
}
</script>

<style scoped>

</style>
```

建议，最好是利用 Vue3 中的 setup 一起使用

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221106155032029.png)

## Vue3 自定义指令

什么是 Vue 中的指令？

- v-if
- v-for
- v-bind
- ...

这些都是指令。

[https://cn.vuejs.org/guide/reusability/custom-directives.html](https://cn.vuejs.org/guide/reusability/custom-directives.html)

自定义指令在 RuoYi 项目中的应用：

```vue
<el-col :span="1.5">
   <el-button
      type="warning"
      plain
      icon="Download"
      @click="handleExport"
      v-hasPermi="['system:dict:export']"
   >导出</el-button>
</el-col>
```

以上面代码为例，如果当前用户具备 `system:dict:export` 权限，那么这个按钮就展示出来，否则这个按钮就隐藏。

### 两种作用域

自定义指令有两种作用域，可以是全局自定义指令（当前项目任何地方都可以使用），也可以是局部自定义指令（只能在定义的 .vue 文件中使用）。

### 局部自定义指令

自定义一个指令，要求如下：

1. 指令名字 onceClick。
2. 指令在定义的时候，可以加上一个时间参数。
3. 这个指令一般加在 button 上，表示 button 在点击完成之后，多长时间内，无法再次点击。
4. `<button v-onceClick="10000"></button>` 表示这个按钮点击之后，处于禁用状态，10s 之后才可以再次点击，防止用户发送重复请求。

自定义局部指令：

```vue
<template>
  <div>
    <div>{{ a }}</div>
    <div>
      <button @click="btnClick" v-once-click="10000">Click Me</button>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";

export default {
  setup() {
    const a = ref(1);
    const btnClick = () => {
      a.value++;
    }
    return {a, btnClick};
  },
  directives: {
    onceClick: {
      /**
       * 首先，自定义指令的钩子函数一共有七个：https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks
       * 钩子函数有参数，这个参数基本和 Vue2 中的自定义指令时候的参数含义一致，一共四个参数
       * @param el 就是自定义指令所绑定的元素
       * @param binding 各种传递的参数都在 binding 上
       * @param vNode Vue 编译生成的虚拟节点
       */
      mounted(el, binding, vNode) {
        el.addEventListener('click', () => {
          if (!el.disabled) {
            //当发生点击事件的时候，如果 el 没有被禁用，那么就让他禁用 10s
            el.disabled = true;
            // 延迟执行
            setTimeout(() => {
              el.disabled = false; // 不传参默认3秒
            }, binding.value || 3000);  //binding.value --> v-once-click='时间'  binding.arg ---> v-once-click:时间
          }
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
```

两种传参方式：

- `vue-one-click:10000`，那么获取参数就是  `binding.arg`
- `vue-one-click="10000"`，那么获取参数就是 `binding.value`

### 全局自定义指令

在 main.js 中定义如下

```javascript
/**
 * 这里定义的，就是一个全局指令
 */
app.directive('onceClick2', {
    /**
     * 首先，自定义指令的钩子函数一共有七个：https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks
     * 钩子函数有参数，这个参数基本和 Vue2 中的自定义指令时候的参数含义一致，一共四个参数
     * @param el 就是自定义指令所绑定的元素
     * @param binding 各种传递的参数都在 binding 上
     * @param vNode Vue 编译生成的虚拟节点
     */
    mounted(el, binding, vNode) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                //当发生点击事件的时候，如果 el 没有被禁用，那么就让他禁用 10s
                el.disabled = true;
                // 延迟执行
                setTimeout(() => {
                    el.disabled = false;
                }, binding.value || 3000); 
            }
        });
    }
})
```

使用：

```javascript
<button @click="btnClick" v-once-click2="10000">Click Me</button>
```

全局自定义指令和局部自定义指令的唯一区别在全局指令写在 main.js 中（也可以单独写一个 js 文件用来定义各种全局自定义指令，然后在 main.js 中引入这个自定义指令的文件），而局部自定义指令写在你要使用的 .vue 文件的directives 属性中。指令的具体逻辑，定义方式都是一样的。全局自定义指令可以应用在当期项目的任何地方。

### 同时传递两个参数

假设，v-noceClick2 这个指令的时间参数，其中的时间单位可以自己传递：

```vue
<button @click="btnClick" v-once-click3:ms="10000">Click Me</button>
```

全局指令的定义：

```javascript
// 多个参数传递
app.directive('onceClick3', {
    /**
     * 首先，自定义指令的钩子函数一共有七个：https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks
     * 钩子函数有参数，这个参数基本和 Vue2 中的自定义指令时候的参数含义一致，一共四个参数
     * @param el 就是自定义指令所绑定的元素
     * @param binding 各种传递的参数都在 binding 上
     * @param vNode Vue 编译生成的虚拟节点
     */
    mounted(el, binding, vNode) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                //当发生点击事件的时候，如果 el 没有被禁用，那么就让他禁用 10s
                el.disabled = true;
                let time = binding.value;
                if (binding.arg == 's') {
                    // 使用指令的使用，单位是秒，这里转为毫米 ms，因为 setTimeout 中的时间是 ms
                    time = time * 1000;
                }
                // 延迟执行
                setTimeout(() => {
                    el.disabled = false;
                }, time);  //binding.value --> v-once-click='时间'  binding.arg ---> v-once-click:时间
            }
        });
    }
});
```

使用：

```vue
<button @click="btnClick" v-once-click3:s="3">Click Me</button>
```

处理这个指令的时候，先看一下指令的 binding.arg，如果这个为 s，说明使用指令的时候传递的参数是 s，而 setTimeout 中的参数是 ms，所以乘上 1000。

### 传递动态参数

自定义指令中，还可以传递动态参数，方式如下：

首先定义一个变量：

```javascript
setup() {
    const timeUnit = ref('s')
    return {timeUnit};
},
```

timeUnit 就是我们要使用的时间单位，但是注意他是一个变量。

然后在页面中，就可以直接使用这个变量了：

```vue
<button @click="btnClick" v-onceClick3:[timeUnit]="3">Click Me</button>
```

### 自定义权限指令

用户登录成功之后，会从服务端获取到自己的权限以及角色信息，自定义权限指令，则是比较一下用户是否具备某一个控件所需要的角色/权限。

自定义全局的权限控制指令：

```javascript
// 这个表示当前用户所具备的权限信息，正常来说，这个数组应该是从服务端获取
const usersPermissions = ['user'];

app.directive('hasPermission', {
    mounted(el, binding, vNode) {
        // 获取组件所需要的权限 <button v-hasPermission="[user:add]">添加用户</button>
        // 此时拿到的 value 就是一个数组：[user:add]
        const {value} = binding;  //const value = binding.value
        console.log("value", value);
        // 接下来就是判断 usersPermissions 数组中是否包含 value 数组中的值
        let f = usersPermissions.some(p => {  //some 函数遍历
            // 如果这里都返回 false，f 就为 false，如果这里有一个是 true，则 f 是 true
            return p.indexOf(value[0]) !== -1;
        })
        if (!f) {
            //说明当前用户不具备所需要的权限,那么就将 el 从 DOM 中移除
            el.parentNode && el.parentNode.removeChild(el); //移除自己
        }
    }
})
```

两个地方：

1. 遍历数组的时候，使用的 some 函数。
2. 从 DOM 树中移除一个元素。

用法如下：

```vue
<button v-hasPermission="['user']">权限按钮</button>
```

## Vite

Vite 是一个前端的构建工具，类似于我们在 Vue2 中使用的 Webpack。

Vite 相比于 Webpack，最大的优势在于快！

> Spring Boot 热加载原理：Spring Boot 中，提供了两个类加载器：
>  
> - base classloader：主要用来加载各种第三方的类（各种依赖中的类，这些类的特点是不会变）。
> - restart classloader：这个用来自己写的类。


Vite 快的思路和 Spring Boot 热加载是一致的。在 Vite 中，将项目的模块分为两种：

- 依赖（变化小，大部分时间都是不变的）
- 源码（经常变化的是源码）

### 创建一个基于 Vite 的项目

```shell
npm create vite@latest my-vue-app --template vue
```

![image-20221108160511751](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221108160511751.png)

```shell
npm install
```

```shell
npm run dev
```

### 创建一个 基于 Vite 的项目

1. 注意，需要 nodejs 版本大于 14.18。如果电脑上已经有基于 nodejs 的项目，建议通过 nvm 来安装多个 nodejs 版本，然后去处理依赖问题。
2. 需要注意，要根据不同的 npm 版本，使用不同的创建命令 [https://vitejs.cn/vite3-cn/guide/#scaffolding-your-first-vite-project](https://vitejs.cn/vite3-cn/guide/#scaffolding-your-first-vite-project)

创建三个步骤：

```
npm create vite@latest vue3_03 --template vue
cd vue3_03
npm insatll
npm run dev
```

## Vite 项目安装 vue-router

- 安装路由

```shell
 npm install vue-router
```

- 定义路由

```javascript
import {createRouter, createWebHashHistory} from "vue-router"
// 1. 定义路由组件.
// 也可以从其他文件导入
import UserMana from "../views/UserMana.vue";
import LogMana from "../views/LogMana.vue";
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    {path: '/um', component: UserMana},
    {path: '/lm', component: LogMana},
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router
```

- 使用路由

```javascript
import router from './router/index.js'

createApp(App).use(router).mount('#app')
```

> 注意点：在定义路由的时候，唯一不同于 vue2 中的是，引入组件时需要将 .vue 后缀补全！


## 方法自动导入

在 Vue3 中，当我们要使用某一个方法的时候，必须先导入这个方法，以页面跳转为例，有如下两种跳转方式。

- 第一种写法，首先从 vue 中导入 getCurrentInstance 方法，然后获取 proxy 对象，这个 proxy 对象就相当于之前 Vue2 中的 this。

```vue
<script setup>
import {getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance();

function goUserMana() {
  proxy.$router.push('/um');
}

function goLogMana() {
  proxy.$router.push('/lm');
}
</script>
```

- 第二种写法：直接从 vue-router 中导入 router 对象，然后调用 router 对象实现页面跳转：

```javascript
import {useRouter} from 'vue-router'
const router = useRouter();
function goLogMana(){
  router.push('/lm')
}
```

无论哪种方式，都需要导入方法/组件，然后才能使用，如果使用了 vite，我们可以通过 unplugin-auto-import 插件来实现方法的自动导入

插件使用步骤：

1. 安装插件：

```shell
npm install unplugin-auto-import -D
```

2. 配置插件

在 vue3_03\vite.config.js 配置

```javascript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), AutoImport({
        imports: ['vue']
    })]
})
```

`imports: ['vue']` 这个配置的含义：凡是 vue 中提供的方法，现在不需要导入就可以直接使用了。

如果还想自动导入 vue-router 中的配置，方式如下：

```javascript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), AutoImport({
        imports: ['vue', 'vue-router']
    })]
})
```

一般来说，一些使用频率特别高的组件中的方法（例如 vue、vue-router、vuex/pina），可以通过这个方式来导入，一些冷门的组件，建议还是自己手动导入。

### 组件后缀问题

在 Vite 中，当需要导入一个组件的时候，默认情况下，必须加上 .vue 后缀，无论是在 router 中，还是在普通的 .vue 文件中，都需要加上这个后缀。但是很多小伙伴习惯了 webpack 中不写后缀，那么通过配置可以解决这个问题。

```javascript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), AutoImport({
        imports: ['vue', 'vue-router']
    })],
    resolve: {
        extensions: ['.vue', '.js', '.json', '.ts']
    }
})
```

这个配置表示后缀为 .vue/.js/.json/.ts 的文件，可以不写后缀。

### 组件名称问题

之前，我们可以通过如下方式来自定义文件名称：

```vue
<script>
    export default {
        name: "UserMana"
    }
</script>
```

当我们将 setup 加在 script 节点中时，就没法去设置 name 属性了，此时，如果还需要设置 name 属性，那么可以通过如下方式来设置：

```vue
<script>
  export default {
    name:'myApp'
  }
</script>
```

新加一个 script 标签，里边只写 export default 即可，然后配置一下组件名称即可。

通过插件可以简化这个操作。

- 首先安装插件：

```shell
npm install vite-plugin-vue-setup-extend -D
```

- 接下来配置组件：

```javascript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), AutoImport({
        imports: ['vue', 'vue-router']
    }),
    VueSetupExtend()],
    resolve: {
        extensions: ['.vue', '.js', '.json', '.ts']
    }
})
```

- 配置完成之后，接下来，就可以直接在 script 节点中定义组件的名称了：

```vue
<script setup name="marico-app">
// import {getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance();

function goUserMana() {
  proxy.$router.push('/um');
}

// import {useRouter} from 'vue-router'

const router = useRouter();

function goLogMana() {
  router.push('/lm')
}
</script>

<!--<script>-->
<!--  export default {-->
<!--    name:'myApp'-->
<!--  }-->
<!--</script>-->

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo"/>
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo"/>
    </a>
  </div>
  <!--  <HelloWorld msg="Vite + Vue" />-->
  <button @click="goUserMana">用户管理</button>
  <button @click="goLogMana">日志管理</button>
  <router-view/>
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

</style>
```

![image-20221108184406849](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221108184406849.png)
