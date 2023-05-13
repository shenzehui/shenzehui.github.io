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



## ✌ 引言

### 说说有哪些常见集合？

集合相关列和接口都在 java.util 中，主要分为3种：List(列表)、Map(映射)、Set(集)。

![image-20221203094701814](https://s1.vika.cn/space/2022/12/03/e90e0bd04ec94a2ea1b3c206b7935699)

其中 `Collection` 是集合 `List`、`Set` 的父接口，它主要有两个子接口：

- `List`：存储的元素有序，可重复
- `Set`：存储的元素不无序，不可重复

`Map` 是另外的接口，是键值对映射结构的集合。

## ✌ List

List，也没啥好问的，但不排除面试官剑走偏锋，比如面试官也看了我这篇文章。

### ArrayList 和 LinkedList 有什么区别？

（1）数据结构不同

- ArrayList 是基于数组实现
- LinkedList 是基于双向链表实现

![image-20221203102718902](https://s1.vika.cn/space/2022/12/03/ffa84f3c7f614e728fc5297b65db8efe)

![image-20221203101242555](https://s1.vika.cn/space/2022/12/03/3ee24b0853ff423ea6eb6d155173bece)

（2）多数情况下，ArrayList 更利于查找，LinkedList 更利于增删

- ArrayList 基于数组实现，get(int index) 可以直接通过数组下标获取，时间复杂度是O(1)；LinkedList 基于链表实现，get(int index)需要遍历链表，时间复杂度是 O(n)；当然，get(Element) 这种查找，两种集合都需要遍历，时间复杂度都是 O(n)。
- ArrayList 增删如果是数组末尾的位置，直接插入或者删除就可以了，但是如果插入中间位置，就需要把插入位置后的元素都向前或者向后移动，甚至还有可能触发扩容；双向链表的插入和删除只需要改变前驱结点、后继结点和插入结点的指向就行了，不需要移动元素。

![image-20221203102608060](https://s1.vika.cn/space/2022/12/03/e1bbff509824453fb06b2cf35785d5bb)

![image-20221203103102711](https://s1.vika.cn/space/2022/12/03/0f4550fa5a4342c2a2aa808c77f914f4)

> 注意，这个地方可能会出现陷阱，LinkedList 更利于增删更多实现是体现在平均步长上，不是体现在时间复杂度上，二者增删的时间复杂度都是 O(n)

（3）是支持随机访问

- ArrayList 基于数组，所以它可以根据下标查找，支持随机访问，当然，它也实现了 RandomAccess 接口，这个接口只是用来标识是否支持随机访问。
- LinkedList 基于链表，所以它没法根据序号直接获取元素，它没有实现 RandomAccess 接口，标记不支持随机访问。

（4）内存占用，ArrayList 基于数组，是一块连续的内存空间，LinkedList 基于链表，内存空间不连续，它们在内存空间上都有 一些额外的消耗：

- ArrayList 是预先定义好的数组，可能会有空的内存空间，存在一定空间浪费
- LinkedList 每个节点，需要存储前驱和后继，所以每个节点会占用更多的空间

### ArrayList 的扩容机制了解吗？

ArrayList 是基于数组的集合，数组的容量在定义的时候确定的，如果数组满了，再插入，就会数组溢出。所以在插入的时候，会先检查是否需要扩容，如果当前容量 +1 超过数组长度，就会进行扩容。

ArrayList 的扩容机制是创建一个1.5 倍的新数组，然后把原数组的值拷贝过去。

![image-20221203110040098](https://s1.vika.cn/space/2022/12/03/af897e11871849b5a65e50aa84374574)

### ArrayList 怎么序列化的知道吗？为什么用 transient 修饰数组？

ArrayList 的序列化不太一样，它使用 `transient` 修饰存储元素的 `elementData` 数组，`transient` 关键字的作用是让被修饰的成员属性不被序列化。

**为什么最 ArrayList 不直接序列化元素数组呢？**

出于效率的考虑，数组可能长度 100，但实际只用了 50，剩下的 50 其实不用序列化，这样可以提高序列化和反序列化的效率，还可以节省内存空间。

**那 ArrayList 怎么序列化呢？**

ArrayList 通过两个方法 **readObject、writeObject 自定义序列化和反序列化策略**，实际直接使用两个流 `ObjectOutputStream` 和 `ObjectInputStream` 来进行序列化和反序列化。

```java
private void writeObject(java.io.ObjectOutputStream s)
    throws java.io.IOException{

    int expectedModCount = modCount;

    // 先调用默认的序列化方法，将没有transient修饰的成员变量序列化
    s.defaultWriteObject();

    // 将元素容量序列化
    s.writeInt(size);

    // 将不为空的元素序列化
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}

private void readObject(java.io.ObjectInputStream s)
    throws java.io.IOException, ClassNotFoundException {
    elementData = EMPTY_ELEMENTDATA;

    // 先调用默认的反序列化方法
    s.defaultReadObject();

    // 反序列化元素容量
    s.readInt(); 

    if (size > 0) {
        // 检查容量，如果不够就进行扩容
        int capacity = calculateCapacity(elementData, size);
        SharedSecrets.getJavaOISAccess().checkArray(s, Object[].class, capacity);
        ensureCapacityInternal(size);

        Object[] a = elementData;
        // 反序列化元素
        for (int i=0; i<size; i++) {
            a[i] = s.readObject();
        }
    }
}
```

### 快速失败(fail-fast)和安全失败(fail-safe)了解吗？

**快速失败(fail-fast)：快速失败是 Java 集合的一种错误检测机制**

- 在用迭代器遍历一个集合对象时，如果线程 A 遍历过程中，线程 B 对集合对象的内容进行了修改（增加、删除、修改），则会抛出 `Concurrent Modification Exception`。
- 原理：迭代器在遍历时直接访问集合中的内容，并且在遍历过程中使用一个 `modCount` 变量。集合在被遍历期间如果内容发生改变，就会改变 `modCount` 的值。每当迭代器使用 hashNext()/next() 遍历下一个元素之前，都会检测 modCount 变量是否为 expectedmodCount 值，是的话就返回遍历；否则抛出异常，终止遍历。
- 注意：这里异常的抛出条件是检测到 modCount != expectedmodCount 这个条件。如果集合发生变化时修改 modCount 值刚好又设置为了 expectedmodCount 值，则异常不会抛出。因此，不能依赖于这个异常是否抛出而进行并发操作的编程，这个异常只建议用于检查并发修改的 bug。
- 场景：**java.util 包下的集合类都是快速失败的**，不能在多线程下发送并发修改（迭代过程中被修改），比如 `ArrayList` 类。

**安全失败(fail-safe)**

- 采用安全失败机制的集合容器，在遍历时不是直接在集合内容上访问的，而是**先复制原有集合内容，在拷贝的集合上进行遍历**。
- 原理：由于迭代时是对集合的拷贝进行遍历，所以在遍历过程中对原集合所做的修改并不能迭代器检测到，所以不会触发 `Concurrent Modification Exception`。
- 缺点：基于拷贝内容的优点是避免了 `Concurrent Modification Exception`，但同样地，迭代器并不能访问到修改后的内容，即：迭代器遍历的是开始遍历那一刻拿到的集合拷贝，在遍历期间原集合发生的修改迭代器是不知道的。
- 场景：**java.util.concurrent 包下的容器都是安全失败，可以在多线程下并发使用，并发修改**，比如 `CopyOnWriteArrayList` 类。

### 有哪几种实现 ArrayList 线程安全的方法？

fail-fast 是一种可能触发的机制，实际上，ArrayList 的线程安全仍然没有保证，一般，保证 ArrayList 的线程安全可以通过这些方案：

- 使用 Vector 代替 ArrayList。(不推荐，Vector 是一个历史遗留类)

- 使用 Colleations.synchronizedList 包装 ArrayList，然后操作包装后的 list。
- 使用 CopyOnWriteArrayList 代替 ArrayList。
- 在使用 ArrayList 时，应用程序通过同步机制去控制 ArrayList 的读写。

### CopyOnWriteArrayList 了解多少？

CopyOnWriteArrayList 就是线程安全版本的 ArrayList。

它的名字叫做 `CopyOnWrite` —— 写时复制，已经明示了它的原理。

`CopyOnWriteArrayList` 采用了一种读写分离的并发策略。CopyOnWriteArrayList 容器允许并发读，读操作是无锁的，性能较高。至于写操作，比如向容器中添加一个元素，则首先将当前容器复制一份，然后在新副本上执行写操作，结束之后再将原容器的引用指向新容器。  

## ✌ Map







## 公众号

 ![](https://s1.vika.cn/space/2022/12/01/f1f467dd3b8e4984a50dce782aa346ff)
