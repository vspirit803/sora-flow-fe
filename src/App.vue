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
      <v-btn to="/">
        Home
      </v-btn>
      <v-btn to="/login">
        Login
      </v-btn>
      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
      <v-spacer />
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

    onMounted(() => {
      const { token, organizationId } = store.state;
      if (token) {
        store.commit('setToken', token);
        store.dispatch('getOrganizations');
      }
      if (organizationId) {
        store.dispatch('authOrganization', { id: organizationId });
      }
    });

    return { drawer, loading, errorMsg, snackbar };
  },
});
</script>

<style lang="less" scoped>
.scroller-container {
  max-height: calc(100vh - 64px);
}
</style>
