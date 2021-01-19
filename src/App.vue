<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <Menu />
    </v-navigation-drawer>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      top
    >
      {{ errorMsg }}
    </v-snackbar>
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-btn
        v-if="showLoginBtn"
        text
        active-class="cancel-active-class"
        :to="{name: 'Login'}"
      >
        {{ t('login') }}
      </v-btn>
      <OrganizationsSelector />
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
      />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, ref, watch } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import { provideStore, useStore } from '@/use';
import Menu from '@/views/Menu.vue';
import OrganizationsSelector from '@/views/OrganizationsSelector.vue';

export default defineComponent({
  name: 'App',
  components: { Menu, OrganizationsSelector },
  setup() {
    provideStore();
    const store = useStore();
    const loading = computed(() => store.state.loading);
    const errorMsg = computed(() => store.state.errorMsg);
    const isError = computed(() => store.state.isError);
    const drawer = ref(true);
    const snackbar = ref(false);

    provide('drawer', drawer);
    watch(isError, () => {
      snackbar.value = isError.value;
    });
    watch(snackbar, (value) => {
      if (!value) {
        store.commit('setIsError', false);
      }
    });

    onMounted(async () => {
      const { token, organizationId } = store.state;
      if (token) {
        store.commit('setToken', token);
        await store.dispatch('getOrganizations');

        if (organizationId) {
          store.dispatch('authOrganization', { id: organizationId });
        }
      }
    });

    return {
      drawer,
      loading,
      errorMsg,
      snackbar,
      showLoginBtn: computed(() => !store.state.token),
      ...useI18n(),
    };
  },
});
</script>

<style lang="less" scoped>
.scroller-container {
  max-height: calc(100vh - 64px);
}

.cancel-active-class::before {
  opacity: 0;
}
</style>
