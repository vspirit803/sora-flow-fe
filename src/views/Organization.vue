<template>
  <div
    v-if="organizationName"
    class="organization"
  >
    {{ organizationName }}
    <Confirm
      v-slot="{ on, attrs }"
      :message="`确认退出组织[${organizationName}]吗`"
      @confirm="leaveOrganization"
    >
      <v-btn
        class="ml-2"
        color="error"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-exit-run</v-icon>退出组织
      </v-btn>
    </Confirm>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import { ProfileService } from '@/service';
import { useRouter, useStore } from '@/use';

export default defineComponent({
  name: 'Organization',
  setup() {
    const store = useStore();
    const router = useRouter();
    const organizations = computed(() => {
      return store.state.organizations;
    });
    const organizationName = computed(() => {
      return store.state.profile?.organizationName ?? '';
    });

    async function leaveOrganization() {
      await ProfileService.leaveOrganization();
      await store.dispatch('getOrganizations');
      const organizations = store.state.organizations;
      if (organizations.length === 0) {
        console.log('没有组织');
      } /*if (organizations.length === 1) */ else {
        await store.dispatch('authOrganization', { id: organizations[0].id });
        router.push({ name: 'Home' });
      }
    }
    return { organizations, organizationName, leaveOrganization };
  },
});
</script>
