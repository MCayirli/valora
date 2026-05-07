import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import './style.css'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

registerSW({
  immediate: true,
})

createApp(App).use(pinia).mount('#app')
