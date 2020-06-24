import { inject, provide } from '@vue/composition-api';
import axios from 'axios';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
const StoreSymbol = Symbol();

interface Organization {
  id: string;
  name: string;
}

interface StoreType {
  token: string;
  organizations: Array<Organization>;
}

function generateStore() {
  return new Store<StoreType>({
    // plugins: [createPersistedState({ paths: [] })],
    state: {
      token: '',
      organizations: [],
    },
    getters: {},
    mutations: {
      setToken: function (state, token: string) {
        state.token = token;
        axios.defaults.headers['Authorization'] = 'Bearer ' + token;
      },
      setOrganizations: function (state, organizations: Array<Organization>) {
        state.organizations = organizations;
      },
    },
    actions: {},
    modules: {},
  });
}

export function provideStore() {
  provide(StoreSymbol, generateStore());
}

export function useStore() {
  const store = inject(StoreSymbol);
  if (!store) {
    throw new Error('没有获取到Store实例');
  }
  return store as Store<StoreType>;
}
