import { createRouter, createWebHistory } from 'vue-router'
import SynopsisComponent from './src/components/SynopsisComponent.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/synopsis', component: SynopsisComponent },
    // { path: '/about', component: About }
  ]
})

export default router