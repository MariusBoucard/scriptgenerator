import { createApp } from 'vue'
import App from './App.vue'
import router from '../router.js'
import VueKonva from 'vue-konva';
import ContextMenu from '@imengyu/vue3-context-menu'
// stylesheet
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App)
app.use(router)
app.use(VueKonva);
app.use(ContextMenu)
app.mount('#app')
