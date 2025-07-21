import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 自定义指令
import { scrollToBottom } from './directives'

import './styles/index.css'
import Antd from 'ant-design-vue'
import ConfigApp from './ConfigApp.vue'
import 'ant-design-vue/dist/antd.css'
import router from './router'

const app = createApp(ConfigApp)

app.directive('bottom', scrollToBottom)

app.use(router).use(createPinia()).use(Antd).mount('#app')
