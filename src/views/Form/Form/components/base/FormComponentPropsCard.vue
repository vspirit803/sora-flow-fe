<!--表单详情 属性设置的卡片-->
<template>
  <v-card
    class="pa-2"
    outlined
  >
    <span class="text-subtitle-2">{{ name }}</span>
    <slot />
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FormComponentPropsCard',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
});
</script>
