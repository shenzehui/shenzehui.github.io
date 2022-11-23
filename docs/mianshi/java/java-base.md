---
title: Java基础 精选面试题🔥
tag: Java基础
category:
  - 面试题
  - Java
article: false
---

## == 和 equals

== ：对比的是`栈中的值`，**基本数据类型是变量值，引用类型是堆中内存对象的地址**

equals：object 中默认也是采用 == 比较，通常会重写

```java
public class StringDemo {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = new String("Hello");
        String str3 = str2;
        System.out.println(str1 == str2);
        System.out.println(str2 == str3); 
        System.out.println(str1 == str3);
        System.out.println(str1.equals(str2));
        System.out.println(str2.equals(str3));
        System.out.println(str1.equals(str3));
    }
}
```

![image-20221110181949125](https://s1.vika.cn/space/2022/11/21/c11e1739d78546e790559d2dc2d7c601)

## 泛型中 extends 和 super 的区别

`<? extends T>` 表示包括 T 在内的任何 T 的子类

`<? super T>` 表示包括 T 在内的任何 T 的父类

## 深拷贝和浅拷贝

深拷贝和浅拷贝就是指对象的拷贝，一个对象中存在两种类型的属性， 一种是基本数据类型，一种是实例对象的引用。

1. 浅拷贝是指，只会`拷贝基本数据类型的值，以及实例对象的引用地址`，并不会复制一份`引用地址所指向的对象`，也就是浅拷贝出来的对象，**内部的类属性指向的是同一个对象**。
2. 深拷贝是指，既会拷贝`基本数据类型的值`，也会针对实例对象的引用地址所指向的对象进行赋值，深拷贝出来的对象，**内部的类属性指向的不是同一个对象**。

## 重载和重写的区别

**重载**：发生在同一类中，`方法名`必须相同，`参数类型`不同、`个数`不同、`顺序`不同，`方法返回值`和`访问修饰符`可以不同，发生在编译时。（跟返回值没有关系）

**重写**：发生在父子类中，方法名、参数列表必须相同，返回值范围小于等于父类，抛出的异常范围小于等于父类，访问修饰符范围大于等于父类；如果父类方法访问修饰符为 **private**，则子类就不能重写该方法。

