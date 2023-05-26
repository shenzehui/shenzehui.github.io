---
title: 分布式事务
tag: 分布式事务
category:
  - Java 企业级开发
  - Spring Cloud学习教程
article: false
---

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
>    通过要更新的 SQL 语句，查询出更新前的数据和更新后的数据，插入到 `UNDO_LOG` 表中，并将本地事务提交的结果上报给 TC 
> -  二阶段 
>    -  回滚 
>       1. 收到 TC 的分支回滚请求，开启一个本地事务，执行如下操作。
>       2. 通过 XID 和 Branch ID 查找到相应的 UNDO LOG 记录。
>       3. 数据校验：拿 UNDO LOG 中的后镜与当前数据进行比较，如果有不同，说明数据被当前全局事务之外的动作做了修改。这种情况，需要根据配置策略来做处理，详细的说明在另外的文档中介绍。
>       4. 根据 UNDO LOG 中的前镜像和业务 SQL 的相关信息生成并执行回滚的语句：

>       - 提交

>       1.  提交本地事务。并把本地事务的执行结果（即分支事务回滚的结果）上报给 TC。 
>       2.  收到 TC 的分支提交请求，把请求放入一个异步任务的队列中，马上返回提交成功的结果给TC。 
>       3.  异步任务阶段的分支提交请求将异步和批量地删除相应 UNDO LOG 记录。 


```sql
update product set name = 'TXC' where id = 1;
```

**回滚日志表**

UNDO_LOG Table：不同数据库在类型上会略有差别。

以 MySQL 为例：

| Field         | Type         |
| ------------- | ------------ |
| branch_id     | bigint PK    |
| xid           | varchar(100) |
| context       | varchar(128) |
| rollback_info | longblob     |
| log_status    | tinyint      |
| log_created   | datetime     |
| log_modified  | datetime     |


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
