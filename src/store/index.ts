import axios from 'axios';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import { AuthService, ProfileService } from '@/service';

Vue.use(Vuex);

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
  loading: boolean;
  requestCount: number;
  errorMsg: string;
  isError: boolean;
  organizationId: string;
  settings: { iconMode: boolean };
}

let stopLoadingTimeout: number;

const store: Store<StoreType> = new Store<StoreType>({
  plugins: [
    createPersistedState({
      paths: ['token', 'organizationId'],
    }),
  ],
  state: {
    token: '',
    organizations: [],
    organizationId: '',
    profile: undefined,
    menus: [],
    loading: false,
    requestCount: 0,
    errorMsg: '',
    isError: false,
    settings: { iconMode: false },
  },
  getters: {},
  mutations: {
    setToken: function (state, token: string) {
      state.token = token;
      axios.defaults.headers['Authorization'] = 'Bearer ' + token;
    },
    setOrganizationId(state, organizationId: string) {
      state.organizationId = organizationId;
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
    setLoading: function (state, loading: boolean) {
      state.loading = loading;
    },
    requestStart: function (state) {
      state.requestCount++;
      state.loading = true;
      if (stopLoadingTimeout) {
        clearTimeout(stopLoadingTimeout);
      }
    },
    requestEnd: function (state) {
      state.requestCount--;
      if (state.requestCount <= 0) {
        stopLoadingTimeout = setTimeout(() => {
          state.loading = false;
        });
      }
    },
    requestError: function (state, error) {
      state.errorMsg = error?.response?.data?.message ?? error.message;
      state.isError = true;
      state.requestCount--;
      if (state.requestCount <= 0) {
        stopLoadingTimeout = setTimeout(() => {
          state.loading = false;
        });
      }
    },
    setIsError: function (state, isError: boolean) {
      state.isError = isError;
    },
  },
  actions: {
    async refreshMenus({ commit }) {
      const { data: menus } = await ProfileService.getMenus();
      commit('setMenus', menus);
    },
    async auth({ commit, dispatch }, { name, password }: { name: string; password: string }) {
      const {
        data: { access_token: token },
      } = await AuthService.login({ name, password });
      commit('setToken', token);
      await dispatch('getOrganizations');
    },
    async authOrganization({ commit, dispatch }, { id }: { id: string }) {
      const {
        data: { access_token: token },
      } = await AuthService.loginOrganization({ organizationId: id });
      commit('setOrganizationId', id);
      commit('setToken', token);

      const { data: profile } = await ProfileService.getProfileOrganization();
      commit('setProfile', profile);
      dispatch('refreshMenus');
    },
    async getOrganizations({ commit }) {
      const { data: organizations } = await ProfileService.getOrganizations();
      commit('setOrganizations', organizations);
    },
  },
  modules: {},
});

export { store };
