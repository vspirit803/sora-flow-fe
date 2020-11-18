<!--可带有重复值的树结点-->
<template>
  <div :class="'ml-' + level * 4">
    <v-checkbox
      class="mt-0"
      :input-value="isSelected"
      :indeterminate="isIndeterminate"
      :label="item[textKey]"
      hide-details
      @click="onSelect(!isSelected)"
    />

    <template v-if="item[childrenKey] && item[childrenKey].length">
      <DuplicateTreeNode
        v-for="eachNode of item[childrenKey]"
        :key="eachNode[valueKey]"
        ref="childrenNodes"
        v-bind="{value, textKey, valueKey, childrenKey, item: eachNode, level: level + 1}"
        @change="(value) => $emit('change', value)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

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
    const isLeaf = computed(() => !props.item[props.childrenKey]?.length);

    const isSelected = computed(() => allValues.every((eachValue) => props.value.includes(eachValue)));
    const isIndeterminate = computed(() =>
      isLeaf.value ? false : !isSelected.value && allValues.some((eachValue) => props.value.includes(eachValue)),
    );

    function onSelect(value: boolean) {
      const newValues = new Set(props.value);

      if (value) {
        allValues.forEach((eachValue) => newValues.add(eachValue));
      } else {
        allValues.forEach((eachValue) => newValues.delete(eachValue));
      }

      emit('change', Array.from(newValues));
    }
    return { onSelect, allValues, isSelected, isIndeterminate, isLeaf };
  },
});
</script>
<style lang="less" scoped>
.node-label {
  user-select: none;
  cursor: pointer;
}
</style>