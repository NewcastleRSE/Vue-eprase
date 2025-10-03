import './assets/scss/custom.scss'
import '../node_modules/print-js/dist/print.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import '../node_modules/flatpickr/dist/plugins/monthSelect/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import { router } from './router'

// Strip out most debugging information in production version (leaves console.warn and console.error)
if (process.env.NODE_ENV === 'production') {
  console.log = function() {}
  console.debug = function() {}
  console.group = function() {}
  console.groupEnd = function() {}
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({storage: localStorage}))

configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: true,
  validateOnModelUpdate: true
})

axios.defaults.baseURL = process.env.BASE_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.mode = 'no-cors'

app.use(pinia).use(VueAxios, axios).use(router).use(Vueform, vueformConfig)

// hides default console message
app.config.productionTip = false
// control inspection of code using vue devtools - set to false for production
app.config.devtools = true

app.config.globalProperties.embolden = function(str, required=false) {
  let markup = `<span class="fw-bold">${str}</span>`
  if (required) {
    markup += `<sup class="ms-1" title="Field is required"><i class="bi bi-asterisk text-danger"></i></sup>`
  }
  return markup
}

app.mount('#app')
