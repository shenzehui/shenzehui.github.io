---
title: 旋转图像
tag: 数据结构与算法
category: 算法指北
---

> 力扣链接：https://leetcode.cn/problems/two-sum/

## 题目说明

给定一个 n X n 的二维矩阵表示一个图像

将图像顺时针旋转 90 度。

说明：你必须在原地旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要使用另一个矩阵来旋转图像。

## 示例

```
示例 1:
给定 matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],
原地旋转输入矩阵，使其变为:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
示例 2:
给定 matrix =
[
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
], 
原地旋转输入矩阵，使其变为:
[
  [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11]
]
```

## 分析

旋转图像，这个应用在图片处理的过程中，非常常见。我们知道对于计算机而言，图像，其实就是一组像素点的集合（所谓点阵），所以图像旋转的问题，本质上就是一个二维数组的旋转问题。

## 题解

### 方法一：数学方法（转置再翻转）

我们可以利用矩阵的特性。所谓顺时针旋转，其实就是**先转置矩阵，然后翻转每一行**。

代码如下：

```java
public void rotate(int[][] matrix) {
    int n = matrix.length;

    // 1. 转置矩阵 
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // 2. 翻转每一行
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - 1 - j];
            matrix[i][n - 1 - j] = temp;
        }
    }
}
```

复杂度分析

- 时间复杂度：O(N^2)

这个简单的方法已经能达到最优的时间复杂度O(N^2)，因为既然是旋转，那么每个点都应该遍历到，N^2 的复杂度是不可避免的。

- 空间复杂度：O(1)

旋转操作是原地完成的，只耗费常数空间。

### 方法二：分治（分为四部分旋转）

方法 1 使用了两次矩阵操作，能不能只使用一次操作的方法完成旋转呢？

为了实现这一点，我们来研究每个元素在旋转的过程中如何移动。

![image-20230527151926538](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527151926538.png)

这提供给我们了一个思路，可以将给定的矩阵分为四个矩形并且将原地问题划归为旋转这些矩形的问题，这其实就是分治思想。

![image-20230527152100227](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527152100227.png)

具体解法也很直接，可以在每一个矩形中遍历元素，并且长度为 4 的临时列表中移动它们。

![image-20230527152459027](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527152459027.png)

代码如下：

```java
public void rotate1(int[][] matrix) {
    int n = matrix.length;

    // 遍历四分之一矩阵，左上角
    for (int i = 0; i < n / 2 + n % 2; i++) {
        for (int j = 0; j < n / 2; j++) {
            // 对于 matrix[i][j]，需要找到不同的四个矩阵中对应的另外三个位置和元素
            // 定义一个临时数组，保存对应的四个元素
            int[] temp = new int[4];
            int row = i;
            int col = j;
            // 行列转换的规律：col -> newRol rwo + newCol = n -1
            for (int k = 0; k < 4; k++) {
                temp[k] = matrix[row][col];
                int x = row;
                row = col;
                col = n - 1 - x;
            }
            // 再次遍历要处理的四个位置，将旋转之后的数据填入
            for (int k = 0; k < 4; k++) {
                // 用上一个值替换当前的位置
                matrix[row][col] = temp[(k + 3) % 4];
                int x = row;
                row = col;
                col = n - 1 - x;
            }
        }
    }
}
```

**测试：**

```java
public static void main(String[] args) {
    int[][] image1 = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int[][] image2 = {{5, 1, 9, 11}, {2, 4, 8, 10}, {13, 3, 6, 7}, {15, 14, 12, 16}};
    RotateImage rotateImage = new RotateImage();
    rotateImage.rotate1(image1);
    rotateImage.printImage(image1);

    rotateImage.rotate1(image2);
    rotateImage.printImage(image2);
}
```

![image-20230527153844704](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527153844704.png)

![image-20230527154302958](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527154302958.png)

![image-20230527154346658](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527154346658.png)

### 方法三：改进方法二

```java
public void rotate2(int[][] matrix) {
    int n = matrix.length;

    // 遍历四分之一矩阵
    for (int i = 0; i < n / 2 + n % 2; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[n - j - 1][i]; // 将上一个位置的元素填入
            matrix[n - j - 1][i] = matrix[n - 1 - i][n - j - 1];
            matrix[n - 1 - i][n - j - 1] = matrix[j][n - 1 - i];
            matrix[j][n - 1 - i] = temp;
        }
    }
}
```

## 最后

**复杂度分析**

- 时间复杂度：O(N^2) 是两重循环的复杂度。

- 空间复杂度：O(1) 由于我们在一次循环中的操作是"就地"完成的，并且我们只用了长度为 4 的临时列表做辅助。

