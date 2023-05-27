import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as e,c as o,a as n,b as s,d as c,e as l}from"./app-566117e8.js";const i={},u={href:"https://leetcode.cn/problems/3sum/",target:"_blank",rel:"noopener noreferrer"},k=l(`<h2 id="题目说明" tabindex="-1"><a class="header-anchor" href="#题目说明" aria-hidden="true">#</a> 题目说明</h2><p>给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。</p><p>注意：答案中不可以包含重复的三元组。</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定数组 nums = [-1, 0, 1, 2, -1, -4]，
满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="分析" tabindex="-1"><a class="header-anchor" href="#分析" aria-hidden="true">#</a> 分析</h2><p>这个问题比起两数之和来，显然要复杂了一些，而且由于结果可能有多种情况，还要考虑去重，整体难度提升了不少。</p><p>最后的返回，就不再是一个简单的数组了，而是“数组的数组”，每一组解都是一个数组，最终有多组解都要返回。</p><h2 id="题解" tabindex="-1"><a class="header-anchor" href="#题解" aria-hidden="true">#</a> 题解</h2><h3 id="方法一-暴力法" tabindex="-1"><a class="header-anchor" href="#方法一-暴力法" aria-hidden="true">#</a> 方法一：暴力法</h3><p>最简单的办法，当然还是暴力法。基本思路是，每个人都先去找到另一个人，然后再一起逐个去找第三个人。</p><p>很容易想到，实现起来就是三重循环：这个时间复杂度是 <strong>O(n^3)</strong>。</p><p>代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token function">threeSum1</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> nums<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 定义结果列表</span>
    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> n <span class="token operator">=</span> nums<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
    <span class="token comment">// 三重 for 循环，枚举所有的三数集合</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n <span class="token operator">-</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">+</span> nums<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    result<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>k<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> result<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行一下，我们会发现，这个结果其实是不正确的没有去重，同样的三元组在结果中无法排除。比如 -1，0，1 会出现两次。而且时间复杂度非常高，是 N^3。</p><p>所以接下来，我们就要做一些改进，试图降低时间复杂度，而且解决去重问题。</p><h3 id="方法二-暴力法的改进-使用哈希表结果去重" tabindex="-1"><a class="header-anchor" href="#方法二-暴力法的改进-使用哈希表结果去重" aria-hidden="true">#</a> 方法二：暴力法的改进：使用哈希表结果去重</h3><p>要做去重，自然首先想到的，就是把结果保存到一张 hash 表里。仿照两数之和，直接存到 HashMap 里查找。</p><p>代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token function">threeSum2</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> nums<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> n <span class="token operator">=</span> nums<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 定义一个 hashMap</span>
    <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> map <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 遍历数组，寻找每个数对应的那二个数</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> thatNum <span class="token operator">=</span> <span class="token number">0</span> <span class="token operator">-</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>thatNum<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 如果已经存在 thatNum，就找到了一组解</span>
            <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> temList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>thatNum<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 添加另一个数</span>
            temList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            result<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>temList<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 把当前数对应的两数组合都保存到 map 里</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> i<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 以两数之和作为 key</span>
            <span class="token keyword">int</span> newKey <span class="token operator">=</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token comment">// 如果 key 不存在，则添加</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>map<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>newKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> tempList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                tempList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                tempList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>nums<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                map<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>newKey<span class="token punctuation">,</span> tempList<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> result<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>时间复杂度降为 N^2，空间复杂度 O(N)。</strong></p><p>但是，我们加一个输入[0,0,0,0]，会发现 结果不正确。</p><p>因为尽管通过 HashMap 存储可以去掉相同二元组的计算结果的值，但没有去掉重复的输出（三元组）。这就导致，0 对应在 HashMap 中有一个值（0，List（0，0）），第三个 0 来了会输出一次，第四个 0 来了又会输出一次。</p><p>如果希望解决这个问题，那就需要继续加入其它的判断来做去重，整个代码复杂度会变得更高。</p><h3 id="方法三-双指针法" tabindex="-1"><a class="header-anchor" href="#方法三-双指针法" aria-hidden="true">#</a> 方法三：双指针法</h3><p>暴力法搜索时间复杂度为 O(N^3)，要进行优化，可通过双指针动态消去无效解来提高效率。</p><p>双指针的思路，又分为左右指针和快慢指针两种。</p><p>我们这里用的是左右指针。左右指针，其实借鉴的就是分治的思想，简单来说，就是在数组头尾各放置一个指针，先让头部的指针（左指针）右移，移不动的时候，再让尾部的指针（右指针）左移：最终两个指针相遇，那么搜索就结束了。</p><p><strong>1. 双指针法铺垫：先将给定 nums 排序，复杂度为 O(NlogN)</strong></p><p>首先，我们可以想到，数字求和，其实跟每个数的大小是有关系的，如果能先将数组排序，那后面肯定会容易很多。</p><p>之前我们搜索数组，时间复杂度至少都为 O(N^2)，而如果用快排或者归并，排序的复杂度，是 O(NlogN)，最多也是 O(N^2)。所以增加一步排序，不会导致整体时间复杂度上升。</p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141231725.png" alt="image-20230527141231725" loading="lazy"></p><p>下面我们通过图解，来看一下具体的操作过程。</p><p><strong>2. 初始状态，定义左右指针 L 和 R，并以指针 i 遍历数组元素</strong></p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141245158.png" alt="image-20230527141245158" loading="lazy"></p><p>固定 3 个指针中最左（最小）数字的指针 i，双指针 L，R 分设在数组索引 (i,len(nums)) 两端，所以初始值，i = 0；L= i + 1；R = nums.length - 1</p><p>通过 L、R 双指针交替向中间移动，记录对于每个固定指针 i 的所有满足 nums[i] + nums[L] + nums[R] == 0 的 L，R 组合。</p><p><strong>两个基本原则：</strong></p><ul><li>当 nums[i] &gt; 0 时直接 break 跳出：因为 nums[R] &gt;= nums[L] &gt;= nums[i] &gt; 0，即 3 个数字都大于 0 ，在此固定指针 i 之后不可能再找到结果了。</li><li>当 i &gt; 0 且 nums[i] == nums[i - 1]时，即遇到重复元素时，跳过此元素 nums[i]：因为已经将 nums[i - 1] 的所有组合加入到结果中，本次双指针搜索只会得到重复组合。</li></ul><p><strong>3. 固定 i，判断 sum，然后移动左右指针 L 和 R</strong></p><p>L，R 分设在数组索引 (i, len(nums)) 两端，当L &lt; R 时循环计算当前三数之和：</p><p>sum = nums[i] + nums[L] + nums[R]</p><p>并按照以下规则执行双指针移动：</p><ul><li>当 sum &lt; 0 时，L ++ 并跳过所有重复的 nums[L]；</li></ul><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141454969.png" alt="image-20230527141454969" loading="lazy"></p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230513224301589.png" alt="image-20230513224301589" loading="lazy"></p><ul><li>由于 sum &lt; 0，L 一直右移，直到跟 R 重合。如果依然没有结果，那么 i++，换下一个数考虑。换下一个数，i++，继续移动双指针：</li></ul><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141542378.png" alt="image-20230527141542378" loading="lazy"></p><p>初始同样还是 L = i + 1，R = nums.length - 1。同样，继续判断 sum。</p><ul><li>找到一组解之后，继续移动 L 和 R，判断 sum，如果小于 0 就右移 L，如果大于 0 就左移 R：</li></ul><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141556620.png" alt="image-20230527141556620" loading="lazy"></p><p>找到一组解 [-1,-1,2]，保存，并继续右移 L。判断 sum，如果这时 sum = -1+0+2 &gt; 0，（R还没变，还是 5 ），那么就让 L 停下，开始左移 R。</p><ul><li>一直移动，又找到一组解</li></ul><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527141612937.png" alt="image-20230527141612937" loading="lazy"></p><ul><li>如果 L 和 R 相遇或者L &gt; R，代表当前 i 已经排查完毕，i++；如果 i 指向的数跟 i - 1 一样，那么直接继续i++，考察下一个数;</li></ul><p>重复以上操作，直到 nums[i] &gt; 0，break 跳出，过程结束</p><p><strong>代码实现如下：</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code> <span class="token keyword">public</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token function">threeSum3</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> nums<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> n <span class="token operator">=</span> nums<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> result <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 0. 先对数组排序</span>
        <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span>nums<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 1. 遍历每一个元素，作为当前三元组中最小的那个（最矮个做核心）</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 1.1 如果当前数已经大于 0，直接退出循环</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// 1.2 如果当前数据已经出现过，直接跳过(去重)</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> nums<span class="token punctuation">[</span>i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">continue</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// 1.3 常规情况，以当前数作为最小数，定义左右指针</span>
            <span class="token keyword">int</span> lp <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
            <span class="token keyword">int</span> rp <span class="token operator">=</span> n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
            <span class="token comment">// 只要左右指针不重叠，就继续移动指针</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>lp <span class="token operator">&lt;</span> rp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">int</span> sum <span class="token operator">=</span> nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">+</span> nums<span class="token punctuation">[</span>lp<span class="token punctuation">]</span> <span class="token operator">+</span> nums<span class="token punctuation">[</span>rp<span class="token punctuation">]</span><span class="token punctuation">;</span>
                <span class="token comment">// 判断 sum 与0做大小对比</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>sum <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token comment">// 1.3.1 找到了一组解</span>
                    result<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span>nums<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>lp<span class="token punctuation">]</span><span class="token punctuation">,</span> nums<span class="token punctuation">[</span>rp<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    lp<span class="token operator">++</span><span class="token punctuation">;</span>
                    rp<span class="token operator">--</span><span class="token punctuation">;</span>
                    <span class="token comment">// 如果移动之后的元素相同，直接跳过(去重)</span>
                    <span class="token keyword">while</span> <span class="token punctuation">(</span>lp <span class="token operator">&lt;</span> rp <span class="token operator">&amp;&amp;</span> nums<span class="token punctuation">[</span>lp<span class="token punctuation">]</span> <span class="token operator">==</span> nums<span class="token punctuation">[</span>lp <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        lp<span class="token operator">++</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    <span class="token keyword">while</span> <span class="token punctuation">(</span>lp <span class="token operator">&lt;</span> rp <span class="token operator">&amp;&amp;</span> nums<span class="token punctuation">[</span>rp<span class="token punctuation">]</span> <span class="token operator">==</span> nums<span class="token punctuation">[</span>rp <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        rp<span class="token operator">--</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>sum <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 1.3.2 小于 0，较小的数增大，左指针右移</span>
                    lp<span class="token operator">++</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>  <span class="token comment">//1.3.3 大于 0，较小的数减小，右指针左移</span>
                    rp<span class="token operator">--</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> result<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>复杂度分析：</p><ul><li><p><strong>时间复杂度 O(N^2)</strong>：其中固定指针k循环复杂度 O(N)，双指针 i，j 复杂度 O(N)。比暴力法的 O(n^3)，显然有了很大的改善。</p></li><li><p><strong>空间复杂度 O(1)</strong>：指针使用常数大小的额外空间。</p></li></ul><h2 id="最后" tabindex="-1"><a class="header-anchor" href="#最后" aria-hidden="true">#</a> 最后</h2><p>尽管时间复杂度依然为 O(n^2)，但是过程中避免了复杂的数据结构，空间复杂度仅为常数级O(1)，可以说，双指针法是一种很巧妙、很优雅的算法设计。</p>`,62);function r(d,m){const a=t("ExternalLinkIcon");return e(),o("div",null,[n("blockquote",null,[n("p",null,[s("力扣链接："),n("a",u,[s("https://leetcode.cn/problems/3sum/"),c(a)])])]),k])}const b=p(i,[["render",r],["__file","threeSum.html.vue"]]);export{b as default};