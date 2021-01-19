import { createI18n } from 'vue-i18n-composable';

export default createI18n({
  locale: navigator.language ?? 'zh-CN',
  messages: {
    en: {
      login: 'login',
      language: 'English',
      username: 'account',
      password: 'password',
    },
    'zh-CN': {
      login: '登录',
      language: '简体中文',
      username: '账号',
      password: '密码',
    },
  },
});
