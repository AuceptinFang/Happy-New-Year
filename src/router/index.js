import { createRouter, createWebHistory } from 'vue-router'
import StartPoint from '../views/StartPoint.vue'
import GamePage from '../views/GamePage.vue'
import PunishmentPage from '../views/PunishmentPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartPoint
    },
    {
      path: '/game',
      name: 'game',
      component: GamePage
    },
    {
      path: '/punishment',
      name: 'punishment',
      component: PunishmentPage
    }
  ]
})

export default router 