import Vue from 'vue'
import App from './App.vue'
import VueGoogleCharts from 'vue-google-charts'
import {router} from './router'
import { store } from './store'
import VeeValidate from 'vee-validate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faInfoCircle, faList, faClipboard, faChartBar, faQuestionCircle, faSignOutAlt, faCaretRight, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue } from 'bootstrap-vue'
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

library.add(faHome, faInfoCircle, faList, faClipboard, faChartBar, faQuestionCircle, faSignOutAlt, faCaretRight, faEnvelope );
Vue.component('font-awesome-icon', FontAwesomeIcon);

// Install BootstrapVue
Vue.use(BootstrapVue);
Vue.use(VueGoogleCharts);

Vue.use(VeeValidate, {
  classes: true,
  classNames: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});

// hides default console message
Vue.config.productionTip = false;
// control inspection of code using vue devtools - set to false for production
Vue.config.devtools = true;

Vue.config.errorHandler = function(err, vm, info) {
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}

Sentry.init({
    Vue,
    dsn: "https://4d30c2e7f1234eca9e329a4d4376a6b0@o1080315.ingest.sentry.io/6616496",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["localhost", "my-site-url.com", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    environment: "development"
  });


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
