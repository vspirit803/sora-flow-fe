import { provide } from '@vue/composition-api';
import { Store } from 'vuex';

import { store, StoreType } from '@/store';

const StoreSymbol = Symbol();
function generateStore() {
  /** */
}

export function provideStore(): void {
  provide(StoreSymbol, generateStore());
}

export function useStore(): Store<StoreType> {
  if (!store) {
    throw new Error('没有获取到Store实例');
  }
  return store;
}
