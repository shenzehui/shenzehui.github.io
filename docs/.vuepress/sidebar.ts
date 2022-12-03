import {sidebar} from 'vuepress-theme-hope';

export const sidebarConfig = sidebar({
    "/nicearticle/": [
        {
            text: "公司订单系统的架构进化",
            link: 'art01.md'
        },
        {
            text: "JWT实现登陆认证及Token自动续期",
            link: 'art02.md'
        },
        {
            text: "实现订单到期关闭的十一种正确姿势！",
            link: 'art03.md'
        },
        {
            text: "写出漂亮代码的45个小技巧",
            link: 'art04.md'
        }
    ],
    "/algorithm/": [
        {
            text: "目录",
            link: 'readme.md'
        },
        {
            text: "数组相关问题",
            prefix: 'array/',
            collapsable: true,
            children: [
                {
                    text: "两数之和",
                    link: 'twoSum.md'
                },
                {
                    text: "三数之和",
                    link: 'threeSum.md'
                }
            ]
        },
        {
            text: "二分查找相关问题",
            prefix: 'binary_search/',
            collapsable: true,
            children: []
        },

    ],
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
                {
                    text: '概述',
                    link: 'chapter01.md'
                },
                {
                    text: '物理层',
                    link: 'chapter02.md'
                },
                {
                    text: '数据链路层',
                    link: 'chapter03.md'
                },
                {
                    text: '计算机网络重要知识点',
                    link: 'summary.md'
                },


            ]
        }
    ],
    "/spring/": [
        {
            text: '目录',
            link: 'readme.md',
        },
        {
            text: "Spring Framework",
            prefix: 'springframework/',
            collapsable: true,
            children: [
                {
                    text: "Spring 基础 - Spring 核心之控制反转(IoC)",
                    link: 'spring-ioc.md'
                },
            ]
        },
        {
            text: 'Spring Boot',
            prefix: 'springboot/',
            collapsable: true,
            children: [
                {
                    text: "Spring Boot整合JPA",
                    link: "springboot-jpa.md"
                },
            ]
        },
    ],
    "/springcloud/": [
        {
            text: '👉前言',
            link: 'readme.md',
        },
        {
            text: '📗目录',
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
    ],
    "/mianshi/": [
        {
            text: '目录',
            link: 'readme.md',
        },
        {
            text: "Java",
            prefix: 'java/',
            collapsable: true,
            children: [
                {
                    text: 'Java 基础🔥',
                    link: 'java-base.md',
                },
                {
                    text: 'Java 集合🔥',
                    link: 'java-collect.md',
                },
                {
                    text: 'Java 并发🔥',
                    link: 'java-concurrent.md',
                }
            ]
        },
        {
            text: "数据库",
            collapsable: true,
            prefix: 'database/',
            children: [
                {
                    text: "数据库原理 精选面试题🔥",
                    link: "theoryandsql.md"
                },
                {
                    text: 'MySQL 精选面试题🔥',
                    link: 'mysql.md'
                },
                {
                    text: 'Redis 精选面试题🔥',
                    link: 'redis.md'
                }
            ]
        },
        {
            text: "开发框架和中间件",
            collapsable: true,
            prefix: "framework/",
            children: [
                {
                    text: 'Spring 精选面试题🔥',
                    link: 'spring.md'
                },
                {
                    text: 'MyBatis 精选面试题🔥',
                    link: 'mybatis.md'
                }
            ]
        },
        {
            text: "计算机基础",
            prefix: 'cs/',
            collapsable: true,
            children: [
                {
                    text: '计算机网络 精选面试题🔥',
                    link: 'wangluo.md',
                },
                {
                    text: '计算机操作系统 精选面试题🔥',
                    link: 'os.md',
                }
            ]
        },
    ],
});