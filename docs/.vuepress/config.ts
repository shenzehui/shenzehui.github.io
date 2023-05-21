import {defineUserConfig} from "vuepress";
// import { webpackBundler } from "@vuepress/bundler-webpack";
// import { defineUserConfig } from "@vuepress/cli";
import {searchPlugin} from "@vuepress/plugin-search";
import {googleAnalyticsPlugin} from "@vuepress/plugin-google-analytics";
import {path} from "@vuepress/utils";
import theme from "./theme";
import {pwaPlugin} from "vuepress-plugin-pwa2";

export default defineUserConfig({
    // 网站语言，默认为中文
    lang: "zh-CN",
    // 网站标题
    title: "Java达摩院",
    // 网站描述
    description: "一位来自计算机在校大学生的个人技术博客，其中涵盖了Java基础、Java并发编程、Java虚拟机、精选面试题、数据结构和算法、计算机网络、Spring、SpringCloud等内容，✨初衷是希望能够和大家一起交流和分享所学到的技术",

    // 网站路径默认为主域名。如果网站部署在子路径下，比如 xxx.com/yyy，那么 base 应该被设置为 "/yyy/"
    base: "/",

    theme,
    // 是否开启页面预拉取，如果服务器宽带足够，可改为 true，会提升其他页面加载速度
    shouldPrefetch: false,

    // 修改页面模板，@vuepress-theme-hope/templates/index.build.html
    // 配置参考：https://vuepress.github.io/zh/reference/theme-api.html#templatebuild
    templateBuild: path.resolve(__dirname, "templateBuild.html"),

    // 禁止文件夹生成静态文件，参考 [VuePress 文档]（https://v2.vuepress.vuejs.org/zh/guide/page.html#routing）
    pagePatterns: ["**/*.md", "!_temp", "!.vuepress", "!node_modules"],

    plugins: [
        // algolia 全文搜索：没设置爬虫的话，需删除 docsearchPlugin 区块以使用节点搜索
        // docsearchPlugin({
        //     indexName: "newzone",
        //     appId: "M4EXXEZIEG",
        //     apiKey: "fd8891a9c4cc21e0ef4f11bf44f7a11e",
        //     locales: {
        //         "/": {
        //             placeholder: "搜索文档",
        //             translations: {
        //                 button: {
        //                     buttonText: "搜索文档",
        //                     buttonAriaLabel: "搜索文档",
        //                 },
        //                 modal: {
        //                     searchBox: {
        //                         resetButtonTitle: "清除查询条件",
        //                         resetButtonAriaLabel: "清除查询条件",
        //                         cancelButtonText: "取消",
        //                         cancelButtonAriaLabel: "取消",
        //                     },
        //                     startScreen: {
        //                         recentSearchesTitle: "搜索历史",
        //                         noRecentSearchesText: "没有搜索历史",
        //                         saveRecentSearchButtonTitle: "保存至搜索历史",
        //                         removeRecentSearchButtonTitle: "从搜索历史中移除",
        //                         favoriteSearchesTitle: "收藏",
        //                         removeFavoriteSearchButtonTitle: "从收藏中移除",
        //                     },
        //                     errorScreen: {
        //                         titleText: "无法获取结果",
        //                         helpText: "你可能需要检查你的网络连接",
        //                     },
        //                     footer: {
        //                         selectText: "选择",
        //                         navigateText: "切换",
        //                         closeText: "关闭",
        //                         searchByText: "搜索提供者",
        //                     },
        //                     noResultsScreen: {
        //                         noResultsText: "无法找到相关结果",
        //                         suggestedQueryText: "你可以尝试查询",
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // }),
        // 本地搜索：默认情况下，该插件会将页面标题和小标题作为搜索索引。
        searchPlugin({
            // 你的选项
        }),
        // 谷歌分析 ID
        googleAnalyticsPlugin({
            id: "G-RWKZTY2P9R",
        }),
        pwaPlugin({
            // favicon.ico一般用于作为缩略的网站标志,它显示位于浏览器的地址栏或者在标签上,用于显示网站的logo,
            favicon: "https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/favicon.ico",
            // 主题色
            themeColor: "#096dd9",
            apple: {
                icon: "/assets/152.png",
                statusBarColor: "black",
            },
            msTile: {
                image: "/assets/144.png",
                color: "#ffffff",
            },
            manifest: {
                icons: [
                    {
                        src: "/assets/512.png",
                        sizes: "512x512",
                        purpose: "maskable",
                        type: "image/png",
                    },
                    {
                        src: "/assets/192.png",
                        sizes: "192x192",
                        purpose: "maskable",
                        type: "image/png",
                    },
                    {
                        src: "/assets/512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/assets/192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
});
