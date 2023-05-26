import {navbar} from "vuepress-theme-hope";

export default navbar([
    {text: '博客主页', icon: 'home', link: '/blog/'},
    {
        text: '面试',
        icon: 'like',
        link: '/mianshi/'
    },
    {
        text: 'Java',
        icon: 'java',
        link: '/java/',
    },
    {
        text: '数据库',
        icon: 'mysql',
        prefix: '/database/',
        children: [
            {
                text: 'MySQL',
                link: 'mysql/',
            },
            {
                text: 'Redis',
                link: 'redis/',
            },
            {
                text: 'MongoDB',
                link: 'mongodb/',
            },
        ]
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
        text: 'Netty 4.x',
        icon: 'cache',
        link: '/netty/'
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
        text: '工具|部署',
        icon: 'operate',
        prefix: '/tools/',
        children: [
            {
                text: 'Git详解',
                link: 'git.md',
            },
            {
                text: 'Maven介绍',
                link: 'maven.md',
            },
            {
                text: 'Linux',
                link: 'linux.md',
            }
        ]
    },
    {
        text: '开源项目学习',
        icon: 'repo',
        link: '/projectlearn/',
    },
    {
        text: '好文收集',
        icon: 'repo',
        link: '/nicearticle/art01.md',
    },
]);
