import{_ as s}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as a,d as t}from"./app.20606009.js";const p={},e=t(`<h2 id="arraylist-和-linkedlist-区别" tabindex="-1"><a class="header-anchor" href="#arraylist-和-linkedlist-区别" aria-hidden="true">#</a> ArrayList 和 LinkedList 区别</h2><p>ArrayList：基于<code>动态数组</code>，连续内存存储，适合下标访问（随机访问），扩容机制；因为数组长度固定，超出长度存数据时需要新建数组，然后将老数组拷贝到新数组，如果不是尾部插入数据还会涉及到元素的移动（往后复制一份，插入新元素），使用尾插法并指定初始容量可以极大提升性能、甚至超过 linkedList （需要创建大量的 node 对象）</p><p>LinkedList：基于<code>链表</code>，可以存储在分散的内存中，适合做数据插入及删除操作，不适合查询，需要逐一遍历，遍历 LinkedList <code>必须使用 iterator 不能使用 for 循环</code>，因为每次 for 循环体内通过 get(i) 取得某一元素时，都需要对 list 重新进行遍历，性能消耗极大。另外不要视图使用 indexOf 等返回元素索引，并利用其进行遍历，使用 indexOf 对 list 进行了遍历，当结果为空时会遍历整个列表。</p><p>ArrayList 和 LinkedList 都实现了 List 接口，但是 LinkedList 还额外实现了 Deque 接口，所以 ListedList 还可以当做队列来实现。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ListTest</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> arrayList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 数组实现 查询快</span>
        arrayList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token string">&quot;1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 扩容会变慢</span>
        arrayList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token string">&quot;1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 扩容 元素移动</span>

        <span class="token class-name">LinkedList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> linkedList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LinkedList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 链表实现  增删快</span>
        linkedList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token string">&quot;1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        linkedList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token string">&quot;1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 耗性能的是寻找节点过程</span>

        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>arrayList<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>linkedList<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="arraylist-和-linkedlist-的区别" tabindex="-1"><a class="header-anchor" href="#arraylist-和-linkedlist-的区别" aria-hidden="true">#</a> ArrayList 和 LinkedList 的区别？</h2><p><img src="https://s1.vika.cn/space/2022/11/22/6017f440c7de4348b8168f1a41c93be1" alt="img" loading="lazy"></p><ul><li>ArrayList 是实现了基于<strong>数组</strong>的，存储空间是连续的。LinkedList 基于<strong>链表</strong>的，存储空间是不连续的。（LinkedList 是双向链表）</li><li>对于<strong>随机访问</strong>的 get 和 set，ArrayList 优于 LinkedList，因为 LinkedList 要移动指针。</li><li>对于新增和删除操作（add 和 remove），LinkedList 比较占优势，因为 ArrayList 要移动数据。</li><li>同样的数据量 LinkedList 所占的空间可能会更小，因为 ArrayList 需要<strong>预留空间</strong>便于后续数据增加，而 LinkedList 增加数据只需要<strong>增加一个节点</strong></li></ul><h2 id="hashmap-和-hashtable-的区别-其底层实现是什么" tabindex="-1"><a class="header-anchor" href="#hashmap-和-hashtable-的区别-其底层实现是什么" aria-hidden="true">#</a> HashMap 和 HashTable 的区别？其底层实现是什么？</h2><p>区别：</p><p>（1）HashMap 方法没有 synchronized 修饰，线程非安全，HashTable 线程安全；</p><p>（2）HashMap 允许 key 和 value 为 null，而 HashTable 不允许</p><p>底层实现：数组+链表实现</p><p>jdk8 开始链表高度到8、数组长度超过64，链表转变为红黑树，元素以内部类 Node 节点存在</p><ul><li>计算 key 的 hash 值，二次 hash 然后对数组长度取模，对应到数组下标</li><li>如果没有产生 hash 冲突（下标位置没有元素），则直接创建 Node 存入数组</li><li>如果产生 hash 冲突，先进行 equal 比较，相同则取代该元素，不同，则判断链表高度插入链表，链表高度达到 8，并且数组长度到 64 则转变为红黑树，长度低于 6 则将红黑树转回链表</li><li>key 为 null，存在下标 0 的位置</li></ul><p>数组扩容：默认扩容方式：扩容为原来的两倍，并将原有的数组复制过来。</p><h2 id="hashmap-1-7-和-hashmap-1-8-的区别" tabindex="-1"><a class="header-anchor" href="#hashmap-1-7-和-hashmap-1-8-的区别" aria-hidden="true">#</a> hashMap 1.7 和 hashMap 1.8 的区别？</h2><p>只记录<strong>重点</strong></p><table><thead><tr><th>不同点</th><th>hashMap 1.7</th><th>hashMap 1.8</th></tr></thead><tbody><tr><td>数据结构</td><td>数组+链表</td><td>数组+链表+红黑树</td></tr><tr><td>插入数据方式</td><td>头插法</td><td>尾插法</td></tr><tr><td>hash 值计算方式</td><td>9次扰动处理（4次位运算+5次异或）</td><td>2次扰动处理（1次位运算+1次异或）</td></tr><tr><td>扩容策略</td><td>插入前扩容</td><td>插入后扩容</td></tr></tbody></table><h2 id="hashmap-线程不安全体现在哪里" tabindex="-1"><a class="header-anchor" href="#hashmap-线程不安全体现在哪里" aria-hidden="true">#</a> hashMap 线程不安全体现在哪里？</h2><p>在 <strong>hashMap1.7 中扩容</strong>的时候，因为采用的是头插法，所以会可能会有循环链表产生，导致数据有问题，在 1.8 版本已修复，改为了尾插法</p><p>在任意版本的 hashMap 中，如果在<strong>插入数据时多个线程命中了同一个槽</strong>，可能会有数据覆盖的情况发生，导致线程不安全。</p><h2 id="那么-hashmap-线程不安全怎么解决" tabindex="-1"><a class="header-anchor" href="#那么-hashmap-线程不安全怎么解决" aria-hidden="true">#</a> 那么 hashMap 线程不安全怎么解决？</h2>`,23),i=[e];function o(c,l){return n(),a("div",null,i)}const u=s(p,[["render",o],["__file","java-collect.html.vue"]]);export{u as default};