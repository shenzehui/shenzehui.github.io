---
title: JWT 实现登录认证 + Token 自动续期方案，这才是正确的使用姿势！
tag: 杂文
category:
  - 好文收集
author: 何甜甜在吗
description: 过去这段时间主要负责了项目中的用户管理模块，用户管理模块会涉及到加密及认证流程，加密已经在前面的文章中介绍了，可以阅读用户管理模块：如何保证用户数据安全。今天就来讲讲认证功能的技术选型及实现。技术上没啥难度当然也没啥挑战，但是对一个原先没写过认证功能的菜鸡甜来说也是一种锻炼吧
---

> 过去这段时间主要负责了项目中的用户管理模块，用户管理模块会涉及到加密及认证流程，加密已经在前面的文章中介绍了，可以阅读[用户管理模块：如何保证用户数据安全](https://juejin.cn/post/6916150628955717646)。今天就来讲讲认证功能的技术选型及实现。技术上没啥难度当然也没啥挑战，但是对一个原先没写过认证功能的菜鸡甜来说也是一种锻炼吧

### 技术选型

要实现认证功能，很容易就会想到JWT或者session，但是两者有啥区别？各自的优缺点？应该Pick谁？夺命三连

![img](https://s1.vika.cn/space/2022/11/26/ca24a490d0334e3b8593c8a0e725baa5)

#### 区别

基于session和基于JWT的方式的主要区别就是用户的状态保存的位置，**session是保存在服务端**的，而**JWT是保存在客户端**的

#### 认证流程

##### 基于session的认证流程

- 用户在浏览器中输入用户名和密码，服务器通过密码校验后生成一个session并保存到数据库
- 服务器为用户生成一个sessionId，并将具有sesssionId的cookie放置在用户浏览器中，在后续的请求中都将带有这个cookie信息进行访问
- 服务器获取cookie，通过获取cookie中的sessionId查找数据库判断当前请求是否有效

##### 基于JWT的认证流程

- 用户在浏览器中输入用户名和密码，服务器通过密码校验后生成一个token并保存到数据库
- 前端获取到token，存储到cookie或者local storage中，在后续的请求中都将带有这个token信息进行访问
- 服务器获取token值，通过查找数据库判断当前token是否有效

#### 优缺点

- JWT保存在客户端，在分布式环境下不需要做额外工作。而session因为保存在服务端，分布式环境下需要实现多机数据共享
- session一般需要结合Cookie实现认证，所以需要浏览器支持cookie，因此移动端无法使用session认证方案

##### 安全性

- JWT的payload使用的是base64编码的，因此在**JWT中不能存储敏感数据**。而session的信息是存在服务端的，相对来说更安全

![image.png](https://s1.vika.cn/space/2022/11/26/dd5f08e622c84c02b12897686d7b4b35)

如果在JWT中存储了敏感信息，可以解码出来非常的不安全

##### 性能

- 经过编码之后JWT将非常长，cookie的限制大小一般是4k，cookie很可能放不下，所以JWT一般放在local storage里面。并且用户在系统中的每一次http请求都会把JWT携带在Header里面，HTTP请求的Header可能比Body还要大。而sessionId只是很短的一个字符串，因此使用JWT的HTTP请求比使用session的开销大得多

##### 一次性

无状态是JWT的特点，但也导致了这个问题，JWT是一次性的。想修改里面的内容，就必须签发一个新的JWT

- 无法废弃
   一旦签发一个JWT，在到期之前就会始终有效，无法中途废弃。若想废弃，一种常用的处理手段是结合redis
- 续签
   如果使用JWT做会话管理，传统的cookie续签方案一般都是框架自带的，session有效期30分钟，30分钟内如果有访问，有效期被刷新至30分钟。一样的道理，要改变JWT的有效时间，就要签发新的JWT。最简单的一种方式是每次请求刷新JWT，即每个HTTP请求都返回一个新的JWT。这个方法不仅暴力不优雅，而且每次请求都要做JWT的加密解密，会带来性能问题。另一种方法是在redis中单独为每个JWT设置过期时间，每次访问时刷新JWT的过期时间

#### 选择JWT或session

我投JWT一票，JWT有很多缺点，但是在分布式环境下不需要像session一样额外实现多机数据共享，虽然seesion的多机数据共享可以通过**粘性session**、**session共享**、**session复制**、**持久化session**、**terracoa实现seesion复制**等多种成熟的方案来解决这个问题。但是JWT不需要额外的工作，使用JWT不香吗？且JWT一次性的缺点可以结合redis进行弥补。扬长补短，因此在实际项目中选择的是使用JWT来进行认证

### 功能实现

#### JWT所需依赖

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.10.3</version>
</dependency>
复制代码
```

#### JWT工具类

```typescript
public class JWTUtil {
    private static final Logger logger = LoggerFactory.getLogger(JWTUtil.class);

    //私钥
    private static final String TOKEN_SECRET = "123456";

    /**
     * 生成token，自定义过期时间 毫秒
     *
     * @param userTokenDTO
     * @return
     */
    public static String generateToken(UserTokenDTO userTokenDTO) {
        try {
            // 私钥和加密算法
            Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
            // 设置头部信息
            Map<String, Object> header = new HashMap<>(2);
            header.put("Type", "Jwt");
            header.put("alg", "HS256");

            return JWT.create()
                    .withHeader(header)
                    .withClaim("token", JSONObject.toJSONString(userTokenDTO))
                    //.withExpiresAt(date)
                    .sign(algorithm);
        } catch (Exception e) {
            logger.error("generate token occur error, error is:{}", e);
            return null;
        }
    }

    /**
     * 检验token是否正确
     *
     * @param token
     * @return
     */
    public static UserTokenDTO parseToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(TOKEN_SECRET);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT jwt = verifier.verify(token);
        String tokenInfo = jwt.getClaim("token").asString();
        return JSON.parseObject(tokenInfo, UserTokenDTO.class);
    }
}
复制代码
```

说明：

- 生成的token中不带有过期时间，token的过期时间由redis进行管理
- UserTokenDTO中不带有敏感信息，如password字段不会出现在token中

#### Redis工具类

```typescript
public final class RedisServiceImpl implements RedisService {
    /**
     * 过期时长
     */
    private final Long DURATION = 1 * 24 * 60 * 60 * 1000L;

    @Resource
    private RedisTemplate redisTemplate;

    private ValueOperations<String, String> valueOperations;

    @PostConstruct
    public void init() {
        RedisSerializer redisSerializer = new StringRedisSerializer();
        redisTemplate.setKeySerializer(redisSerializer);
        redisTemplate.setValueSerializer(redisSerializer);
        redisTemplate.setHashKeySerializer(redisSerializer);
        redisTemplate.setHashValueSerializer(redisSerializer);
        valueOperations = redisTemplate.opsForValue();
    }

    @Override
    public void set(String key, String value) {
        valueOperations.set(key, value, DURATION, TimeUnit.MILLISECONDS);
        log.info("key={}, value is: {} into redis cache", key, value);
    }

    @Override
    public String get(String key) {
        String redisValue = valueOperations.get(key);
        log.info("get from redis, value is: {}", redisValue);
        return redisValue;
    }

    @Override
    public boolean delete(String key) {
        boolean result = redisTemplate.delete(key);
        log.info("delete from redis, key is: {}", key);
        return result;
    }

    @Override
    public Long getExpireTime(String key) {
        return valueOperations.getOperations().getExpire(key);
    }
}
复制代码
```

RedisTemplate简单封装

#### 业务实现

##### 登陆功能

```scss
public String login(LoginUserVO loginUserVO) {
    //1.判断用户名密码是否正确
    UserPO userPO = userMapper.getByUsername(loginUserVO.getUsername());
    if (userPO == null) {
        throw new UserException(ErrorCodeEnum.TNP1001001);
    }
    if (!loginUserVO.getPassword().equals(userPO.getPassword())) {
        throw new UserException(ErrorCodeEnum.TNP1001002);
    }

    //2.用户名密码正确生成token
    UserTokenDTO userTokenDTO = new UserTokenDTO();
    PropertiesUtil.copyProperties(userTokenDTO, loginUserVO);
    userTokenDTO.setId(userPO.getId());
    userTokenDTO.setGmtCreate(System.currentTimeMillis());
    String token = JWTUtil.generateToken(userTokenDTO);

    //3.存入token至redis
    redisService.set(userPO.getId(), token);
    return token;
}
复制代码
```

说明：

- 判断用户名密码是否正确
- 用户名密码正确则生成token
- 将生成的token保存至redis

##### 登出功能

```typescript
public boolean loginOut(String id) {
     boolean result = redisService.delete(id);
     if (!redisService.delete(id)) {
        throw new UserException(ErrorCodeEnum.TNP1001003);
     }

     return result;
}
复制代码
```

将对应的key删除即可

##### 更新密码功能

```scss
public String updatePassword(UpdatePasswordUserVO updatePasswordUserVO) {
    //1.修改密码
    UserPO userPO = UserPO.builder().password(updatePasswordUserVO.getPassword())
            .id(updatePasswordUserVO.getId())
            .build();
    UserPO user = userMapper.getById(updatePasswordUserVO.getId());
    if (user == null) {
        throw new UserException(ErrorCodeEnum.TNP1001001);
    }

    if (userMapper.updatePassword(userPO) != 1) {
        throw new UserException(ErrorCodeEnum.TNP1001005);
    }
    //2.生成新的token
    UserTokenDTO userTokenDTO = UserTokenDTO.builder()
            .id(updatePasswordUserVO.getId())
            .username(user.getUsername())
            .gmtCreate(System.currentTimeMillis()).build();
    String token = JWTUtil.generateToken(userTokenDTO);
    //3.更新token
    redisService.set(user.getId(), token);
    return token;
}
复制代码
```

说明：
 更新用户密码时需要重新生成新的token，并将新的token返回给前端，由前端更新保存在local storage中的token，同时更新存储在redis中的token，这样实现可以避免用户重新登陆，用户体验感不至于太差

##### 其他说明

- 在实际项目中，用户分为普通用户和管理员用户，只有管理员用户拥有删除用户的权限，这一块功能也是涉及token操作的，但是我太懒了，demo工程就不写了
- 在实际项目中，密码传输是加密过的

#### 拦截器类

```vbscript
public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
    String authToken = request.getHeader("Authorization");
    String token = authToken.substring("Bearer".length() + 1).trim();
    UserTokenDTO userTokenDTO = JWTUtil.parseToken(token);
    //1.判断请求是否有效
    if (redisService.get(userTokenDTO.getId()) == null 
            || !redisService.get(userTokenDTO.getId()).equals(token)) {
        return false;
    }

    //2.判断是否需要续期
    if (redisService.getExpireTime(userTokenDTO.getId()) < 1 * 60 * 30) {
        redisService.set(userTokenDTO.getId(), token);
        log.error("update token info, id is:{}, user info is:{}", userTokenDTO.getId(), token);
    }
    return true;
}
复制代码
```

说明：
 拦截器中主要做两件事，一是对token进行校验，二是判断token是否需要进行续期
 token校验：

- 判断id对应的token是否不存在，不存在则token过期
- 若token存在则比较token是否一致，保证同一时间只有一个用户操作

token自动续期：  为了不频繁操作redis，只有当离过期时间只有30分钟时才更新过期时间

#### 拦截器配置类

```typescript
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticateInterceptor())
                .excludePathPatterns("/logout/**")
                .excludePathPatterns("/login/**")
                .addPathPatterns("/**");
    }

    @Bean
    public AuthenticateInterceptor authenticateInterceptor() {
        return new AuthenticateInterceptor();
    }
}
复制代码
```

#### 写在最后

若有纰漏不足，欢迎指出

![img](https://s1.vika.cn/space/2022/11/26/6e388d9d96f34c5bbbc8213a4d2b23d2)

**点个赞**在走