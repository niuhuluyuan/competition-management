import { RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'competition',
        name: 'competition',
        component: () => import('../views/competition/index.vue'),
      },
      {
        path: 'team',
        name: 'team',
        component: () => import('../views/team/index.vue'),
      },
      {
        path: 'game',
        name: 'game',
        component: () => import('../views/game/index.vue'),
      },
    ],
  },

]

export default routes
