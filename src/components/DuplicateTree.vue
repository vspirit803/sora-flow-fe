
<!--可带有重复值的树-->
<template>
  <div>
    <DuplicateTreeNode
      v-for="eachNode of items"
      :key="eachNode[valueKey]"
      v-bind="{value, textKey, valueKey, childrenKey, item: eachNode}"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import DuplicateTreeNode from './DuplicateTreeNode.vue';

export default defineComponent({
  name: 'DuplicateTree',
  emits: ['change'],
  components: { DuplicateTreeNode },
  model: {
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    textKey: {
      type: String,
      default: 'text',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    childrenKey: {
      type: String,
      default: 'children',
    },
  },
  setup(props, { emit }) {
    function onChange(newValues: Array<unknown>) {
      emit('change', newValues);
    }

    return { onChange };
  },
});
</script>
