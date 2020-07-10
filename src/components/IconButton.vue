<!--切换button样式 是否带文字说明-->
<template>
  <v-btn
    v-bind="$attrs"
    :icon="iconMode"
    v-on="$listeners"
  >
    <slot />
    <span
      v-if="!iconMode" 
      class="ml-2"
    >{{ $attrs.title }}</span>
  </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import { useStore } from '../use';

export default defineComponent({
  name: 'IconButton',
  setup() {
    const store = useStore();
    const iconMode = computed(() => store.state.settings.iconMode);
    return { iconMode };
  },
});
</script>
