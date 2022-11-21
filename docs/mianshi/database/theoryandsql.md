---
title: 数据库原理 精选面试题🔥
category:
  - 面试题
  - 数据库
article: false
---

## 什么是事务？事务基本特性ACID？

事务指的是满足 ACID 特性的一组操作，可以通过 Commit 提交一个事务，也可以使用 Rollback 进行回滚。

![image](https://s1.vika.cn/space/2022/11/21/d177bbd7ba954dd3a9542bc725088ef2)

- 事务基本特性 ACID？
  - **A 原子性（atomicity）** 指的是一个事务中的操作要么全部成功，要么全部失败。
  - **C 一致性（consistency）** 指的是数据库总是从一个一致性的状态转移到另一个一致性的状态。比如 A 转账给 B 100块钱，假设中间 sql 执行过程中系统崩溃 A 也不会损失 100 块，因为事务没有提交，修改也就不会保存到数据库。
  - **I 隔离性（isolation）** 指的是一个事务的修改在最终提交前，对其他事务是不可见的。
  - **D 持久性（durability）** 指的是一旦事务提交，所做的修改就会永久保存到数据库中。

## 数据并发一致性问题？

在并发环境下，事务的隔离性很难保证，因此会出现很多并发一致性问题。

- **丢失修改**

T1 和 T2 两个事务都对一个数据进行修改，T1 先修改，T2 随后修改，T2 的修改覆盖了 T1 的修改。

![image](https://s1.vika.cn/space/2022/11/21/4fc8265c08e94faf8151426a35c070f2)

- **读脏数据**

T2 读取一个数据，T1 对该数据做了修改。如果 T2 再次读取这个数据，此时读取的结果和第一次读取的结果不同。

![image](https://s1.vika.cn/space/2022/11/21/1f93242fd6114edeb87eae2f15211f2c)

- **幻影读**

T1 读取某个范围的数据，T2 在这个返回内插入新的数据，T1 再次读取这个范围的数据，此时读取的结果和第一次读取的结果不同

![image](https://s1.vika.cn/space/2022/11/21/5dc16f7376aa41c5ba675a7162e5ecf4)

## 事务的隔离级别？

- **未提交读（READ UNCOMMITTED）** 事务中的修改，即使没有提交，对其他事务也是可见的。
- **提交读（READ COMMITED）** 一个事务只能读取已经提交的事务所做的修改。换句话说，一个事务所做的修改在提交之前对其他事务是不可见的。
- **可重复读（REPEATABLE READ）** 保证在同一个事务中多次读取同样数据的结果是一样的。
- **可串行化（SERIALIZABLE）** 强制事务串行执行。

| 隔离级别 | 脏读 | 不可重复读 | 幻影读 |
| :------: | :--: | :--------: | :----: |
| 未提交读 |  √   |     √      |   √    |
|  提交读  |  ×   |     √      |   √    |
| 可重复读 |  ×   |     ×      |   √    |
| 可串行化 |  ×   |     ×      |   ×    |

## ACID靠什么保证的呢？

- **A 原子性(atomicity)** 由 undo log 日志保证，它记录了需要回滚的日志信息，事务回滚时撤销已经执行成功的 sql
- **C 一致性(consistency)** 一般由代码层面来保证
- **I 隔离性(isolation)** 由 MVCC 来保证
- **D 持久性(durability)** 由内存 + redo log 来保证，mysql 修改数据同时在内存和 redo log 记录这次操作，事务提交的时候通过 redo log 刷盘，宕机的时候可以从 redo log 恢复

##  SQL 优化的实践经验？

1.对查询进行优化，要避免全表扫描，首先应考虑在 where 及 order by 涉及的列上建立索引。

2.应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描，如：

```sql
select id from t where num is null
```

最好不要给数据库留 NULL，尽可能的使用 NOT NULL 填充数据库

备注、描述、评论之类的可以设置为 NULL，其他的，最好不要使用 NULL。

不要以为 NULL 不需要空间，比如：char(100) 型，在字段建立时，空间就固定了， 不管是否插入值（NULL也包含在内），都是占用 100个字符的空间的，如果是varchar这样的变长字段， null 不占用空间。

可以在 num 上设置默认值为 0，确保表中 null 列没有 null 值，然后这样查询：

```sql
select id from t where num = 0
```

3.应尽量避免在 where 子句中使用 != 或 <> 操作符，否则将引擎放弃使用索引而进行全表扫描。

4.应尽量避免在 where 子句中使用 or 来连接条件，如果有一个字段有索引，一个字段没有索引，将导致引擎放弃使用索引而进行全表扫描，如：

```sql
select id from t where num=10 or Name = 'admin'
```

可以这样查询：

```sql
select id from t where num = 10
union all
select id from t where Name = 'admin'
```

5.in 和 not in 也要慎用，否则会导致全表扫描，如：

```sql
select id from t where num in(1,2,3)
```

对于连续的数值，能用 between 就不要用 in 了：

```sql
select id from t where num between 1 and 3
```

很多时候用 exists 代替 in 是一个好的选择：

```sql
select num from a where num in(select num from b)
```

用下面的语句替换：

```sql
select num from a where exists(select 1 from b where num=a.num)
```

6.下面的查询也将导致全表扫描：

```sql
select id from t where name like ‘%abc%’
```

若要提高效率，可以考虑全文检索。

7.如果在 where 子句中使用参数，也会导致全表扫描。因为SQL只有在运行时才会解析局部变量，但优化程序不能将访问计划的选择推迟到运行时；它必须在编译时进行选择。然 而，如果在编译时建立访问计划，变量的值还是未知的，因而无法作为索引选择的输入项。如下面语句将进行全表扫描

```sql
select id from t where num = @num
```

可以改为强制查询使用索引：

```sql
select id from t with(index(索引名)) where num = @num
```

应尽量避免在 where 子句中对字段进行表达式操作，这将导致引擎放弃使用索引而进行全表扫描。如：

```sql
select id from t where num/2 = 100
```

应改为:

```sql
select id from t where num = 100*2
```

9.应尽量避免在 where 字句中对字段进行函数操作，这将导致数据引擎放弃使用索引而进行全表扫描。如：

```sql
select id from t where substring(name,1,3) = ’abc’       -–name以abc开头的id
select id from t where datediff(day,createdate,’2005-11-30′) = 0    -–‘2005-11-30’    --生成的id
```

应改为:

```sql
select id from t where name like 'abc%'
select id from t where createdate >= '2005-11-30' and createdate < '2005-12-1'
```

10.不要再 where 字句的 "=" 左边进行函数、算术运算或其他表达式运算，否则系统可能无法正确使用索引

11.在使用索引作为条件时，如果该索引是复合索引，那么必须使用到该索引中的第一个字段作为条件时才能保证系统使用该索引，否则该索引将不会被使用，并且应尽可能的让字段顺序与索引顺序一致。

12.不要写一些没有意义的查询，如需要生成一个空表结构

```sql
select col1,col2 into #t from t where 1=0
```

这类代码不会返回任何结果集，但是会消耗系统资源的，应改成这样：

```sql
create table #t(…)
```

13.update 语句，如果只更改1、2个字段，不要 Update 全部字段，否则频繁调用会引用明显的性能消耗，同时带来大量日志。

14.对于多张大数据量（这里几百条就算大了）的表 JSON，首先分页再 JOIN，否则逻辑读会很高，性能很差。

15.select count(*) from table；这样不带任何条件的 count 会引起全表扫描，并且没有任何业务意义，是一定要杜绝的。

16.索引并不是越多越好，索引固然可以提高相应的 select 的效率，但同时也降低了 insert 及 update 的效率，因为 insert 或 update 时有可能会重建索引，所以怎样建索引需要慎重考虑，视具体情况而定。一个表的索引数最好不要超过6个，若太多则应考虑一些不常使用到的列上建的索引是否有 必要。

17.应尽可能的避免更新 clustered 索引数据列，因为 clustered 索引数据列的顺序就是表记录的物理存储顺序，一旦该列值改变将导致整个表记录的顺序的调整，会耗费相当大的资源。若应用系统需要频繁更新 clustered 索引数据列，那么需要考虑是否应将该索引建为 clustered 索引。

18.尽量使用数字型字段，若只含数值信息的字段尽量不要设计为字符型，这会降低查询和连接的性能，并会增加存储开销。这是因为引擎在处理查询和连 接时会逐个比较字符串中每一个字符，而对于数字型而言只需要比较一次就够了。

19.尽可能的使用 varchar/nvarchar 代替 char/nchar ，因为首先变长字段存储空间小，可以节省存储空间，其次对于查询来说，在一个相对较小的字段内搜索效率显然要高些。

20.任何地方都不要使用 select * from t ，用具体的字段列表代替"*"，不要返回用不到的任何字段。

21.尽量使用表变量来代替临时表。如果表变量包含大量数据，请注意索引非常有限（只有主键索引）。

22.避免频繁创建和删除临时表，以减少系统表资源的消耗。临时表并不是不可使用，适当地使用它们可以使某些例程更有效，例如，当需要重复引用大型表或常用表中的某个数据集时。但是，对于一次性事件， 最好使用导出表。

23.在新建临时表时，如果一次性插入数据量很大，那么可以使用 select into 代替 create table，避免造成大量 log，以提高速度；如果数据量不大，为了缓和系统表的资源，应先 create table，然后 insert。

24.如果使用到了临时表，在存储过程的最后务必将所有的临时表显式删除，先 truncate table ，然后 drop table ，这样可以避免系统表的较长时间锁定。

25.尽量避免使用游标，因为游标的效率较差，如果游标操作的数据超过1万行，那么就应该考虑改写。

26.使用基于游标的方法或临时表方法之前，应先寻找基于集的解决方案来解决问题，基于集的方法通常更有效。

27.与临时表一样，游标并不是不可使用。对小型数据集使用 FAST_FORWARD 游标通常要优于其他逐行处理方法，尤其是在必须引用几个表才能获得所需的数据时。在结果集中包括"合计"的例程通常要比使用游标执行的速度快。如果开发时 间允许，基于游标的方法和基于集的方法都可以尝试一下，看哪一种方法的效果更好。

28.在所有的存储过程和触发器的开始处设置 SET NOCOUNT ON ，在结束时设置 SET NOCOUNT OFF 。无需在执行存储过程和触发器的每个语句后向客户端发送 DONE_IN_PROC 消息。

29.尽量避免大事务操作，提高系统并发能力。

30.尽量避免向客户端返回大数据量，若数据量过大，应该考虑相应需求是否合理

## Buffer Pool、Redo Log Buffer 和 undo log、redo log、bin log 概念以及关系？

- Buffer Pool 是 MySQL 的一个非常重要的组件，因为针对数据库的增删改都是在 Buffer Pool 中完成的
- Undo log 记录的是数据库操作前的样子
- redo log  记录的是数据库操作后的样子（redo log 是 Innodb 存储引擎特有）
- bin log 记录的是整个操作记录（这个对于主从复制具有非常重要的意义）

## 从准备更新一条数据到事务的提交的流程描述？

![](https://s1.vika.cn/space/2022/11/21/b408e4d7bf284693b27d2cb313c03343)

- 首先执行器根据 MySQL 的执行计划来查询数据，先是从缓存池中查询数据，如果没有就去数据库中查询，如果查询到了就将其放到缓存池中

- 在数据被缓存到缓存池的同时，会写入 undo log 日志文件
- 更新的动作是在 Buffer Pool 中完成的，同时会将更新后的数据添加到 redo log buffer 中
- 完成以后就可以提交事务，在提交的同时会做以下三件事
  - 将 redo log buffer 中的数据刷入到 redo log 文件中
  - 将本次操作记录写入到 bin log 文件中
  - 将 bin log 文件名字和更新内容在 bin log 中的位置记录到 redo log 中，同时在 redo log 最后添加 commit 标记
