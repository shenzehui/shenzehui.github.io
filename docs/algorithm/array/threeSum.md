---
title: 三数之和
tag: 数据结构与算法
category: 算法指北
---

> 力扣链接：https://leetcode.cn/problems/3sum/

## 题目说明

给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

## 示例 

```
给定数组 nums = [-1, 0, 1, 2, -1, -4]，
满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

## 分析

这个问题比起两数之和来，显然要复杂了一些，而且由于结果可能有多种情况，还要考虑去重，整体难度提升了不少。

最后的返回，就不再是一个简单的数组了，而是“数组的数组”，每一组解都是一个数组，最终有多组解都要返回。

## 题解

### 方法一：暴力法

最简单的办法，当然还是暴力法。基本思路是，每个人都先去找到另一个人，然后再一起逐个去找第三个人。

很容易想到，实现起来就是三重循环：这个时间复杂度是 **O(n^3)**。

代码如下：

```java
public List<List<Integer>> threeSum1(int[] nums) {
    // 定义结果列表
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    // 三重 for 循环，枚举所有的三数集合
    for (int i = 0; i < n - 2; i++) {
        for (int j = i + 1; j < n - 1; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] == 0) {
                    result.add(Arrays.asList(nums[i], nums[j], nums[k]));
                }
            }
        }
    }
    return result;
}
```

运行一下，我们会发现，这个结果其实是不正确的没有去重，同样的三元组在结果中无法排除。比如 -1，0，1 会出现两次。而且时间复杂度非常高，是 N^3。

所以接下来，我们就要做一些改进，试图降低时间复杂度，而且解决去重问题。

### 方法二：暴力法的改进：使用哈希表结果去重

要做去重，自然首先想到的，就是把结果保存到一张 hash 表里。仿照两数之和，直接存到 HashMap 里查找。

代码如下：

```java
public List<List<Integer>> threeSum2(int[] nums) {
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();

    // 定义一个 hashMap
    Map<Integer, List<Integer>> map = new HashMap<>();

    // 遍历数组，寻找每个数对应的那二个数
    for (int i = 0; i < n; i++) {
        int thatNum = 0 - nums[i];
        if (map.containsKey(thatNum)) {
            // 如果已经存在 thatNum，就找到了一组解
            List<Integer> temList = new ArrayList<>(map.get(thatNum));
            // 添加另一个数
            temList.add(nums[i]);
            result.add(temList);
        }
        // 把当前数对应的两数组合都保存到 map 里
        for (int j = 0; j < i; j++) {
            // 以两数之和作为 key
            int newKey = nums[i] + nums[j];
            // 如果 key 不存在，则添加
            if (!map.containsKey(newKey)) {
                List<Integer> tempList = new ArrayList<>();
                tempList.add(nums[i]);
                tempList.add(nums[j]);
                map.put(newKey, tempList);
            }
        }
    }
    return result;
}
```

**时间复杂度降为 N^2，空间复杂度 O(N)。**

但是，我们加一个输入[0,0,0,0]，会发现 结果不正确。

因为尽管通过 HashMap 存储可以去掉相同二元组的计算结果的值，但没有去掉重复的输出（三元组）。这就导致，0 对应在 HashMap 中有一个值（0，List（0，0）），第三个 0 来了会输出一次，第四个 0 来了又会输出一次。

如果希望解决这个问题，那就需要继续加入其它的判断来做去重，整个代码复杂度会变得更高。

### 方法三：双指针法

暴力法搜索时间复杂度为 O(N^3)，要进行优化，可通过双指针动态消去无效解来提高效率。

双指针的思路，又分为左右指针和快慢指针两种。

我们这里用的是左右指针。左右指针，其实借鉴的就是分治的思想，简单来说，就是在数组头尾各放置一个指针，先让头部的指针（左指针）右移，移不动的时候，再让尾部的指针（右指针）左移：最终两个指针相遇，那么搜索就结束了。

**1. 双指针法铺垫：先将给定 nums 排序，复杂度为 O(NlogN)**

首先，我们可以想到，数字求和，其实跟每个数的大小是有关系的，如果能先将数组排序，那后面肯定会容易很多。

之前我们搜索数组，时间复杂度至少都为 O(N^2)，而如果用快排或者归并，排序的复杂度，是 O(NlogN)，最多也是 O(N^2)。所以增加一步排序，不会导致整体时间复杂度上升。

![image-20230527141231725](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141231725.png)

下面我们通过图解，来看一下具体的操作过程。

**2. 初始状态，定义左右指针 L 和 R，并以指针 i 遍历数组元素**

![image-20230527141245158](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141245158.png)

固定 3 个指针中最左（最小）数字的指针 i，双指针 L，R 分设在数组索引 (i,len(nums)) 两端，所以初始值，i = 0；L= i + 1；R = nums.length - 1

通过 L、R 双指针交替向中间移动，记录对于每个固定指针 i 的所有满足 nums[i] + nums[L] + nums[R] == 0 的 L，R 组合。

**两个基本原则：**

- 当 nums[i] > 0 时直接 break 跳出：因为 nums[R] >= nums[L] >= nums[i] > 0，即 3 个数字都大于 0 ，在此固定指针 i 之后不可能再找到结果了。
- 当 i > 0 且 nums[i] == nums[i - 1]时，即遇到重复元素时，跳过此元素 nums[i]：因为已经将 nums[i - 1] 的所有组合加入到结果中，本次双指针搜索只会得到重复组合。

**3. 固定 i，判断 sum，然后移动左右指针 L 和 R**

L，R 分设在数组索引 (i, len(nums)) 两端，当L < R 时循环计算当前三数之和：

sum = nums[i] + nums[L] + nums[R]

并按照以下规则执行双指针移动：

- 当 sum < 0 时，L ++ 并跳过所有重复的 nums[L]；

![image-20230527141454969](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141454969.png)

![image-20230513224301589](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513224301589.png)

- 由于 sum < 0，L 一直右移，直到跟 R 重合。如果依然没有结果，那么 i++，换下一个数考虑。换下一个数，i++，继续移动双指针：

![image-20230527141542378](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141542378.png)

初始同样还是 L = i + 1，R = nums.length - 1。同样，继续判断 sum。

- 找到一组解之后，继续移动 L 和 R，判断 sum，如果小于 0 就右移 L，如果大于 0 就左移 R：

![image-20230527141556620](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141556620.png)

找到一组解 [-1,-1,2]，保存，并继续右移 L。判断 sum，如果这时 sum = -1+0+2 > 0，（R还没变，还是 5 ），那么就让 L 停下，开始左移 R。

- 一直移动，又找到一组解

![image-20230527141612937](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141612937.png)

- 如果 L 和 R 相遇或者L > R，代表当前 i 已经排查完毕，i++；如果 i 指向的数跟 i - 1 一样，那么直接继续i++，考察下一个数;

重复以上操作，直到 nums[i] > 0，break 跳出，过程结束

**代码实现如下：**

```java
 public List<List<Integer>> threeSum3(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();

        // 0. 先对数组排序
        Arrays.sort(nums);

        // 1. 遍历每一个元素，作为当前三元组中最小的那个（最矮个做核心）
        for (int i = 0; i < n; i++) {
            // 1.1 如果当前数已经大于 0，直接退出循环
            if (nums[i] > 0) {
                break;
            }
            // 1.2 如果当前数据已经出现过，直接跳过(去重)
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            // 1.3 常规情况，以当前数作为最小数，定义左右指针
            int lp = i + 1;
            int rp = n - 1;
            // 只要左右指针不重叠，就继续移动指针
            while (lp < rp) {
                int sum = nums[i] + nums[lp] + nums[rp];
                // 判断 sum 与0做大小对比
                if (sum == 0) {
                    // 1.3.1 找到了一组解
                    result.add(Arrays.asList(nums[i], nums[lp], nums[rp]));
                    lp++;
                    rp--;
                    // 如果移动之后的元素相同，直接跳过(去重)
                    while (lp < rp && nums[lp] == nums[lp - 1]) {
                        lp++;
                    }
                    while (lp < rp && nums[rp] == nums[rp + 1]) {
                        rp--;
                    }
                } else if (sum < 0) { // 1.3.2 小于 0，较小的数增大，左指针右移
                    lp++;
                } else {  //1.3.3 大于 0，较小的数减小，右指针左移
                    rp--;
                }
            }
        }
        return result;
    }
```

复杂度分析：

- **时间复杂度 O(N^2)**：其中固定指针k循环复杂度 O(N)，双指针 i，j 复杂度 O(N)。比暴力法的 O(n^3)，显然有了很大的改善。

- **空间复杂度 O(1)**：指针使用常数大小的额外空间。

## 最后

尽管时间复杂度依然为 O(n^2)，但是过程中避免了复杂的数据结构，空间复杂度仅为常数级O(1)，可以说，双指针法是一种很巧妙、很优雅的算法设计。

