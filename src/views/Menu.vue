<template>
  <v-treeview activatable open-on-click transition :items="menus"></v-treeview>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import { useStore } from '@/use';

export default defineComponent({
  name: 'Menu',
  setup() {
    const store = useStore();
    const menus = computed(() => store.state.menus);

    return { menus };
  },
});
</script>

<style lang="less" scoped>
/** */
</style>