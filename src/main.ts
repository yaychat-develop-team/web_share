import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import { preloadGlobalAssets } from '@/utils/preload'
import { toast } from '@/utils/toast'

import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@/assets/styles/index.scss'
import '@/assets/styles/tailwind.css'

preloadGlobalAssets()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$toast = toast
app.mount('#app')
