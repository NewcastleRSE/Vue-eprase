import Vue from 'vue'
import App from './App.vue'
import VueGoogleCharts from 'vue-google-charts'
import {router} from './router'
import { store } from './store'
import VeeValidate from 'vee-validate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faInfoCircle, faList, faClipboard, faChartBar, faQuestionCircle, faSignOutAlt, faCaretRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BootstrapVue } from 'bootstrap-vue'

library.add(faHome, faInfoCircle, faList, faClipboard, faChartBar, faQuestionCircle, faSignOutAlt, faCaretRight);
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
