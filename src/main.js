import { createApp } from 'vue'
import App from './App.vue'
import router from '../router.js'
import VueKonva from 'vue-konva';

const app = createApp(App)
app.use(router)
app.use(VueKonva);
app.mount('#app')
