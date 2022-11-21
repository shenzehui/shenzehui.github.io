import {defineUserConfig} from "vuepress";
// import { webpackBundler } from "@vuepress/bundler-webpack";
// import { defineUserConfig } from "@vuepress/cli";
import {searchPlugin} from "@vuepress/plugin-search";
import {docsearchPlugin} from "@vuepress/plugin-docsearch";
import {googleAnalyticsPlugin} from "@vuepress/plugin-google-analytics";
import {path} from "@vuepress/utils";
import theme from "./theme";

export default defineUserConfig({
    // 网站语言，默认为中文
    lang: "zh-CN",
    // 网站标题
    title: "IT达摩院",
    // 网站描述
    description: "个人博客，旨在分享自己的技术😆",

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
    ],
});
