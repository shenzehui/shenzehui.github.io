---
title: 寻找重复数
tag: 数据结构与算法
category: 算法指北
---

> 力扣链接：https://leetcode.cn/problems/search-a-2d-matrix/

## 题目说明

给定一个包含 n + 1 个整数的数组 nums，其数字都在 1 到 n 之间（包括 1 和 n），可知至少存在一个重复的整数，假设只有一个重复的整数，找出这个重复的数。

## 示例

```java
输入: [1,3,4,2,2]
输出: 2
```

```java
输入: [3,1,3,4,2]
输出: 3
```

说明：

- 不能更改原数组（假设数组是只读的）
- 只能使用额外的 O(1) 空间
- 时间复杂度小于 O(n^2)
- 数组中只有一个重复的数字，但它可能不止重复出现一次。

## 分析

怎样证明 nums 中存在至少一个重复值？其实很简单，这是"抽屉原理"（或者叫"鸽子洞原理"）的简单应用。

这里，nums 中的每个数字（n+1个）都是一个物品，nums 中可以出现的每个不同的数字（n个）都是一个"抽屉"。把 n+1 个物品放入 n 个抽屉中，必然至少会有一个抽屉放了 2 个或者 2 个以上的物品。所以这意味着 nums 中至少有一个数是重复的。

## 题解




