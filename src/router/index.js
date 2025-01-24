import { createRouter, createWebHistory } from 'vue-router'
import StartPoint from '../views/StartPoint.vue'
import EndPoint from '../views/EndPoint.vue'

const routes = [
  {
    path: '/',
    name: 'StartPoint',
    component: StartPoint
  },
  {
    path: '/endpoint',
    name: 'EndPoint',
    component: EndPoint
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 