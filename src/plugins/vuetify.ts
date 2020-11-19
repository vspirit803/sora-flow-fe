import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from 'vuetify/src/locale/zh-Hans';

Vue.use(Vuetify);
export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans',
  },
});
