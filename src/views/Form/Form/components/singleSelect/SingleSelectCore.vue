<template>
  <v-radio-group
    v-if="item.mode==='tiled'"
    v-model="item.value"
    :row="item.direction==='horizontal'"
    dense
    class="mt-1 pt-0"
  >
    <v-radio
      v-for="each of item.options"
      :key="each.value"
      :value="each.value"
      :label="each.text"
      :color="each.color"
    />
  </v-radio-group>
  <v-select
    v-else
    v-model="item.value"
    :items="item.options"
    dense
    class="mt-1 pt-0"
  >
    <template v-slot:selection="{ item }">
      <v-chip
        small
        :color="item.color"
      >
        <span>{{ item.text }}</span>
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-title :class="item.color + '--text'">
        {{ item.text }}
      </v-list-item-title>
    </template>
  </v-select>
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
