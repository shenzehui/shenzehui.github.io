import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as l,c as a,a as n,b as i,d as v,e as r}from"./app-3d9fb0de.js";const u={},c={href:"https://leetcode.cn/problems/rotate-image",target:"_blank",rel:"noopener noreferrer"},m=r(`<h2 id="题目说明" tabindex="-1"><a class="header-anchor" href="#题目说明" aria-hidden="true">#</a> 题目说明</h2><p>实现获取下一个排列的函数，算法需要将给定数字序列重新排序成字典序列中下一个更大的排序。如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。必须原地修改，只允许有额外常数空间。</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1,2,3 → 1,3,2
3,2,1 → 1,2,3
1,1,5 → 1,5,1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="题解" tabindex="-1"><a class="header-anchor" href="#题解" aria-hidden="true">#</a> 题解</h2><div class="language-方法一：暴力法 line-numbers-mode" data-ext="方法一：暴力法"><pre class="language-方法一：暴力法"><code>
最简单的想法就是暴力枚举，我们找到由给定数组的元素形成的列表的每个可能的排序，并找出给定的排列更大的排列。

但是这个方法要求我们找出所有可能的排列，这需要很长时间，实施起来也很复杂。因此，这种算法不能满足要求。 我们跳过它的实现，直接采用正确的方法。

**复杂度分析**

时间复杂度：O(n!)，可能的排列总计有 n! 个。

空间复杂度：O(n)，因为数组将用于存储排列。

### 方法二：一遍扫描

首先，我们观察到对于任何给定序列的**降序排序**，就不会有下一个更大的排列。

例如，以下数组不可能有下一个排列：

- 
[9, 5, 4, 3, 1]
- 

这时应该直接返回升序排列。

所以对于一般的情况，如果有一个&quot;升序子序列&quot;，那么就一定可以找到它的下一个排列。具体来说，需要从右边找到第一对连续的数组 a[i] 和 a[i-1]，它们满足 a[i] &gt; a[i-1]。

所以一个思路是，找到最后一个的&quot;正序&quot;排列的子序列，把它改成下一个排列就行了。

![image-20230527145642719](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527145642719.png)

不过具体操作会发现，如果正序子序列后没数了，那么子序列的&quot;下一个&quot;一定就是整个序列的&quot;下一个&quot;，这样做没问题，但如果后面还有逆序排列的数，这样就不对了。比如：

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[1,3,8,7,6,2]</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>
最后的正序列子序列是[1,3,8]，但显然不能直接换成[1,8,3]就完事了。而是应该把 3 换成后面比 3 大比 8 小的数，而且选最小的那个 6。接下来，还要让 6 之后的所有数，做一个升序排列，得到结果：

### 
[1,6,2,3,7,8]
###

代码实现如下：

\`\`\`java
/**
 * 方法改进：将降序数组反转的操作提取出来
 */
public void nextPermutation2(int[] nums) {
    int n = nums.length;
​
    // 1.从后向前找到升序子序列，找到一次下降的数，位置记为 k
    int k = n - 2;
    while (k &gt;= 0 &amp;&amp; nums[k] &gt;= nums[k + 1]) {
        k--;
    }
​
    // 找到 k,就是需要调整位置的最高位
​
    // 2.如果 k = -1，说明所有数降序排列，改成升序排列
    if (k == -1) {
        reverse(nums, 0, n - 1);
        return;
    }
​
    // 3. 一般情况，k &gt;=0
    // 3.1 依次遍历剩余降序排列部分，找到要替换最高位的那个数
    int i = k + 2;  // k+1肯定比它大
    while (i &lt; n &amp;&amp; nums[i] &gt; nums[k]) {
        i++;
    }
    // 当前的 i 就是后面部分第一个比 nums[k] 小的数，num[i-1] 就是比当前数大的最小的数，就是要替换的数
​
    // 3.2 交换 i -1 和 k 位置上的数
    sway(nums, k, i - 1);
​
    // 3.3 k 之后的剩余部分变成升序排列，直接前后替换
    reverse(nums, k + 1, n - 1);
}
​
/**
 * 定义一个方法，交换数组中两个元素
 */
private void sway(int[] nums, int i, int j) {
    int tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp;
}
​
/**
 * 定义一个反转数组的方法
 */
private void reverse(int[] nums, int start, int end) {
    while (start &lt; end) {
        sway(nums, start, end);
        start++;
        end--;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最后" tabindex="-1"><a class="header-anchor" href="#最后" aria-hidden="true">#</a> 最后</h2><p><strong>复杂度分析</strong></p><ul><li>时间复杂度：O(N)，其中 NN 为给定序列的长度。我们至多只需要扫描两次序列，以及进行一次反转操作。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code></code></pre><div class="highlight-lines"></div><div class="line-numbers" aria-hidden="true"></div></div>`,12);function t(b,o){const e=d("ExternalLinkIcon");return l(),a("div",null,[n("blockquote",null,[n("p",null,[i("力扣链接："),n("a",c,[i("https://leetcode.cn/problems/rotate-image"),v(e)])])]),m])}const p=s(u,[["render",t],["__file","rotateImage.html.vue"]]);export{p as default};
