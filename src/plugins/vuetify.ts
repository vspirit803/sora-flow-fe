import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import en from 'vuetify/src/locale/en';
import zhHans from 'vuetify/src/locale/zh-Hans';

Vue.use(Vuetify);

let current: string;

switch (navigator.language) {
  case 'zh-CN':
    current = 'zhHans';
    break;
  case 'en':
  case 'en-GB':
  case 'en-US':
    current = 'en';
    break;
  default:
    current = 'zhHans';
}

console.log(current);

export default new Vuetify({
  lang: {
    locales: { zhHans, en },
    current,
  },
});
