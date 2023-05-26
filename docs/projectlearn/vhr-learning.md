---
article: false
title: 微人事学习笔记
tag: 开源项目
---

> 项目地址：https://github.com/lenve/vhr

## vue-cli3 构建Vue项目

### 使用vue-cli3 创建vue脚手架

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005182847340.png)

- 使用`vue create 项目名`命令创建

![image-20220917090433867](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917090433867.png)

- 手动选择

![image-20220917090515710](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917090515710.png)

- 选择Router和Babel

![image-20220917090622753](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917090622753.png)

- Router是否选择history模式（默认是使用hash）：这里选择 N

![image-20220917090647351](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917090647351.png)

- 选择配置位置  `In package.json`

![image-20220917090849547](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917090849547.png)

- 保存配置作为模板‘  N

![image-20220917090949523](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917090949523.png)

**注意：如果报错，可以使用管理员命令窗口创建**

- 创建成功

![image-20220917091721788](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917091721788.png)

### 运行项目

![image-20220917091827970](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917091827970.png)

访问 http://localhost:8080/

| 访问成功后                                                   |
| ------------------------------------------------------------ |
| ![image-20220917091908047](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917091908047.png) |

## vue-cli3项目结构介绍

### 项目结构说明

| 项目结构                                                     |
| ------------------------------------------------------------ |
| ![image-20220917092616282](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917092616282.png) |

### main.js内容说明

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

| main.js                                                      |
| ------------------------------------------------------------ |
| ![image-20220917093039219](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917093039219.png) |

| index.js                                                     |
| ------------------------------------------------------------ |
| ![image-20220917093235011](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917093235011.png) |

### App.vue页面

![image-20220917093659562](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917093659562.png)

### router目录下的index.js(有些脚手架为router.js)

![image-20220917094141726](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917094141726.png)

## 微人事登录页面制作

### 项目配置启动

![image-20220917094504288](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917094504288.png)

### 引入Element-UI

- 在vue项目终端执行


```shell
npm i element-ui -S
```

i：表示install

-S：表示安装到生产环境

| 安装成功后                                                   |
| ------------------------------------------------------------ |
| ![image-20220917095040405](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917095040405.png) |

- 在main.js中添加

![image-20220917095210238](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917095210238.png)

### 删除工程初始化页面

- 修改App.vue

```vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>
```

- 删除components和views下的.vue页面和组件

### 登录页制作

##### 在views目录下新建Login.vue登录页面

##### 修改router.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
```

显示Login页面流程：

> 在main.js中
>
> ```js
> new Vue({
>       router,
>       store,
>       render: h => h(App)
> }).$mount('#app')
> ```
>
> 将App.vue渲染到index.js中的<div id=app></div>中
>
> ```vue
> <template>
>   <div id="app">
>        <router-view/>
>       </div>
> </template>
> ```
>
> 默认是斜杠路径
>
> ```js
> routes:[
>        {
>            path: '/',
>            name: 'Login',
>            component: Login,
>            hidden:true
>        },
> ]
> ```
>
> 跳转到登录页

##### Element中验证表单属性

| 参数  | 说明                                                         | 类型   | 可选值                            | 默认值 |
| :---- | :----------------------------------------------------------- | :----- | :-------------------------------- | :----- |
| prop  | 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 | string | 传入 Form 组件的 `model` 中的字段 | —      |
| rules | 表单验证规则                                                 | object | —                                 | —      |
| model | 表单数据对象                                                 | object | —                                 | —      |

```vue
<template>
  <div>
    <!-- rules 校验规则  loginForm登录数据-->
    <el-form :rules="rules" :model="loginForm" class="loginContainer">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <!--v-model字段绑定， auto-complete是否自动不全-->
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入用户密码"></el-input>
      </el-form-item>
      <el-checkbox class="loginRemember" v-model="checked"></el-checkbox>
      <el-button type="primary" style="width: 100%;">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      checked: true,
      loginForm: {
        username: 'admin',
        password: '123'
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    }
  }
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

</style>
```

## 处理前端登录事件

- 定义点击事件

![image-20220917104507348](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917104507348.png)

**校验表单需要全部规则通过后才能提交**

- 表单添加ref属性

![image-20220917104716397](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917104716397.png)

- 在点击事件方法定义如下

![image-20220917104813722](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917104813722.png)

- 测试


![image-20220917104833464](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917104833464.png)

**只有满足全部表单规则才能够提交！！！**

## 服务端环境搭建

##### GAV坐标

![image-20220917105221085](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917105221085.png)

##### 添加依赖

![image-20220917105305972](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917105305972.png)

- 添加druid依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.11</version>
</dependency>
```

##### 使用代码生成器生成mapper和model

##### 整合mybatis配置

- 启动类上添加注解`@MapperScan("org.szh.vhr.mapper")`

```java
@SpringBootApplication
@MapperScan("org.szh.vhr.mapper")
public class VhrApplication {

    public static void main(String[] args) {
        SpringApplication.run(VhrApplication.class, args);
    }

}
```

- applictaion.properties中添加配置

```properties
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.username=root
spring.datasource.password=240518.a
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/vhr?characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useUnicode=true
```

- pom文件中配置防止xml文件过滤

```xml
<resources>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.xml</include>
        </includes>
    </resource>
    <resource>
        <directory>src/main/resources</directory>
    </resource>
</resources>
```

## 服务端登录接口制作（一）

### SpringSecurity接入数据库

##### 修改Hr类，实现UserDetails接口

```java
package org.javaboy.vhr.bean;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class Hr implements UserDetails {
    private Integer id;

    private String name;

    private String phone;

    private String telephone;

    private String address;

    private Boolean enabled;

    private String username;

    private String password;

    private String userface;

    private String remark;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone == null ? null : telephone.trim();
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address == null ? null : address.trim();
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getUserface() {
        return userface;
    }

    public void setUserface(String userface) {
        this.userface = userface == null ? null : userface.trim();
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark == null ? null : remark.trim();
    }
}
```

#####  创建HrService类

```java
@Service
public class HrService implements UserDetailsService {

    @Autowired
    private HrMapper hrMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Hr hr  = hrMapper.loadUserByUsername(username);
        if(hr == null){
            throw new UsernameNotFoundException("用户名不存在");
        }
        return hr;
    }
}
```

- 在HrMapper中新定义接口方法

```java
Hr loadUserByUsername(String username);
```

- 映射文件

```xml
<select id="loadUserByUsername" resultMap="BaseResultMap">
  select * from hr where username = #{username}
</select>
```

##### 新建SecurityConifg类，添加Security配置

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    HrService hrService;

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(hrService);
    }
}
```

##### 新建控制器HelloController类，测试

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }
}
```

![image-20220917113605190](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917113605190.png)

**输入admin 123** 

![image-20220917113628216](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917113628216.png)

### 添加登录访问接口并自定义返回JSON数据

-  SecurityConfig中添加如下配置

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
        .anyRequest().authenticated()
        .and()
        .formLogin()
        .usernameParameter("username")
        .passwordParameter("password")
        .loginProcessingUrl("/doLogin")
        .loginPage("/login")
        .successHandler(((req, resp, authentication) -> {
            resp.setContentType("application/json;charset=utf-8");
            PrintWriter out = resp.getWriter();
            Hr hr = (Hr) authentication.getPrincipal();
            RespBean.ok("登录成功",hr);
            String result = new ObjectMapper().writeValueAsString(hr);
            out.write(result);
            out.flush();
            out.close();
        }))
        .failureHandler(((req, resp, e) -> {
            resp.setContentType("application/json;charset=utf-8");
            PrintWriter out = resp.getWriter();
            RespBean respBean = RespBean.error("登录失败！");
            if(e instanceof LockedException){
                respBean.setMsg("账户被锁定，请联系管理员！");
            }else if(e instanceof CredentialsExpiredException){
                respBean.setMsg("密码过期，请联系管理员！");
            }else if(e instanceof AccountExpiredException){
                respBean.setMsg("账户过期，请联系管理员！");
            }else if(e instanceof DisabledException){
                respBean.setMsg("账户被禁用，请联系管理员！");
            }else if(e instanceof BadCredentialsException){
                respBean.setMsg("用户名或者密码输入错误，请重新输入！");
            }
            out.write(new ObjectMapper().writeValueAsString(respBean));
            out.flush();
            out.close();
        }))
        .permitAll()
        .and()
        .logout()
        .logoutSuccessHandler(((httpServletRequest, httpServletResponse, authentication) -> {

        }))
        .permitAll()
        .and()
        .csrf().disable();

}
```

- 启动项目测试

![image-20220917123917500](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917123917500.png)

![image-20220917123927347](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917123927347.png)

## 服务端登录接口制作（二）

###  添加登录跳转接口

```java
@RestController
public class LoginController {

    @GetMapping("/login")
    public RespBean login(){
        return RespBean.error("尚未登录，请登录！");
    }
}
```

### 在SecurityConifg中添加注销自定义JSON数据

```java
.logoutSuccessHandler(((req, resp, authentication) -> {  //注销登录
    resp.setContentType("application/json;charset=utf-8");
    PrintWriter out = resp.getWriter();
    out.write(new ObjectMapper().writeValueAsString(RespBean.ok("注销成功！")));
    out.flush();
    out.close();
}))
```

### 问题：登录成功后返回的JSON数据中密码应该为NULL

- 方法一：（推荐）

```java
.successHandler(((req, resp, authentication) -> {  //登录成功
    resp.setContentType("application/json;charset=utf-8");
    PrintWriter out = resp.getWriter();
    Hr hr = (Hr) authentication.getPrincipal();
    hr.setPassword(null);
    RespBean.ok("登录成功",hr);
    String result = new ObjectMapper().writeValueAsString(hr);
    out.write(result);
    out.flush();
    out.close();
}))
```

- 方法二：设置在属性的get方法上

```java
@JsonIgnore
public String getPassword() {
    return password;
}
```

## 前后端接口对接

### 安装axios

```shell
npm install axios
```

### 前端统一请求异常处理以及post 请求行传值axios方法封装

```js
import axios from "axios";
import {Message} from 'element-ui';

/*自定义响应拦截器*/
axios.interceptors.response.use(success => {  //请求成功 http请求响应200 但是会包含后端业务逻辑错误
    //success.status http 响应码  success.data.status 自定义响应码
    if (success.status && success.status == 200 && success.data.status == 500) {  //业务上的错误，自定义返回 错误状态码
        Message.error({message: success.data.msg});
        return; //请求没有数据，说明是响应失败的
    }
    if(success.data.msg){
        Message.success({message:success.data.msg});
    }
    return success.data;  //请求成功返回 后端数据
}, error => {  //请求失败  400~500
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: '服务器被吃了o(╯□╰)o'});
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员'});
    } else if (error.response.status == 401) {
        Message.error({message: '尚未登录，请登录'});
    } else {
        if (error.response.data.msg) { //存在服务端返回的错误信息
            Message.error({message: error.response.data.msg});
        } else {
            Message.error({message: '未知错误！'});
        }
    }
    return;
})

let base = '';

/*key value 形式传参*/
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + "&";
            }
            console.log(ret);
            return ret;
        }],
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}
```

### 修改Login.vue页面

- 引入api.js中的post封装方法

```js
import {postKeyValueRequest} from "@/utils/api";
```

- 点击登录后发起请求

```js
submitLogin() {
    /*验证表单校验（通过ref = ‘loginForm查找到校验表单’）*/
    this.$refs.loginForm.validate((valid) => {
        if (valid) {
            // alert('submit!');
            postKeyValueRequest('/doLogin', this.loginForm).then(resp => {  //注意：这里的resp 是被拦截器处理过的 如果成功是resp.data,如果失败，则没有值
                if (resp) { //请求成功
                    alert(JSON.stringify(resp));
                }
            })
        } else {
            this.$message.error('请输入所有字段'); //message消息提示
            return false;
        }
    });
}
```

### 使用nodejs转发解决前后端跨域问题（难点）

##### 修改vue.config.js文件（没有则新建）

- 定义代理对象，并在生产环境下导出

```js
let proxyObj={};  //定义代理对象proxyObj
proxyObj['/']={  //拦截http请求
  ws:false, //websocket关闭
  target:'http://localhost:9090', //请求转发地址
  changeOrigin:true,  //开启代理
  pathRewrite:{
    '^/':'' //拦截地址不修改
  }
}
module.exports={ //导出
  devServer:{  //开发环境
    host:'localhost',
    port:8080,
    proxy:proxyObj  //代理对象
  }
}
```

- 重启前端项目，访问http://localhost:8080/,点击登录，结果如下

![image-20220917162707151](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917162707151.png)

## 登录页面跳转

### 用sesssionStorage保存登录用户信息

```js
if (resp) { //请求成功,resp，相当于resp.data
    window.sessionStorage.setItem('user',JSON.stringify(resp.obj)); //将登录用户信息存到sessionStorage中，供其他页面使用，注意：只能用字符串保存
}
```

### 定义Home.vue页面

- 添加div

```vue
<template>
	<div>
    	home
    </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>

</style>
```

### 在index.js中定义Home.vue的路由规则

- 引入Home.vue

```js
import Home from '../views/Home.vue'
```

- 添加路由

```js
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    }
]
```

**当访问 /home 时，会将该页面渲染到App.vue中<router-view/> 标签**

- 登录成功后实现页面跳转

```js
if (resp) { //请求成功,resp，相当于resp.data
    window.sessionStorage.setItem('user',JSON.stringify(resp.obj)); //将登录用户信息存到sessionStorage中，供其他页面使用
    this.$router.replace('/home');   //页面跳转
}
```

说明：`this.$router` 表示获取在main.js中定义的router组件

![image-20220917164655967](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917164655967.png)

方法说明：

- replace：表示直接替换该页面，浏览器没有后退按钮
- push：表示压栈，浏览器可以后退

### 测试

启动项目，点击登录，页面实现跳转

## 前端请求方法封装

### 在api.js中定义如下方法

```js
/*key value 形式传参 post方法*/
export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + "&";
            }
            return ret;
        }],
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    })
}

/*JSON形式传参 post方法*/
export const postRequest = (url, params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params
    })
}

/*JSON形式传参 put方法*/
export const putRequest = (url, params)=>{
    return axios({
        method:'put',
        url:`${base}${url}`,
        data:params
    })
}

/*JSON形式传参 get方法*/
export const getRequest = (url, params)=>{
    return axios({
        method:'get',
        url:`${base}${url}`,
        data:params
    })
}

/*JSON形式传参 delete方法*/
export const deleteRequest = (url, params)=>{
    return axios({
        method:'delete',
        url:`${base}${url}`,
        data:params
    })
}
```

### vue插件的使用(可以不使用)

##### 问题引出

> 因为每次调用api.js中的方法都需要导入
>
> 例如：
>
> ​		import {postKeyValueRequest} from "@/utils/api";
>
> 我们可以使用vue插件来实现优化

官方文档：https://v2.cn.vuejs.org/v2/guide/plugins.html

##### 采用方法

- 添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。实现全区配置

##### 具体实现

- 在main.js中添加如下配置

```js
import {postRequest} from "@/utils/api";
import {postKeyValueRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
```

- 在调用的时候无需导入，只需要使用`this`即可

```js
this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {});
```

## Home页title制作

### 页面布局

- Container布局容器

```html
<el-container>
    <el-header>Header</el-header>
    <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
    </el-container>
</el-container>
```

### 编写样式

- index.html：去除body样式

![image-20220917181705974](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917181705974.png)

- Home.vue

```vue
<template>
<div>
    <el-container>
        <el-header class="homeHeader">
            <div class="title">微人事</div>

    </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
    </el-container>
    </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>
    .homeHeader{
        background-color: #409eff;
        display: flex;
        /*文字上下居中*/
        align-items: center;
        /*空白在中间，其余往两侧*/
        justify-content: space-between;
        padding: 0px 15px;
        /*padding会在框的里面*/
        box-sizing: border-box;
    }
    .homeHeader .title{
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff;
    }
</style>
```

### Dropdown下拉菜单

- 官方文档代码

```vue
<el-dropdown>
    <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item disabled>双皮奶</el-dropdown-item>
        <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
    </el-dropdown-menu>
</el-dropdown>
```

- 获取sessionStorage中的用户信息

```js
return{
  /*JSON.parse();将json字符串转成对象*/
  user:JSON.parse(window.sessionStorage.getItem("user"))
}
```

- 修改页面信息

![image-20220917183845178](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917183845178.png)

- 设置点击事件

![image-20220917184117411](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917184117411.png)

![image-20220917184159341](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917184159341.png)

![image-20220917184035090](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917184035090.png)

![image-20220917184349624](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917184349624.png)

- 定义点击事件方法

> 回调函数command的参数就是定义在el-dropdown-item 中command的属性值

Messagebox弹框确认消息

```js
this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
}).then(() => {
    this.$message({
        type: 'success',
        message: '删除成功!'
    });
}).catch(() => {
    this.$message({
        type: 'info',
        message: '已取消删除'
    });          
});
```

```js
/*参数：el-dropdown-item中的command属性值*/
commandHandler(cmd){
    if(cmd=='logout'){ //注销登录
        //使用messagebox确认弹框确认消息
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.getRequest('/logout'); //发起get请求
            window.sessionStorage.removeItem("user"); //清除sessionStorage中的用户信息
            this.$router.replace("/"); //回到登录页
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消操作'
            });
        });
    }
}
```

### 用户图片显示

```js
<span class="el-dropdown-link" style="display: flex;align-items: center">
    {{ user.name }}<i><img :src="user.userface" style="width: 48px;height: 48px;border-radius； 24px;margin-left: 8px"></img></i>
 </span>
```

## 左边导航菜单制作

### NavMenu 导航菜单

```html
<el-menu
         default-active="2"
         class="el-menu-vertical-demo"
         @open="handleOpen"
         @close="handleClose">
    <el-submenu index="1">
        <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
        </template>
        <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
    </el-submenu>
    <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
    </el-menu-item>
    <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
    </el-menu-item>
</el-menu>
```

属性说明：

- default-active ：默认打开的菜单
- @open：默认打开的时候的回调
- @close：默认关闭时候的回调

![image-20220917192934274](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917192934274.png)

- 点击事件

![image-20220917193003496](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917193003496.png)

| ![image-20220917193331204](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917193331204.png) |
| ------------------------------------------------------------ |
| ![image-20220917193401691](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917193401691.png) |

![image-20220917193432566](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220917193432566.png)

### 点击跳转

- 在views目录下 新建Test1.vue 和 Test2.vue文件
- 在router目录下的 index.js中进行路由绑定

![image-20220918082112457](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918082112457.png)

- 添加跳转路径以及路由渲染区

![image-20220918082224153](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918082224153.png)

- 页面跳转

![image-20220918082300367](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918082300367.png)

- 测试后，发现页面直接跳转，并不在main区进行跳转

> 分析原因：当进行页面跳转时，默认会先渲染到App.vue中的<router-view/>，而不会渲染到<el-main></el-main>中

- 修改 index.js，为Home路由添加childern属性，这样就不会渲染到App.vue中

```js
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children:[
            {
                path: '/test1',
                name: 'Test1',
                component: Test1
            },
            {
                path: '/test2',
                name: 'Test2',
                component: Test2
            }
        ]
    },
```

### 再优化：统一index.js和Home.vue中的数据

> 问题提出：当需要新加导航栏时，不但需要向router中添加路由，还需要向Home.vue中添加导航菜单数据，因此，我们可以在Home.vue中遍历index.js中的数据，动态渲染，以后就可以在index.js中添加导航路由信息即可

- index.js

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Test1 from '../views/Test1.vue'
import Test2 from '../views/Test2.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden:true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden:true
    },
    {
        path: '/home',
        name: '导航1',
        component: Home,
        children:[
            {
                path: '/test1',
                name: '选项1',
                component: Test1
            },
            {
                path: '/test2',
                name: '选项2',
                component: Test2
            }
        ]
    },

]

const router = new VueRouter({
    routes
})

export default router

```

| 遍历routes数组                                               |
| ------------------------------------------------------------ |
| ![image-20220918083814494](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918083814494.png) |

**注意：**this.$router.options.routes  等同于 

 const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden:true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden:true
    },
    {
        path: '/home',
        name: '导航1',
        component: Home,
        children:[
            {
                path: '/test1',
                name: '选项1',
                component: Test1
            },
            {
                path: '/test2',
                name: '选项2',
                component: Test2
            }
        ]
    },

]

### 继续优化

- Menu Attribute 参数

![image-20220918084117730](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918084117730.png)

- 用 router 替代点击事件，实现自动跳转

![image-20220918084331193](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918084331193.png)

![image-20220918084349376](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918084349376.png)

## 服务端菜单接口设计

### 修改Menu类

- 新增Meta类（包含原Menu类中的两个属性）

```java
package org.javaboy.vhr.bean;

/**
 * @Author szh
 * @Date 2022/9/18 9:06
 * @PackageName:org.javaboy.vhr.bean
 * @ClassName: Meta
 * @Description: TODO
 * @Version 1.0
 */
public class Meta {

    private Boolean keepAlive;

    private Boolean requireAuth;
	//省略getter and setter
}

```

- 在Menu类中添加meta和children属性

```java
package org.javaboy.vhr.bean;

import java.util.List;

public class Menu {
    private Integer id;

    private String url;

    private String path;

    private String component;

    private String name;

    private String iconCls;

//    private Boolean keepAlive;
//
//    private Boolean requireAuth;

    private Meta meta;
    
    private List<Menu> children;

    private Integer parentId;

    private Boolean enabled;
    
    //省略getter and setter 
}
```

### 代码实现

- controller

```java
@RestController
@RequestMapping("/system/config")
public class SystemConfigController {

    @Autowired
    MenuService menuService;

    @GetMapping("/menu")
    public List<Menu> getMenusByHrId(){
        return menuService.getMenusByHrId();
    }
}
```

**注意：不要通过前端传过来的id值来查询菜单列表，因为前端传过来的值不可信**

- service

```java
@Service
public class MenuService {

    @Autowired
    MenuMapper menuMapper;

    public List<Menu> getMenusByHrId(){
        return menuMapper.getMenusByHrId(((Hr) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId());
    }
}
```

- 映射文件

```xml
 <resultMap id="BaseResultMap" type="org.javaboy.vhr.bean.Menu" >
    <id column="id" property="id" jdbcType="INTEGER" />
    <result column="url" property="url" jdbcType="VARCHAR" />
    <result column="path" property="path" jdbcType="VARCHAR" />
    <result column="component" property="component" jdbcType="VARCHAR" />
    <result column="name" property="name" jdbcType="VARCHAR" />
    <result column="iconCls" property="iconCls" jdbcType="VARCHAR" />
    <result column="keepAlive" property="meta.keepAlive" jdbcType="BIT" />
    <result column="requireAuth" property="meta.requireAuth" jdbcType="BIT" />
    <result column="parentId" property="parentId" jdbcType="INTEGER" />
    <result column="enabled" property="enabled" jdbcType="BIT" />
  </resultMap>

<resultMap id="menus2" type="org.javaboy.vhr.bean.Menu" extends="BaseResultMap">
    <!--一对多查询-->
    <collection property="children" ofType="org.javaboy.vhr.bean.Menu">
        <id column="id2" property="id" jdbcType="INTEGER" />
        <result column="url2" property="url" jdbcType="VARCHAR" />
        <result column="path2" property="path" jdbcType="VARCHAR" />
        <result column="component2" property="component" jdbcType="VARCHAR" />
        <result column="name2" property="name" jdbcType="VARCHAR" />
        <result column="iconCls2" property="iconCls" jdbcType="VARCHAR" />
        <!--一对一查询-->
        <result column="keepAlive2" property="meta.keepAlive" jdbcType="BIT" />
        <result column="requireAuth2" property="meta.requireAuth" jdbcType="BIT" />
        <result column="parentId2" property="parentId" jdbcType="INTEGER" />
        <result column="enabled2" property="enabled" jdbcType="BIT" />
    </collection>
</resultMap>

<select id="getMenusByHrId" resultMap="menus2">
    SELECT DISTINCT m1.*,m2.id as id2,m2.component as component2,m2.enabled as enabled2,m2.iconCls as iconCls2,m2.keepAlive as keepAlive2,m2.name as name2,m2.parentId as parentId2, m2.requireAuth as requireAuth2,m2.path as path2 FROM menu m1,menu m2,hr_role hrr,menu_role mr
    WHERE m1.id = m2.parentId
    AND hrr.rid = mr.rid
    AND mr.mid = m2.id
    AND m2.enabled = true
    AND hrr.hrid = #{hrid}
    ORDER BY m1.id,m2.id
</select>
```

### 测试

![image-20220918094853256](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918094853256.png)

## Vuex 介绍与安装

> 菜单项数据加载成功后，在前端有几个可以存放的地方：
>
> 1. sessionStorage
> 2. localStorage
> 3. `vuex`：所有的.vue文件都可以访问（状态管理） 数据共享 安全

**安装**

```shell
npm install vuex
```

## Vuex 配置

官方文档：https://vuex.vuejs.org/zh/guide/

### 配置

- 新建store文件夹，在文件夹下新建index.js文件

**配置信息如下：**

```js
import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state:{  //声明的变量
        routes:[] //路由数组，后端传过来的菜单项
    },
    mutations:{  //修改state中变量属性值：相当于set方法
        initRoutes(state,data){
            state.routes = data;
        }
    },
    actions:{  //
    }
})
```

- 在main.js中配置store，使vuex生效

![image-20220918100952692](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918100952692.png)

## 菜单请求工具类封装

> 后端传过来的menu菜单数据中的component是个字符串，而前端是个对象。因此需要封装请求数据

- 在util包下新建编写menus.js文件

```js
import {getRequest} from "@/utils/api";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {  //store中的routes数组
        //有菜单数据
        return;
    }

    getRequest('/system/config/menu').then(data => {
        if (data) {  //请求到数据
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);  //menu菜单数据添加到router
            store.commit('initRoutes',fmtRoutes); //store中routes赋值，数据添加到store中  initRoutes是mutations中的方法
        }
    })
}
//格式化菜单项数据
export const formatRoutes = (routes) => {
    let fmRoutes = []; //格式化后的数据
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;  //批量变量定义  相当于 let path = router.path,let component = router.component ...

        /*children属性处理*/
        if (children && children instanceof Array) { //存在children且为Array的数组  一级菜单
            children = formatRoutes(children); //递归调用
        }
        /*component处理*/
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            component(resolve){
                //  '../views'+component+'.vue'  vue文件完整路径
                require(['../views'+component+'.vue'],resolve); //动态导入组件
            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}
```

## 前端页面添加并完善菜单请求

### 在views目录下创建如下目录和.vue文件

![image-20220918105159434](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918105159434.png)

### 修改menu.js文件中的component处理

![image-20220918105304769](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918105304769.png)

## 左边导航菜单加载

> 问题：什么时候加载？
>
> 目标：确保在用户刷新页面后或者按F5导航菜单仍能够加载

### 路由导航守卫介绍

官方文档：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html

### 配置

- 在main.js下配置如下：

```js
/*全局导航守卫*/
router.beforeEach((to, from, next) => {
    console.log(to);
    console.log(from);
    next();
})
```

![image-20220918123711399](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918123711399.png)

![image-20220918123503497](../typora-user-images/image-20220918123503497.png

![image-20220918123514411](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918123514411.png)

### 使用路由守卫初始化菜单数据，保存到router和stroe中

![image-20220918125807144](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918125807144.png)

### Home页获取菜单数据并渲染

- 添加计算属性

![image-20220918144213725](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918144213725.png)

- 渲染到页面

![image-20220918144243619](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918144243619.png)

### 优化：每次点击只打开一个菜单项

![image-20220918144522832](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918144522832.png)

### 问题：不同用户登录时菜单项一样

> 解决：退出登录时，清空store中的数据（登录时，发现store中仍有数据，就不会加载）

![image-20220918144951980](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918144951980.png)

### 菜单图标渲染

fontawesome官网：http://www.fontawesome.com.cn/

##### 安装fontawesome

```shell
npm install font-awesome
```

##### 在main.js中引入样式库

```js
import 'font-awesome/css/font-awesome.min.css'
```

##### 渲染

![image-20220918145321894](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918145321894.png)

## 页面加载问题解决

### 菜单项页面跳转问题

- 添加Home页面的动态导入

![image-20220918150501849](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918150501849.png)

**效果：**

![image-20220918150554377](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918150554377.png)

## 微人事首页完善

### Breadcrumb 面包屑

```html
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
  <el-breadcrumb-item>活动详情</el-breadcrumb-item>
</el-breadcrumb>
```

![image-20220918150851056](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918150851056.png)

![image-20220918150904868](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918150904868.png)

### 结合项目

![image-20220918151605414](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918151605414.png)

- 首页

![image-20220918151647543](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918151647543.png)

- 导航页面

![image-20220918151706070](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918151706070.png)

## 前后端分离管理权限思路探讨

**文章**：http://www.javaboy.org/2019/0523/springboot-vue-permission.html

> 前端所做的一切处理只是为了用户体验，将该用户没有权限的菜单项隐藏，但用户仍然可以通过任何途径访问没有权限的菜单项接口，只有在后端才能真正实现用户的权限管理，确保数据完整性

postman ，浏览器 ，都可以访问到...

总而言之一句话，前端的所有操作，都是为了提高用户体验，不是为了数据安全，真正的权限校验要在后端来做，后端如果是SSM架构，建议使用Shrio，如果是SpringBoot+微服务，建议使用Spring Security。

## 后端接口权限设计

### 数据表设计

| 5张表                                                        |
| ------------------------------------------------------------ |
| ![image-20220918154134085](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918154134085.png) |

**接口设计路径（path）采用menu中的数据库中url的值来设计**

![image-20220918154435972](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918154435972.png)

> 思路：
>
> 1. 用户前端发起http请求，后端拿到请求后，分析地址和这里的url哪一个匹配
> 2. 根据menu id 查询哪些角色可以访问（找到请求有哪些角色可以访问到）
> 3. 当前登录的用户是否具备我所需要的角色（只要一个满足即可访问）

设计上：角色不分配给一级菜单，只分配给二级菜单

### 整合Spring Security实现

##### 修改Menu类，添加Role  list数组

![image-20220918164707266](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918164707266.png)

##### 在MenuService中添加方法

![image-20220918165045400](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918165045400.png)

##### 映射文件

![image-20220918164905624](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918164905624.png)

**目的：查询所有的菜单项一级菜单对应的访问角色**

##### 步骤一：查询当前请求需要哪些角色才可以访问

- 新建Myfilter类，实现`FilterInvocationSecurityMetadataSource`接口

```java
package org.javaboy.vhr.config;

import org.javaboy.vhr.bean.Menu;
import org.javaboy.vhr.bean.Role;
import org.javaboy.vhr.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.Collection;
import java.util.List;

/**
 * @Author szh
 * @Date 2022/9/18 15:51
 * @PackageName:org.javaboy.vhr.config
 * @ClassName: MyFilter
 * @Description: 作用：根据用户传来的请求地址，分析出请求需要的角色
 * @Version 1.0
 */
@Component
public class MyFilter implements FilterInvocationSecurityMetadataSource {

    @Autowired
    private MenuService menuService;

    AntPathMatcher antPathMatcher = new AntPathMatcher();

    /* Collection<ConfigAttribute> 当期请求所需的角色*/
    @Override
    public Collection<ConfigAttribute> getAttributes(Object o) throws IllegalArgumentException {
        String requestUrl = ((FilterInvocation) o).getRequestUrl(); //获取当前请求的地址
        List<Menu> menus = menuService.getAllMenuWithRole();
        for (Menu menu : menus) {
            if (antPathMatcher.match(menu.getUrl(), requestUrl)) {  //参数：规则 + url
                List<Role> roles = menu.getRoles();  //当前请求所需的角色
                //封装当前请求所需的角色
                String[] str = new String[roles.size()];
                for (int i = 0; i < roles.size(); i++) {
                    str[i] = roles.get(i).getName();
                }
                return SecurityConfig.createList(str);  //返回角色列表
            }
        }
        return SecurityConfig.createList("ROLE_LOGIN");  //没有匹配上的返回，登录即可访问
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
```

**重点代码分析：**

![image-20220918165703408](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918165703408.png)

##### 步骤二：判断当前是否具备访问的角色

- 新建MyDecisionManager类，实现`AccessDecisionManager`接口

```java
package org.javaboy.vhr.config;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;

/**
 * @Author szh
 * @Date 2022/9/18 16:59
 * @PackageName:org.javaboy.vhr.config
 * @ClassName: MyDecisionManager
 * @Description: 判断当前用户是否具备请求路径所需的角色
 * @Version 1.0
 */
@Component
public class MyDecisionManager implements AccessDecisionManager {
    /**
     *
     * @param authentication  登录用户信息
     * @param o
     * @param collection  请求路径所需的角色
     * @throws AccessDeniedException
     * @throws InsufficientAuthenticationException
     */
    @Override
    public void decide(Authentication authentication, Object o, Collection<ConfigAttribute> collection) throws AccessDeniedException, InsufficientAuthenticationException {
        for (ConfigAttribute attribute : collection) {
            String needRole = attribute.getAttribute();
            if("ROLE_LOGIN".equals(needRole)){  //登录之后就能访问
                if(authentication instanceof AnonymousAuthenticationToken){
                    //匿名用户
                    throw new AccessDeniedException("尚未登录，请登录！");
                }else{
                    return;
                }
            }
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities(); //获取当前登录用户的角色
            for (GrantedAuthority authority : authorities) {
                if(authority.getAuthority().equals(needRole)){
                    //当前登录用户具备请求路径所需的角色
                    return;
                }
            }
        }
        //没有权限
        throw new AccessDeniedException("权限不足，请联系管理员");
    }

    @Override
    public boolean supports(ConfigAttribute configAttribute) {
        return false;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }
}
```

**重点代码分析：**

![image-20220918171745701](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918171745701.png)

##### 步骤三：在Security.config中引入配置

![image-20220918172107444](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918172107444.png)

##### 修改Hr类

- 新增roles属性

![image-20220918181416762](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918181416762.png)

- 给用户赋予角色信息

![image-20220918181448231](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918181448231.png)

##### 修改HrService，查询用户角色并赋值

![image-20220918181840167](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918181840167.png)

![image-20220918181850930](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918181850930.png)

### 添加接口，测试

![image-20220918182657729](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918182657729.png)

**登录成功后返回用户角色信息**

![image-20220918182735224](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918182735224.png)

**成功访问**

![image-20220918182758406](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918182758406.png)

## 权限问题解决

**另一种解决思路：**

> 前端在路由中定义额外角色数组，表明每个路径访问所需的角色，当用户登录时，服务端只需要将登录用户具备的角色信息返回给前端，由前端自己做校验，若该页面所需角色和用户具备角色匹配，则提供访问

## 权限管理继续完善

**问题一：**当页面直接访问http://localhost:8080/#/sys/cfg后，前端初始化菜单项数据，发送请求给服务端http://localhost:8080/system/config/menu，请求重定向到http://localhost:8080/system/config/menu，直接访问，不经过nodejs代理，产生跨域问题

![image-20220918185815955](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918185815955.png)

![image-20220918185844350](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918185844350.png)

**解决：**

- 在SecurityConfig中添加如下配置

![image-20220919111908089](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919111908089.png)

 ![image-20220919112140583](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919112140583.png)

**问题二：未登录访问 页面跳转问题解决**

![image-20220919112716836](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919112716836.png)

**问题三：当用户在未登录情况下访问某个接口，去登录页，登录成功后应该重定向到访问页面**

**解决：**

- 跳转时路径添加redirect属性，属性值为要跳转的路径（可以使用路由中的to属性获取到）

![image-20220919113527884](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919113527884.png)

- 点击登录访问登录接口成功后，判断登录路径中是否有redirect属性，若有，访问该路径，若无，访问`/home`路径

![image-20220919113800261](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919113800261.png)

## 基础信息设置

### Tabs标签页

```html
<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
```

- @tab-click：是点击选项卡后触发的事件
- activeName：是激活选项卡的name值

![image-20220919125533842](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919125533842.png)

![image-20220919125623186](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919125623186.png)

![image-20220919125633650](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220919125633650.png)

### 组件化管理

- 在components/sys/basic目录下创建五个组件

![image-20220920095349218](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920095349218.png)



- 在SysBasic.vue文件引入这五个`组件`

![image-20220920095618778](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920095618778.png)

- 注册组件

![image-20220920095801915](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920095801915.png)

- 将这组件以标签显示展示到页面

![image-20220920100052470](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920100052470.png)

![image-20220920100107613](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920100107613.png)

## 职位管理前端页面设计

### Input输入框（带 icon 的输入框）

```html
<el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="input2">
</el-input>
```

### ElementUI图标库

![image-20220920100521087](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920100521087.png)

![image-20220920100736455](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920100736455.png)

**结果：**

![image-20220920100820188](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920100820188.png)

### Button按钮

![image-20220920102055018](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920102055018.png)

![image-20220920102104100](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920102104100.png)

###  Table 表格

```html
<el-table
          :data="tableData"
          border
          style="width: 100%">
    <el-table-column
                     prop="date"
                     label="日期"
                     width="180">
    </el-table-column>
    <el-table-column
                     prop="name"
                     label="姓名"
                     width="180">
    </el-table-column>
    <el-table-column
                     prop="address"
                     label="地址">
    </el-table-column>
</el-table>
```

![image-20220920102910413](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920102910413.png)

## 职位管理后端接口设计

### 查询接口和添加接口

![image-20220920105300264](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920105300264.png)

### Service层实现

![image-20220920105230198](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920105230198.png)

### DAO层

![image-20220920104124723](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920104124723.png)

### 映射文件

![image-20220920104138397](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920104138397.png)

### 测试接口

![image-20220920104311355](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920104311355.png)

![image-20220920105509250](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920105509250.png)

![image-20220920105627599](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920105627599.png)

![image-20220920105656890](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920105656890.png)

## 职位管理前后端接口对接

### 前端请求接口，获取数据

![image-20220920110219680](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920110219680.png)

![image-20220920110241705](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920110241705.png)

### Table表格checkbox展示

![image-20220920110449389](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920110449389.png)

- 手动在表格前添加一段column

```html
 <el-table-column
      type="selection"
      width="55">
 </el-table-column>
```

![image-20220920110648518](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920110648518.png)

### 操作列创建

- 使用template模板列创建

```html
 <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
</el-table-column>
```

- scope.row ：表示这整行JSON数据
- scope.$index：表示操作行数

![image-20220920111148393](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920111148393.png)

### 点击事件实现

- 按钮添加点击事件

![image-20220920122031093](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920122031093.png)

- 点击发起请求

![image-20220920122146502](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920122146502.png)

![image-20220920123231247](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123231247.png)

### 删除事件实现

- 使用确认消息提示框

```js
this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
}).then(() => {
    this.$message({
        type: 'success',
        message: '删除成功!'
    });
}).catch(() => {
    this.$message({
        type: 'info',
        message: '已取消删除'
    });          
});
```

![image-20220920123120697](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123120697.png)

![image-20220920123147947](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123147947.png)

![image-20220920123242701](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123242701.png)

![image-20220920123302086](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123302086.png)

## 职位管理前后端对接问题解决

> 问题描述：当前端点击删除的职位作为外键存在在其他表中时，服务端会抛出异常
>
> 原因：在employee表中有position的id作为外键

![image-20220920123823490](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123823490.png)

![image-20220920123947243](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920123947243.png)

### 解决：服务端统一异常处理

- 新建异常捕获类GlobalExceptionHandler

![image-20220920124523244](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920124523244.png)

- 重启项目测试

![image-20220920124554486](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920124554486.png)

> 问题描述： 前端日期格式化显示

- 方法一：前端日期格式化（较麻烦）

- 方法二：后端日期格式处理

**这里我们选择后端处理**

![image-20220920124923709](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920124923709.png)

这里使用的是SpringBoot自带的jackson格式化日期处理

注意：要加上时区`Asia/Shanghai`![image-20220920125047388](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920125047388.png)

## 职位修改操作

### Dialog对话框

```html
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
```

-  :before-close：关闭之前的回到
-  :visible.sync="dialogVisible"：对话框是否可见

![image-20220920130611429](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920130611429.png)

- input输入框数据绑定

![image-20220920130718909](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920130718909.png)

- 编辑按钮点击事件

![image-20220920130806554](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920130806554.png)

![image-20220920130836848](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920130836848.png)

![image-20220920130906781](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920130906781.png)

- 确认按钮点击事件

![image-20220920131256650](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920131256650.png)

![image-20220920131358655](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920131358655.png)

### 问题发现

![image-20220920131807778](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920131807778.png)

**点击取消后：**

![image-20220920131831834](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920131831834.png)

### 问题解决

使用Object.assign()；实现对象合并

- 介绍

> Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。    简单来说，就是Object.assign()是对象的静态方法，可以用来复制对象的可枚举属性到目标对象，利用这个特性可以实现对象属性的合并。

- 用法

> Object.assign(target, ...sources) 参数： target--->目标对象       source--->源对象       返回值：target，即目标对象

- 使用案例

```js
var target={name:'guxin',age:18};
var source={state:'single'}
var result=Object.assign(target,source);
console.log(target,target==result);
```

- 结果

![image-20220920132305114](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920132305114.png)

- 项目中解决

![image-20220920132644465](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920132644465.png)

![image-20220920132556357](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920132556357.png)

## 职位批量删除实现

### 服务端实现

- 接口设计

![image-20220920133516409](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920133516409.png)

- service实现

![image-20220920133536933](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920133536933.png)

- 映射文件

![image-20220920133551754](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920133551754.png)

### 前端实现

- 批量删除按钮

![image-20220920134115663](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920134115663.png)

> 目标：当table表格没有一行被选中时，默认禁用按钮，有一行或多行被选中时，可以启用该按钮

**实现：**

![image-20220920134429667](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920134429667.png)

- 为table添加回调函数

![image-20220920134640021](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920134640021.png)

- 获取选中行数据

![image-20220920134725108](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920134725108.png)

- 每次选中/取消某一列都会触发该回调

![image-20220920134843277](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920134843277.png)

- 按钮添加dsabled属性，动态判断`multipleSelection`属性长度是否为0

![image-20220920135147910](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920135147910.png)

![image-20220920135209257](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920135209257.png)

![image-20220920135223819](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920135223819.png)

- 批量删除点击事件

![image-20220920135314838](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920135314838.png)

![image-20220920135804668](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920135804668.png)

![image-20220920135825482](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920135825482.png)

## 职称管理前端页面实现（与职位管理类似）

### Select选择器（下拉框）

```html
<el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
</el-select>
```

:bookmark::smile::e-mail::elephant::ear::earth_africa::arrow_double_down::upside_down_face::goat:

- `:label`：表示下拉框显示的数据
- `:value`：表示和v-model绑定的数据

![image-20220920144412111](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920144412111.png)

![image-20220920144820881](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920144820881.png)

### 添加按钮

![image-20220920144717900](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920144717900.png)

### table表格

![image-20220920145233764](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920145233764.png)

![image-20220920145249374](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920145249374.png)

![image-20220920145403840](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920145403840.png)

## 职称管理后端接口设计

- controller

![image-20220920160354215](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920160354215.png)

- service

![image-20220920160406768](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920160406768.png)

- 映射文件

![image-20220920160449438](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920160449438.png)

## 职称管理前后端接口对接

### 表格查询全部职称

![image-20220920160907371](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920160907371.png)

![image-20220920160939843](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920160939843.png)

- 日期问题解决

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920161244854.png)

![image-20220920161146277](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920161146277.png)

### 添加职称名称

- 属性绑定

![image-20220920161746741](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920161746741.png)

- 点击事件

![image-20220920161701904](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920161701904.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162041559.png)

- 测试

![image-20220920161948276](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920161948276.png)

### 删除职称名称

- 点击事件

![image-20220920162519799](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162519799.png)

![image-20220920162537334](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162537334.png)

- 测试

![image-20220920162555974](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162555974.png)

![image-20220920162606272](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162606272.png)

### 添加是否启用列

![image-20220920162909136](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162909136.png)

![image-20220920162929692](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920162929692.png)

### switch开关

```html
<el-switch
  v-model="value1"
  active-text="按月付费"
  inactive-text="按年付费">
</el-switch>
```

- active-text：激活文本
- inactive-text：未激活文本

### 编辑点击按钮实现

- 对话框编写

![QQ图片20220920170018](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/QQ%E5%9B%BE%E7%89%8720220920170018.png)

- 数据绑定

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920164348249.png)

- 编辑点击事件绑定

![image-20220920164421431](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920164421431.png)

![image-20220920165101709](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920165101709.png)

- 确定点击事件绑定

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920165620908.png)

## 职称批量删除实现

### 服务端接口实现

- controller

![image-20220920172116428](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172116428.png)

- service

![image-20220920172136003](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172136003.png)

- 映射文件

![image-20220920172144615](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172144615.png)

### 前端实现

- 添加checkbox列

![image-20220920172240054](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172240054.png)

- 添加点击checkbox的回调函数

![image-20220920172314545](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172314545.png)

![image-20220920172334554](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172334554.png)

![image-20220920172357088](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172357088.png)

- 批量删除的点击和禁用

![image-20220920172449131](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172449131.png)

![image-20220920173226110](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173226110.png)

![image-20220920173233897](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173233897.png)

- 点击事件

![image-20220920172545461](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920172545461.png)

![image-20220920173301108](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173301108.png)

![image-20220920173312561](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173312561.png)

## 解决职位管理中的一个小问题

### 职位管理添加是否启用列

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173525088.png)

![image-20220920173536702](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173536702.png)

- 在Dialect对话框中添加是否启用

![image-20220920173646313](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173646313.png)

![image-20220920173746321](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173746321.png)

![image-20220920173813409](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220920173813409.png)

## 权限组前端页面制作

### Input输入框加前缀内容

```html
<el-input placeholder="请输入内容" v-model="input1">
    <template slot="prepend">Http://</template>
</el-input>
```

![image-20220921073930013](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921073930013.png)

![image-20220921073955808](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921073955808.png)

### Collapse 折叠面板

![image-20220921074135811](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921074135811.png)

```html
<el-collapse v-model="activeName" accordion>
    <el-collapse-item title="一致性 Consistency" name="1">
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
    </el-collapse-item>
    <el-collapse-item title="反馈 Feedback" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
    </el-collapse-item>
    <el-collapse-item title="效率 Efficiency" name="3">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
    </el-collapse-item>
    <el-collapse-item title="可控 Controllability" name="4">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
    </el-collapse-item>
</el-collapse>
```

- accordion：通过 `accordion` 属性来设置是否以手风琴模式显示。

- activeName：默认激活展开的面板

![image-20220921075526868](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921075526868.png)

- 页面效果

![image-20220921075542001](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921075542001.png)

## 权限组用户角色前后端接口对接

### 服务端

- controller

![image-20220921080126274](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921080126274.png)

- service

![image-20220921080145537](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921080145537.png)

- 映射文件

![image-20220921080200171](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921080200171.png)

### 前端请求数据

![image-20220921081124895](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921081124895.png)

![image-20220921081135257](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921081135257.png)

### Card卡片

```html
<el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
    </div>
</el-card>
```

## 权限组菜单树展示

### 服务端

![image-20220921131137262](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921131137262.png)

![image-20220921131158586](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921131158586.png)

- 映射文件（聚合查询）

![image-20220921131220002](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921131220002.png)

- 测试

![image-20220921131330482](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921131330482.png)

### ![image-20220921131358519](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921131358519.png) Tree 树形控件

```html
<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
```

-  @node-click="handleNodeClick"：每个叶子的点击事件

- :props="defaultProps"：表明children的key是什么，label的key是什么

```css
defaultProps: {
    children: 'children',
    label: 'label'
},
```

![image-20220921132408794](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921132408794.png)

### Collapse 折叠面板点击事件

![image-20220921132538810](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921132538810.png)

![image-20220921132813432](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921132813432.png)

![image-20220921132839387](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921132839387.png)

![image-20220921132708023](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921132708023.png)

- 发起请求，初始化菜单数据

![image-20220921133240909](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921133240909.png)

- 复选框展示

![image-20220921133333143](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921133333143.png)

![image-20220921133416393](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921133416393.png)

## 菜单角色关系修改

### Tree树形控件默认选中

![image-20220921140211547](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921140211547.png)

![image-20220921140344267](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921140344267.png)

![image-20220921140358948](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921140358948.png)

### 动态渲染

- 后端接口

![image-20220921141406024](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921141406024.png)

![image-20220921141419106](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921141419106.png)

- 前端渲染

![image-20220921141506885](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921141506885.png)

![image-20220921141613671](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921141613671.png)

- 按钮

![image-20220921141937277](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921141937277.png)

![image-20220921142002778](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921142002778.png)

### ElementUI全局组件大小配置

- main.js中配置如下

![image-20220921142043678](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921142043678.png)

### 修改角色对应资源（菜单）

##### 前端

所需参数：

1. 修改角色的id
2. 角色对应的资源（树形菜单选中的menu）

- 树形控件方法说明

![image-20220921142629149](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921142629149.png)

- 使用`ref`给树形控件定义名称

![image-20220921143050807](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921143050807.png)

- 通过`this.$refs.tree`获取到所有树形控件，是一个数组
- 若要获取到指定的树形控件，需要传递数组对应的下标

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921143338501.png)

![image-20220921143409488](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921143409488.png)

![image-20220921143439084](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921143439084.png)

- 通过`getCheckedKeys`方法获取对应树形控件中选中的`菜单id数组`

![image-20220921144228800](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921144228800.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921144204546.png)

- 这里返回的数组包含了一级和二级菜单的id值，而我们修改时只需要三级菜单的id数组，这该如何实现呢？

![image-20220921144637898](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921144637898.png)

![image-20220921144651272](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921144651272.png)

![image-20220921144725982](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921144725982.png)

##### 服务端

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921145917993.png)

![image-20220921145926083](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921145926083.png)

![image-20220921145936693](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921145936693.png)

##### 前后端对接

![image-20220921152715858](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921152715858.png)

- 取消修改按钮

![image-20220921152855066](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921152855066.png)

## 权限组角色添加

### 服务端

![image-20220921153251851](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921153251851.png)

![image-20220921153259213](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921153259213.png)

### 前端

- 点击事件

![image-20220921153556917](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921153556917.png)

![image-20220921153810528](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921153810528.png)

![image-20220921153928294](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921153928294.png)

## 权限组角色删除

### 服务端

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921164645470.png)

![image-20220921161825274](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921161825274.png)

### 前端

- 点击事件

![image-20220921161918715](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921161918715.png)

![image-20220921164544386](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921164544386.png)

## 登录问题完善

> 问题：服务端重启或者30分钟未操作导致的session失效，使得前端无法继续运行，只返回在Security.config中配置的错误信息，正常应该跳转到登录页，给用户一个好的体验

- 后端修改

![image-20220921165504755](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921165504755.png)

- 前端

![image-20220921165533950](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220921165533950.png)

## 部门管理数据展示和搜索

### 服务端实现

- 实体类

![image-20220922080406676](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922080406676.png)

- controller

![image-20220922080434603](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922080434603.png)

- service

![image-20220922080443599](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922080443599.png)

- 映射文件（递归查询）

![image-20220922080525075](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922080525075.png)

- 测试

![image-20220922080554904](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922080554904.png)

![image-20220922080623845](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922080623845.png)

### 前端实现

- Tree树形控件节点过滤

```html
<el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>

<el-tree
  class="filter-tree"
  :data="data"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="tree">
</el-tree>

methods: {
  	watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    filterNode(value, data) {
    	if (!value) return true;
    	return data.label.indexOf(value) !== -1;
    }
},
```

-   :filter-node-method：处理过滤方法  :sheep:

![image-20220922081454503](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922081454503.png)

![image-20220922083808374](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922083808374.png)

- 初始化部门树

![image-20220922083907189](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922083907189.png)

![image-20220922083927302](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922083927302.png)

### 效果

![image-20220922084024771](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922084024771.png)

![image-20220922084032907](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922084032907.png)

## 部门树展示添加与删除

- 按钮添加（树自定义节点内容）

![image-20220922084609508](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922084609508.png)

- scoped slot方式实现

![image-20220922085704043](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922085704043.png)

![image-20220922085734858](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922085734858.png)

![image-20220922085827012](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922085827012.png)

![image-20220922090004497](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922090004497.png)

:sheep::package::mobile_phone_off::date::calendar::dagger::tada::first_quarter_moon_with_face::question::dancer::dromedary_camel::x::zap::zipper_mouth_face::smile_cat::ocean::sailboat::older_man::peach::dancer::email:

- 添加部门和删除部门按钮定义

![image-20220922090805841](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922090805841.png)

![image-20220922090829440](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922090829440.png)

![image-20220922090910417](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922090910417.png)

## 部门树的动态修改【添加】

- 数据表

![image-20220922091334989](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220922091334989.png)

- 基本思路
  1. 添加数据（包含name和parentId），id自动生成
  2. depPath需要通过parentId依次查询父部门的parentId，并在最后添加自己id
  3. 还需判读出该部门是否包含子部门，若有，则parentId=1，若无，则为0

### 存储过程的使用

> 将网络执行时间的压力转移到数据库

- addDep

```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `addDep`(in depName varchar(32),in parentId int,in enabled boolean,out result int,out result2 int)
begin
  declare did int;
  declare pDepPath varchar(64);
  insert into department set name=depName,parentId=parentId,enabled=enabled;
  select row_count() into result;
  select last_insert_id() into did;
  set result2=did;
  select depPath into pDepPath from department where id=parentId;
  update department set depPath=concat(pDepPath,'.',did) where id=did;
  update department set isParent=true where id=parentId;
end
```

- deleteDep

```mysql
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteDep`(in did int,out result int)
begin
  declare ecount int;
  declare pid int;
  declare pcount int;
  declare a int;
  select count(*) into a from department where id=did and isParent=false;
  if a=0 then set result=-2;
  else
  select count(*) into ecount from employee where departmentId=did;
  if ecount>0 then set result=-1;
  else
  select parentId into pid from department where id=did;
  delete from department where id=did and isParent=false;
  select row_count() into result;
  select count(*) into pcount from department where parentId=pid;
  if pcount=0 then update department set isParent=false where id=pid;
  end if;
  end if;
  end if;
end
```

### 服务端实现添加部门接口

- department类添加reulst属性

![image-20220924093632861](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924093632861.png)

- controller

![image-20220924085620256](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924085620256.png)

- service

![image-20220924085630301](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924085630301.png)

- 存储过程的调用

![image-20220924085643882](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924085643882.png)

- 测试

![image-20220924085713395](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924085713395.png)

- children不应该为null值，应该是空数组

**解决：**

![image-20220924085837997](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924085837997.png)

### 前端实现

- 添加按钮实现

![image-20220924090904599](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924090904599.png)

![image-20220924090934261](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924090934261.png)

![image-20220924091017903](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924091017903.png)

- Dialog 确定添加按钮实现

![image-20220924092404713](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924092404713.png)

- 前端页面动态实现

![image-20220924092457546](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924092457546.png)

![image-20220924092518899](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924092518899.png)

## 部门树的动态修改【删除】

### 存储过程

```sql
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteDep`(in did int,out result int)
begin
  declare ecount int;
  declare pid int;
  declare pcount int;
  declare a int;
  select count(*) into a from department where id=did and isParent=false;
  if a=0 then set result=-2;
  else
  select count(*) into ecount from employee where departmentId=did;
  if ecount>0 then set result=-1;
  else
  select parentId into pid from department where id=did;
  delete from department where id=did and isParent=false;
  select row_count() into result;
  select count(*) into pcount from department where parentId=pid;
  if pcount=0 then update department set isParent=false where id=pid;
  end if;
  end if;
  end if;
end
```

- reulst == -2 ：部门下有子部门，删除失败！
- result == -1 ：部门下有员工，删除失败！
- result == 1 ：删除成功！

### 服务接口实现

![image-20220924093505327](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924093505327.png)

- 存储过程调用

![image-20220924093524905](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924093524905.png)

- 测试

![image-20220924095223921](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924095223921.png)

### 前端实现

- 点击事件

![image-20220924095254457](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924095254457.png)

- 发起请求和动态实现前端删除成功页面

![image-20220924095335092](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924095335092.png)

## 操作员管理接口设计

- controller

![image-20220924100923036](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924100923036.png)

- 在utils包下新建HrUtils工具类

```java
package org.javaboy.vhr.utils;

import org.javaboy.vhr.bean.Hr;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @Author szh
 * @Date 2022/9/24 9:59
 * @PackageName:org.javaboy.vhr.utils
 * @ClassName: HrUtils
 * @Description: TODO
 * @Version 1.0
 */
public class HrUtils {
    public static Hr getCurrentHr(){
        return ((Hr) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
}

```

![image-20220924101008927](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924101008927.png)

- mapper映射

![image-20220924101019526](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924101019526.png)

**注意：这里采用左连接，避免了没有角色的用户不被查询到**

- 测试接口

![image-20220924101152184](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924101152184.png)

**结果：除了自己都能查询到**

## 操作员管理页面展示

- 搜索框以及搜索按钮

![image-20220924102120580](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924102120580.png)

- 页面显示

![image-20220924102138722](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924102138722.png)

### Card 卡片

```html
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>卡片名称</span>
    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
  </div>
  <div v-for="o in 4" :key="o" class="text item">
    {{'列表内容 ' + o }}
  </div>
</el-card>
```

- 初始化HR信息以及页面展示

![image-20220924103602376](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924103602376.png)

![image-20220924103540112](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924103540112.png)

- 页面样式

```html
<style scoped>
    .userinfo-container div{
        font-size: 12px;
        color: #409eff;
    }

    .userinfo-container{
        margin-top: 20px;
    }
    .img-container{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .userface-img {
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }

    .hr-container {
        margin-top: 10px;
        display: flex;
        /*自动换行*/
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .hr-card {
        width: 350px;
        margin-bottom: 20px;
    }

</style>
```

- 页面效果

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924103712580.png)

### Switch开关展示用户状态

```html
<el-switch
  v-model="value1"
  active-text="按月付费"
  inactive-text="按年付费">
</el-switch>
```

![image-20220924104038164](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104038164.png)

![image-20220924104053866](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104053866.png)

### Tag标签展示用户角色

![image-20220924104339766](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104339766.png)

![image-20220924104350814](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104350814.png)

### Button按钮展示编辑用户角色

![image-20220924104556148](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104556148.png)

![image-20220924104606858](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104606858.png)

## 用户状态更新操作

![image-20220924104906360](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104906360.png)

![image-20220924104946785](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924104946785.png)

### switch开关添加回调函数

![image-20220924105125948](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924105125948.png)

- 注意这里要先删除hr中的roles数组，会出现转化异常

![image-20220924105917532](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924105917532.png)

### 报错解决

```shell
2022-09-24 11:01:13.943  WARN 17560 --- [nio-9090-exec-8] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: null; nested exception is com.fasterxml.jackson.databind.JsonMappingException: N/A
at [Source: (PushbackInputStream); line: 1, column: 282] (through reference chain: org.javaboy.vhr.bean.Hr["authorities"])]
```

**解决：忽略authorities**

![image-20220924110219423](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924110219423.png)

### 测试

- 将李白用户禁用

![image-20220924110613707](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924110613707.png)

- 尝试登录

![image-20220924110642310](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924110642310.png)

## 操作员角色更新

### Popover 弹出框

```html
  <el-popover
    placement="bottom"
    title="标题"
    width="200"
    trigger="click"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
    <el-button slot="reference">click 激活</el-button>
  </el-popover>
```

- placement：弹出框展示位置 (left、right、bottom、top)
- trigger：触发方式(click、foucs、hover、manual)

![image-20220924120219859](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924120219859.png)

- 页面效果

![image-20220924120256843](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924120256843.png)

###  Select 选择器

```html
<el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
```

![image-20220924121054382](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924121054382.png)

### 服务端定义获取所有角色接口

![image-20220924121158074](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924121158074.png)

### 前端请求显示

![image-20220924121916157](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924121916157.png)

- 点击后触发该方法

![image-20220924122010159](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122010159.png)

![image-20220924122027768](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122027768.png)

- 回显

![image-20220924122103429](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122103429.png)

![image-20220924122143196](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122143196.png)

### 预选中实现

- 传递当前hr对象

![image-20220924122443473](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122443473.png)

- 获取当前所有的HR对应的角色并将对应角色id赋值到选中数组中（此操作前需要先将选中角色数组清空）

![image-20220924122531672](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122531672.png)

- 页面效果

![image-20220924122707417](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122707417.png)

### 隐藏时触发更新操作

![image-20220924122830000](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924122830000.png)

![image-20220924123003303](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924123003303.png)

![image-20220924123012869](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924123012869.png)

- 服务端接口设计

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924123843869.png)

![image-20220924123850506](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924123850506.png)

![image-20220924123904716](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924123904716.png)

### 前端实现

![image-20220924124534190](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924124534190.png)

**优化：当要修改的角色和原先的没有变化时，不发起请求（难点）**

![image-20220924130554981](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924130554981.png)

![image-20220924130642277](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924130642277.png)

**结果：不修改，点击空白处不会发起请求**

## 操作员搜索

- 修改接口方法

![image-20220924132257691](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924132257691.png)

![image-20220924132307238](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924132307238.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924133519405.png)

- 前端实现

![image-20220924133541447](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924133541447.png)

![image-20220924133550485](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924133550485.png)

![image-20220924133600597](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924133600597.png)

## 操作员删除

![image-20220924131053887](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924131053887.png)

![image-20220924131101251](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924131101251.png)

![image-20220924131510506](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924131510506.png)

![image-20220924131531768](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924131531768.png)

![image-20220924131554526](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924131554526.png)

## 增加数据加载进度

### Loading 加载

```html
<template>
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</template>
```

- loading：是否显示加载

### 登录页使用

![image-20220924134026312](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924134026312.png)

![image-20220924134046833](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924134046833.png)

![image-20220924134112496](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220924134112496.png)

## 员工资料

### 接口设计（分页查询员工资料）

- 封装分页数据类

```java
public class RespPageBean {
    private Long total;
    private List<?> data;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public List<?> getData() {
        return data;
    }

    public void setData(List<?> data) {
        this.data = data;
    }
}
```

![image-20220925090143973](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925090143973.png)

![image-20220925090157732](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925090157732.png)

- employee添加几个该字段

![image-20220925090252310](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925090252310.png)

- 映射文件

```xml
<resultMap id="AllEmployeeInfo" type="org.javaboy.vhr.bean.Employee" extends="BaseResultMap">
    <association property="nation" javaType="org.javaboy.vhr.bean.Nation">
        <id column="nid" property="id"/>
        <result column="name" property="name"/>
    </association>
    <association property="politicsstatus" javaType="org.javaboy.vhr.bean.Politicsstatus">
        <id column="pid" property="id"/>
        <result column="pname" property="name"/>
    </association>
    <association property="department" javaType="org.javaboy.vhr.bean.Department">
        <id column="did" property="id"/>
        <result column="dname" property="name"/>
    </association>
    <association property="jobLevel" javaType="org.javaboy.vhr.bean.JobLevel">
        <id column="jid" property="id"/>
        <result column="jname" property="name"/>
    </association>
    <association property="position" javaType="org.javaboy.vhr.bean.Position">
        <id column="posid" property="id"/>
        <result column="posname" property="name"/>
    </association>
</resultMap>

<select id="getEmployeeByPage" resultMap="BaseResultMap">
    SELECT e.*,
           n.id       as nid,
           n.`name`   as namne,
           p.id       as pid,
           p.name     as pname,
           d.id       as did,
           d.name     as dname,
           j.id       as jid,
           j.name     as jname,
           pos.id     as posid,
           pos.`name` as posname
    FROM employee e,
         nation n,
         politicsstatus p,
         department d,
         joblevel j,
         position pos
    WHERE e.nationId = n.id
      AND e.politicId = p.id
      AND e.departmentId = d.id
      AND e.jobLevelId = j.id
      AND e.posId = pos.id
    limit #{page},#{size}
</select>

<select id="getTotal" resultType="long">
    select count(*) from employee
</select>
```

- 测试

![image-20220925090957381](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925090957381.png)

## 员工管理工具栏展示

![image-20220925092309473](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925092309473.png)

- 页面 :pager:

![image-20220925092326333](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925092326333.png)

### 员工管理员数据展示

```html
<div style="margin-top: 10px">
  <el-table
      :data="emps"
      stripe
      border
      style="width: 100%">
    <el-table-column
        type="selection"
        width="55">
    </el-table-column>
    <el-table-column
        prop="name"
        label="姓名"
        fixed
        align="left"
        width="90">
    </el-table-column>
    <el-table-column
        prop="workId"
        label="工号"
        align="left"
        width="85">
    </el-table-column>
    <el-table-column
        prop="birthday"
        width="95px"
        align="left"
        label="出生日期">
    </el-table-column>
    <el-table-column
        prop="idCard"
        width="150px"
        align="left"
        label="身份证号码">
    </el-table-column>
    <el-table-column
        prop="wedlock"
        width="70px"
        align="left"
        label="婚姻状况">
    </el-table-column>
    <el-table-column
        prop="nation.name"
        label="民族">
    </el-table-column>
    <el-table-column
        prop="nativePlace"
        width="80px"
        label="籍贯">
    </el-table-column>
    <el-table-column
        prop="politicsstatus.name"
        label="政治面貌">
    </el-table-column>
    <el-table-column
        prop="email"
        width="180px"
        align="left"
        label="电子邮件">
    </el-table-column>
    <el-table-column
        prop="phone"
        width="100px"
        align="left"
        label="电话号码">
    </el-table-column>
    <el-table-column
        prop="address"
        width="220px"
        align="left"
        label="联系地址">
    </el-table-column>
    <el-table-column
        prop="department.name"
        width="100px"
        align="left"
        label="所属部门">
    </el-table-column>
    <el-table-column
        prop="position.name"
        width="100px"
        label="职位">
    </el-table-column>
    <el-table-column
        prop="jobLevel.name"
        width="100px"
        align="left"
        label="职称">
    </el-table-column>
    <el-table-column
        prop="engageForm"
        width="100px"
        align="left"
        label="聘用形式">
    </el-table-column>
    <el-table-column
        prop="beginDate"
        width="95px"
        align="left"
        label="入职日期">
    </el-table-column>
    <el-table-column
        prop="conversionTime"
        width="95px"
        align="left"
        label="转正日期">
    </el-table-column>
    <el-table-column
        prop="beginContract"
        width="95px"
        align="left"
        label="合同起始日期">
    </el-table-column>
    <el-table-column
        prop="endContract"
        width="95px"
        align="left"
        label="合同截止日期">
    </el-table-column>
    <el-table-column
        width="100px"
        align="left"
        label="合同期限">
      <template slot-scope="scope">
        <el-tag>{{scope.row.contractTerm}}</el-tag>年
      </template>
    </el-table-column>
    <el-table-column
        prop="tiptopDegree"
        label="最高学历">
    </el-table-column>
    <el-table-column
        width="200px"
        fixed="right"
        label="操作">
      <template slot-scope="scope">
        <el-button style="padding: 3px" size="mini">编辑</el-button>
        <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
        <el-button style="padding: 3px" size="mini" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
```

- checkbox

```html
 <el-table-column
        type="selection"
        width="55">
    </el-table-column>
```

- fixed：冻结该列
  - right：居右冻结
  - left：居左冻结（默认）

- align="left"：文本居左

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925095813993.png)

## 员工管理员工数据分页

###  Pagination 分页

##### 带背景色的分页

```html
<el-pagination
  background
  layout="prev, pager, next"
  :total="1000">
</el-pagination>
```

##### 其他功能 

![image-20220925100155284](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925100155284.png)



![image-20220925100249189](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925100249189.png)

**效果**

![image-20220925100304704](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925100304704.png)

### 前端页面参数传递

##### 定义变量

![image-20220925100837578](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925100837578.png)

##### 参数传递

![image-20220925100858783](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925100858783.png)

### 分页事件

![image-20220925101000220](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925101000220.png)

![image-20220925101915453](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925101915453.png)

## 员工管理之员工搜索

### 服务端接口改造

![image-20220925102817320](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925102817320.png)![image-20220925102836772](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925102836772.png)

![image-20220925102855271](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925102855271.png)

### 前端实现

![image-20220925102954713](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925102954713.png)![image-20220925103008596](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925103008596.png)

![image-20220925103038723](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925103038723.png)

##### 清空输入框自动回调函数

![image-20220925103330327](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925103330327.png)

![image-20220925103347477](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925103347477.png)![image-20220925103415083](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925103415083.png)

**点击清除后，自动查询出全部员工**

## 员工添加接口设计

![image-20220925183937319](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925183937319.png)

![image-20220925183924435](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220925183924435.png)

```json
{
    "name": "江南一点雨",
    "gender": "男",
    "birthday": "1990-01-01",
    "idCard": "610122199001011256",
    "wedlock": "已婚",
    "nationId": 1,
    "nativePlace": "陕西",
    "politicId": 13,
    "email": "laowang@qq.com",
    "phone": "18565558897",
    "address": "深圳市南山区",
    "departmentId": 5,
    "jobLevelId": 9,
    "posId": 29,
    "engageForm": "劳务合同",
    "tiptopDegree": "本科",
    "specialty": "信息管理与信息系统",
    "school": "深圳大学",
    "beginDate": "2018-01-01",
    "workState": "在职",
    "workId": "00000001",
    "contractTerm": 2,
    "conversionTime": "2018-04-01",
    "notworkDate": null,
    "beginContract": "2018-01-01",
    "endContract": "2020-01-01",
    "workAge": 12
}
```

## 员工添加页面绘制

### Layout 布局

通过基础的 24 分栏，迅速简便地创建布局。

##### 基础布局

```html
<el-row>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
</el-row>
```

### Radio 单选框

##### 单选框组

```html
 <el-radio-group v-model="radio">
    <el-radio :label="3">备选项</el-radio>
    <el-radio :label="6">备选项</el-radio>
    <el-radio :label="9">备选项</el-radio>
  </el-radio-group>
```

```html
<el-col :span="5">
    <el-form-item label="性别:" prop="gender">
        <el-radio-group v-model="emp.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女" style="margin-left: -15px">女</el-radio>
        </el-radio-group>
    </el-form-item>
</el-col>
```

### DatePicker 日期选择器

```html
<el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期">
</el-date-picker>
```

![image-20220927135202729](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927135202729.png)

- 对话框内容编写

```html
<el-dialog
    title="添加员工"
    :visible.sync="dialogVisible"
    width="80%">
  <div>
    <el-form>
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名:" prop="name">
            <el-input size="mini" placeholder="请输入员工姓名" prefix-icon="el-icon-edit" v-model="emp.name"
                      style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="性别:" prop="gender">
            <el-radio-group v-model="emp.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女" style="margin-left: -15px">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出生日期:" prop="birthday">
            <el-date-picker
                v-model="emp.birthday"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 150px"
                placeholder="出生日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="政治面貌:" prop="politicId">
            <el-select size="mini" style="width: 200px" v-model="emp.politicId" placeholder="政治面貌">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="民族:" prop="nationId">
            <el-select size="mini" style="width: 150px" v-model="emp.nationId" placeholder="民族">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="籍贯:" prop="nativePlace">
            <el-input size="mini" placeholder="请输入籍贯" prefix-icon="el-icon-edit" v-model="emp.nativePlace"
                      style="width: 120px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电子邮箱:" prop="email">
            <el-input size="mini" placeholder="请电子邮箱" prefix-icon="el-icon-message" v-model="emp.email"
                      style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="联系地址:" prop="address">
            <el-input size="mini" placeholder="请电子邮箱" prefix-icon="el-icon-message" v-model="emp.address"
                      style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="职位:" prop="nationId">
            <el-select size="mini" style="width: 150px" v-model="emp.posId" placeholder="职位">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="职称:" prop="jobLevelId">
            <el-select size="mini" style="width: 150px" v-model="emp.jobLevelId" placeholder="职称">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属部门:" prop="departmentId">
            <el-input size="mini" placeholder="所属部门" v-model="emp.departmentId" prefix-icon="el-icon-edit"
                      style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="电话号码:" prop="phone">
            <el-input size="mini" placeholder="电话号码" prefix-icon="el-icon-phone" v-model="emp.phone"
                      style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="工号:" prop="workId">
            <el-input size="mini" placeholder="工号" v-model="emp.workId" style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="学历:" prop="tiptopDegree">
            <el-select size="mini" style="width: 150px" v-model="emp.tiptopDegree" placeholder="学历">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="毕业院校:" prop="school">
            <el-input size="mini" placeholder="毕业院校名称" prefix-icon="el-icon-edit" v-model="emp.school"
                      style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="专业名称:" prop="specialty">
            <el-input size="mini" placeholder="请输入专业名称" prefix-icon="el-icon-edit" v-model="emp.specialty"
                      style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="入职日期:" prop="beginDate">
            <el-date-picker
                v-model="emp.beginDate"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 130px"
                placeholder="入职日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="转正日期:" prop="conversionTime">
            <el-date-picker
                v-model="emp.conversionTime"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 130px"
                placeholder="出生日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同起始日期:" prop="beginContract">
            <el-date-picker
                v-model="emp.beginContract"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 130px"
                placeholder="合同起始日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同终止日期:" prop="endContract">
            <el-date-picker
                v-model="emp.endContract"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 150px"
                placeholder="出生日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="身份证号码:" prop="idCard">
            <el-input size="mini" placeholder="请输入身份证号码" v-model="emp.idCard" style="width: 180px" prefix-icon="el-icon-edit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="聘用形式:" prop="engageForm">
            <el-radio-group v-model="emp.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同" style="margin-left: -15px">劳务合同</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="婚姻状况:" prop="wedlock">
            <el-radio-group v-model="emp.wedlock">
              <el-radio label="已婚">已婚</el-radio>
              <el-radio label="未婚" style="margin-left: -15px">未婚</el-radio>
              <el-radio label="未婚" style="margin-left: -15px">离异</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
```

![image-20220927141552357](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927141552357.png)

## 员工添加页面下拉框数据

### 接口设计

> 查询全部民族，政治面貌、职称信息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927142612489.png)

**select * from .....**

### 前端实现

- 定义三个数组变量

![image-20220927143228389](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143228389.png)

- 数据初始化方法

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927152153852.png)

- 方法调用

![image-20220927143322385](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143322385.png)

- 渲染数据

![image-20220927143406701](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143406701.png)

![image-20220927143424024](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143424024.png)

| ![image-20220927144414862](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144414862.png) | ![image-20220927144429685](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144429685.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20220927144455690](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144455690.png) |                                                              |

### 职位初始化数据

![image-20220927143724235](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143724235.png)

![image-20220927143737179](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143737179.png)

![image-20220927143910360](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143910360.png)![image-20220927143921893](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143921893.png)

![image-20220927143942534](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927143942534.png)

![image-20220927144527601](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144527601.png)

### 学历写死

![image-20220927144256876](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144256876.png)![image-20220927144314320](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144314320.png)

![image-20220927144542603](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144542603.png)

## 员工添加页面工号加载

### disabled禁止输入

![image-20220927144643386](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144643386.png)![image-20220927144651546](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927144651546.png)

### 工号数据来源

> 因为是添加，所以是从数据库中查询出工号的最大值，并在此基础上+1，做到递增效果

- 修改RespBean类

> set方法返回自身，并添加build方法

```java
package org.javaboy.vhr.bean;

/**
 * @Author szh
 * @Date 2022/9/17 11:42
 * @PackageName:org.javaboy.vhr.bean
 * @ClassName: RespBean
 * @Description: TODO
 * @Version 1.0
 */
public class RespBean {
    private Integer status;
    private String msg;
    private Object obj;

    public static RespBean build(){
        return new RespBean();
    }

    public static RespBean ok(String msg){
        return new RespBean(200,msg,null);
    }

    public static RespBean ok(String msg,Object obj){
        return new RespBean(200,msg,obj);
    }

    public static RespBean error(String msg){
        return new RespBean(500,msg,null);
    }

    public static RespBean error(String msg,Object obj){
        return new RespBean(500,msg,obj);
    }

    private RespBean(Integer status, String msg, Object obj) {
        this.status = status;
        this.msg = msg;
        this.obj = obj;
    }

    private RespBean() {
    }

    public Integer getStatus() {
        return status;
    }

    public RespBean setStatus(Integer status) {
        this.status = status;
        return this;
    }

    public String getMsg() {
        return msg;
    }

    public RespBean setMsg(String msg) {
        this.msg = msg;
        return this;
    }

    public Object getObj() {
        return obj;
    }

    public RespBean setObj(Object obj) {
        this.obj = obj;
        return this;
    }
}
```

- controller

![image-20220927145450357](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927145450357.png)

- 映射文件

![image-20220927145503161](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927145503161.png)

### 前端调用

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927150005607.png)

![image-20220927145644887](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927145644887.png)

![image-20220927150022798](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927150022798.png)

## 员工添加页面部门列表

![image-20220927150519933](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927150519933.png)

![image-20220927150541241](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927150541241.png)

### [¶](https://element.eleme.io/#/zh-CN/component/popover#popover-dan-chu-kuang)Popover 弹出框（手动激活）

![image-20220927150612830](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927150612830.png)

![image-20220927151130742](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927151130742.png)

![image-20220927151141260](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927151141260.png)![image-20220927151150798](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927151150798.png)

### 部门树展示

[¶](https://element.eleme.io/#/zh-CN/component/tree#tree-shu-xing-kong-jian)Tree 树形控件

```html
<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
```

##### 部门数据

![image-20220927151547475](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927151547475.png)

![image-20220927151557041](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927151557041.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927151626046.png)

### 前端实现

![image-20220927152457169](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927152457169.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927152800122.png)

![image-20220927152518956](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927152518956.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927152838870.png)

![image-20220927153004355](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153004355.png)

##### 点击后展示数据

![image-20220927153111083](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153111083.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153235783.png)

![image-20220927153205433](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153205433.png)

![image-20220927153155440](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153155440.png)

![image-20220927153717089](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153717089.png)

![image-20220927153734054](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153734054.png)

![image-20220927153914036](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927153914036.png)

- box-sizing：border-box  --->  padding和border的值就不会在影响元素的宽高，相当于把padding和border的值都算在content里，盒子模型会自动根据padding和border的值来调整content的值，就不需要手动调整

![image-20220927154150935](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927154150935.png)

## 员工添加测试

![image-20220927155238986](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927155238986.png)

## 员工添加数据校验

### 给表单添加`：model`和`:rules`两个属性

![image-20220927155505270](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927155505270.png)

### 定义rules属性

![image-20220927160110566](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927160110566.png)

### 给表单取名（ref)

![image-20220927160211850](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927160211850.png)

### 在添加前进行校验

![image-20220927160515209](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927160515209.png)

## 【问题处理】部门管理问题

> 问题描述：部门管理中删除一个子部门成功后，父部门没有子部门，再删除父部门，无法删除

**删除部门解决：**

![image-20220927162858944](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927162858944.png)

**添加部门解决：**

![image-20220927163232853](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927163232853.png)

## 员工删除

### 接口添加

![image-20220927164101979](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164101979.png)

![image-20220927164108805](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164108805.png)

### 前端

![image-20220927164639504](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164639504.png)

![image-20220927164650194](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164650194.png)

## 员工信息更新

### Dialog的title属性设为变量

![image-20220927164819015](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164819015.png)

##### 添加员工

![image-20220927164853092](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164853092.png)

##### 编辑员工

![image-20220927164926190](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927164926190.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927175257028.png)

### 更新接口

![image-20220927165534417](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927165534417.png)

![image-20220927165543547](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927165543547.png)

### 前端方法

![image-20220927165743056](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927165743056.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927175204276.png)

![image-20220927171153462](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927171153462.png)

## 【问题处理】自动计算合同期限

![image-20220927181434376](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927181434376.png)![image-20220927181448106](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927181448106.png)

- 测试

![image-20220927181616936](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927181616936.png)

**添加失败问题：**

前端删除workState字段，该字段默认为'在职'，是枚举类型，不能传空字符串

![image-20220927181746640](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927181746640.png)

## 权限组取消问题

![image-20220927182814602](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927182814602.png)

**分析：**

当前端传给后端的mids数组为空时，后端无法插入数据，所以报错

![image-20220927182917068](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927182917068.png)

**解决：**

![image-20220927182932861](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927182932861.png)

- 将mids设置为非必要参数

![image-20220927183151454](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927183151454.png)

## 员工数据导出【Excel导出】

### poi实现Excel导出

##### 添加依赖

```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>4.1.2</version>
</dependency>
```

##### 新建工具类POIUtils

文档摘要如图：

![image-20220927184349816](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927184349816.png)



**后端代码过长，这里就不展示了，自己去看吧...** :smile::goal_net::sheep::deciduous_tree::warning:

### 前端实现

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927194003755.png)

![image-20220927193950576](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927193950576.png)

### 测试

![image-20220927194025649](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927194025649.png)



## 员工数据导入【Excel导入】

### 步骤：

- 文件上传（前后端分离实现文件上传）
- 文件解析

### 服务端

![image-20220927194533289](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927194533289.png)

### Upload上传

```html
<el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
```

- action中填写请求地址

![image-20220927200741923](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927200741923.png)

![image-20220927200801150](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927200801150.png)

![image-20220927200824578](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220927200824578.png)

## 员工数据导入【Excel解析】

> 具体代码省略；

![image-20220928085401054](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928085401054.png)

重写Department，JobLevel，Position，Politicsstatus类的hash（只有name）方法，并添加空构造器以及一个name有参构造器

![image-20220928084447345](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928084447345.png)

在POIUtils中使用

![image-20220928084529284](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928084529284.png)

## 员工数据导入【插入数据】

![image-20220928085320074](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928085320074.png)![image-20220928085333185](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928085333185.png)

## 员工高级搜索页面设计

### 日期选择器（选择日期范围）

```html
 <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
```

```html
<div style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px">
  <el-row>
    <el-col :span="5">
      政治面貌:
      <el-select size="mini" style="width: 130px" v-model="emp.politicId" placeholder="政治面貌">
        <el-option
            v-for="item in politicsstatus"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      民族:
      <el-select size="mini" style="width: 150px" v-model="emp.nationId" placeholder="民族">
        <el-option
            v-for="item in nations"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      职位:
      <el-select size="mini" style="width: 130px" v-model="emp.posId" placeholder="职位">
        <el-option
            v-for="item in positions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      职称:
      <el-select size="mini" style="width: 130px" v-model="emp.jobLevelId" placeholder="职称">
        <el-option
            v-for="item in joblevels"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="7">
      聘用形式:
      <el-radio-group v-model="emp.engageForm">
        <el-radio label="劳动合同">劳动合同</el-radio>
        <el-radio label="劳务合同" style="margin-left: -15px">劳务合同</el-radio>
      </el-radio-group>
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px">
    <el-col :span="5">
      所属部门:
      <el-popover
          placement="right"
          title="请选择部门"
          width="300"
          trigger="manual"
          v-model="visible">
        <el-tree :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"
                 default-expand-all></el-tree>
        <div slot="reference" style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;
            border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;margin-left: 3px"
             @click="showDepView">{{ inputDepName }} 所属部门
        </div>
      </el-popover>
    </el-col>
    <el-col :span="10">
      入职日期:
      <el-date-picker
          size="mini"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </el-col>
    <el-col :span="5" :offset="4">
      <el-button size="mini">取消</el-button>
      <el-button size="mini" icon="el-icon-search" type="primary">搜索</el-button>
    </el-col>
  </el-row>
</div>
```

![screencapture-localhost-8080-2022-09-29-10_23_36](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/screencapture-localhost-8080-2022-09-29-10_23_36-16644182859711.png)

## 员工高级搜索页面动画

### 添加一个变量

![image-20220929103337254](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929103337254.png)

### v-show绑定

![image-20220929103355059](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929103355059.png)

### 点击事件和图标动态化

![image-20220929103425663](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929103425663.png)

### 页面效果

![image-20220929103519434](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929103519434.png)

![image-20220929103530027](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929103530027.png)

![image-20220929103519434](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929103519434.png)

### 动画

[vue-css过渡动画](https://v2.cn.vuejs.org/v2/guide/transitions.html)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929104102898.png)

![image-20220929104218993](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929104218993.png)

### 项目实现

##### 将要显示的内容用<transaction></transaction>包起来

![image-20220929104434690](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929104434690.png)

##### 样式

![image-20220929104453908](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929104453908.png)

##### 渐变效果

## 禁用普通搜索

### disabled属性

![image-20220929104635355](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929104635355.png)

### 效果

![image-20220929104702876](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929104702876.png)

## 员工高级搜索功能

### 前端改造

![image-20220929135124475](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929135124475.png)

### 后端改造

![image-20220929135322289](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929135322289.png)![image-20220929135331104](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929135331104.png)

### 测试

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929151737306.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929151332741.png)

### 后端日期转化

##### 工具类

```java
@Component
public class DateConverter implements Converter<String, Date> {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public Date convert(String s) {

        try {
            return sdf.parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

![image-20220929152002694](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929152002694.png)

![image-20220929152116007](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929152116007.png)

### 修改后端代码

![image-20220929155959755](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929155959755.png)

![image-20220929160014471](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929160014471.png)

![image-20220929160029804](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929160029804.png)

![image-20220929160041355](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929160041355.png)

### 前端请求参数拼接

![image-20220929160124321](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929160124321.png)

### 测试

![image-20220929160301191](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929160301191.png)

### Bug解决

> 通过高级搜索后得到的表格数据，点击分页会搜索全部分页信息

解决：定义一个全局变量searchType，点击高级搜索后给其赋值，点击取消或者再点高级搜索按钮或者搜索按钮，都会给其空值，然后在分页回调函数中定义如下：

![image-20220929162742084](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929162742084.png)

## 项目模块化改造【Maven聚合工程】

### 创建vhr Maven项目，删除src目录

##### 在vhr工程下创建vhrserver工程

![image-20220929164710876](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929164710876.png)

##### 在vhrserver下创建各个子模块，并引入vhr-web工程

![image-20220929164733629](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929164733629.png)

![image-20220929164742033](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929164742033.png)

### 在vhr中的pom.xml中添加依赖并删除vhr-web中的parent

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.3.12.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

### 在vhr-web中添加

```xml
<parent>
    <groupId>org.javaboy</groupId>
    <artifactId>vhrserver</artifactId>
    <version>1.0-SNAPSHOT</version>
</parent>
```

### 依赖引用

##### vhr-model引用vhr-commons

![image-20220929165306984](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929165306984.png)

##### vhr-mapper引用vhr-model

![image-20220929165353808](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929165353808.png)

##### vhr-service引用vhr-mapper

![image-20220929165425806](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929165425806.png)

##### vhr-web引用vhr-service

![image-20220929165716234](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929165716234.png)

### 依赖分布

##### vhr-web

![image-20220929170014735](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929170014735.png)

##### vhr-service

![image-20220929170032446](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929170032446.png)

##### vhr-mapper

![image-20220929170044609](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929170044609.png)

##### vhr-model

![image-20220929170057945](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929170057945.png)

##### vhr-commons

![image-20220929170118931](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929170118931.png)

### 每个模块建立如下包

![image-20220929170426797](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929170426797.png)

### 最终效果

![image-20220929171402615](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929171402615.png)



## 准备RabbitMQ消息中间件

略.....

## 搭建邮件服务

### 创建SpringBoot应用

> 添加thymeleaf，Mail，rabbitmq依赖，并引用vhr-model

![image-20220929183645992](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929183645992.png)

### 配置基本信息

![image-20220929183138483](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929183138483.png)

### 创建邮件模板

在resources目录下新建template目录

![image-20220929183216116](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929183216116.png)

### 创建队列

![image-20220929183447807](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929183447807.png)

### 给Employee类实现序列化

![image-20220929183919205](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929183919205.png)

### 创建邮件接收类，并发送邮件

![image-20220929184711396](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220929184711396.png)

## 自动发送员工入职欢迎邮件

### 在添加员工完成之后发送邮件

![image-20221004085310527](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085310527.png)

- 主键回填

![image-20221004085350476](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085350476.png)

- 查询员工


![image-20221004085324232](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085324232.png)

**注意：要将Employee中的对象属性都设为序列化**

![image-20221004085513911](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085513911.png)

![image-20221004085533566](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085533566.png)

### 测试邮件发送

![image-20221004085818217](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085818217.png)

![image-20221004085842164](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085842164.png)

![image-20221004085911335](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004085911335.png)

## 工资账套服务接口设计

### controller设计

![image-20221004090959480](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004090959480.png)

![image-20221004091005670](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004091005670.png)

![image-20221004091015160](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004091015160.png)

### 日期格式处理

![image-20221004091156867](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004091156867.png)

## 工资账套前端页面设计

### Table表格—多级表头

![image-20221004092002500](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004092002500.png)

![image-20221004094150972](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094150972.png)

![image-20221004094201223](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094201223.png)

![image-20221004094213039](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094213039.png)

## 添加工资账套页面设计

![image-20221004094609076](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094609076.png)

![image-20221004094621889](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094621889.png)

![image-20221004094635120](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094635120.png)

###  Steps 步骤条

##### 竖式步骤条

![image-20221004094727468](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004094727468.png)

```html
 <el-steps direction="vertical" :active="1">
    <el-step title="步骤 1"></el-step>
    <el-step title="步骤 2"></el-step>
    <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
  </el-steps>
```

**active表示激活的项**

![image-20221004095211074](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095211074.png)

![image-20221004095305527](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095305527.png)

![image-20221004095314064](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095314064.png)

### 下一步按钮动态化渲染

![image-20221004095601004](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095601004.png)

![image-20221004095640410](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095640410.png)

![image-20221004095610736](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095610736.png)

![image-20221004095712118](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095712118.png)

![image-20221004095656194](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004095656194.png)

### 输入框添加

![image-20221004100100773](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004100100773.png)

![image-20221004100128972](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004100128972.png)

### 上一步和取消按钮添加

![image-20221004100513637](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004100513637.png)

![image-20221004100527331](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004100527331.png)

## 工资账套添加页面设计

### 定义对象

![image-20221004101815793](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004101815793.png)

### 绑定-对象遍历

![image-20221004102056453](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004102056453.png)

### 测试

![image-20221004102343228](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004102343228.png)

![image-20221004102325353](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004102325353.png)

## 工资账套前后端接口对接

### 服务端接口添加

![image-20221004100802504](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004100802504.png)![image-20221004100808379](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004100808379.png)



![image-20221004102502743](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004102502743.png)

## 工资账套删除

![image-20221004104156878](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004104156878.png)

![image-20221004104205520](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004104205520.png)

![image-20221004104703434](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004104703434.png)

![image-20221004104720384](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004104720384.png)

## 工资账套编辑与刷新

![image-20221004105055971](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004105055971.png)

![image-20221004105106162](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004105106162.png)

![image-20221004110316503](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004110316503.png)

![image-20221004110326802](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004110326802.png)

![image-20221004110511053](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004110511053.png)

### 刷新按钮

![image-20221004110902769](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004110902769.png)

## 员工账套数据展示

### 服务端接口

![image-20221004125906339](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004125906339.png)

![image-20221004130118192](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004130118192.png)

![image-20221004130142880](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004130142880.png)

![image-20221004130155689](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004130155689.png)

![image-20221004130220518](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004130220518.png)

### 前端页面

![image-20221004131946278](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004131946278.png)

- 请求数据

![image-20221004132005532](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004132005532.png)

![image-20221004132013333](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004132013333.png)

###  Tooltip 文字提示

![image-20221004132103915](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004132103915.png)

```html
<el-tooltip placement="top">
  <div slot="content">多行信息<br/>第二行信息</div>
  <el-button>Top center</el-button>
</el-tooltip>
```

slot="content"：表示所展示的信息

```html
<el-table-column label="工资账套" align="center">
  <template slot-scope="scope">
    <el-tooltip placement="right" effect="light">
      <div slot="content">
        <table>
          <tr>
            <td>基本工资</td>
            <td>{{ scope.row.salary.basicSalary }}</td>
          </tr>
          <tr>
            <td>交通补助</td>
            <td>{{ scope.row.salary.trafficSalary }}</td>
          </tr>
          <tr>
            <td>午餐补助</td>
            <td>{{ scope.row.salary.lunchSalary }}</td>
          </tr>
          <tr>
            <td>奖金</td>
            <td>{{ scope.row.salary.bonus }}</td>
          </tr>
          <tr>
            <td>养老金比率</td>
            <td>{{ scope.row.salary.medicalPer }}</td>
          </tr>
          <tr>
            <td>养老金基数</td>
            <td>{{ scope.row.salary.pensionBase }}</td>
          </tr>
          <tr>
            <td>医疗保险比率</td>
            <td>{{ scope.row.salary.medicalPer }}</td>
          </tr>
          <tr>
            <td>医疗保险基数</td>
            <td>{{ scope.row.salary.medicalBase }}</td>
          </tr>
          <tr>
            <td>公积金比率</td>
            <td>{{ scope.row.salary.medicalPer }}</td>
          </tr>
          <tr>
            <td>公积金基数</td>
            <td>{{ scope.row.salary.medicalBase }}</td>
          </tr>
          <tr>
            <td>启用时间</td>
            <td>{{ scope.row.salary.createDate }}</td>
          </tr>
        </table>
      </div>
      <el-tag>{{ scope.row.salary.name }}</el-tag>
    </el-tooltip>
  </template>
</el-table-column>
```

![image-20221004133133802](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004133133802.png)



## 员工工资账套调整页面设计

### Popover 弹出框

```html
 <el-popover
    placement="bottom"
    title="标题"
    width="200"
    trigger="click"
    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
    <el-button slot="reference">click 激活</el-button>
  </el-popover>
```

###  Select 选择器

```html
  <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
```

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004140916977.png)

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004140928230.png)

![image-20221004140427172](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004140427172.png)

## 员工工资账套更新

### 接口设计

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004145713420.png)

### 使用Replace Into关键字插入表数据

```sql
REPLACE INTO empsalary (eid,sid) VALUES(10,9)
```

说明：该sql语句会先根据eid（唯一索引）查询是否唯一，若存在eid=10 的数据，会修改sid，若不存在，直接插入

**注意：eid需要设置成唯一索引字段**

![image-20221004142239954](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004142239954.png)

![image-20221004142918975](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004142918975.png)

![image-20221004142931546](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004142931546.png)

### 前端实现

![image-20221004143319558](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004143319558.png)

![image-20221004143253042](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004143253042.png)

## 员工工资账套设置分页

![image-20221004144826606](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004144826606.png)

![image-20221004144842848](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004144842848.png)

![image-20221004144856542](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004144856542.png)

![image-20221004144906755](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004144906755.png)

## 修改工资账套问题解决

略................

## 聊天页面方案介绍

基于https://github.com/is-liyiwei/vue-Chat-demo该项目完成

## 项目首页增加聊天入口

### 首页铃铛显示

![image-20221004152612808](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004152612808.png)

### 新增FriendChat页面

![image-20221004152713354](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004152713354.png)



### 注册到router中

![image-20221004153121658](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004153121658.png)

### 添加点击事件

![image-20221004153256980](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004153256980.png)

![image-20221004153306024](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004153306024.png)

### 页面效果

![image-20221004153502058](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004153502058.png)

## 聊天页面绘制

**将上述项目的components、store、以及App.vue页面内容信息拷贝到vhr中即可**

**添加自定义图片，在message.vue、card.vue、store中添加**

![image-20221004161710745](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004161710745.png)



## 调整页面聊天个人信息

![image-20221004161853530](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004161853530.png)

![image-20221004162019825](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004162019825.png)

![image-20221004162038954](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004162038954.png)

## 用户列表展示

### 服务端接口

![image-20221004172129144](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004172129144.png)

![image-20221004172139457](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004172139457.png)

### 前端

##### 加载数据

![image-20221004171905454](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004171905454.png)

##### 调用store中的方法

![image-20221004172057121](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004172057121.png)

![image-20221004171933746](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004171933746.png)

##### 调用store中的数据

![image-20221004172408216](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004172408216.png)

![image-20221004172630747](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221004172630747.png)

## 服务端消息处理配置

##### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

##### 添加配置类WebSocketConfig

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/ep").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue");
    }
}

```

##### 新建消息实体类

```java
public class ChatMsg {

    private String from;
    private String to;
    private String content;
    private Date date;
    //此处省略getter and setter
}
```

##### 接收消息接口

```java
@Controller
public class WsController {
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/ws/chat")
    public void handleMsg(Principal principal, ChatMsg chatMsg){
        chatMsg.setFrom(principal.getName());
        chatMsg.setDate(new Date());
        simpMessagingTemplate.convertAndSendToUser(chatMsg.getTo(), "/queue/chat", chatMsg);
    }
}
```

## 前端的聊天配置

### 在vue.config.js中配置

![image-20221005122522108](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005122522108.png)

### 拷贝两个js工具

![image-20221005123519162](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005123519162.png)



### 在store中定义变量

![image-20221005123705818](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005123705818.png)

### 前端建立连接收消息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005141635933.png)

### userText.vue中发消息

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005141658142.png)

## 消息首发测试 





## 消息发送处理

![image-20221005143733410](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005143733410.png)

## 消息接收处理

![image-20221005143754111](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005143754111.png)

## 聊天数据展示

![image-20221005144405277](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005144405277.png)

![image-20221005144437860](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005144437860.png)

## 聊天消息自动刷新

![image-20221005144614895](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005144614895.png)

## 聊天完善

### 登录用户赋值时机问题

![image-20221005144930338](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005144930338.png)

**登录成功后赋值**

![image-20221005144954802](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005144954802.png)

**恢复本地聊天记录**

![image-20221005145117508](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005145117508.png)

## 聊天消息提示

### Badge 标记

### Notification 通知

```js
this.$notify({
    title: '自定义位置',
    message: '右下角弹出的消息',
    position: 'bottom-right'
});
```

![image-20221005154949038](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005154949038.png)

![image-20221005155006500](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005155006500.png)

## 新消息提示红点

###  Badge 标记

![image-20221005155331339](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005155331339.png)

## 聊天信息动态提示

![image-20221005155848121](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005155848121.png)

![image-20221005155907991](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005155907991.png)

![image-20221005155957287](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20221005155957287.png)

## 服务端添加验证码

### 生成验证码工具类

```java
public class VerificationCode {

    private int width = 100;// 生成验证码图片的宽度
    private int height = 30;// 生成验证码图片的高度
    private String[] fontNames = { "宋体", "楷体", "隶书", "微软雅黑" };
    private Color bgColor = new Color(255, 255, 255);// 定义验证码图片的背景颜色为白色
    private Random random = new Random();
    private String codes = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private String text;// 记录随机字符串

    /**
     * 获取一个随意颜色
     *
     * @return
     */
    private Color randomColor() {
        int red = random.nextInt(150);
        int green = random.nextInt(150);
        int blue = random.nextInt(150);
        return new Color(red, green, blue);
    }

    /**
     * 获取一个随机字体
     *
     * @return
     */
    private Font randomFont() {
        String name = fontNames[random.nextInt(fontNames.length)];
        int style = random.nextInt(4);
        int size = random.nextInt(5) + 24;
        return new Font(name, style, size);
    }

    /**
     * 获取一个随机字符
     *
     * @return
     */
    private char randomChar() {
        return codes.charAt(random.nextInt(codes.length()));
    }

    /**
     * 创建一个空白的BufferedImage对象
     *
     * @return
     */
    private BufferedImage createImage() {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        g2.setColor(bgColor);// 设置验证码图片的背景颜色
        g2.fillRect(0, 0, width, height);
        return image;
    }

    public BufferedImage getImage() {
        BufferedImage image = createImage();
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < 4; i++) {
            String s = randomChar() + "";
            sb.append(s);
            g2.setColor(randomColor());
            g2.setFont(randomFont());
            float x = i * width * 1.0f / 4;
            g2.drawString(s, x, height - 8);
        }
        this.text = sb.toString();
        drawLine(image);
        return image;
    }

    /**
     * 绘制干扰线
     *
     * @param image
     */
    private void drawLine(BufferedImage image) {
        Graphics2D g2 = (Graphics2D) image.getGraphics();
        int num = 5;
        for (int i = 0; i < num; i++) {
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g2.setColor(randomColor());
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawLine(x1, y1, x2, y2);
        }
    }

    public String getText() {
        return text;
    }

    public static void output(BufferedImage image, OutputStream out) throws IOException {
        ImageIO.write(image, "JPEG", out);
    }
}
```

### controller接口

![image-20220928090441866](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928090441866.png)

### 放行接口

![image-20220928090615003](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928090615003.png)

### 测试

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928090700959.png)

### 自定义过滤器

> 在校验用户名和密码之前校验验证码

- 自定义过滤器

![image-20220928091428917](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928091428917.png)

- 添加到Security执行链中（在校验密码之前）

![image-20220928091615136](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928091615136.png)

- 测试

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928091819137.png)

![image-20220928091853632](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928091853632.png)

## 前端添加验证码

![image-20220928092549278](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928092549278.png)

![image-20220928092653043](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928092653043.png)

- 点击图片后能够随意更换

![image-20220928092713148](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928092713148.png)

![image-20220928093431546](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928093431546.png)

## 国际化

### 创建如下文件

![image-20220928123734420](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928123734420.png)

![image-20220928123746167](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928123746167.png)![image-20220928123759334](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928123759334.png)

### 测试

![image-20220928123814983](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928123814983.png)

![image-20220928123827940](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928123827940.png)

### 使用请求行传递参数

- 新建类，配置如下

![image-20220928124650619](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928124650619.png)

- 测试

![image-20220928124724492](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928124724492.png)

下次再发起请求，可以不携带lang参数，因为数据已存在session中

![](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928124813991.png)

参数默认是`locale`，这里配置成了`lang`

### 自定义properties存放目录

```properties
spring.messages.basename=i18n/messages
```

![image-20220928125328182](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928125328182.png)

### 其他自定义

![image-20220928125338601](https://javablog-image.oss-cn-hangzhou.aliyuncs.com/blog/image-20220928125338601.png)

```properties
spring.messages.fallback-to-system-locale=true
```

找message_zh-CN.properties

```properties
spring.messages.fallback-to-system-locale=false
```

找message.properties
