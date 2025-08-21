import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routes'
import store from '@/store'
import '../public/assets/tailwind.css'
import VueGtag from "vue-gtag";


const app = createApp(App);

app.use(router)
    .use(store)
    .use(VueGtag, {
        config: { id: process.env.VUE_APP_MEASUREMENT_ID}
    }, router)
    .mount('#app')

export const gtag = app.config.globalProperties.$gtag;