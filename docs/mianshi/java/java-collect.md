---
title: Java集合 精选面试题🔥
tag: Java集合
category:
  - 面试题
  - Java
article: false
---

## ArrayList 和 LinkedList 区别

ArrayList：基于`动态数组`，连续内存存储，适合下标访问（随机访问），扩容机制；因为数组长度固定，超出长度存数据时需要新建数组，然后将老数组拷贝到新数组，如果不是尾部插入数据还会涉及到元素的移动（往后复制一份，插入新元素），使用尾插法并指定初始容量可以极大提升性能、甚至超过 linkedList （需要创建大量的 node 对象）

LinkedList：基于`链表`，可以存储在分散的内存中，适合做数据插入及删除操作，不适合查询，需要逐一遍历，遍历 LinkedList `必须使用 iterator 不能使用 for 循环`，因为每次 for 循环体内通过 get(i) 取得某一元素时，都需要对 list 重新进行遍历，性能消耗极大。另外不要视图使用 indexOf 等返回元素索引，并利用其进行遍历，使用 indexOf 对 list 进行了遍历，当结果为空时会遍历整个列表。

ArrayList 和 LinkedList 都实现了 List 接口，但是 LinkedList 还额外实现了 Deque 接口，所以 ListedList 还可以当做队列来实现。

```java
public class ListTest {
    public static void main(String[] args) {
        ArrayList<String> arrayList = new ArrayList<>(); // 数组实现 查询快
        arrayList.add("1");  // 扩容会变慢
        arrayList.add(3, "1"); // 扩容 元素移动

        LinkedList<String> linkedList = new LinkedList<>(); // 链表实现  增删快
        linkedList.add("1");
        linkedList.add(3, "1"); // 耗性能的是寻找节点过程

        System.out.println(arrayList);
        System.out.println(linkedList);
    }
}
```

## ArrayList 和 LinkedList 的区别？

![img](https://s1.vika.cn/space/2022/11/22/6017f440c7de4348b8168f1a41c93be1)

- ArrayList 是实现了基于**数组**的，存储空间是连续的。LinkedList 基于**链表**的，存储空间是不连续的。（LinkedList 是双向链表）
- 对于**随机访问**的 get 和 set，ArrayList 优于 LinkedList，因为 LinkedList 要移动指针。
- 对于新增和删除操作（add 和 remove），LinkedList 比较占优势，因为 ArrayList 要移动数据。
- 同样的数据量 LinkedList 所占的空间可能会更小，因为 ArrayList 需要**预留空间**便于后续数据增加，而 LinkedList 增加数据只需要**增加一个节点**

## HashMap 和 HashTable 的区别？其底层实现是什么？

区别：

（1）HashMap 方法没有 synchronized 修饰，线程非安全，HashTable 线程安全；

（2）HashMap 允许 key 和 value 为 null，而 HashTable 不允许

底层实现：数组+链表实现

jdk8 开始链表高度到8、数组长度超过64，链表转变为红黑树，元素以内部类 Node 节点存在

- 计算 key 的 hash 值，二次 hash 然后对数组长度取模，对应到数组下标
- 如果没有产生 hash 冲突（下标位置没有元素），则直接创建 Node 存入数组
- 如果产生 hash 冲突，先进行 equal 比较，相同则取代该元素，不同，则判断链表高度插入链表，链表高度达到 8，并且数组长度到 64 则转变为红黑树，长度低于 6 则将红黑树转回链表
- key 为 null，存在下标 0 的位置

数组扩容：默认扩容方式：扩容为原来的两倍，并将原有的数组复制过来。

## hashMap 1.7 和 hashMap 1.8 的区别？

只记录**重点**

| 不同点          | hashMap 1.7                      | hashMap  1.8                     |
| --------------- | -------------------------------- | -------------------------------- |
| 数据结构        | 数组+链表                        | 数组+链表+红黑树                 |
| 插入数据方式    | 头插法                           | 尾插法                           |
| hash 值计算方式 | 9次扰动处理（4次位运算+5次异或） | 2次扰动处理（1次位运算+1次异或） |
| 扩容策略        | 插入前扩容                       | 插入后扩容                       |

## hashMap 线程不安全体现在哪里？

在 **hashMap1.7 中扩容**的时候，因为采用的是头插法，所以会可能会有循环链表产生，导致数据有问题，在 1.8 版本已修复，改为了尾插法

在任意版本的 hashMap 中，如果在**插入数据时多个线程命中了同一个槽**，可能会有数据覆盖的情况发生，导致线程不安全。

## 那么 hashMap 线程不安全怎么解决？

## 公众号

 ![](https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff)