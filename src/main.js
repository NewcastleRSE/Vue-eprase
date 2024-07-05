import "./assets/scss/custom.scss"
import "../node_modules/print-js/dist/print.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import "../node_modules/bootstrap-icons/font/bootstrap-icons.min.css"
import { createApp } from "vue"
import { createPinia } from "pinia"
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from "./App.vue"
import axios from "axios"
import VueAxios from "vue-axios"
import { configure, defineRule } from "vee-validate"
import { required } from '@vee-validate/rules'
import { router } from "./router"
import * as Sentry from "@sentry/vue"

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({storage: localStorage}))

configure({
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: true,
  validateOnModelUpdate: true
})
defineRule('nhsEmail', value => {
  console.debug('Validate NHS email', value)
  if (
    value &&
    value.match(/^[a-zA-Z0-9-.]+@([a-z]+.|)nhs.(uk|net)+$/)
  ) {
    console.debug('Ok')
    return true
  } else {
    return 'Must be a valid nhs.net or nhs.uk email address'
  }
})
defineRule('required', required)
defineRule('lengthBetween', (value, [minLength, maxLength]) => {
  console.debug('Validate length of', value, 'between', minLength, 'and', maxLength)
  if (value && value.length >= minLength && value.length <= maxLength) {
    console.debug('Ok')
    return true
  } else {
    return `Must be between ${minLength} and ${maxLength} characters long`
  }
})
defineRule('passwordConfirmationEqual', (value, [target]) => {
  console.debug('Validate password', value, 'and confirmation', target, 'same')
  if (value === target) {
    console.debug('Ok')
    return true
  }
  return 'Password and confirmation must match'
})

axios.defaults.baseURL = 'http://localhost:6001/api/',
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.mode = 'no-cors'

app.use(pinia).use(VueAxios, axios).use(router)

// hides default console message
app.config.productionTip = false
// control inspection of code using vue devtools - set to false for production
app.config.devtools = true

// app.config.errorHandler = function (err, vm, info) {
//   console.log(`Error: ${err.toString()}\nInfo: ${info}`)
// }

// https://docs.sentry.io/platforms/javascript/guides/vue/
Sentry.init({
  app,
  dsn: 'https://4d30c2e7f1234eca9e329a4d4376a6b0@o1080315.ingest.us.sentry.io/6616496',
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

app.mount('#app')
