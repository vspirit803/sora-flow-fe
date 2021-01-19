<template>
  <div
    v-if="organizationName"
    class="organization"
  >
    {{ organizationName }}
    <Confirm
      v-slot="{ on, attrs }"
      :message="t('organization.confirmLeaveOrganization', [organizationName])"
      @confirm="leaveOrganization"
    >
      <v-btn
        class="ml-2"
        color="error"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-exit-run</v-icon>{{ t('organization.leaveOrganization') }}
      </v-btn>
    </Confirm>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-composable';

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
    return { organizations, organizationName, leaveOrganization, ...useI18n() };
  },
});
</script>
