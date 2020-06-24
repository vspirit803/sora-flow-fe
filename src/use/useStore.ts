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

interface Role {
  id: string;
  name: string;
  text: string;
}

interface Profile {
  id: string;
  name: string;
  nickname: string;
  roles?: Array<Role>;
  organizationId?: string;
  organizationName?: string;
}

interface MenuItem {
  name: string;
  namePath: Array<string>;
  idPath: Array<string>;
  parentId: string;
  parentName: string;
  icon: string;
  enable: boolean;
  type: 'directory' | 'item';
  visible: boolean;
  children: Array<MenuItem>;
}

interface StoreType {
  token: string;
  organizations: Array<Organization>;
  profile?: Profile;
  menus: Array<MenuItem>;
}

function generateStore() {
  return new Store<StoreType>({
    // plugins: [createPersistedState({ paths: [] })],
    state: {
      token: '',
      organizations: [],
      profile: undefined,
      menus: [],
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
      setProfile: function (state, profile: Profile) {
        state.profile = profile;
      },
      setMenus: function (state, menus: Array<MenuItem>) {
        state.menus = menus;
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
