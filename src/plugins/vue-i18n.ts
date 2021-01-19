import { createI18n } from 'vue-i18n-composable';

import { messages } from './locale';

export default createI18n({
  locale: navigator.language ?? 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages,
});
