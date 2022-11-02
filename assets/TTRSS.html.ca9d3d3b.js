import{_ as r}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as l,c as i,a as s,b as e,d as n,w as c,e as p,r as t}from"./app.e1fd1b76.js";const d={},w={href:"http://ttrss.henry.wang/zh/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://github.com/levito/tt-rss-feedly-theme",target:"_blank",rel:"noopener noreferrer"},m={href:"https://tt-rss.org/wiki/FAQ",target:"_blank",rel:"noopener noreferrer"},h=s("li",null,[e("定期备份："),s("code",null,"偏好设置 - 订阅源"),e(" 导出订阅源和 tt-rss 设置。")],-1),_=s("h2",{id:"手动部署",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#手动部署","aria-hidden":"true"},"#"),e(" 手动部署")],-1),b=s("p",null,"虽然 Tiny Tiny RSS 官方推荐用 Docker 部署，不过手动部署也很简单，挑选适合自己的方式即可。",-1),v=s("ol",null,[s("li",null,[e("进入指定目录，"),s("code",null,"cd /www/wwwroot/"),e("。")]),s("li",null,[e("新建 rss 目录，并下载最新 tt-rss，"),s("code",null,"git clone https://git.tt-rss.org/fox/tt-rss.git rss"),e("。")]),s("li",null,"打开 rss 链接，页面会出现指定要求，如：提升文件权限，删除禁用函数 passthru，安装 php 扩展-fileinfo。配置好后，重新加载 php 配置。")],-1),k={href:"https://tt-rss.org/wiki/UpdatingFeeds",target:"_blank",rel:"noopener noreferrer"},S=s("code",null,"lock/update_daemon.lock",-1),f=s("code",null,"update_daemon.stamp",-1),T={href:"https://www.cnblogs.com/imyalost/p/9801426.html",target:"_blank",rel:"noopener noreferrer"},g=p(`<ul><li>指定 PHP 版本来运行：<code>/www/server/php/74/bin/php /www/wwwroot/rss/update.php --daemon</code>。</li><li>不指定版本运行：<code>php /www/wwwroot/rss/update.php --daemon</code>。</li></ul><p>服务器使用定时任务更新 TTRSS：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">crontab</span> <span class="token parameter variable">-e</span> <span class="token comment">#进入 Cpanel 面板添加定时任务</span>
*/15 * * * * /usr/bin/php /www/wwwroot/rss/update.php <span class="token parameter variable">--feeds</span> <span class="token parameter variable">--quiet</span> <span class="token comment">#只安装了一个php</span>
*/15 * * * * /www/server/php/74/bin/php /www/wwwroot/rss/update.php <span class="token parameter variable">--feeds</span> <span class="token parameter variable">--quiet</span> <span class="token comment">#安装了多个php</span>
<span class="token comment"># 同时按下ctrl+c退出编辑模式，按下shift+: 输入wq 退出 crontab</span>
*/15 * * * *表示每隔15分钟更新一次，你可以自己改成其它的。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务器或 nginx 重启后，TTRss 会出现文件夹权限丢失，需重新设置权限。建议将此步骤设为定期任务自动执行。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /www/wwwroot/rss/cache/images
<span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /www/wwwroot/rss/cache/upload
<span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /www/wwwroot/rss/cache/export
<span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /www/wwwroot/rss/feed-icons
<span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /www/wwwroot/rss/lock
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>升级 Tiny Tiny RSS：进行 TTRSS 目录后执行升级命令 <code>git pull origin master</code>。无法升级时重命名 TTRSS 路径，全新下载后没问题再删除。数据库没变化就没事，主题重新安装。</p>`,6);function R(y,x){const a=t("ExternalLinkIcon"),o=t("RouterLink");return l(),i("div",null,[s("p",null,[e("Tiny Tiny RSS 推荐用 "),s("a",w,[e("Awesome TTRSS"),n(a)]),e(" 的 Docker 镜像，搭建步骤参考 "),n(o,{to:"/services/NAS.html#nas-docker"},{default:c(()=>[e("NAS 上搭建 Docker")]),_:1}),e("。Awesome TTRSS 镜像不含插件「no_title_counters」，导致 TTRSS 网页标题会显示未读 RSS 数量。")]),s("ul",null,[s("li",null,[e("主题："),s("a",u,[e("feedly-sepia.css"),n(a)])]),s("li",null,[e("常见问题："),s("a",m,[e("Tiny Tiny RSS – FAQ"),n(a)])]),h]),_,b,v,s("p",null,[e("部署完成后，需要让 TTRSS 定期更新 RSS，步骤参考 "),s("a",k,[e("Tiny Tiny RSS – Updating Feeds"),n(a)]),e("。如果遇到提示 daemon 未启动，可删除 "),S,e("和"),f,e("。")]),s("p",null,[e("阿里云"),s("a",T,[e("用非 root 账户登录远程 vnc"),n(a)]),e("，然后启动 RSS 更新 (默认 2 分钟)。远程 vnc 黑屏时，点左上角「发送远程命令」，点击菜单栏或「关机后重新启动」后不再黑屏。不用直接重启，否则报错。")]),g])}const F=r(d,[["render",R],["__file","TTRSS.html.vue"]]);export{F as default};
