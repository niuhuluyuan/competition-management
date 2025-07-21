# 竞赛管理系统

## 介绍
竞赛管理系统

## 项目目录


## 开发

### 引入Ant Design Vue
```bash
$ yarn add ant-design-vue
```
在`main.ts`中:
```diff
  import { createApp } from 'vue'
+ import Antd from 'ant-design-vue'
  import App from './App.vue'
+ import 'ant-design-vue/dist/antd.css'
 
  createApp(App)
+ .use(Antd)
  .mount('#app')
```

### 引入VueRouter
```bash
$ yarn add vue-router@4
```
- 在`src`目录下创建`router`文件夹, 用于存放VueRouter相关文件
- 这里我们使用`index.ts`作为VueRouter入口文件, 用`routes.ts`单独存放路由
`index.ts`
```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

// 这里进行导出
export default router
```

`routes.ts`
```ts
// 这里引入类型RouteRecordRaw来规范类型，辅助开发
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  // ...
]

export default routes
```

然后在`main.ts`中进行引入即可:
```diff
 import { createApp } from 'vue'
 import Antd from 'ant-design-vue'
 import App from './App.vue'
 import 'ant-design-vue/dist/antd.css'
+ import router from './router'
 
 createApp(App)
+.use(router)
 .use(Antd)
 .mount('#app')
```

### 引入tailwindcss
为了写更少的css, 使用`tailwindcss`来辅助开发  
- 首先安装`tailwindcss`以及与之搭配的工具
```bash
$ yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
```
- 快速创建配置文件, 这将会在根目录下创建`tailwind.config.js`和`postcss.config.js`文件: 
```bash
$ npx tailwindcss init -p
```
- tailwind.config.js
```js
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
- postcss.config.js
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- 接下来要进行`tailwindcss`的配置来移除生产环境下没有用到的样式声明, 在刚刚创建的`tailwind.config.js`中:
```diff
module.exports = {
+ purge: ['./index.html', './src/**/*.{vue, js, ts, jsx, tsx}'],
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- 接下来创建文件`src/styles/index.css`, 在css中引入`tailwindcss`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- 最后在`src/main.ts`下引入这个文件
```diff
  import { createApp } from 'vue'
  import Antd from 'ant-design-vue'
  import App from './App.vue'
+ import './styles/index.css'
  import 'ant-design-vue/dist/antd.css'
  import router from './router'
  
  createApp(App)
  .use(router)
  .use(Antd)
  .mount('#app')
```

> 注意这里引入`index.css`要放在`antd`样式文件之前，否则会影响一些`antd`组件的样式

接下来就可以愉快地使用了：
```html
<div class="w-10 h-5 bg-slate-600">Hello World</div>
```

### 引入Pinia
本项目采用Pinia作为全局状态管理器
```bash
yarn add pinia
```
在`main.ts`中进行引入
```diff
  import { createApp } from 'vue'
+ import { createPinia } from 'pinia'
  import Antd from 'ant-design-vue'
  import App from './App.vue'
  import './styles/index.css'
  import 'ant-design-vue/dist/antd.css'
  import router from './router'
  
  createApp(App)
  .use(router)
+ .use(createPinia())
  .use(Antd)
  .mount('#app')
```

#### 如何使用Pinia?
1. 创建文件`src/store/user.ts`
```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state() {
    return {
      nickName: '',
      openid: ''
    }
  },
})
```
2. 在vue文件中进行引用
```js
import { computed } from 'vue'
import { useUserStore } from 'src/store/user'

const userStore = useUserStore()
const nickName = computed(() => userStore.nickName)
```

### 引入Axios
#### 安装
```bash
$ yarn add axios
```
#### 封装
- 新建文件`src/utils/http.ts`
```ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class IAxios {
  private instance: AxiosInstance
  private options: AxiosRequestConfig
  constructor(options: AxiosRequestConfig) {
    this.options = options
    this.instance = axios.create(options)
    this.setupInterceptor()
  }

  public getInstance(): AxiosInstance {
    return this.instance
  }

  /**
   * @description 设置拦截器
   */
  public setupInterceptor () {
    this.instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return config
    })

    this.instance.interceptors.response.use((response: AxiosResponse) => {
      return {
        ...response.data,
        status: response.status,
        statusText: response.statusText
      }
    })
  }

}

const http = new IAxios({ baseURL: 'https://www.youngcr.cn/capi', timeout: 10 * 1000 })

export default http
```

### 代码格式化-Prettier
```bash
$ yarn add prettier -D
```
然后在根目录下新建文件`.prettierrc`或`prettier.config.js`  
文件不同，写法不同，更多详情见[prettier官网](https://www.prettier.cn/docs/configuration.html)  
这里写`.prettierrc`的写法，`prettier.config.js`加上`module.exports`即可
```json
{
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```
在VSCode中安装`prettier`插件，然后配置默认格式化程序，就可以开始愉快地开发了

### 组件库全局化配置
使用`Ant Design Vue`的`<a-config-provider>`组件来对开发中组件库的配置进行全局约束  
首先这里我新建一个组件`ConfigApp`用来包裹根组件App, 内容如下：
```html
<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale="zhCN">
    <App />
  </a-config-provider>
</template>

<script lang="ts" setup>
import App from './App.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
// 引入dayjs相关项，对日期选择组件进行汉化
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 加载dayjs的中文包
dayjs.locale('cn')

const getPopupContainer = (el, dialogContext) => {
  if (dialogContext) {
    return dialogContext.getDialogWrap()
  } else {
    return document.body
  }
}
</script>
```
最后在`main-ts`中把根组件换成现在这个`ConfigApp.vue`组件就好了：
```diff
  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import './styles/index.css'
  import Antd from 'ant-design-vue'
- import App from './App.vue'
+ import ConfigApp from './ConfigApp.vue'
  import 'ant-design-vue/dist/antd.css'
  import router from './router'
  
- createApp(App)
+ createApp(ConfigApp)
  .use(router)
  .use(createPinia())
  .use(Antd)
  .mount('#app')
```
当然也可以直接在`App.vue`组件内用`<a-config-provider>`进行包裹，视个人喜好而定

## git相关问题
#### 在进行Git本地仓库与远程仓库的关联时，调用`pull`命令报错 **refusing to merge unrelated histories**

解决方法：
在pull命令后加上选项`--allow-unrelated-histories`
