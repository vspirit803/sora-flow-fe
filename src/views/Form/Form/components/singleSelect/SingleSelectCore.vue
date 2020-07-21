<template>
  <v-radio-group
    v-model="item.default"
    :row="item.direction==='horizontal'"
  >
    <v-radio
      v-for="each of item.options"
      :key="each.symbol"
      :value="each.value"
      :label="each.value"
    />
  </v-radio-group>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { SingleSelectModel } from './SingleSelectModel';

export default defineComponent({
  name: 'SingleSelectCore',
  props: {
    item: {
      type: SingleSelectModel,
      required: true,
    },
  },
});
</script>
