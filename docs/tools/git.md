---
icon: git
title: Git 教程
shortTitle: 深入浅出的讲解了GIT使用的全流程以及实战教学
category:
  - Java 企业级开发
tag:
  - Git
description: Git是分布式版本控制系统（Distributed Version Control System，简称 DVCS）
article: false
---

## 一、Git简介

### 1.1 项目的版本管理

> 在项目开发过程中，项目没开发到⼀个节点就会对当前项目进行备份，这个备份就是项目的⼀个版本；当我 们继续开发⼀个阶段后，再次进行备份，就⽣成新的版本——多个版本的集合就是项目的版本库


在项目版本管理中，我们可以使用⼿动进行管理，但是存在⼀些问题：

-  需要手动维护版本的更新日志，记录每个版本的变化 
-  需要手动查找历史版本，当历史版本比较多的时候，查找工作很繁琐 
-  当我们需要回退到某个版本时，只能够手动的通过 IDE 工具手动打开 

### 1.2 团队协同开发

![](https://s1.vika.cn/space/2022/11/23/5b24094c165641f7aa13f2505160eae4)

### 1.3 版本管理工具 — Git

> Git 是⼀个开源的分布式版本控制系统，用于敏捷高效的处理任何大小项目的版本管理。


核心功能：

- 项目的版本管理
- 团队协同开发

## 二、Git 下载及安装

### 2.1 下载 Git
| [https://git-scm.com/](https://git-scm.com/)                 |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/94b0a6011cd64af9982b8d01e930adbc) |


### 2.2 安装 Git

> 除了选择安装位置以外，其他都傻瓜式安装


### 2.3 检查

-  win + r 
-  输⼊ cmd 
-  输入 git --version 

## 三、Git架构

![](https://s1.vika.cn/space/2022/11/23/248a9421599d4617aa0c594c53cffd47)

## 四、Git 的基本使用

### 4.1 创建版本库

- 在⼯作空间的目录中，右键 `Git Bash Here` 打开 git 终端
- 在 Git 终端中输⼊ `git init`  指令，创建版本库（就是⼀个.git目录）

![](https://s1.vika.cn/space/2022/11/23/c7a9a5d02a014cdea37b8f65a9cb580e)

### 4.2 查看版本库状态的指令

```shell
git status
```

### 4.3 将工作空间的修改添加到暂存区

```shell
git add a.txt  ## 只将⼯作空间中的某个⽂件 add 到暂存区
git add .  ## 将⼯作空间中所有⽂件都 add 暂存区
```

### 4.4 将暂存区内容提交到版本库（仓库）

```shell
git commit -m '版本说明'
```

### 4.5 查看版本库中的历史版本

```shell
git log --oneline ## 每个版本信息只显示⼀⾏
get log ## 显示每个版本的详细信息
```

### 4.6 设置用户信息

> 因为我们将暂存区的内容提交到版本时，会记录当前版本的提交的用户信息，因此在版本提交之前需要先绑 定用户信息


```shell
git config --global user.name 'ergou'
git config --global user.email 'haha@hehe.com'
```

### 4.7 同步历史版本到工作空间

```shell
git checkout 版本号
```

## 五、远程仓库

> 远程仓库，远程版本库；实现版本库的远程存储，以实现团队的协同开发


![](https://s1.vika.cn/space/2022/11/23/4a5494b7f67f4dc48aef608405287154)

### 5.2 如何获得远程仓库

-  使用 GitLab 搭建私服 
-  远程仓库提供商 GitHub [https://gitbub.com](https://gitbub.com) 
-  Gitee（码云） [https://gitee.com](https://gitee.com) 
-  Coding 

### 5.3 创建远程仓库（码云）

- 注册账号 
   - 账号：[3032388097@qq.com](mailto:3032388097@qq.com)
   - 密码：xxxxxx
- 创建远程仓库 [https://gitee.com/shenzehui/java2022.git](https://gitee.com/shenzehui/java2022.git)
- 远程仓库管理（添加开发人员）

![](https://s1.vika.cn/space/2022/11/23/88e10103889d47bda4696a6d1dda8c84)

## 六、远程仓库操作

### 6.1 push 本地仓库到远程仓库

##### 6.1.1 准备工作

1. 创建本地⼯作空间

```shell
D:\demo
	src
		main
			java
			resources
		test
			java
	pom.xml
```

2. 初始化本地仓库

```shell
git init
```

3. 将⼯作空间搭建的项目结构 add 到暂存区

```shell
git add .
```

4. 将暂存区文件提交到版本库，生成第一个版本

```shell
git commit -m '提交说明内容'
```

5. 为当前项⽬创建⼀个远程仓库

[https://gitee.com/shenzehui/java2022.git](https://gitee.com/shenzehui/java2022.git)

##### 6.1.2 本地仓库关联远程仓库

> 建⽴本地仓库和远程仓库 https://gitee.com/shenzehui/java2022.git 的关联


```shell
git remote add origin https://gitee.com/shenzehui/java2022.git
```

##### 6.1.3 查看远程仓库状态

```shell
git remote -v
```

##### 6.1.4 将本地仓库 push 到远程仓库

> push 到远程仓库需要 gitee 的帐号和密码


```shell
git push origin master
```

![](https://s1.vika.cn/space/2022/11/23/2479fc4e23c2484b805b25805147e464)

![](https://s1.vika.cn/space/2022/11/23/e98faa92794342e3b36d2ec226097c24)

### 6.2 其他开发者 pull 远程仓库到本地


##### 6.2.1 先创建本地仓库

- 在 E 盘创建 ws 目录(空目录)，进⼊ ws 目录，打开 Git 客户端
- 创建本地版本库

```shell
git init
```

##### 6.2.2 拉取远程仓库到本地

- 拉取远程仓库

```shell
git pull 远程仓库地址 master
git pull https://gitee.com/shenzehui/java2022.git master
```

#### 6.3 解决协同开发冲突问题

```
场景: Helloworld.java [bbb]
开发者1：沈哥 							开发者2：周瑜
-------------------------------------------------------------------------------------------
git pull java2022 master					git pull java2022 master 
 										在 Hellworld.java 中新增内容 “bbb”
在 Hellworld.java 中新增内容 “aaa”
 										git add .
 										git commit -m ''
 										git push java2022 master
git add .
git commit -m ''
git push java2022 master【会失败！！！ 在我 pull 之后，push 之前其他开发人员push过】
```

```
问题：我该如何操作？
git pull java2022 master 【将小乔修改的内容拉取到本地】

对文件进行冲突合并

git add .
git commit -m ''
git push java2022 master
```

Helloworld.java

```java
>>>>>>>>>>>>>>>>>>>>>HEAD
aaa
=================
bbb
<<<<<<<<<<<<<<<<<<<<< sikdfhjkasdfhjasdfhjk
```

## 七、分支管理

### 7.1 什么是分支

> 分支就是版本库中记录版本位置（支线），分支之间项目会影响，使用分支可以对项目起到保护作用分支就是⼀条时间线，每次提交就在这条时间线上形成⼀个版本


### 7.2 分支特性

-  创建⼀个新的版本库，默认创建⼀个主分支 — master 分支 
-  每个分支可以进行单独管理（常规分支 、保护分支 、只读分支 ） 
-  分支是可以合并的 

![](https://s1.vika.cn/space/2022/11/23/84317d29d63c42cd9b4b2e2761537bb2)

### 7.3 分支操作

##### 7.3.1 创建分支

```shell
git branch branch_name  #会继承当前分支下的最后一个版本
```

##### 7.3.2 查看分支

```shell
git branch
```

##### 7.3.3 切换分支

```shell
git checkout branch_name # 切换到指定分⽀上的最新版本
```

##### 7.3.4 检出分支

```shell
git checkout 历史版本 -b branch_name # 签出指定的历史版本创建新分⽀
```

##### 7.3.5 分支合并

-  **三方合并：当前分支和要合并分支都有新版本** 
-  **快速合并：当前分支没有新版本** 

```shell
# 在master分⽀执⾏ git merge dev 表示将 dev 分⽀合并 merge   
git merge breanch_name
```

![](https://s1.vika.cn/space/2022/11/23/8d1f2cbd7be742c19110581cb1e9270e)

##### 7.3.6 查看分支及版本视图

```shell
git log --oneline --graph
```

**企业中主流分支使用**

![](https://s1.vika.cn/space/2022/11/23/ff0dd5f860bc44eea9c77ebfc8f3187f)

## 八、Idea 整合 Git 使用

> 作为 Java 开发工程，我们代码的编写工作都是在 IDE 工具（idea）中完成，因此我们需要了解和掌握直接使用 IDE 工具完成 Git 的操作


### 8.1 IDEA 关联 Git

![](https://s1.vika.cn/space/2022/11/23/cdcaaf328d4e44f2aced42308106e5fe)

### 8.2 IDEA 中 Git 版本管理

> 准备⼯作：打开 IDEA 新建⼀个 web ⼯程


##### 8.2.1 创建本地版本库
|  |
| --- |
| ![](https://s1.vika.cn/space/2022/11/23/83bf6d03e69b408db07a9366c08153ab) |
| ![](https://s1.vika.cn/space/2022/11/23/604c9999682c4a65b539f645ff04dfa3) |


##### 8.2.2 设置忽略文件

> 在工作空间中有些文件是不需要记录到版本库中的（例如 .idea、target、.iml 文件），可以通过设置忽略提交 来实现


-  在工作空间的根目录（项目的根目录）中创建⼀个名为  `.gitignore`  文件 
-  在 `.gitignore` 文件配置忽略过滤条件 

```java
.idea
target
*.iml
```

##### 8.2.3 将工作空间 add 到暂存区

- 选择项目/文件---右键----Git---Add(添加到暂存区的文件---绿色)

![](https://s1.vika.cn/space/2022/11/23/10ae187ab9844c4d98f48f7af91a3c3a)

- 如果一个文件创建好之后还没有添加到暂存区—棕红色
- 添加到暂存区的操作可以设置默认添加

![](https://s1.vika.cn/space/2022/11/23/a2412a8eee224b4ba194028f80c3142d)

### 8.2.4 将暂存区提交到版本库

- 选择项目/文件---右键---Git--Commit（记录到版本库的文件--黑色）

![](https://s1.vika.cn/space/2022/11/23/f8608585c8f34c4b887c95a75c07333e)

- 如果对记录到 版本库的文件进行了修改，也就是说工作空间和版本库不⼀致--蓝色

![](https://s1.vika.cn/space/2022/11/23/8bc62c13b43d42cf8ea2ac5f57e82f3e)

### 8.3 IDEA 中 Git 分支管理

##### 8.3.1 创建分支

-  点击IDEA右下角 `Git` 
-  在弹窗中点击 `New Branch` 
-  输入新分支的名称 

![](https://s1.vika.cn/space/2022/11/23/f550d0e403a448df857a452efa29be07)

##### 8.3.2 切换分支

-  点击IDEA右下角 `Git` 
-  点击非当前分支右边的箭头 
-  在选项卡点击 `checkout` 

![](https://s1.vika.cn/space/2022/11/23/0f43877e174347bc8a58de07606fbc4b)

##### 8.3.3 删除分支
| 点击右下角 git |
| --- |
| ![](https://s1.vika.cn/space/2022/11/23/874e1957ee00480688b85a09823de7ac) |


##### 8.3.4 合并分支

> 例如：将 dev 合并到 master


- 切换到 master 分支
- 点击 dev 分支右面的箭头，在展开的菜单中选择 `Merge Selected into current`

![](https://s1.vika.cn/space/2022/11/23/6950499e54ed4a1b8e5802a72bd67378)

### 8.4 IDEA 中使用 Git 进行团队协同开发

##### 8.4.1 项目管理者

1.  **完成项目搭建** 
   - 略
2.  为当前项目创建本地版本库 
3.  将搭建好的项目提交到本地版本库 
   -  add 到暂存区 
   -  commit 到版本库 
4.  创建远程版本库（远程仓库） 
   -  [https://gitee.com/shenzehui/git-jd.git](https://gitee.com/shenzehui/git-jd.git) 
   -  管理—添加开发者 
5.  将本地仓库 push 到远程仓库（master 分支——master 分支） 
| ![](https://s1.vika.cn/space/2022/11/23/78f43064b7ed41b7a2652bb7e6d60d06) |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/bc8e79acba104c9483d16b1ec679641c) |
| ![](https://s1.vika.cn/space/2022/11/23/7a49a5ffbc874d82ab62a6b6a7ec4f3d) |


6. 在本地创建 dev 分支

> 在远程仓库 `New Branch from Selected` 新建本地 `dev` 分支（master 需要进行保护）

| ![](https://s1.vika.cn/space/2022/11/23/29e89f2fe5bc4978a15c012de3b029fc) |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/655895f4a51a444eb16b110ba9ed95d7) |

**在本地会创建一个 dev 分支，但分支内容会与远程仓库 master 分支一致**

7. 将本地`dev`分支 push 到远程仓库，新建远程仓库的 dev 分支
| ![](https://s1.vika.cn/space/2022/11/23/848ae42f032c49cea28979efd565233c) |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/b83da95f23e54d9a9795666c3af3ee93) |


8. 设置远程仓库中 master 分支为保护分支

![](https://s1.vika.cn/space/2022/11/23/874e40342893483bb64e0e0a4f799267)

##### 8.4.2 项目开发者

1.  从管理员提供的远程仓库 pull 项目到本地 
   - 远程仓库 https://gitee.com/shenzehui/git-jd.git
| ![](https://s1.vika.cn/space/2022/11/23/d52549a8d28044e6a3029322489a021b) |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/afa3bfdcabe34344a0bd501afafe50e7) |

   2.  打开项目（此时本地工作空间的项目和远程仓库是同步的） 
   3.  开发步骤： 
   -  新建本地分支 `dev` 
   -  选择要修改的文件 — pull 
   -  进行修改操作 
   -  测试本地修改 
   -  add 到暂存区 
   -  commit 到本地版本库 
   -  push 到远程仓库（dev） 

### 8.5 解决团队协同开发的冲突问题

> 冲突：在 pull 之后，push 之前被其他开发者 push 成功


- 选择产生冲突的文件---pull
- 弹出弹窗提示：accpet yours | accept theirs | Merge 
   - `accpet yours` 保留自己的版本（提交时会覆盖其他开发者代码）
   - `accpet theirs` 保留远程仓库上的版本（会导致自己修改的代码丢失）
   - `Merge` 手动合并（和其他开发者沟通合并方案）

**注意：新版 IDEA 这里开始直接点 Merge 即可，后面会有其它方案提示**

| ![](https://s1.vika.cn/space/2022/11/23/2703949b3109486f83418e0f26a85bc7) |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/13153699ea48411bb2a1fb13748fa120) |
| 点击 Merge 后的显示：                                        |
| ![](https://s1.vika.cn/space/2022/11/23/fa302897714e46ceaaac69aea9046705) |


- Merge 页面说明：

![](https://s1.vika.cn/space/2022/11/23/59166cd9c16d49238185e49f9799b8d7)

- 点击两个合并按钮后：
| ![](https://s1.vika.cn/space/2022/11/23/43d0631329644361babfb32ac107c03b) |
| ------------------------------------------------------------ |
| ![](https://s1.vika.cn/space/2022/11/23/b3f0e94b0c0742f4b616e9af39e70e75) |
| ![](https://s1.vika.cn/space/2022/11/23/3f9402d1f4724a0d9211a8efd5341a3f) |

**注意：此时需要再进行一次 push 操作才会生效**
