---
title: 二分查找
tag: 数据结构与算法
category: 算法指北
---

## 起步

二分查找也称折半查找（Binary Search），它是一种效率较高的查找方法，前提是数据结构必须先**排好序**，可以在**对数**时间复杂度内完成查找。

二分查找事实上采用的就是一种**分治策略**，它充分利用了元素间的次序关系，可在最坏的情况下用O(log n)完成搜索任务。

它的基本思想是：假设数组元素呈升序排列，将n个元素分成个数大致相同的两半，取 a[n/2] 与欲查找的 x 作比较，如果 x=a[n/2] 则找到 x，算法终止；如果 x<a[n/2]，则我们只要在数组 a 的左半部继续搜索 x；如果 x>a[n/2]，则我们只要在数组 a 的右半部继续搜索 x。

![image-20230527155648073](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527155648073.png)



二分查找问题也是面试中经常考到的问题，虽然它的思想很简单，但写好二分查找算法并不是一件容易的事情。

## 实现

接下来，我们首先用代码实现一个 int 数组的二分查找：

```java
public int binarySearch(int[] a, int key) {
    // 定义初始查找范围，双指针
    int low = 0;
    int high = a.length - 1;

    // 排除特殊情况
    if (key < a[low] || key > a[high]) {
        return -1;
    }
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] < key) {
            // 取右半部分
            low = mid + 1;
        } else if (a[mid] > key) {
            // 取左半不封
            high = mid - 1;
        } else {
            // 相等直接返回
            return mid;
        }
    }
    return -1;
}
```

当然，我们也可以用递归的方式实现：

```java
public int binarySearch2(int[] a, int key, int fromIndex, int toIndex) {
    // 基本判断，当起始位置大于结束位置时，直接返回 -1；特殊情况超出最大小值，直接返回 -1
    if (key < a[fromIndex] || key > a[toIndex] || fromIndex > toIndex) {
        return -1;
    }
    // 计算中间位置
    int mid = (fromIndex + toIndex) / 2;

    // 判断中间位置元素和 key 元素的大小，更改搜索范围，递归调用
    if (a[mid] > key) {
        return binarySearch2(a, key, fromIndex, mid - 1);
    } else if (a[mid] < key) {
        return binarySearch2(a, key, mid + 1, toIndex);
    } else {
        return mid;
    }
}
```

测试：

```java
public static void main(String[] args) {
    int[] arr = {1, 2, 3, 4, 5, 6, 7, 10, 11};
    int key = 7;
    BinarySearch binarySearch = new BinarySearch();
    int index = binarySearch.binarySearch(arr, key);
    int index2 = binarySearch.binarySearch2(arr, key, 0, arr.length - 1);

    System.out.println(index);
    System.out.println(index2);
}
```

![image-20230527160231252](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527160231252.png)

## 最后

我们总结一下二分查找：

- 优点是比较次数少，查找速度快，平均性能好；

- 缺点是要求待查表为有序表，且插入删除困难。

因此，二分查找方法适用于不经常变动而查找频繁的有序列表。使用条件：查找序列是顺序结构，有序。
