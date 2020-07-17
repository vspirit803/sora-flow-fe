<template>
  <div>
    <FormComponentPropsCard name="描述文字">
      <v-text-field
        v-model="item.text"
        placeholder="请输入描述文字"
      />
    </FormComponentPropsCard>
    
    <FormComponentSizeAdjuster :item="item" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { TableModel } from './TableModel';

export default Vue.extend({
  name: 'TableDetail',
  props: {
    item: {
      type: TableModel,
      required: true,
    },
  },
});
</script>
