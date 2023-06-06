import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as d,c as r,a,b as e,d as n,e as s}from"./app-0c9d838f.js";const c={},o=s('<h2 id="一、git简介" tabindex="-1"><a class="header-anchor" href="#一、git简介" aria-hidden="true">#</a> 一、Git简介</h2><h3 id="_1-1-项目的版本管理" tabindex="-1"><a class="header-anchor" href="#_1-1-项目的版本管理" aria-hidden="true">#</a> 1.1 项目的版本管理</h3><blockquote><p>在项目开发过程中，项目没开发到⼀个节点就会对当前项目进行备份，这个备份就是项目的⼀个版本；当我 们继续开发⼀个阶段后，再次进行备份，就⽣成新的版本——多个版本的集合就是项目的版本库</p></blockquote><p>在项目版本管理中，我们可以使用⼿动进行管理，但是存在⼀些问题：</p><ul><li>需要手动维护版本的更新日志，记录每个版本的变化</li><li>需要手动查找历史版本，当历史版本比较多的时候，查找工作很繁琐</li><li>当我们需要回退到某个版本时，只能够手动的通过 IDE 工具手动打开</li></ul><h3 id="_1-2-团队协同开发" tabindex="-1"><a class="header-anchor" href="#_1-2-团队协同开发" aria-hidden="true">#</a> 1.2 团队协同开发</h3><figure><img src="https://s1.vika.cn/space/2022/11/23/5b24094c165641f7aa13f2505160eae4" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_1-3-版本管理工具-—-git" tabindex="-1"><a class="header-anchor" href="#_1-3-版本管理工具-—-git" aria-hidden="true">#</a> 1.3 版本管理工具 — Git</h3><blockquote><p>Git 是⼀个开源的分布式版本控制系统，用于敏捷高效的处理任何大小项目的版本管理。</p></blockquote><p>核心功能：</p><ul><li>项目的版本管理</li><li>团队协同开发</li></ul><h2 id="二、git-下载及安装" tabindex="-1"><a class="header-anchor" href="#二、git-下载及安装" aria-hidden="true">#</a> 二、Git 下载及安装</h2><h3 id="_2-1-下载-git" tabindex="-1"><a class="header-anchor" href="#_2-1-下载-git" aria-hidden="true">#</a> 2.1 下载 Git</h3>',13),h={href:"https://git-scm.com/",target:"_blank",rel:"noopener noreferrer"},p=a("tbody",null,[a("tr",null,[a("td",null,[a("img",{src:"https://s1.vika.cn/space/2022/11/23/94b0a6011cd64af9982b8d01e930adbc",alt:"",loading:"lazy"})])])],-1),u=s(`<h3 id="_2-2-安装-git" tabindex="-1"><a class="header-anchor" href="#_2-2-安装-git" aria-hidden="true">#</a> 2.2 安装 Git</h3><blockquote><p>除了选择安装位置以外，其他都傻瓜式安装</p></blockquote><h3 id="_2-3-检查" tabindex="-1"><a class="header-anchor" href="#_2-3-检查" aria-hidden="true">#</a> 2.3 检查</h3><ul><li>win + r</li><li>输⼊ cmd</li><li>输入 git --version</li></ul><h2 id="三、git架构" tabindex="-1"><a class="header-anchor" href="#三、git架构" aria-hidden="true">#</a> 三、Git架构</h2><figure><img src="https://s1.vika.cn/space/2022/11/23/248a9421599d4617aa0c594c53cffd47" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="四、git-的基本使用" tabindex="-1"><a class="header-anchor" href="#四、git-的基本使用" aria-hidden="true">#</a> 四、Git 的基本使用</h2><h3 id="_4-1-创建版本库" tabindex="-1"><a class="header-anchor" href="#_4-1-创建版本库" aria-hidden="true">#</a> 4.1 创建版本库</h3><ul><li>在⼯作空间的目录中，右键 <code>Git Bash Here</code> 打开 git 终端</li><li>在 Git 终端中输⼊ <code>git init</code> 指令，创建版本库（就是⼀个.git目录）</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/c7a9a5d02a014cdea37b8f65a9cb580e" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_4-2-查看版本库状态的指令" tabindex="-1"><a class="header-anchor" href="#_4-2-查看版本库状态的指令" aria-hidden="true">#</a> 4.2 查看版本库状态的指令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-3-将工作空间的修改添加到暂存区" tabindex="-1"><a class="header-anchor" href="#_4-3-将工作空间的修改添加到暂存区" aria-hidden="true">#</a> 4.3 将工作空间的修改添加到暂存区</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> a.txt  <span class="token comment">## 只将⼯作空间中的某个⽂件 add 到暂存区</span>
<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>  <span class="token comment">## 将⼯作空间中所有⽂件都 add 暂存区</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-将暂存区内容提交到版本库-仓库" tabindex="-1"><a class="header-anchor" href="#_4-4-将暂存区内容提交到版本库-仓库" aria-hidden="true">#</a> 4.4 将暂存区内容提交到版本库（仓库）</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&#39;版本说明&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-5-查看版本库中的历史版本" tabindex="-1"><a class="header-anchor" href="#_4-5-查看版本库中的历史版本" aria-hidden="true">#</a> 4.5 查看版本库中的历史版本</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> log <span class="token parameter variable">--oneline</span> <span class="token comment">## 每个版本信息只显示⼀⾏</span>
get log <span class="token comment">## 显示每个版本的详细信息</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-6-设置用户信息" tabindex="-1"><a class="header-anchor" href="#_4-6-设置用户信息" aria-hidden="true">#</a> 4.6 设置用户信息</h3><blockquote><p>因为我们将暂存区的内容提交到版本时，会记录当前版本的提交的用户信息，因此在版本提交之前需要先绑 定用户信息</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&#39;ergou&#39;</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&#39;haha@hehe.com&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-7-同步历史版本到工作空间" tabindex="-1"><a class="header-anchor" href="#_4-7-同步历史版本到工作空间" aria-hidden="true">#</a> 4.7 同步历史版本到工作空间</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> checkout 版本号
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="五、远程仓库" tabindex="-1"><a class="header-anchor" href="#五、远程仓库" aria-hidden="true">#</a> 五、远程仓库</h2><blockquote><p>远程仓库，远程版本库；实现版本库的远程存储，以实现团队的协同开发</p></blockquote><figure><img src="https://s1.vika.cn/space/2022/11/23/4a5494b7f67f4dc48aef608405287154" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_5-2-如何获得远程仓库" tabindex="-1"><a class="header-anchor" href="#_5-2-如何获得远程仓库" aria-hidden="true">#</a> 5.2 如何获得远程仓库</h3>`,27),g=a("li",null,"使用 GitLab 搭建私服",-1),b={href:"https://gitbub.com",target:"_blank",rel:"noopener noreferrer"},f={href:"https://gitee.com",target:"_blank",rel:"noopener noreferrer"},v=a("li",null,"Coding",-1),m=a("h3",{id:"_5-3-创建远程仓库-码云",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#_5-3-创建远程仓库-码云","aria-hidden":"true"},"#"),e(" 5.3 创建远程仓库（码云）")],-1),k=a("li",null,[e("注册账号 "),a("ul",null,[a("li",null,[e("账号："),a("a",{href:"mailto:3032388097@qq.com"},"3032388097@qq.com")]),a("li",null,"密码：xxxxxx")])],-1),_={href:"https://gitee.com/shenzehui/java2022.git",target:"_blank",rel:"noopener noreferrer"},x=a("li",null,"远程仓库管理（添加开发人员）",-1),z=s(`<figure><img src="https://s1.vika.cn/space/2022/11/23/88e10103889d47bda4696a6d1dda8c84" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="六、远程仓库操作" tabindex="-1"><a class="header-anchor" href="#六、远程仓库操作" aria-hidden="true">#</a> 六、远程仓库操作</h2><h3 id="_6-1-push-本地仓库到远程仓库" tabindex="-1"><a class="header-anchor" href="#_6-1-push-本地仓库到远程仓库" aria-hidden="true">#</a> 6.1 push 本地仓库到远程仓库</h3><h5 id="_6-1-1-准备工作" tabindex="-1"><a class="header-anchor" href="#_6-1-1-准备工作" aria-hidden="true">#</a> 6.1.1 准备工作</h5><ol><li>创建本地⼯作空间</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>D:<span class="token punctuation">\\</span>demo
	src
		main
			<span class="token function">java</span>
			resources
		<span class="token builtin class-name">test</span>
			<span class="token function">java</span>
	pom.xml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>初始化本地仓库</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3"><li>将⼯作空间搭建的项目结构 add 到暂存区</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="4"><li>将暂存区文件提交到版本库，生成第一个版本</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&#39;提交说明内容&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="5"><li>为当前项⽬创建⼀个远程仓库</li></ol>`,13),y={href:"https://gitee.com/shenzehui/java2022.git",target:"_blank",rel:"noopener noreferrer"},j=a("h5",{id:"_6-1-2-本地仓库关联远程仓库",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#_6-1-2-本地仓库关联远程仓库","aria-hidden":"true"},"#"),e(" 6.1.2 本地仓库关联远程仓库")],-1),q={href:"https://gitee.com/shenzehui/java2022.git",target:"_blank",rel:"noopener noreferrer"},G=s(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> remote <span class="token function">add</span> origin https://gitee.com/shenzehui/java2022.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_6-1-3-查看远程仓库状态" tabindex="-1"><a class="header-anchor" href="#_6-1-3-查看远程仓库状态" aria-hidden="true">#</a> 6.1.3 查看远程仓库状态</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> remote <span class="token parameter variable">-v</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_6-1-4-将本地仓库-push-到远程仓库" tabindex="-1"><a class="header-anchor" href="#_6-1-4-将本地仓库-push-到远程仓库" aria-hidden="true">#</a> 6.1.4 将本地仓库 push 到远程仓库</h5><blockquote><p>push 到远程仓库需要 gitee 的帐号和密码</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> push origin master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://s1.vika.cn/space/2022/11/23/2479fc4e23c2484b805b25805147e464" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/e98faa92794342e3b36d2ec226097c24" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_6-2-其他开发者-pull-远程仓库到本地" tabindex="-1"><a class="header-anchor" href="#_6-2-其他开发者-pull-远程仓库到本地" aria-hidden="true">#</a> 6.2 其他开发者 pull 远程仓库到本地</h3><h5 id="_6-2-1-先创建本地仓库" tabindex="-1"><a class="header-anchor" href="#_6-2-1-先创建本地仓库" aria-hidden="true">#</a> 6.2.1 先创建本地仓库</h5><ul><li>在 E 盘创建 ws 目录(空目录)，进⼊ ws 目录，打开 Git 客户端</li><li>创建本地版本库</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_6-2-2-拉取远程仓库到本地" tabindex="-1"><a class="header-anchor" href="#_6-2-2-拉取远程仓库到本地" aria-hidden="true">#</a> 6.2.2 拉取远程仓库到本地</h5><ul><li>拉取远程仓库</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull 远程仓库地址 master
<span class="token function">git</span> pull https://gitee.com/shenzehui/java2022.git master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_6-3-解决协同开发冲突问题" tabindex="-1"><a class="header-anchor" href="#_6-3-解决协同开发冲突问题" aria-hidden="true">#</a> 6.3 解决协同开发冲突问题</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>场景: Helloworld.java [bbb]
开发者1：沈哥 							开发者2：周瑜
-------------------------------------------------------------------------------------------
git pull java2022 master					git pull java2022 master 
 										在 Hellworld.java 中新增内容 “bbb”
在 Hellworld.java 中新增内容 “aaa”
 										git add .
 										git commit -m &#39;&#39;
 										git push java2022 master
git add .
git commit -m &#39;&#39;
git push java2022 master【会失败！！！ 在我 pull 之后，push 之前其他开发人员push过】
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>问题：我该如何操作？
git pull java2022 master 【将小乔修改的内容拉取到本地】

对文件进行冲突合并

git add .
git commit -m &#39;&#39;
git push java2022 master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Helloworld.java</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token operator">&gt;&gt;&gt;</span><span class="token operator">&gt;&gt;&gt;</span><span class="token operator">&gt;&gt;&gt;</span><span class="token operator">&gt;&gt;&gt;</span><span class="token operator">&gt;&gt;&gt;</span><span class="token operator">&gt;&gt;&gt;</span><span class="token operator">&gt;&gt;&gt;</span><span class="token class-name">HEAD</span>
aaa
<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>
bbb
<span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;&lt;</span><span class="token operator">&lt;</span> sikdfhjkasdfhjasdfhjk
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、分支管理" tabindex="-1"><a class="header-anchor" href="#七、分支管理" aria-hidden="true">#</a> 七、分支管理</h2><h3 id="_7-1-什么是分支" tabindex="-1"><a class="header-anchor" href="#_7-1-什么是分支" aria-hidden="true">#</a> 7.1 什么是分支</h3><blockquote><p>分支就是版本库中记录版本位置（支线），分支之间项目会影响，使用分支可以对项目起到保护作用分支就是⼀条时间线，每次提交就在这条时间线上形成⼀个版本</p></blockquote><h3 id="_7-2-分支特性" tabindex="-1"><a class="header-anchor" href="#_7-2-分支特性" aria-hidden="true">#</a> 7.2 分支特性</h3><ul><li>创建⼀个新的版本库，默认创建⼀个主分支 — master 分支</li><li>每个分支可以进行单独管理（常规分支 、保护分支 、只读分支 ）</li><li>分支是可以合并的</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/84317d29d63c42cd9b4b2e2761537bb2" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_7-3-分支操作" tabindex="-1"><a class="header-anchor" href="#_7-3-分支操作" aria-hidden="true">#</a> 7.3 分支操作</h3><h5 id="_7-3-1-创建分支" tabindex="-1"><a class="header-anchor" href="#_7-3-1-创建分支" aria-hidden="true">#</a> 7.3.1 创建分支</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> branch branch_name  <span class="token comment">#会继承当前分支下的最后一个版本</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_7-3-2-查看分支" tabindex="-1"><a class="header-anchor" href="#_7-3-2-查看分支" aria-hidden="true">#</a> 7.3.2 查看分支</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> branch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_7-3-3-切换分支" tabindex="-1"><a class="header-anchor" href="#_7-3-3-切换分支" aria-hidden="true">#</a> 7.3.3 切换分支</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> checkout branch_name <span class="token comment"># 切换到指定分⽀上的最新版本</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_7-3-4-检出分支" tabindex="-1"><a class="header-anchor" href="#_7-3-4-检出分支" aria-hidden="true">#</a> 7.3.4 检出分支</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> checkout 历史版本 <span class="token parameter variable">-b</span> branch_name <span class="token comment"># 签出指定的历史版本创建新分⽀</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="_7-3-5-分支合并" tabindex="-1"><a class="header-anchor" href="#_7-3-5-分支合并" aria-hidden="true">#</a> 7.3.5 分支合并</h5><ul><li><strong>三方合并：当前分支和要合并分支都有新版本</strong></li><li><strong>快速合并：当前分支没有新版本</strong></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 在master分⽀执⾏ git merge dev 表示将 dev 分⽀合并 merge   </span>
<span class="token function">git</span> merge breanch_name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://s1.vika.cn/space/2022/11/23/8d1f2cbd7be742c19110581cb1e9270e" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_7-3-6-查看分支及版本视图" tabindex="-1"><a class="header-anchor" href="#_7-3-6-查看分支及版本视图" aria-hidden="true">#</a> 7.3.6 查看分支及版本视图</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> log <span class="token parameter variable">--oneline</span> <span class="token parameter variable">--graph</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>企业中主流分支使用</strong></p><figure><img src="https://s1.vika.cn/space/2022/11/23/ff0dd5f860bc44eea9c77ebfc8f3187f" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="八、idea-整合-git-使用" tabindex="-1"><a class="header-anchor" href="#八、idea-整合-git-使用" aria-hidden="true">#</a> 八、Idea 整合 Git 使用</h2><blockquote><p>作为 Java 开发工程，我们代码的编写工作都是在 IDE 工具（idea）中完成，因此我们需要了解和掌握直接使用 IDE 工具完成 Git 的操作</p></blockquote><h3 id="_8-1-idea-关联-git" tabindex="-1"><a class="header-anchor" href="#_8-1-idea-关联-git" aria-hidden="true">#</a> 8.1 IDEA 关联 Git</h3><figure><img src="https://s1.vika.cn/space/2022/11/23/cdcaaf328d4e44f2aced42308106e5fe" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_8-2-idea-中-git-版本管理" tabindex="-1"><a class="header-anchor" href="#_8-2-idea-中-git-版本管理" aria-hidden="true">#</a> 8.2 IDEA 中 Git 版本管理</h3><blockquote><p>准备⼯作：打开 IDEA 新建⼀个 web ⼯程</p></blockquote><h5 id="_8-2-1-创建本地版本库" tabindex="-1"><a class="header-anchor" href="#_8-2-1-创建本地版本库" aria-hidden="true">#</a> 8.2.1 创建本地版本库</h5><figure><img src="https://s1.vika.cn/space/2022/11/23/83bf6d03e69b408db07a9366c08153ab" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/604c9999682c4a65b539f645ff04dfa3" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_8-2-2-设置忽略文件" tabindex="-1"><a class="header-anchor" href="#_8-2-2-设置忽略文件" aria-hidden="true">#</a> 8.2.2 设置忽略文件</h5><blockquote><p>在工作空间中有些文件是不需要记录到版本库中的（例如 .idea、target、.iml 文件），可以通过设置忽略提交 来实现</p></blockquote><ul><li>在工作空间的根目录（项目的根目录）中创建⼀个名为 <code>.gitignore</code> 文件</li><li>在 <code>.gitignore</code> 文件配置忽略过滤条件</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token punctuation">.</span>idea
target
<span class="token operator">*</span><span class="token punctuation">.</span>iml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_8-2-3-将工作空间-add-到暂存区" tabindex="-1"><a class="header-anchor" href="#_8-2-3-将工作空间-add-到暂存区" aria-hidden="true">#</a> 8.2.3 将工作空间 add 到暂存区</h5><ul><li>选择项目/文件---右键----Git---Add(添加到暂存区的文件---绿色)</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/10ae187ab9844c4d98f48f7af91a3c3a" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>如果一个文件创建好之后还没有添加到暂存区—棕红色</li><li>添加到暂存区的操作可以设置默认添加</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/a2412a8eee224b4ba194028f80c3142d" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_8-2-4-将暂存区提交到版本库" tabindex="-1"><a class="header-anchor" href="#_8-2-4-将暂存区提交到版本库" aria-hidden="true">#</a> 8.2.4 将暂存区提交到版本库</h3><ul><li>选择项目/文件---右键---Git--Commit（记录到版本库的文件--黑色）</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/f8608585c8f34c4b887c95a75c07333e" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>如果对记录到 版本库的文件进行了修改，也就是说工作空间和版本库不⼀致--蓝色</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/8bc62c13b43d42cf8ea2ac5f57e82f3e" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_8-3-idea-中-git-分支管理" tabindex="-1"><a class="header-anchor" href="#_8-3-idea-中-git-分支管理" aria-hidden="true">#</a> 8.3 IDEA 中 Git 分支管理</h3><h5 id="_8-3-1-创建分支" tabindex="-1"><a class="header-anchor" href="#_8-3-1-创建分支" aria-hidden="true">#</a> 8.3.1 创建分支</h5><ul><li>点击IDEA右下角 <code>Git</code></li><li>在弹窗中点击 <code>New Branch</code></li><li>输入新分支的名称</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/f550d0e403a448df857a452efa29be07" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_8-3-2-切换分支" tabindex="-1"><a class="header-anchor" href="#_8-3-2-切换分支" aria-hidden="true">#</a> 8.3.2 切换分支</h5><ul><li>点击IDEA右下角 <code>Git</code></li><li>点击非当前分支右边的箭头</li><li>在选项卡点击 <code>checkout</code></li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/0f43877e174347bc8a58de07606fbc4b" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_8-3-3-删除分支" tabindex="-1"><a class="header-anchor" href="#_8-3-3-删除分支" aria-hidden="true">#</a> 8.3.3 删除分支</h5><table><thead><tr><th>点击右下角 git</th></tr></thead><tbody><tr><td><img src="https://s1.vika.cn/space/2022/11/23/874e1957ee00480688b85a09823de7ac" alt="" loading="lazy"></td></tr></tbody></table><h5 id="_8-3-4-合并分支" tabindex="-1"><a class="header-anchor" href="#_8-3-4-合并分支" aria-hidden="true">#</a> 8.3.4 合并分支</h5><blockquote><p>例如：将 dev 合并到 master</p></blockquote><ul><li>切换到 master 分支</li><li>点击 dev 分支右面的箭头，在展开的菜单中选择 <code>Merge Selected into current</code></li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/6950499e54ed4a1b8e5802a72bd67378" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_8-4-idea-中使用-git-进行团队协同开发" tabindex="-1"><a class="header-anchor" href="#_8-4-idea-中使用-git-进行团队协同开发" aria-hidden="true">#</a> 8.4 IDEA 中使用 Git 进行团队协同开发</h3><h5 id="_8-4-1-项目管理者" tabindex="-1"><a class="header-anchor" href="#_8-4-1-项目管理者" aria-hidden="true">#</a> 8.4.1 项目管理者</h5><ol><li><strong>完成项目搭建</strong></li></ol><ul><li>略</li></ul><ol start="2"><li>为当前项目创建本地版本库</li><li>将搭建好的项目提交到本地版本库</li></ol><ul><li>add 到暂存区</li><li>commit 到版本库</li></ul><ol start="4"><li>创建远程版本库（远程仓库）</li></ol>`,86),E={href:"https://gitee.com/shenzehui/git-jd.git",target:"_blank",rel:"noopener noreferrer"},I=a("li",null,"管理—添加开发者",-1),D=s('<ol start="5"><li>将本地仓库 push 到远程仓库（master 分支——master 分支）</li></ol><figure><img src="https://s1.vika.cn/space/2022/11/23/78f43064b7ed41b7a2652bb7e6d60d06" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/bc8e79acba104c9483d16b1ec679641c" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/7a49a5ffbc874d82ab62a6b6a7ec4f3d" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ol start="6"><li>在本地创建 dev 分支</li></ol><blockquote><p>在远程仓库 <code>New Branch from Selected</code> 新建本地 <code>dev</code> 分支（master 需要进行保护）</p></blockquote><figure><img src="https://s1.vika.cn/space/2022/11/23/29e89f2fe5bc4978a15c012de3b029fc" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/655895f4a51a444eb16b110ba9ed95d7" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>在本地会创建一个 dev 分支，但分支内容会与远程仓库 master 分支一致</strong></p><ol start="7"><li>将本地<code>dev</code>分支 push 到远程仓库，新建远程仓库的 dev 分支</li></ol><figure><img src="https://s1.vika.cn/space/2022/11/23/848ae42f032c49cea28979efd565233c" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/b83da95f23e54d9a9795666c3af3ee93" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ol start="8"><li>设置远程仓库中 master 分支为保护分支</li></ol><figure><img src="https://s1.vika.cn/space/2022/11/23/874e40342893483bb64e0e0a4f799267" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h5 id="_8-4-2-项目开发者" tabindex="-1"><a class="header-anchor" href="#_8-4-2-项目开发者" aria-hidden="true">#</a> 8.4.2 项目开发者</h5><ol><li>从管理员提供的远程仓库 pull 项目到本地</li></ol>',16),w={href:"https://gitee.com/shenzehui/git-jd.git",target:"_blank",rel:"noopener noreferrer"},A=s('<figure><img src="https://s1.vika.cn/space/2022/11/23/d52549a8d28044e6a3029322489a021b" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/afa3bfdcabe34344a0bd501afafe50e7" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ol start="2"><li>打开项目（此时本地工作空间的项目和远程仓库是同步的）</li><li>开发步骤：</li></ol><ul><li>新建本地分支 <code>dev</code></li><li>选择要修改的文件 — pull</li><li>进行修改操作</li><li>测试本地修改</li><li>add 到暂存区</li><li>commit 到本地版本库</li><li>push 到远程仓库（dev）</li></ul><h3 id="_8-5-解决团队协同开发的冲突问题" tabindex="-1"><a class="header-anchor" href="#_8-5-解决团队协同开发的冲突问题" aria-hidden="true">#</a> 8.5 解决团队协同开发的冲突问题</h3><blockquote><p>冲突：在 pull 之后，push 之前被其他开发者 push 成功</p></blockquote><ul><li>选择产生冲突的文件---pull</li><li>弹出弹窗提示：accpet yours | accept theirs | Merge <ul><li><code>accpet yours</code> 保留自己的版本（提交时会覆盖其他开发者代码）</li><li><code>accpet theirs</code> 保留远程仓库上的版本（会导致自己修改的代码丢失）</li><li><code>Merge</code> 手动合并（和其他开发者沟通合并方案）</li></ul></li></ul><p><strong>注意：新版 IDEA 这里开始直接点 Merge 即可，后面会有其它方案提示</strong></p><figure><img src="https://s1.vika.cn/space/2022/11/23/2703949b3109486f83418e0f26a85bc7" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>点击 Merge 后的显示：</strong></p><figure><img src="https://s1.vika.cn/space/2022/11/23/13153699ea48411bb2a1fb13748fa120" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>Merge 页面说明：</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/59166cd9c16d49238185e49f9799b8d7" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li>点击两个合并按钮后：</li></ul><figure><img src="https://s1.vika.cn/space/2022/11/23/43d0631329644361babfb32ac107c03b" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/b3f0e94b0c0742f4b616e9af39e70e75" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://s1.vika.cn/space/2022/11/23/3f9402d1f4724a0d9211a8efd5341a3f" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>注意：此时需要再进行一次 push 操作才会生效</strong></p>',18);function H(B,M){const i=l("ExternalLinkIcon");return d(),r("div",null,[o,a("table",null,[a("thead",null,[a("tr",null,[a("th",null,[a("a",h,[e("https://git-scm.com/"),n(i)])])])]),p]),u,a("ul",null,[g,a("li",null,[e("远程仓库提供商 GitHub "),a("a",b,[e("https://gitbub.com"),n(i)])]),a("li",null,[e("Gitee（码云） "),a("a",f,[e("https://gitee.com"),n(i)])]),v]),m,a("ul",null,[k,a("li",null,[e("创建远程仓库 "),a("a",_,[e("https://gitee.com/shenzehui/java2022.git"),n(i)])]),x]),z,a("p",null,[a("a",y,[e("https://gitee.com/shenzehui/java2022.git"),n(i)])]),j,a("blockquote",null,[a("p",null,[e("建⽴本地仓库和远程仓库 "),a("a",q,[e("https://gitee.com/shenzehui/java2022.git"),n(i)]),e(" 的关联")])]),G,a("ul",null,[a("li",null,[a("a",E,[e("https://gitee.com/shenzehui/git-jd.git"),n(i)])]),I]),D,a("ul",null,[a("li",null,[e("远程仓库 "),a("a",w,[e("https://gitee.com/shenzehui/git-jd.git"),n(i)])])]),A])}const C=t(c,[["render",H],["__file","git.html.vue"]]);export{C as default};