import { createRouter, createWebHistory } from 'vue-router'
import NamePage from '../views/NamePage.vue'
import GamePage from '../views/GamePage.vue'
import PaintingPage from '../views/PaintingPage.vue'
import SecretPage from '../views/SecretPage.vue'
import StartPoint from '../views/StartPoint.vue'
import PunishmentPage from '../views/PunishmentPage.vue'
import AIChatPage from '../views/AIChatPage.vue'
import SupportPage from '../views/SupportPage.vue'
import DarkPage from '../views/DarkPage.vue'
import DinoPage from '../views/DinoPage.vue'
import EndPoint from '../views/EndPoint.vue'
import HintPage from '../views/HintPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/name',
      name: 'name',
      component: NamePage
    },
    {
      path: '/game',
      name: 'game',
      component: GamePage
    },
    {
      path: '/painting',
      name: 'painting',
      component: PaintingPage
    },
    {
      path: '/secret',
      name: 'secret',
      component: SecretPage
    },
    {
      path: '/',
      name: 'start',
      component: StartPoint
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
      path: '/endpoint',
      name: 'endpoint',
      component: EndPoint
    },
    {
      path: '/hint',
      name: 'hint',
      component: HintPage
    }
  ]
})

export default router 