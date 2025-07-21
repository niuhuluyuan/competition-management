import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { Modal } from 'ant-design-vue'
import { getSessionItem } from '../utils'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !getSessionItem('user')) {
    Modal.warning({
      title: '未登录',
      content: '需要先登录才能继续操作，请先登录！',
      okText: '去登录',
      centered: true,
      onOk() {
        next({ name: 'Login' })
      },
    })
  } else {
    next()
  }
})

export default router
