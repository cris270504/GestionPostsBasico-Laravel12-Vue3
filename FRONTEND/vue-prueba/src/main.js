import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.vue'
import './assets/style.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'


const main = createApp(App)

main.use(createPinia())
main.use(router)

main.mount('#app')



