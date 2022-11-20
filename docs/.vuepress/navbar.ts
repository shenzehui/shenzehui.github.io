import {navbar} from "vuepress-theme-hope";

export default navbar([
    {text: '博客主页', icon: 'home', link: '/blog/'},
    {
        text: 'Java',
        icon: 'java',
        link: '/java/',
    },
    {
        text: '数据结构算法',
        icon: 'creative',
        link: '/algorithm/',
    },
    {
        text: 'Spring',
        icon: 'leaf',
        link: '/spring/',
    },
    {
        text: 'SpringCloud学习教程',
        icon: 'cache',
        link: '/springcloud/'
    },
    {
        text: '计算机基础',
        icon: 'computer',
        prefix: '/cs/',
        children: [
            {
                text: '计算机操作系统',
                link: 'os/',
            },
            {
                text: '计算机网络',
                link: 'internet/',
            },
        ]
    },
    {
        text: '面试',
        icon: 'like',
        link: '/mianshi/'
    },
    {
        text: '工具|部署',
        icon: 'operate',
        prefix: '/tools/',
        children: [
            {
                text: 'Git详解',
                link: 'git.md',
            },
            {
                text: 'Linux',
                link: 'linux.md',
            },
        ]
    }
]);