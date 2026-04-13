import './assets/scss/custom.scss'
import '../node_modules/print-js/dist/print.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import '../node_modules/flatpickr/dist/plugins/monthSelect/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import { router } from './router'
import { authenticationStore } from './stores/authentication.js'
import { isStagingSite } from './helpers/utils.js'

// Strip out most debugging information in production version (leaves console.warn and console.error)
// 30/03/2026 David - leave debugging trace information in for staging site, only strip out on actual production server
if (process.env.NODE_ENV === 'production' && !isStagingSite()) {
  console.log = function() {}
  console.debug = function() {}
  console.group = function() {}
  console.groupEnd = function() {}
}
console.dir(process.env)

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
pinia.use(({ store }) => {
  store.router = router // This makes 'router' available as 'this.router' in stores
})

axios.defaults.baseURL = process.env.BASE_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.mode = 'no-cors'
axios.defaults.withCredentials = true

app.use(pinia).use(VueAxios, axios).use(router).use(Vueform, vueformConfig)

// hides default console message
app.config.productionTip = false
// control inspection of code using vue devtools - set to false for production
app.config.devtools = process.env.NODE_ENV !== 'production'

app.config.globalProperties.embolden = function(str, required=false) {
  let markup = `<span class="fw-bold">${str}</span>`
  if (required) {
    markup += `<sup class="ms-1" title="Field is required"><i class="bi bi-asterisk text-danger"></i></sup>`
  }
  return markup
}
// Check an API or other async service response and forward error only if response status not 401|403|440
// Otherwise just return and allow triageError() in authentication.js to route user to login page
app.config.globalProperties.errorResponder = async function(response) {
  let wasError = false
  const isObject = Object.prototype.toString.call(response) === '[object Object]'
  if (isObject) {
    console.debug('errorResponder() processing API response', response)
    const status = response.status || 200
    const message = response.message || 'An unspecified error occurred'
    const unauthHttp = [401, 403, 440]
    if (status >= 400) {
      wasError = true
      let sessionValid = true
      if (status == 500) {
        // Server error - could be thrown by a manually terminated session, so check session validity first
        sessionValid = await authenticationStore().isLoggedIn()
      }
      if (!sessionValid) {
        authenticationStore().triageError({ status: 403, message: 'Your session is no longer valid, possibly terminated on another device' })
      } else if (!unauthHttp.includes(status)) {
        throw new Error(message)
      } 
    }
  }
  return wasError
}
// yes|no => true|false
app.config.yesNoToBoolean = function(value) {

}
// true|false => yes/no
app.config.booleanToYesNo = function(value) {

}

app.mount('#app')
