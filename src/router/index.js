import { createRouter, createWebHashHistory } from 'vue-router'
import StartPoint from '../views/StartPoint.vue'
import GamePage from '../views/GamePage.vue'
import PunishmentPage from '../views/PunishmentPage.vue'
import AIChatPage from '../views/AIChatPage.vue'
import SupportPage from '../views/SupportPage.vue'
import DarkPage from '../views/DarkPage.vue'
import DinoPage from '../views/DinoPage.vue'
import NamePage from '../views/NamePage.vue'
import EndPoint from '../views/EndPoint.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
    },
    {
      path: '/chat',
      name: 'chat',
      component: AIChatPage
    },
    {
      path: '/support',
      name: 'support',
      component: SupportPage
    },
    {
      path: '/dark',
      name: 'dark',
      component: DarkPage
    },
    {
      path: '/dino',
      name: 'dino',
      component: DinoPage
    },
    {
      path: '/name',
      name: 'name',
      component: NamePage
    },
    {
      path: '/endpoint',
      name: 'endpoint',
      component: EndPoint
    }
  ]
})

export default router 