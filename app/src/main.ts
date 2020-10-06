import Vue from 'vue'
import App from '@/App.vue'
import '@/registerServiceWorker'
import router from '@/router'
import store from '@/store'

Vue.config.productionTip = false

const createApp = async (): Promise<void> => {
  const vuetify =
    process.env.NODE_ENV === 'production'
      ? (await import('@/plugins/vuetify')).default
      : (await import('@/plugins/vuetify_dev')).default

  await new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')
}
createApp()
