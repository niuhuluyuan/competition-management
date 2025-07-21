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
        path: '',
        name: 'Home',
        component: () => import('../views/home/index.vue'),
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('../views/create/index.vue'),
      },
    ],
  },
  {
    path: '/competition',
    component: Layout,
    children: [
      {
        path: '',
        name: 'CompetitionDetail',
        component: () => import('../views/detail/competition/index.vue'),
        meta: { hidden: true }
      }
    ]
  },
  // {
  //   path: '/staff',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '',
  //       name: '',
  //       component: () => import('../views/create/index.vue'),
  //     },
  //   ],
  // },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/test/index.vue'),
  },
]

export default routes
