import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

// Create the app instance
const app = createApp(App)

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Create and use Pinia before mounting the app
const pinia = createPinia()
app.use(pinia)

// Import stores after Pinia is created
import { useAttractionsStore } from './stores/attractions'

// Use other plugins
app.use(router)
app.use(ElementPlus)

// Mount the app
app.mount('#app')
// Initialize data after app is mounted
const attractionsStore = useAttractionsStore()
attractionsStore.fetchAttractions()

