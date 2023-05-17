import {path} from "@vuepress/utils";
import {hopeTheme} from "vuepress-theme-hope";
import navbar from "./navbar";
import {sidebarConfig} from "./sidebar";

export default hopeTheme({
    // 主题选项：https://vuepress-theme-hope.github.io/v2/zh/config/theme/layout.html
    hostname: "https://newzone.top",

    author: {
        name: 'Marico',
        url: 'https://github.com/shenzehui',
    },

    iconAssets: "iconfont",
    logo: "/logo.svg",

    // 是否全局启用路径导航
    breadcrumb: false,

    // 页面元数据：贡献者，最后修改时间，编辑链接
    contributors: false,
    lastUpdated: true,
    editLink: true,

    // 深色模式配置
    darkmode: "switch",
    themeColor: {
        blue: "#2196f3",
        red: "#f26d6d",
        green: "#3eaf7c",
        orange: "#fb9b5f",
    },
    fullscreen: true,

    // 默认为 GitHub. 同时也可以是一个完整的 URL
    repo: "shenzehui/shenzehui.github.io",
    // 自定义仓库链接文字。默认从 `repo` 中自动推断为 "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
    repoLabel: "GitHub",
    // 是否在导航栏内显示仓库链接，默认为 `true`
    repoDisplay: true,
    // 文档存放路径
    docsDir: "docs",

    // navbar
    navbar: navbar,
    // 导航栏布局
    navbarLayout: {
        left: ["Brand"],
        center: ["Links"],
        right: ["Repo", "Outlook", "Search"],
    },
    // 是否在向下滚动时自动隐藏导航栏
    // navbarAutoHide: "always",

    // sidebar
    sidebar: sidebarConfig,
    // 侧边栏排序规则
    // sidebarSorter: ['readme', 'order', 'title'],

    footer: '<a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2021038026号-1</a>',

    displayFooter: true,

    copyright: "Copyright © 2022 Marico",

    // 页面布局 Frontmatter 配置：https://vuepress-theme-hope.github.io/v2/zh/config/frontmatter/layout.html#pageinfo
    pageInfo: ['Author', 'Original', 'Date', 'Category', 'Tag', 'ReadingTime'],

    // 主题功能选项：https://vuepress-theme-hope.github.io/v2/zh/config/theme/feature.html
    blog: {
        avatar: "/userface.jpg",
        sidebarDisplay: "mobile",
        roundAvatar: true,
        medias: {
            Zhihu: 'https://www.zhihu.com/people/ming-zhi-xian-nai-41',
            Gitee: 'https://gitee.com/shenzehui',
            GitHub: 'https://github.com/shenzehui',
        },
        description: '不积跬步无以至千里，不积小流无以成江海',
        intro: '/intro.html',
    },

    // page meta
    metaLocales: {
        contributors: '贡献者',
        lastUpdated: '上次更新',
        editLink: '在 GitHub 上编辑此页',
    },

    plugins: {

        blog: {
            // 自动摘要
            autoExcerpt: true,
        },

        // 评论配置（仅做样例，记得更换）
        comment: {
            provider: "Giscus",
            repo: "shenzehui/giscus-repository",
            repoId: "R_kgDOJj-hSQ",
            category: "Announcements",
            categoryId: "DIC_kwDOJj-hSc4CWiZ",
        },

        // 组件库
        components: ["Badge", "BiliBili", "VideoPlayer", "YouTube"],

        // 禁用不需要的配置
        mdEnhance: {
            align: true,
            attrs: true, // 使用特殊标记为 Markdown 元素添加属性
            // chart: true,
            // codetabs: true, // 代码块分组
            container: true,
            // demo: true, //代码演示
            // echarts: true,
            // flowchart: true,
            gfm: true,
            imageLazyload: true,
            // imageMark: true,
            imageSize: true,
            imageTitle: true,
            include: true, //导入文件
            // katex: true,
            mark: true,
            // mermaid: true,
            footnote: true,
            tasklist: true,
            sub: true, // 上下角标
            sup: true,
            // tabs: true, // 选项卡
            // vpre: true,
            // vuePlayground: true, // Vue 交互演示
        },

        // rss 属性
        feed: {
            rss: true,
            count: 10,
        },
    },
});
