<template>
  <FormComponentPropsCard
    :name="isTableField ? '最小宽度(px)' : '宽度 (%)'"
  >
    <v-btn-toggle
      class="d-flex"
      mandatory
      :value="item.size"
      tile
    >
      <v-btn
        v-for="each of sizeList"
        :key="each"
        :value="each"
        class="flex-grow-1"
        @click="item.changeSize(each)"
      >
        {{
          isTableField ? each * 30 : Math.round((each / 12) * 100)
        }}
      </v-btn>
    </v-btn-toggle>
  </FormComponentPropsCard>
</template>
<script lang="ts">
import Vue from 'vue';

import { FormComponentModel } from './FormComponentModel';
import { sizeList } from './sizeList';

export default Vue.extend({
  name: 'FormComponentSizeAdjuster',
  components: {},
  props: {
    item: {
      type: FormComponentModel,
      required: true,
    },
    isTableField: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sizeList,
    };
  },
});
</script>
