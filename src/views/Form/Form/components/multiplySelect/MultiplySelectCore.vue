<template>
  <v-radio-group
    v-if="item.mode==='tiled'"
    :row="item.direction==='horizontal'"
    dense
    class="mt-1 pt-0"
  >
    <v-checkbox
      v-for="(each, index) of item.options"
      :key="each.value"
      v-model="item.value"
      hide-details
      class="pt-0 mt-0"
      :class="{'mt-2' : item.direction==='vertical' && index, 'ml-4' : item.direction==='horizontal' && index}"
      :value="each.value"
      :label="each.text"
    />
  </v-radio-group>
  <v-select
    v-else
    v-model="item.value"
    :items="item.options"
    multiple
    dense
    class="mt-1 pt-0"
  >
    <template v-slot:selection="{ item }">
      <v-chip small>
        <span>{{ item.text }}</span>
      </v-chip>
    </template>
  </v-select>
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
