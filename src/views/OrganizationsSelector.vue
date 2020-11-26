<template>
  <v-menu
    v-model="showList"
    offset-y
    :disabled="!organizations.length"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        text
        v-bind="attrs"
        v-on="on"
      >
        {{ organizationName || '选择组织' }}<v-icon v-if="organizations.length">
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
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';

import { useRouter, useStore } from '@/use';

export default defineComponent({
  name: 'OrganizationsSelector',
  setup() {
    const store = useStore();
    const router = useRouter();
    const showList = ref(false);
    const organizations = computed(() => store.state.organizations);
    const organizationName = computed(() => store.state.profile?.organizationName);

    async function onSelect(organization: { name: string; id: string }) {
      await store.dispatch('authOrganization', { id: organization.id });

      if (router.currentRoute.name !== 'Tasks') {
        router.push({ name: 'Tasks' });
      }
    }
    return { showList, organizations, onSelect, organizationName };
  },
});
</script>

<style lang="less" scoped>
/** */
</style>
