import {navbar} from "vuepress-theme-hope";

export default navbar([
    {text: '博客主页', icon: 'home', link: '/blog/'},
    {
        text: 'Git教程',
        icon: 'git',
        link: '/git/git.md'
    },
    {
        text: 'SSM',
        icon: 'edit',
        prefix: '/ssm/',
        children: [
            {
                text: 'MyBatis',
                link: 'mybatis/readme.md',
            },
            {
                text: 'Spring',
                link: 'spring.md',
            },
            {
                text: 'SpringMVC',
                link: 'springmvc.md',
            }
        ]
    },
    {
        text: 'SpringBoot学习',
        icon: 'leaf',
        link: '/springboot/'
    },
    {
        text: 'SpringCloud学习教程',
        icon: 'cache',
        link: '/springcloud/'
    },
    {
        text: '计算机基础',
        icon: 'computer',
        children: [
            {
                text: '计算机操作系统',
                link: '/cs/os/',
            },
            {
                text: '计算机网络',
                link: '/cs/internet/',
            },
        ]
    },
    {
        text: '面试',
        icon: 'like',
        link: '/mianshi/readme.md'
    }

]);