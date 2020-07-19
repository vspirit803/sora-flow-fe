<template>
  <v-radio-group
    :row="item.direction==='horizontal'"
  >
    <v-checkbox
      v-for="index of item.options.length"
      :key="index"
      v-model="item.default"
      hide-details
      class="pt-0 mt-0"
      :class="{'mt-2' : item.direction==='vertical' && index - 1,'ml-4' : item.direction==='horizontal' && index - 1}"
      :value="item.options[index - 1]"
      :label="item.options[index - 1]"
    />
  </v-radio-group>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { MultiplySelectModel } from './MultiplySelectModel';

export default defineComponent({
  name: 'MultiplySelectCore',
  props: {
    item: {
      type: MultiplySelectModel,
      required: true,
    },
  },
});
</script>
