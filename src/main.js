import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './estilo.scss'

createApp(App).use(router).use(vuetify).mount('#app')
