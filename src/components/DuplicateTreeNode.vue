<!--可带有重复值的树结点-->
<template>
  <div :style="`margin-left: ${level * 24}px;`">
    <v-checkbox
      :input-value="isSelected"
      :indeterminate="isIndeterminate"
      hide-details
      @click="onSelect(!isSelected)"
    >
      <template #label>
        <span style="color: rgba(0,0,0,.87);">{{ item[textKey] }}</span>
      </template>
      <template #prepend>
        <v-icon
          v-if="item[childrenKey] && item[childrenKey].length"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'mdi-menu-down' : 'mdi-menu-right' }}
        </v-icon>
        <v-icon
          v-else
          class="mr-6"
        >
          mdi-blank
        </v-icon>
      </template>
    </v-checkbox>

    <template v-if="isExpanded && item[childrenKey] && item[childrenKey].length">
      <DuplicateTreeNode
        v-for="eachNode of item[childrenKey]"
        :key="eachNode[valueKey]"
        v-bind="{value, textKey, valueKey, childrenKey, item: eachNode, level: level + 1}"
        @change="(value) => $emit('change', value)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';

function extractValues(item: Record<string, unknown>, valueKey: string, childrenKey: string): Array<string> {
  if (Array.isArray(item[childrenKey]) && (item[childrenKey] as Array<Record<string, unknown>>).length) {
    return (item[childrenKey] as Array<Record<string, unknown>>)
      .map((eachChild) => extractValues(eachChild, valueKey, childrenKey))
      .reduce((prev, curr) => [...prev, ...curr], []);
  }
  return [item[valueKey] as string];
}

export default defineComponent({
  name: 'DuplicateTreeNode',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    item: {
      type: Object,
      default: () => ({}),
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
    level: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const allValues = extractValues(props.item, props.valueKey, props.childrenKey);
    const isLeaf = !props.item[props.childrenKey]?.length;

    const isSelected = computed(() => allValues.every((eachValue) => props.value.includes(eachValue)));
    const isIndeterminate = computed(() =>
      isLeaf ? false : !isSelected.value && allValues.some((eachValue) => props.value.includes(eachValue)),
    );

    const isExpanded = ref(false);

    function onSelect(value: boolean) {
      const newValues = new Set(props.value);

      if (value) {
        allValues.forEach((eachValue) => newValues.add(eachValue));
      } else {
        allValues.forEach((eachValue) => newValues.delete(eachValue));
      }

      emit('change', Array.from(newValues));
    }
    return { onSelect, allValues, isSelected, isIndeterminate, isLeaf, isExpanded };
  },
});
</script>
<style lang="less" scoped>
.node-label {
  user-select: none;
  cursor: pointer;
}
</style>