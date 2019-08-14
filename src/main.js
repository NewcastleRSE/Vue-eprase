import Vue from 'vue'
import App from './App.vue'
import {router} from './router'
import { store } from './store'
import VeeValidate from 'vee-validate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faList, faClipboard, faChartBar, faQuestionCircle, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHome, faList, faClipboard, faChartBar, faQuestionCircle, faSignOutAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VeeValidate, {
  classes: true,
  classNames: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
