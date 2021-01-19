<template>
  <v-menu
    v-if="profile"
    v-model="showList"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-btn
        text
        v-bind="attrs"
        v-on="on"
      >
        {{ organizationName || t('selectOrgainzation') }}
        <v-icon v-if="organizations.length">
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="eachOrganization of organizations"
        :key="eachOrganization.id"
        @click="onSelect(eachOrganization)"
      >
        <v-list-item-title>{{ eachOrganization.name }}</v-list-item-title>
      </v-list-item>
      <v-list-item @click="onLogout">
        <v-list-item-title>
          <v-icon style="color: green;">
            mdi-exit-run
          </v-icon> {{ t('logout') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

import { useRouter, useStore } from '@/use';

export default defineComponent({
  name: 'OrganizationsSelector',
  setup() {
    const store = useStore();
    const router = useRouter();
    const showList = ref(false);
    const profile = computed(() => store.state.profile);
    const organizations = computed(() => store.state.organizations);
    const organizationName = computed(() => store.state.profile?.organizationName);

    async function onSelect(organization: { name: string; id: string }) {
      await store.dispatch('authOrganization', { id: organization.id });
      if (router.currentRoute.name !== 'Tasks') {
        router.push({ name: 'Tasks' });
      }
    }

    async function onLogout() {
      showList.value = false;
      useStore().commit('clearToken');
      if (router.currentRoute.name !== 'Login') {
        router.push({ name: 'Login' });
      }
    }

    return { showList, organizations, onSelect, organizationName, onLogout, profile, ...useI18n() };
  },
});
</script>

<style lang="less" scoped>
/** */
</style>
