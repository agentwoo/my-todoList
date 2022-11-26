

import 'element-plus/dist/index.css'
import './style/index.scss'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./http/index"
import router from './router'
import App from './App.vue'


const app = createApp(App)
app.use(router);

// console.log($api);


const store = createPinia()
app.use(store)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}



app.mount('#app')