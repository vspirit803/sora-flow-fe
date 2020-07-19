<template>
  <v-radio-group
    v-model="item.default"
    :row="item.direction==='horizontal'"
  >
    <v-radio
      v-for="index of item.options.length"
      :key="index"
      :value="item.options[index - 1]"
      :label=" item.options[index - 1]"
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
