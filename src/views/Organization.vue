<template>
  <div
    v-if="organizationName"
    class="organization"
  >
    {{ organizationName }}
    <v-btn>退出组织</v-btn>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import HelloWorld from '@/components/HelloWorld.vue';
import { useStore } from '@/use';

export default defineComponent({
  name: 'Organization',
  components: {
    HelloWorld,
  },
  setup() {
    const store = useStore();
    const organizations = computed(() => {
      return store.state.organizations;
    });
    const organizationName = computed(() => {
      return store.state.profile?.organizationName ?? '';
    });
    return { organizations, organizationName };
  },
});
</script>
