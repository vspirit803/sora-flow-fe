<template>
  <div>
    <FormComponentPropsCard name="标题">
      <v-text-field
        v-model="item.title"
        placeholder="请输入描述文字"
      />
    </FormComponentPropsCard>
   
    <FormComponentSizeAdjuster :item="item" />
    
    <FormComponentPropsCard name="默认文本">
      <v-text-field
        v-model="item.default"
        placeholder="请输入默认文本"
      />
    </FormComponentPropsCard>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { SingleLineInputModel } from './SingleLineInputModel';

export default Vue.extend({
  name: 'SingleLineInputDetail',
  props: {
    item: {
      type: SingleLineInputModel,
      required: true,
    },
  },
});
</script>
