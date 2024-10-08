import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//引入css
import '@/styles/css/index.css'
import '@/styles/css/iconfont.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store).use(router).use(ElementPlus, { locale: zhCn }).mount('#app')
