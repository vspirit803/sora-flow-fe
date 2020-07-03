import { provide } from '@vue/composition-api';

import { store } from '@/store';

const StoreSymbol = Symbol();
function generateStore() {
  /** */
}

export function provideStore() {
  provide(StoreSymbol, generateStore());
}

export function useStore() {
  if (!store) {
    throw new Error('没有获取到Store实例');
  }
  return store;
}
