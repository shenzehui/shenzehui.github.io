---
title: 搜索二维矩阵
tag: 数据结构与算法
category: 算法指北
---

> 力扣链接：https://leetcode.cn/problems/search-a-2d-matrix/

## 题目说明

编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有如下特性：

- 每行中的整数从左到右按升序排序。
- 每行的第一个整数大于前一行的最后一个整数。

## 示例

![image-20230527160630891](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527160630891.png)

```java
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,50]], target = 3
输出：true
```

```java
输入：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,50]], target = 13
输出：false
```

```java
输入：matrix = [], target = 0
输出：false
```

提示：

```java
m == matrix.length
n == matrix[i].length
0 <= m, n <= 100
-104 <= matrix[i][j], target <= 104
```

## 分析

既然这是一个查找元素的问题，并且数组已经排好序，我们自然可以想到利用二分查找是一个高效的方式。

输入的 m x n 矩阵可以视为长度为 m x n 的有序数组：

![image-20230527160918019](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527160918019.png)

行列坐标为（row，col)的元素，展开之后索引下标为 **idx = row * n + col**；反过来，对于一维坐标为 idx 的元素，对应二维数组中的坐标就是：**row = idx/n；col = idx % n;**

## 题解

### 使用二分查找

代码实现如下：

```java
public static boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length;
    if (m == 0) {
        return false;
    }
    int n = matrix[0].length;
    int[] newArray = new int[m * n];
    // 将二维数组中的元素填充到一维数组中
    for (int i = 0; i < m; i++) {
        n = matrix[i].length;
        for (int j = 0; j < n; j++) {
            newArray[i * n + j] = matrix[i][j];
        }
    }
    // 使用二分查找
    int i = binarySearch(newArray, target, 0, n * m - 1);
    if (i == -1) {
        return false;
    }
    return true;
}

public static int binarySearch(int[] array, int target, int start, int end) {
    if (array[start] > target || array[end] < target || start > end) {
        return -1;
    }
    int mid = (start + end) / 2;
    if (array[mid] > target) {
        return binarySearch(array, target, start, mid - 1);
    } else if (array[mid] < target) {
        return binarySearch(array, target, mid + 1, end);
    } else {
        return mid;
    }
}
```

更加优雅的实现：

```java
public static boolean searchMatrix1(int[][] matrix, int target) {
    int m = matrix.length;
    if (m == 0) {
        return false;
    }
    int n = matrix[0].length;

    // 二分查找，定义左右指针
    int left = 0;
    int right = m * n - 1;
    while (left <= right) {
        // 计算中间位置
        int mid = (left + right) / 2;
        // 计算二维矩阵中对应的行列号，取出对应元素
        int midElement = matrix[mid / n][mid % n];

        //判断中间元素与 target 的关系
        if (midElement < target) {
            left = mid + 1;
        } else if (midElement > target) {
            right = mid - 1;
        } else {
            return true;
        }
    }
    return false;
}
```

测试：

```java
public static void main(String[] args) {
    int[][] matrix = {{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}};
    int target = 10;
    boolean b = searchMatrix(matrix, target);
    System.out.println(b);
}
```

输出：

```java
true
```

## 最后

**复杂度分析**

- 时间复杂度 : 由于是标准的二分查找，时间复杂度为 O(log(m n))。

- 空间复杂度 : 没有用到额外的空间，复杂度为 O(1)。
