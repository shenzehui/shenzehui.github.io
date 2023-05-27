import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o,c as e,a as n,b as s,d as c,e as l}from"./app-566117e8.js";const i={},u={href:"https://leetcode.cn/problems/ratate-image/",target:"_blank",rel:"noopener noreferrer"},r=l(`<h2 id="题目说明" tabindex="-1"><a class="header-anchor" href="#题目说明" aria-hidden="true">#</a> 题目说明</h2><p>给定一个 n X n 的二维矩阵表示一个图像</p><p>将图像顺时针旋转 90 度。</p><p>说明：你必须在原地旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要使用另一个矩阵来旋转图像。</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>示例 1:
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="分析" tabindex="-1"><a class="header-anchor" href="#分析" aria-hidden="true">#</a> 分析</h2><p>旋转图像，这个应用在图片处理的过程中，非常常见。我们知道对于计算机而言，图像，其实就是一组像素点的集合（所谓点阵），所以图像旋转的问题，本质上就是一个二维数组的旋转问题。</p><h2 id="题解" tabindex="-1"><a class="header-anchor" href="#题解" aria-hidden="true">#</a> 题解</h2><h3 id="方法一-数学方法-转置再翻转" tabindex="-1"><a class="header-anchor" href="#方法一-数学方法-转置再翻转" aria-hidden="true">#</a> 方法一：数学方法（转置再翻转）</h3><p>我们可以利用矩阵的特性。所谓顺时针旋转，其实就是<strong>先转置矩阵，然后翻转每一行</strong>。</p><p>代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">rotate</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> matrix<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> n <span class="token operator">=</span> matrix<span class="token punctuation">.</span>length<span class="token punctuation">;</span>

    <span class="token comment">// 1. 转置矩阵 </span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> i<span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> temp <span class="token operator">=</span> matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> matrix<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 2. 翻转每一行</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> temp <span class="token operator">=</span> matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> j<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>复杂度分析</p><ul><li>时间复杂度：O(N^2)</li></ul><p>这个简单的方法已经能达到最优的时间复杂度O(N<sup>2)，因为既然是旋转，那么每个点都应该遍历到，N</sup>2 的复杂度是不可避免的。</p><ul><li>空间复杂度：O(1)</li></ul><p>旋转操作是原地完成的，只耗费常数空间。</p><h3 id="方法二-分治-分为四部分旋转" tabindex="-1"><a class="header-anchor" href="#方法二-分治-分为四部分旋转" aria-hidden="true">#</a> 方法二：分治（分为四部分旋转）</h3><p>方法 1 使用了两次矩阵操作，能不能只使用一次操作的方法完成旋转呢？</p><p>为了实现这一点，我们来研究每个元素在旋转的过程中如何移动。</p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527151926538.png" alt="image-20230527151926538" loading="lazy"></p><p>这提供给我们了一个思路，可以将给定的矩阵分为四个矩形并且将原地问题划归为旋转这些矩形的问题，这其实就是分治思想。</p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527152100227.png" alt="image-20230527152100227" loading="lazy"></p><p>具体解法也很直接，可以在每一个矩形中遍历元素，并且长度为 4 的临时列表中移动它们。</p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527152459027.png" alt="image-20230527152459027" loading="lazy"></p><p>代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">rotate1</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> matrix<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> n <span class="token operator">=</span> matrix<span class="token punctuation">.</span>length<span class="token punctuation">;</span>

    <span class="token comment">// 遍历四分之一矩阵，左上角</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n <span class="token operator">/</span> <span class="token number">2</span> <span class="token operator">+</span> n <span class="token operator">%</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 对于 matrix[i][j]，需要找到不同的四个矩阵中对应的另外三个位置和元素</span>
            <span class="token comment">// 定义一个临时数组，保存对应的四个元素</span>
            <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> temp <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token keyword">int</span> row <span class="token operator">=</span> i<span class="token punctuation">;</span>
            <span class="token keyword">int</span> col <span class="token operator">=</span> j<span class="token punctuation">;</span>
            <span class="token comment">// 行列转换的规律：col -&gt; newRol rwo + newCol = n -1</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">4</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                temp<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> matrix<span class="token punctuation">[</span>row<span class="token punctuation">]</span><span class="token punctuation">[</span>col<span class="token punctuation">]</span><span class="token punctuation">;</span>
                <span class="token keyword">int</span> x <span class="token operator">=</span> row<span class="token punctuation">;</span>
                row <span class="token operator">=</span> col<span class="token punctuation">;</span>
                col <span class="token operator">=</span> n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> x<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// 再次遍历要处理的四个位置，将旋转之后的数据填入</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> <span class="token number">4</span><span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 用上一个值替换当前的位置</span>
                matrix<span class="token punctuation">[</span>row<span class="token punctuation">]</span><span class="token punctuation">[</span>col<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">[</span><span class="token punctuation">(</span>k <span class="token operator">+</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
                <span class="token keyword">int</span> x <span class="token operator">=</span> row<span class="token punctuation">;</span>
                row <span class="token operator">=</span> col<span class="token punctuation">;</span>
                col <span class="token operator">=</span> n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> x<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>测试：</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> image1 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> image2 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token number">13</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token number">15</span><span class="token punctuation">,</span> <span class="token number">14</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">16</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token class-name">RotateImage</span> rotateImage <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RotateImage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    rotateImage<span class="token punctuation">.</span><span class="token function">rotate1</span><span class="token punctuation">(</span>image1<span class="token punctuation">)</span><span class="token punctuation">;</span>
    rotateImage<span class="token punctuation">.</span><span class="token function">printImage</span><span class="token punctuation">(</span>image1<span class="token punctuation">)</span><span class="token punctuation">;</span>

    rotateImage<span class="token punctuation">.</span><span class="token function">rotate1</span><span class="token punctuation">(</span>image2<span class="token punctuation">)</span><span class="token punctuation">;</span>
    rotateImage<span class="token punctuation">.</span><span class="token function">printImage</span><span class="token punctuation">(</span>image2<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527153844704.png" alt="image-20230527153844704" loading="lazy"></p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527154302958.png" alt="image-20230527154302958" loading="lazy"></p><p><img src="https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20230527154346658.png" alt="image-20230527154346658" loading="lazy"></p><h3 id="方法三-改进方法二" tabindex="-1"><a class="header-anchor" href="#方法三-改进方法二" aria-hidden="true">#</a> 方法三：改进方法二</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">rotate2</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> matrix<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> n <span class="token operator">=</span> matrix<span class="token punctuation">.</span>length<span class="token punctuation">;</span>

    <span class="token comment">// 遍历四分之一矩阵</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n <span class="token operator">/</span> <span class="token number">2</span> <span class="token operator">+</span> n <span class="token operator">%</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> temp <span class="token operator">=</span> matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> matrix<span class="token punctuation">[</span>n <span class="token operator">-</span> j <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 将上一个位置的元素填入</span>
            matrix<span class="token punctuation">[</span>n <span class="token operator">-</span> j <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> matrix<span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> i<span class="token punctuation">]</span><span class="token punctuation">[</span>n <span class="token operator">-</span> j <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> i<span class="token punctuation">]</span><span class="token punctuation">[</span>n <span class="token operator">-</span> j <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> matrix<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> i<span class="token punctuation">]</span><span class="token punctuation">;</span>
            matrix<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">[</span>n <span class="token operator">-</span> <span class="token number">1</span> <span class="token operator">-</span> i<span class="token punctuation">]</span> <span class="token operator">=</span> temp<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最后" tabindex="-1"><a class="header-anchor" href="#最后" aria-hidden="true">#</a> 最后</h2><p><strong>复杂度分析</strong></p><ul><li><p>时间复杂度：O(N^2) 是两重循环的复杂度。</p></li><li><p>空间复杂度：O(1) 由于我们在一次循环中的操作是&quot;就地&quot;完成的，并且我们只用了长度为 4 的临时列表做辅助。</p></li></ul>`,38);function k(d,m){const a=t("ExternalLinkIcon");return o(),e("div",null,[n("blockquote",null,[n("p",null,[s("力扣链接："),n("a",u,[s("https://leetcode.cn/problems/ratate-image/"),c(a)])])]),r])}const g=p(i,[["render",k],["__file","rotateImage.html.vue"]]);export{g as default};