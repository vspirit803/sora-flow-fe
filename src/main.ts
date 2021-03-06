import '@/plugins/vee-validate';

import VueCompositionApi from '@vue/composition-api';
import Vue from 'vue';

import App from '@/App.vue';
import Confirm from '@/components/Confirm.vue';
import IconButton from '@/components/IconButton.vue';
import i18n from '@/plugins/vue-i18n';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import FormComponent from '@/views/Form/Form';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(FormComponent);

Vue.component('IconButton', IconButton);
Vue.component('Confirm', Confirm);

new Vue({
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
