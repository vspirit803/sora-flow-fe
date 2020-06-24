import VueCompositionApi from '@vue/composition-api';
import Vue from 'vue';
import vueCustomScrollbar from 'vue-custom-scrollbar';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.component('vue-custom-scrollbar', vueCustomScrollbar);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
