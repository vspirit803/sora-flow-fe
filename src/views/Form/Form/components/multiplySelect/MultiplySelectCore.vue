<template>
  <v-radio-group
    :row="item.direction==='horizontal'"
    dense
    class="mt-1 pt-0"
  >
    <v-checkbox
      v-for="(each, index) of item.options"
      :key="each.symbol"
      v-model="item.value"
      hide-details
      class="pt-0 mt-0"
      :class="{'mt-2' : item.direction==='vertical' && index, 'ml-4' : item.direction==='horizontal' && index}"
      :value="each.value"
      :label="each.value"
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

  setup(props) {
    const item = props.item;

    function onComponentValueChange(value: any) {
      // props.item.value = value;
      console.log(value);
    }

    return {
      onComponentValueChange,
      onChange(...params: any) {
        console.log(params);
      },
    };
  },
});
</script>
