import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { registerDirectives } from './directives'
import router from './router'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
registerDirectives(app)

app.mount('#app')
