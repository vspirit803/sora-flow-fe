<template>
  <div>
    <FormComponentPropsCard name="标题">
      <v-text-field
        v-model="item.title"
        placeholder="请输入标题"
      />
    </FormComponentPropsCard>
   
    <FormComponentSizeAdjuster :item="item" />

    <FormComponentPropsCard name="行数">
      <v-text-field
        v-model="item.rowNumber"
        type="number"
        :min="1"
        :max="20"
      />
    </FormComponentPropsCard>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { MultiplyLineInputModel } from './MultiplyLineInputModel';

export default Vue.extend({
  name: 'MultiplyLineInputDetail',
  props: {
    item: {
      type: MultiplyLineInputModel,
      required: true,
    },
  },
});
</script>
