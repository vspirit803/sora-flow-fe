import '@/plugins/vee-validate';

import VueCompositionApi from '@vue/composition-api';
import Vue from 'vue';

import App from '@/App.vue';
import Confirm from '@/components/Confirm.vue';
import IconButton from '@/components/IconButton.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

Vue.component('IconButton', IconButton);
Vue.component('Confirm', Confirm);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
