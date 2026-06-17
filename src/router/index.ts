import { createRouter, createWebHistory } from 'vue-router'
import LampOverview from '@/views/LampOverview.vue'
import WorkshopManage from '@/views/WorkshopManage.vue'
import StatisticsView from '@/views/StatisticsView.vue'

const routes = [
  {
    path: '/',
    name: 'overview',
    component: LampOverview,
    meta: { title: '供灯总览' }
  },
  {
    path: '/workshop',
    name: 'workshop',
    component: WorkshopManage,
    meta: { title: '作坊管理' }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: StatisticsView,
    meta: { title: '消耗统计' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
