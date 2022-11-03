import {sidebar} from 'vuepress-theme-hope';

export const sidebarConfig = sidebar({
    "/cs/": [
        {
            text: "计算机网络",
            prefix: 'internet/',
            collapsable: true,
            children: [
                {
                    text: '前言',
                    link: 'readme.md'
                },
                'chapter01.md',
                "chapter02.md"
            ]
        }
    ],
    "/ssm/mybatis/": [
        {
            text: '前言',
            link: 'readme.md',
        },
        {
            text: "MyBatis基础篇",
            link: 'mybatis-01.md',
        },
        {
            text: "MyBatis高级篇",
            link: 'mybatis-02.md',
        }
    ],
    "/springcloud/": [
        {
            text: '前言',
            link: 'readme.md',
        },
        {
            text: '目录',
            link: 'menu.md'
        },
        {
            text: 'Spring Cloud组件',
            prefix: 'component/',
            collapsable: true,
            children: [
                {
                    text: 'Spring Cloud Eureka: 服务注册与发现中心',
                    link: 'eureka.md'
                },
                {
                    text: 'Spring Cloud Ribbon: 客户端负载均衡',
                    link: 'ribbon.md'
                },
                {
                    text: 'Spring CLoud Hystrix: 服务容错保护',
                    link: 'hystrix.md'
                },
                {
                    text: 'SpringCloud Resilience4j: 新一代容错解决方案',
                    link: 'resilience4j.md'
                },
                {
                    text: 'Spring Cloud OpenFeign: 声明式服务调用',
                    link: 'openFeign.md'
                },
                {
                    text: 'Spring Cloud Zuul: API网关服务',
                    link: 'zuul.md'
                },
                {
                    text: 'Spring Cloud GateWay: 新一代API服务网关',
                    link: 'gateway.md'
                },
                {
                    text: 'Spring Cloud Config: 分布式配置中心',
                    link: 'config.md'
                },
                {
                    text: 'Spring Cloud Bus: 服务消息总线',
                    link: 'bus.md'
                },
                {
                    text: 'Spring Cloud Stream: 消息驱动的微服务',
                    link: 'stream.md'
                },
                {
                    text: 'Spring Cloud Sleuth: 分布式服务追踪',
                    link: 'sleuth.md'
                },
            ],
        },
        {
            text: 'Spring Cloud Alibaba',
            link: 'cloudalibaba.md'
        },
        {
            text: '分布式事务解决方案',
            link: 'transaction.md'
        },
    ]
});