<!--可带有重复值的树-->
<template>
  <div>
    <span>{{ value }}</span>
    <DuplicateTree
      v-model="value"
      style="width: 300px;"
      :items="items"
      text-key="name"
      value-key="id"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

import DuplicateTree from '@/components/DuplicateTree.vue';

export default defineComponent({
  name: 'Test',
  components: { DuplicateTree },
  setup() {
    const items = [
      {
        id: 1,
        name: 'Applications :',
        children: [
          { id: 2, name: 'Calendar : app' },
          { id: 3, name: 'Chrome : app' },
          { id: 4, name: 'Webstorm : app' },
        ],
      },
      {
        id: 5,
        name: 'Documents :',
        children: [
          {
            id: 6,
            name: 'vuetify :',
            children: [
              {
                id: 7,
                name: 'src :',
                children: [
                  { id: 8, name: 'index : ts' },
                  { id: 9, name: 'bootstrap : ts' },
                ],
              },
              {
                id: 77,
                name: 'src :',
                children: [
                  { id: 8, name: 'index : ts' },
                  { id: 99, name: 'bootstrap : ts' },
                ],
              },
            ],
          },
          {
            id: 10,
            name: 'material2 :',
            children: [
              {
                id: 77,
                name: 'src :',
                children: [
                  { id: 8, name: 'index : ts' },
                  { id: 99, name: 'bootstrap : ts' },
                ],
              },
              {
                id: 11,
                name: 'src :',
                children: [
                  { id: 12, name: 'v-btn : ts' },
                  { id: 13, name: 'v-card : ts' },
                  { id: 14, name: 'v-window : ts' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 15,
        name: 'Downloads :',
        children: [
          { id: 16, name: 'October : pdf' },
          { id: 17, name: 'November : pdf' },
          { id: 18, name: 'Tutorial : html' },
        ],
      },
      {
        id: 19,
        name: 'Videos :',
        children: [
          {
            id: 20,
            name: 'Tutorials :',
            children: [
              { id: 21, name: 'Basic layouts : mp4' },
              { id: 22, name: 'Advanced techniques : mp4' },
              { id: 23, name: 'All about app : dir' },
            ],
          },
          { id: 24, name: 'Intro : mov' },
          { id: 25, name: 'Conference introduction : avi' },
        ],
      },
    ];
    const value = ref([2, 3, 5]);
    return { items, value };
  },
});
</script>
