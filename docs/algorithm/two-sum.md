---
title: 两数之和
tag: 数据结构与算法
category: 数据结构与算法
---

> 力扣链接：https://leetcode.cn/problems/two-sum/

## 题意

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

## 示例 

```java
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1]
```

## 题解

### 方法一：暴力法：穷举所有两数组合

```java
// 方法一：暴力法：穷举所有两数组合
public int[] twoSum1(int[] nums, int target) {
    // 双重 for 循环
    for (int i = 0; i < nums.length - 1; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    // 如果找不到，抛出异常
    throw new IllegalArgumentException("no solution");
}
```

### 方法二：使用 HashMap

```java
public int[] twoSum3(int[] nums, int target) {
    // 定义一个哈希表
    Map<Integer, Integer> map = new HashMap<>();

    // 遍历数组，寻找每个数对应的那个数是否存在（只向前寻找）
    for (int i = 0; i < nums.length; i++) {
        int thatNum = target - nums[i];
        // 如果那个数存在，并且不是当前数自身，就直接返回结果
        if (map.containsKey(thatNum)) {
            return new int[]{map.get(thatNum), i};
        }
        map.put(nums[i], i);
    }
    // 如果找不到，抛出异常
    throw new IllegalArgumentException("no solution");
}
```

::: tip 大致思路

首先定义一个 HashMap，在 key 中存储的是当前数组的每个元素值，value 存储的是元素所在的索引下标，遍历数组，先求每个值匹配的值 thatNum，之后再判断 HashMap 中是否存在该值，若存在，则直接返回两个数对应的索引值（因为题目中已明确说明只有一个解，所以无需再求解）；若循环结束后还没有找到结果，则直接抛出参数错误异常。

:::

## 总结

灵活的使用了一个重要的数据结构 — hash 表，利用 java 给我们提供的 HashMap ，通过 `map.containsKey()` 快速的寻找对应的数。

